const express = require('express');
// import { userRouter } from './user.route'
const { securityRouter } = require('./security.route');
const { decryptClientRequest, ResponseBody } = require('@/utils');
const { disbaleJourney, scriptTagRemover } = require('@/middlewares');
const { HTTP_STATUS, RES_MSG } = require('@/constants');

const Router = express.Router();

Router.get('/health-check', (request, response, next) => {
  const responseBody = new ResponseBody(HTTP_STATUS.OK, RES_MSG.OK);
  response.status(responseBody.statusCode).json(responseBody);
});

Router.get('/version', (request, response, next) => {
  const version = process.env.npm_package_version;
  const data = { version };
  const responseBody = new ResponseBody(HTTP_STATUS.OK, RES_MSG.OK, data);
  response.status(responseBody.statusCode).json(responseBody);
});

// Disable Journey Middleware
Router.use(disbaleJourney);

Router.use(scriptTagRemover);

// Decrypt Request If Encryption Enabled
Router.use(decryptClientRequest);

// Router.use('/users', userRouter)

if (process.env.APP_ENVIRONMENT !== 'prod')
  Router.use('/security', securityRouter);

module.exports = Router;
