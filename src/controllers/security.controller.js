const crypto = require('crypto');
const {
  encryptClientRequestPayload,
  encryptClientRequestKey,
  decryptClientRequestKey,
  decryptResponse,
  encryptServerResponse,
} = require('../utils');

const securityController = {};
const algorithm = 'aes-256-ctr';
/*
 * payload:jsonData,
 * key:?randomKey
 * iv:?iv
 */

module.exports = {
  encryptRequest: async (request, response) => {
    let { payload, secret, iv } = request.body;

    secret = secret || crypto.randomBytes(16).toString('hex');
    iv = iv || crypto.randomBytes(8).toString('hex');

    const encryptedPayload = encryptClientRequestPayload({
      payload,
      secretKey: secret,
      iv,
    });
    const encryptedSecretKey = encryptClientRequestKey(secret);

    return response.json({
      payload: encryptedPayload,
      apptoken: `${encryptedSecretKey}|${iv}`,
    });
  },
  decryptRequest: async (request, response) => {
    try {
      const [key, iv] = request.body.apptoken.split('|');

      const secretKey = decryptClientRequestKey(key);

      const { payload } = request.body;

      const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

      let dec = decipher.update(payload, 'hex', 'utf8');
      dec += decipher.final('utf8');
      dec = JSON.parse(dec);

      return response.json({ ...dec });
    } catch (err) {
      return response.json({ error: 'Unable to identify request' });
    }
  },
  encryptResponse: async (request, response) => {
    return response.json(
      encryptServerResponse(request.body.payload, request.body.secretKey),
    );
  },
  decryptResponse: async (request, response) => {
    const { payload, iv, secretKey } = request.body;
    return response.json(decryptResponse(payload, secretKey, iv));
  },
};
