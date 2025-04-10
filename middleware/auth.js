// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Brak nagłówka Authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return sendError(res, 'Authorization header missing', 401, 'NO_TOKEN');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }
};
