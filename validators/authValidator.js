// validators/authValidator.js
const { body } = require('express-validator');

exports.validateRegisterInput = [
  body('email').trim().isEmail().withMessage('Invalid email format'),

  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.validateLoginInput = [
  body('email').trim().notEmpty().withMessage('Email is required'),

  body('password').notEmpty().withMessage('Password is required'),
];
