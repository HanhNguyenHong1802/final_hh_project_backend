const encryptServerResponse = require('../utils');
class ResponseHandler {
  constructor() {
    // Method Hard-binding
    this.handleBody = this.handleBody.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleBody(document, options, response) {
    const _defaultOption = { encrypt: true, message: 'OK', statusCode: 200 };
    if (!response) {
      response = options;
      options = {};
    }
    const { statusCode, message } = { ..._defaultOption, ...options };

    let responseBody = document;
    if (document && document.constructor.name !== 'ResponseBody') {
      responseBody = new ResponseBody(statusCode, message, document);
    }
    response.statusMessage = responseBody.message;
    if (process.env.ENABLE_ENCRYPTION === 'Y' && responseBody.data) {
      const data = encryptServerResponse(
        responseBody.data,
        response.locals.key,
      );
      responseBody.data = `${data.payload}|${data.iv}`;
    }
    response.status(responseBody.statusCode).json(responseBody);
  }

  handleError(error, options, response) {
    const _defaultOption = {
      encrypt: true,
      message: 'Something went wrong',
      statusCode: 500,
      data: undefined,
    };
    if (!response) {
      response = options;
      options = {};
    }

    const { statusCode, data } = { ..._defaultOption, ...options };
    let responseBody = error;
    if (error && error.constructor.name !== 'ResponseBody') {
      responseBody = new ResponseBody(statusCode, error.toString(), data);
    }
    response.statusMessage = responseBody.message;
    response.status(responseBody.statusCode).json(responseBody);
    return true;
  }

  handleResponse(response, error, document) {
    if (this.handleError(error, response)) {
      return;
    }
    this.handleBody(document, response);
  }
}

class ResponseBody {
  constructor(statusCode, message, data, error) {
    this.statusCode = parseInt(statusCode || 200);
    this.message = message;
    this.data = data || undefined;
    this.error = error;
  }
}
module.exports = {
  ResponseHandler,
  ResponseBody,
};
