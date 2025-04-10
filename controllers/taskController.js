// backend/controllers/taskController.js

const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getTaskStructureFromAI } = require('../services/gptService');

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

        const task = await Task.findOneAndUpdate(
            { _id: id, ownerId: req.user.id },
            updates,
            { new: true }
        );

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

        if (!description || description.trim().lenght < 5) {
            return sendError(res, 'Description is too short or missing', 400);
    }

    const aiResponse = await getTaskStructureFromAI(description);

    const newTask = new Task({
        ownerId: req.user.id,
        description,
        notes: aiResponse, // odpowiedź GPT zapisujemy jako notatki
        status: 'open'
    });

    await newTask.save();
    return sendSuccess(res, 'AI-generated task created', newTask, 201);
} catch (err) {
    console.error('AI task creation error: ', err);
    return sendError(res, 'Failed to create task with AI', 500);
}
};