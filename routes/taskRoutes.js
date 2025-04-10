// backend/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { validateTaskInput } = require('../validators/taskValidator');

//Wszystkie trasy wymagają zalogowania (middleware auth)
router.post('/', authMiddleware, validateTaskInput, validate, taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks);
router.put('/:id', authMiddleware, validateTaskInput, validate, taskController.updateTask);
router.post('/:id/close', authMiddleware, taskController.closeTask);
router.post('/ai-create', authMiddleware, taskController.createWithAI);

module.exports = router;
