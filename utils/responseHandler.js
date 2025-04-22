// backend/utils/responseHandler.js

// Success response (HTTP 2xx)
const sendSuccess = (res, message = 'success', data = null, status = 200) => {
  return res.status(status).json({
    status: 'success',
    message,
    data,
  });
};

// Error response (HTTP 4xx / 5xx)
const sendError = (res, message = 'Something went wrong', status = 500, code = null) => {
  return res.status(status).json({
    status: 'error',
    message,
    code,
  });
};

// Wrapper for try/catch handling in async route handlers
const handleTryCatch = (asyncFn) => {
  if (typeof asyncFn !== 'function') {
    console.error('❌ handleTryCatch error: passed argument is not a function:', asyncFn);
    throw new TypeError('handleTryCatch expects a function');
  }

  return async (req, res, next) => {
    try {
      await asyncFn(req, res, next);
    } catch (err) {
      console.error('❌ Error in route handler:', err);
      return sendError(res, err.message || 'Unexpected error', 500, err.code || null);
    }
  };
};

module.exports = {
  sendSuccess,
  sendError,
  handleTryCatch,
};
