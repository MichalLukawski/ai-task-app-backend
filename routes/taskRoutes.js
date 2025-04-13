// backend/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  validateTaskInput,
  validateUpdateTaskInput,
  validateCreateTaskWithAI,
} = require('../validators/taskValidator');

//Wszystkie trasy wymagają zalogowania (middleware auth)
router.post('/', authMiddleware, validateTaskInput, validate, taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks);
router.patch('/:id', authMiddleware, validateUpdateTaskInput, validate, taskController.updateTask);
router.patch('/:id/close', authMiddleware, taskController.closeTask);
router.post(
  '/ai-create',
  authMiddleware,
  validateCreateTaskWithAI,
  validate,
  taskController.createTaskWithAI
);
router.patch('/:id/ai-close', authMiddleware, taskController.closeTaskWithAI);

module.exports = router;
