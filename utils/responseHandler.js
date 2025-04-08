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

module.exports = {
    sendSuccess,
    sendError,
};