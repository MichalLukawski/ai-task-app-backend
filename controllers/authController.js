// backend/controllers/authController.js

const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 'Email already registered', 400, 'EMAIL_EXISTS');
    }

    const newUser = new User({ email, password });
    await newUser.save();

    sendSuccess(res, 'User registered successfully');
  } catch (err) {
    sendError(res, 'Registration failed', 500, 'REGISTRATION_ERROR');
  }
};

module.exports = { register };
