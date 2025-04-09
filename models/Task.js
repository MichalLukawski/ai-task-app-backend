// backend/models/Task.js

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    closedAt : {
        type: Date,
    },
});

module.exports = mongoose.model('Task', TaskSchema);