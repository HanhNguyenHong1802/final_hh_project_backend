import mongoose from 'mongoose';
import debug from 'debug';
import fs from 'fs';

const log = debug('app:mongo');
mongoose.connection.on('connected', () => {
  log('Mongo Connection Established');
});

mongoose.connection.on('reconnected', () => {
  log('Mongo Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
  log('Mongo Connection Disconnected');
});

mongoose.connection.on('close', () => {
  log('Mongo Connection Closed');
});

mongoose.connection.on('error', error => {
  log('Mongo ERROR: ' + error);
  process.exit(1);
});

if (['local', 'dev', 'uat'].includes(process.env.NODE_ENV)) {
  mongoose.set('debug', { color: false });
}

export const mongoConnect = async () => {
  const MONGO_CONFIG = {
    DBNAME: process.env.MONGO_DBNAME,
    PRIMARY_HOST: process.env.MONGO_HOST_PRIMARY,
    SECONDARY_HOST: process.env.MONGO_HOST_SECONDARY,
    PORT: process.env.MONGO_PORT,
    USERNAME: process.env.MONGO_USERNAME,
    PASSWORD: process.env.MONGO_PASSWORD,
    REPLICASET: process.env.MONGO_REPLICASET,
    AUTH_SOURCE: process.env.MONGO_AUTH_SOURCE,
    OPTIONS: {
      db: { native_parser: true },
      server: { poolSize: 5 },
    },
  };
  //mongodb+srv://hanh-nh_18:<password>@cluster0.wuezp5c.mongodb.net/?retryWrites=true&w=majority
  const connectionuri =
    'mongodb+srv://' +
    encodeURIComponent(MONGO_CONFIG.USERNAME) +
    ':' +
    encodeURIComponent(MONGO_CONFIG.PASSWORD) +
    '@cluster0.wuezp5c.mongodb.net/?retryWrites=true&w=majority';
  // '@' +
  // MONGO_CONFIG.PRIMARY_HOST +
  // ':' +
  // MONGO_CONFIG.PORT +
  // ',' +
  // MONGO_CONFIG.SECONDARY_HOST +
  // ':' +
  // MONGO_CONFIG.PORT +
  // '/' +
  // MONGO_CONFIG.DBNAME +
  // '?' +
  // 'replicaSet=' +
  // MONGO_CONFIG.REPLICASET +
  // '&' +
  // 'ssl=true&authSource=' +
  // MONGO_CONFIG.AUTH_SOURCE

  let sslOptions = {};

  const { MONGO_SSL_CA_PATH, MONGO_SSL_CERT_PATH, MONGO_SSL_CERT_KEY } =
    process.env;
  if (MONGO_SSL_CA_PATH && MONGO_SSL_CERT_PATH && MONGO_SSL_CERT_KEY) {
    sslOptions = {
      ssl: true,
      sslValidate: true,
      sslCA: [fs.readFileSync(MONGO_SSL_CA_PATH)],
      sslKey: fs.readFileSync(MONGO_SSL_CERT_PATH),
      sslCert: fs.readFileSync(MONGO_SSL_CERT_KEY),
    };
  }
  await mongoose.connect(connectionuri, {
    ...sslOptions,
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};
