// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { handleTryCatch } = require('../utils/responseHandler');

router.post('/register', validateRegisterInput, validate, handleTryCatch(register));

router.post('/login', validateLoginInput, validate, handleTryCatch(login));

module.exports = router;
