const express = require('express');
const securityController = require('@controllers/security.controller');
const asyncMiddleware = require('@middlewares/asyncMiddleware');

const securityRouter = express.Router();

securityRouter.post(
  '/encryptRequest',
  asyncMiddleware(securityController.encryptRequest),
);
securityRouter.post(
  '/decryptRequest',
  asyncMiddleware(securityController.decryptRequest),
);
securityRouter.post(
  '/encryptResponse',
  asyncMiddleware(securityController.encryptResponse),
);
securityRouter.post(
  '/decryptResponse',
  asyncMiddleware(securityController.decryptResponse),
);
module.exports = securityRouter;
