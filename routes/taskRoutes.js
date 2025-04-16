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
const { handleTryCatch } = require('../utils/responseHandler');

// Wszystkie trasy wymagają zalogowania (middleware auth)
router.post(
  '/',
  authMiddleware,
  validateTaskInput,
  validate,
  handleTryCatch(taskController.createTask)
);

router.get('/', authMiddleware, handleTryCatch(taskController.getTasks));

router.patch(
  '/:id',
  authMiddleware,
  validateUpdateTaskInput,
  validate,
  handleTryCatch(taskController.updateTask)
);

router.patch(
  '/:id/close',
  authMiddleware,
  handleTryCatch(taskController.closeTask)
);

router.post(
  '/ai-create',
  authMiddleware,
  validateCreateTaskWithAI,
  validate,
  handleTryCatch(taskController.createTaskWithAI)
);

router.patch(
  '/:id/ai-close',
  authMiddleware,
  handleTryCatch(taskController.closeTaskWithAI)
);

module.exports = router;
