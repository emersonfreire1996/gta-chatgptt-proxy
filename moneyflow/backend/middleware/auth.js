const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next({ status: 401, code: 'NO_TOKEN', message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch (err) {
    next({ status: 401, code: 'BAD_TOKEN', message: 'Invalid or expired token' });
  }
};
