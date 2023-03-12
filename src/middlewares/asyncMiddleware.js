const asyncMiddleware = (req, res, next) =>
  Promise.resolve(req, res, next).catch(next);
module.exports = asyncMiddleware;
