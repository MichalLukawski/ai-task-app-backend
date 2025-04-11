// models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
  },
  summary: {
    type: String,
  },
  similarTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  embedding: [Number],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);
