const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getTaskStructureFromAI } = require('../services/gptService.function');
const { generateAndAttachEmbedding } = require('../services/embeddingService');
const { processTaskClosure } = require('../services/aiSummaryService');

// Tworzenie zadania ręcznie (bez AI)
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

// Tworzenie zadania z pomocą AI
exports.createTaskWithAI = async (req, res) => {
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
    return sendError(res, 'Failed to create task using AI', 500);
  }
};

// Pobieranie wszystkich zadań użytkownika
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Tasks retrieved successfully', tasks);
  } catch (err) {
    return sendError(res, 'Failed to retrieve tasks', 500);
  }
};

// Edycja zadania
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

// Zamykanie zadania przez AI – ocena summary, force, wygładzanie
exports.closeTaskWithAI = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.ownerId.toString() !== req.user.id) {
      return sendError(res, 'Task not found or unauthorized access.', 404);
    }

    const { summary, force = false } = req.body;

    if (!summary) {
      return sendError(res, 'Summary is required when using AI.', 400);
    }

    const processedSummary = await processTaskClosure({
      task,
      userSummary: summary,
      force,
    });

    task.status = 'closed';
    task.closedAt = new Date();
    task.summary = processedSummary;

    await task.save();
    return sendSuccess(res, 'Task closed successfully', task);
  } catch (err) {
    return sendError(res, err.message || 'Failed to close task with AI', 500);
  }
};

// Zamykanie zadania przez kopiowanie summary z innego zadania (bez AI)
exports.closeTask = async (req, res) => {
  try {
    const { sourceTaskId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task || task.ownerId.toString() !== req.user.id) {
      return sendError(res, 'Task not found or unauthorized access.', 404);
    }

    if (!sourceTaskId) {
      return sendError(res, 'Only sourceTaskId is allowed in this endpoint.', 400);
    }

    const sourceTask = await Task.findById(sourceTaskId);
    if (!sourceTask || !sourceTask.summary) {
      return sendError(res, 'Source task not found or has no summary.', 400);
    }

    task.status = 'closed';
    task.closedAt = new Date();
    task.summary = sourceTask.summary;

    await task.save();
    return sendSuccess(res, 'Task closed successfully (copied summary)', task);
  } catch (err) {
    return sendError(res, err.message || 'Failed to close task', 500);
  }
};
