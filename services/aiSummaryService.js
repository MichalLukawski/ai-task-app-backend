const { getSummaryAssessment, improveSummary } = require('./gptService.function');
const Task = require('../models/Task');

const MIN_SUMMARY_LENGTH = 40;

const processTaskClosure = async ({ task, userSummary, sourceTaskId, force }) => {
  // Case 1: User provided a summary
  if (userSummary) {
    if (userSummary.length < MIN_SUMMARY_LENGTH && !force) {
      throw new Error(
        'Summary is too short. Minimum length is 40 characters or explicit override required.'
      );
    }

    const aiDecision = await getSummaryAssessment(task.description, userSummary);
    if (aiDecision === 'error' && !force) {
      throw new Error('Summary was assessed as too weak. Please improve it or force the usage.');
    }

    return await improveSummary(userSummary);
  }

  // Case 2: User selected a source task
  if (sourceTaskId) {
    const sourceTask = await Task.findById(sourceTaskId);
    if (!sourceTask || !sourceTask.summary) {
      throw new Error('Selected source task has no summary to copy.');
    }

    return sourceTask.summary;
  }

  // Case 3: No input provided
  throw new Error('You must provide a summary or select a task to copy the solution from.');
};

module.exports = {
  processTaskClosure,
};
