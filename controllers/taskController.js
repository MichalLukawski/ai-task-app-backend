// backend/controllers/taskController.js

const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getTaskStructureFromAI } = require('../services/gptService');
const { generateAndAttachEmbedding } = require('../services/embeddingService');
const { processTaskClosure } = require('../services/aiSummaryService');

const createTask = async (req, res) => {
  const { description } = req.body;

  const newTask = new Task({
    ownerId: req.user.id,
    description,
  });

  const savedTask = await newTask.save();
  return sendSuccess(res, 'Task created successfully', savedTask, 201);
};

const createTaskWithAI = async (req, res) => {
  const { description } = req.body;
  if (!description || description.length < 5) {
    return sendError(res, 'Description is required and must be at least 5 characters', 400);
  }

  const structure = await getTaskStructureFromAI(description);

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
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  return sendSuccess(res, 'Tasks retrieved successfully', tasks);
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ _id: id, ownerId: req.user.id })
    .populate({
   path: 'similarTasks',
  select: '_id title description summary closedAt createdAt'
    });
   if (!task) return sendError(res, 'Task not found', 404);

  return sendSuccess(res, 'Task retrieved successfully', task);
};


const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // znajdź task przypisany do użytkownika
  const existingTask = await Task.findOne({ _id: id, ownerId: req.user.id });
  if (!existingTask) {
    return sendError(res, 'Task not found', 404);
  }

  // zaktualizuj tylko przekazane pola
  Object.assign(existingTask, updates);
  await existingTask.save();

  // ponownie pobierz pełny task z bazy
  const updatedTask = await Task.findById(id);

  return sendSuccess(res, 'Task updated successfully', updatedTask);
};

const closeTaskWithAI = async (req, res) => {
  const task = await Task.findById(req.params.id);
  const isOwner = task?.ownerId?.toString() === req.user?.id?.toString();
  if (!task || !isOwner) {
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
};

const closeTaskManually = async (req, res) => {
  const task = await Task.findById(req.params.id);
  const isOwner = task?.ownerId?.toString() === req.user?.id?.toString();
  if (!task || !isOwner) {
    return sendError(res, 'Task not found or unauthorized access.', 404);
  }

  const { summary } = req.body;

  if (!summary || summary.trim().length < 10) {
    return sendError(res, 'Summary is required and must be at least 10 characters.', 400);
  }

  task.status = 'closed';
  task.closedAt = new Date();
  task.summary = summary;

  await task.save();
  return sendSuccess(res, 'Task closed manually.', task);
};

const closeTaskFromSource = async (req, res) => {
  const task = await Task.findById(req.params.id);
  const isOwner = task?.ownerId?.toString() === req.user?.id?.toString();
  if (!task || !isOwner) {
    return sendError(res, 'Task not found or unauthorized access.', 404);
  }

  const { sourceTaskId } = req.body;

  if (!sourceTaskId) {
    return sendError(res, 'sourceTaskId is required.', 400);
  }

  const sourceTask = await Task.findById(sourceTaskId);
  if (!sourceTask?.summary) {
    return sendError(res, 'Source task not found or has no summary.', 400);
  }

  task.status = 'closed';
  task.closedAt = new Date();
  task.summary = sourceTask.summary;

  await task.save();
  return sendSuccess(res, 'Task closed from source summary.', task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ownerId: req.user.id });
  if (!task) {
    return sendError(res, 'Task not found or unauthorized access.', 404);
  }

  await Task.deleteOne({ _id: task._id });
  return sendSuccess(res, 'Task permanently deleted.');
};


module.exports = {
  createTask,
  createTaskWithAI,
  getTasks,
  getTaskById,
  updateTask,
  closeTaskWithAI,
  closeTaskManually,
  closeTaskFromSource,
  deleteTask
};
