// backend/routes/systemRoutes.js

const express = require('express');
const router = express.Router();
const { setOpenAIKey } = require('../controllers/systemController');
const auth = require('../middleware/auth');
const { handleTryCatch } = require('../utils/responseHandler');

router.post('/openai-key', auth, handleTryCatch(setOpenAIKey));

module.exports = router;
