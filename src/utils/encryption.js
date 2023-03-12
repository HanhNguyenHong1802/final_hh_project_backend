const crypto = require('crypto');

const { ALGORITHM, ENCRYPTION_PUBLIC_KEY, ENCRYPTION_PRIVATE_KEY } =
  process.env;
const algorithm = ALGORITHM;
const publicKey = ENCRYPTION_PUBLIC_KEY.replace(/\\n/g, '\n');
const privateKey = ENCRYPTION_PRIVATE_KEY.replace(/\\n/g, '\n');

// Symmetric encryption
const encryptResponse = (jsonData, secretKey) => {
  const text = JSON.stringify(jsonData);
  const iv = crypto.randomBytes(8).toString('hex');
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return { payload: crypted, iv, secretKey };
};

const decryptResponse = (encryptedText, secretKey, iv) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let dec = decipher.update(encryptedText, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return { payload: JSON.parse(dec) };
};

// Asymmetric encryption

const encryptClientRequestPayload = ({ payload, secretKey, iv }) => {
  const text = JSON.stringify(payload);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

const encryptClientRequestKey = payload => {
  const encryptedBufferData = Buffer.from(payload);
  const encryptedData = crypto.publicEncrypt(publicKey, encryptedBufferData);
  return encryptedData.toString('hex');
};

const decryptClientRequestKey = payload => {
  return crypto
    .privateDecrypt(privateKey, Buffer.from(payload.toString('hex'), 'hex'))
    .toString();
};

const decryptClientRequestPayload = ({ payload, key, iv }) => {
  const secretKey = decryptClientRequestKey(key);

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let dec = decipher.update(payload, 'hex', 'utf8');
  dec += decipher.final('utf8');

  return { payload: JSON.parse(dec) };
};

const extractKeyAndIv = str => {
  if (str.indexOf('|') < 0) {
    throw new Error('Invalid request token');
  }
  const [key, iv] = str.split('|');
  return { key, iv };
};

const decryptClientRequest = async (req, res, next) => {
  try {
    if (process.env.ENABLE_ENCRYPTION === 'N') return next();

    if (!req.headers.apptoken)
      return res.status(400).json({ error: 'Missing request token' });

    const { key, iv } = extractKeyAndIv(req.headers.apptoken);

    const secretKey = decryptClientRequestKey(key);

    if (Object.entries(req.body).length) {
      const { payload } = req.body;

      delete req.body.payload;

      const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

      let dec = decipher.update(payload, 'hex', 'utf8');
      dec += decipher.final('utf8');
      dec = JSON.parse(dec);

      req.body = { ...dec };
    }

    res.locals.key = secretKey;
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Unable to identify request/token' });
  }
};

// same as encryptResponse in utils/encryption
const encryptServerResponse = (jsondata, key) => {
  const data = encryptResponse(jsondata, key);
  delete data.secretKey;
  return { payload: data.payload, iv: data.iv };
};
module.exports = {
  encryptResponse,
  decryptResponse,
  encryptClientRequestPayload,
  encryptClientRequestKey,
  decryptClientRequestKey,
  decryptClientRequestPayload,
  decryptClientRequest,
  encryptServerResponse,
};
