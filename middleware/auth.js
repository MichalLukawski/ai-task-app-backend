// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authorization token missing or malformed', 401, 'NO_TOKEN');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('id email role');

    if (!user) {
      return sendError(res, 'User not found', 401, 'USER_NOT_FOUND');
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }
};
