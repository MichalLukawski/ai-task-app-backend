// backend/services/aiSummaryService.js

const { getSummaryAssessment, improveSummary } = require('./gptService');
const Task = require('../models/Task');

const MIN_SUMMARY_LENGTH = 40;

async function processTaskClosure({ task, userSummary, sourceTaskId, force }) {
  if (userSummary) {
    if (userSummary.length < MIN_SUMMARY_LENGTH && !force) {
      const err = new Error('Summary is too short.');
      err.code = "AI_REJECTED";
      throw err;
    }

    const aiDecision = await getSummaryAssessment(task.description, userSummary);
    if (aiDecision === 'error' && !force) {
      const err = new Error("Summary was assessed as too weak.");
      err.code = "AI_REJECTED";
      throw err;
    }

    return await improveSummary(userSummary);
  }

  if (sourceTaskId) {
    const sourceTask = await Task.findById(sourceTaskId);
    if (!sourceTask?.summary) {
      const err = new Error('Selected source task has no summary');
      err.code = "AI_REJECTED";
      throw err;
    }
    return await improveSummary(sourceTask.summary);
  }

  const err = new Error('No summary provided or source task selected');
  err.code = "AI_REJECTED";
  throw err;
}

module.exports = { processTaskClosure };
