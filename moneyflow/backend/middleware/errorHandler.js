const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) logger.error(req.method, req.url, err);
  res.status(status).json({
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'Something went wrong',
      ...(err.details ? { details: err.details } : {}),
    },
  });
};
