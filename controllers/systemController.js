// backend/controllers/systemController.js

const { setOpenAIKey } = require('../services/openaiKeyManager');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.setOpenAIKey = async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return sendError(res, "Missing 'apiKey' in request body", 400);
  }

  await setOpenAIKey({ apiKeyPlaintext: apiKey });

  return sendSuccess(res, 'OpenAI API key set successfully');
};
