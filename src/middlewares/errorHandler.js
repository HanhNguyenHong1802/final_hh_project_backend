const debug = require('debug');
const { HTTP_STATUS } = require('../constants');
const { logError } = require('../utils');

const log = debug('app:error');

const errorHandler = (err, req, res, next) => {
  err.status && err.status === '404'
    ? log(err.toString())
    : logError({ err, groupName: 'ErrorHandler' });

  if (err.constructor.name === 'ResponseBody') {
    const statusCode = parseInt(
      err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
    return res
      .status(statusCode)
      .json({ statusCode, message: err.message, data: err.data });
  }
  // Handle Apperror
  if (err.name === 'Apperror') {
    const statusCode = parseInt(
      err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
    return res
      .status(statusCode)
      .json({ statusCode, message: err.message, data: err.data });
  }

  // Handle Mongoose  validation error
  if (err.name === 'ValidationError') {
    const statusCode = parseInt(HTTP_STATUS.BAD_REQUEST);
    return res.status(statusCode).json({ statusCode, message: err.message });
  }

  // Default handle error
  const errormessage = ['local', 'dev', 'uat'].includes(process.env.NODE_ENV)
    ? err.message
    : 'Something broke !';

  if (!res.headersSent) {
    const statusCode = parseInt(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    return res.status(statusCode).json({ statusCode, message: errormessage });
  }
};

module.exports = errorHandler;
