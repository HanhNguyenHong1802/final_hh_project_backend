const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Router = require('./routes');
const { mongoConnect, redisConnect, pgConnect } = require('@/config');
const { setSecurityHeaders, AppError } = require('@/utils');
const { errorHandler, requestLogs } = require('@/middlewares');
const { HTTP_STATUS, ERR_MSG } = require('@/constants');
require('module-alias/register')

const app = express();

const {
  CORS_ORIGIN,
  CORS_METHODS,
  NODE_ENV,
  RATE_LIMIT_TIME,
  RATE_LIMIT_MAX_REQUESTS,
  MONGO_DB_CONNECTION,
  PG_CONNECTION,
  REDIS_CONNECTION,
} = process.env;

const corsOptions = { origin: CORS_ORIGIN, methods: CORS_METHODS };
const limiter = rateLimit({
  windowMs: RATE_LIMIT_TIME,
  max: parseInt(RATE_LIMIT_MAX_REQUESTS),
});

app.set('trust proxy', 1);
//  Set Rate Limiter
app.use(limiter);

// Documentation of apis using api-docs
if (NODE_ENV === 'local') {
  app.use(express.static('public'));
}

// Cross Origin setup
app.use(cors(corsOptions));

// Body Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Use helmet for HSTS headers
setSecurityHeaders(app);

// Mongo Connection
if (MONGO_DB_CONNECTION === 'Y') {
  mongoConnect();
}

// Redis Connection
if (REDIS_CONNECTION === 'Y') {
  redisConnect();
}

// PG Connection
if (PG_CONNECTION === 'Y') {
  pgConnect();
}

// Log all the request and response
app.use(requestLogs);

// Route Initialization
app.use('/', Router);

// Handle Invalid Endpoint
app.use(function (request, response, next) {
  throw new AppError(ERR_MSG.INVALID_ENDPOINT, HTTP_STATUS.NOT_FOUND);
});

// Route Error Response Handler
app.use(errorHandler);

module.exports = app;
