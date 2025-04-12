// backend/validators/taskValidator.js

const { body } = require('express-validator');

//Walidacja przy tworzeniu lub edycji zadania
exports.validateTaskInput = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 40 })
    .withMessage('Description must be at least 40 characters long'),

  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be either "open" or "closed"'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date (YYYY-MM-DD or full datetime)'),

  body('difficulty')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Difficulty must be an integer between 1 and 5'),
];

exports.validateUpdateTaskInput = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  body("status")
    .optional()
    .isIn(["open", "closed"])
    .withMessage("Status must be either 'open' or 'closed'"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),

  body("difficulty")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Difficulty must be between 1 and 5"),
];

exports.validateCreateTaskWithAI = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters long'),
];
