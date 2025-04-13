const express = require('express');
const router = express.Router();
const { setOpenAIKey } = require('../services/openaiKeyManager');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const auth = require('../middleware/auth');

router.post('/openai-key', auth, async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return sendError(res, "Missing 'apiKey' in request body", 400);
    }

    // Optional: check if user is admin
    // if (req.user.role !== "admin") {
    //   return sendError(res, "Only admins can set the OpenAI API key", 403);
    // }

    await setOpenAIKey({ apiKeyPlaintext: apiKey });
    return sendSuccess(res, 'OpenAI API key set successfully');
  } catch (err) {
    return sendError(res, 'Failed to set OpenAI key', 500, err.message);
  }
});

module.exports = router;
