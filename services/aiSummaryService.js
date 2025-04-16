// backend/services/aiSummaryService.js

const { getSummaryAssessment, improveSummary } = require('./gptService');
const Task = require('../models/Task');

const MIN_SUMMARY_LENGTH = 40;

async function processTaskClosure({ task, userSummary, sourceTaskId, force }) {
  if (userSummary) {
    if (userSummary.length < MIN_SUMMARY_LENGTH && !force) {
      throw new Error('Summary is too short.');
    }

    const aiDecision = await getSummaryAssessment(task.description, userSummary);
    if (aiDecision === 'error' && !force) {
      throw new Error('Summary was assessed as too weak.');
    }

    return await improveSummary(userSummary);
  }

  if (sourceTaskId) {
    const sourceTask = await Task.findById(sourceTaskId);
    if (!sourceTask?.summary) throw new Error('Selected source task has no summary');
    return await improveSummary(sourceTask.summary);
  }

  throw new Error('No summary provided or source task selected');
}

module.exports = { processTaskClosure };
