// backend/middleware/validate.js

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((e) => e.msg)
      .join('; ');
    return sendError(res, messages, 400, 'VALIDATION_ERROR');
  }

  next();
};
