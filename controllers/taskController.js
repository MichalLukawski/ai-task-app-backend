// backend/controllers/taskController.js

const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getTaskStructureFromAI } = require('../services/gptService.function');
const { generateAndAttachEmbedding } = require('../services/embeddingService');
const { processTaskClosure } = require('../services/aiSummaryService');

//Tworzenie nowego zadania
exports.createTask = async (req, res) => {
  try {
    const { description } = req.body;
    const newTask = new Task({
      ownerId: req.user.id,
      description,
    });
    const savedTask = await newTask.save();
    return sendSuccess(res, 'Task created successfully', savedTask, 201);
  } catch (err) {
    return sendError(res, 'Failed to create task', 500);
  }
};

//Pobieranie wszystkich zadań danego użytkownika
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Task retrieved successfully', tasks);
  } catch (err) {
    return sendError(res, 'Failed to retrieve tasks', 500);
  }
};

//Edycja zadania
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate({ _id: id, ownerId: req.user.id }, updates, {
      new: true,
    });

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    return sendSuccess(res, 'Task updated successfully', task);
  } catch (err) {
    return sendError(res, 'Failed to update task', 500);
  }
};

//Zamykanie zadania (status + data + notatki AI w przyszłosci)
exports.closeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: id, ownerId: req.user.id },
      {
        status: 'closed',
        closedAt: new Date(),
      },
      { new: true }
    );

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    return sendSuccess(res, 'Task closed succerssfully', task);
  } catch (err) {
    return sendError(res, 'Failed to close task', 500);
  }
};

//Tworzenie nowego zadania z wykorzystaniem AI
exports.createWithAI = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || description.length < 5) {
      return sendError(res, 'Description is required and must be at least 5 characters', 400);
    }

    const structure = await getTaskStructureFromAI(description);

    if (structure.difficulty === undefined) {
      console.warn('⚠️ AI did not return difficulty');
    }

    const task = new Task({
      ownerId: req.user.id,
      description: structure.description || description,
      title: structure.title || '',
      dueDate: structure.dueDate || null,
      difficulty: structure.difficulty ?? null,
    });

    await task.save();
    await generateAndAttachEmbedding(task._id);

    return sendSuccess(res, 'AI-generated task created', task, 201);
  } catch (err) {
    console.error(err);
    return sendError(res, 'Nie udało się stworzyć zadania z pomocą AI', 500);
  }
};

exports.closeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.ownerId.toString() !== req.user.id) {
      return sendError(res, 'Task not found or unauthorized access.', 400);
    }

    const { summary, sourceTaskId, force = false } = req.body;

    const processedSummary = await processTaskClosure({
      task,
      userSummary: summary,
      sourceTaskId,
      force,
    });

    task.status = 'closed';
    task.closedAt = new Date();
    task.summary = processedSummary;

    await task.save();
    return sendSuccess(res, 'Task closed successfully', task);
  } catch (err) {
    return sendError(res, err.message);
  }
};
