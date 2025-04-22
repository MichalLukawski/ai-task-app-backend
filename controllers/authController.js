// backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Rejestracja nowego użytkownika
const register = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendError(res, 'Email already registered', 400, 'EMAIL_EXISTS');
  }

  const newUser = new User({ email, password });
  await newUser.save();

  return sendSuccess(res, 'User registered successfully');
};

// Logowanie użytkownika i generowanie tokena JWT
const login = async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return sendError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const expiresIn = rememberMe ? '7d' : '1d';
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });

  return sendSuccess(res, 'Login successful', { token });
};

module.exports = { register, login };
