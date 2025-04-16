// backend/services/gptService.js

require('dotenv').config();
const { DateTime } = require('luxon');
const { getOpenAIKey } = require('./openaiKeyManager');
const { OpenAI } = require('openai');

const today = DateTime.now().setZone('Europe/Warsaw').toISODate();

async function getOpenAIClient() {
  const apiKey = await getOpenAIKey();
  return new OpenAI({ apiKey });
}

async function getTaskStructureFromAI(description) {
  const openai = await getOpenAIClient();

  const messages = [
    {
      role: 'system',
      content: `Today is ${today}. Based on the user's description, generate the data required to create a task.`,
    },
    { role: 'user', content: description },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'create_task',
        description: 'Create structured task',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            difficulty: { type: 'number' },
            dueDate: { type: 'string', format: 'date' },
          },
          required: ['title', 'difficulty', 'dueDate'],
        },
      },
    },
  ];

  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    tools,
    tool_choice: 'auto',
  });

  return result.choices[0].message.tool_calls?.[0]?.function?.arguments;
}

async function getSummaryAssessment(taskDescription, userSummary) {
  // tu logika do walidacji podsumowania przez GPT
}

async function improveSummary(userSummary) {
  // tu logika do poprawy podsumowania
}

module.exports = {
  getTaskStructureFromAI,
  getSummaryAssessment,
  improveSummary,
};
