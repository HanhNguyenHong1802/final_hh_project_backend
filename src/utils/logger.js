const debug = require('debug');

const logger = debug('app:logger');

const logAxiosError = ({ err, groupName = 'AxiosError' }) => {
  logger(JSON.stringify({ groupName, err: JSON.stringify(err) }));
};

const logError = ({
  err = 'logError',
  groupName = 'logError',
  message = null,
}) => {
  let params = {
    groupName,
    errorMessage: err.toString(),
    stack: err.stack || err,
    code: err.code || '',
    userMessage: message || '',
  };
  if (err.constructor && err.constructor.name === 'ResponseBody') {
    params = { groupName, ...err };
  }
  logger(JSON.stringify(params));
};

const logData = ({ data = {}, groupName = 'logData', message = null }) => {
  const params = { groupName, data, message };
  logger(JSON.stringify(params));
};

module.exports = {
  logAxiosError,
  logData,
  logError,
};
