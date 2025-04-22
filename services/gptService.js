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
      content: `Today is ${today}. Your task is to extract structured task information strictly based on the content provided by the user.

Do not add, guess, or infer any information that is not explicitly stated by the user.

If the description is incomplete or unclear, you must still generate a title, description, and difficulty using only the available data, without adding anything on your own.

You may slightly rephrase or clean up the text to improve readability, but preserve the full meaning and technical accuracy.

Respond in the same language as the user.`

      
    },
    {
      role: 'user',
      content: description,
    },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'create_task',
        description: 'Generates a task structure based on the user’s description.',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'A short, concise title for the task.',
            },
            description: {
              type: 'string',
              description:
                'A detailed technical description of the task, suitable for embedding models (e.g., technical context, error messages, stack traces).',
            },
            dueDate: {
              type: 'string',
              description: 'Due date in ISO 8601 format, only if clearly specified by the user.',
              format: 'date',
            },
            difficulty: {
              type: 'number',
              description: 'Estimated difficulty of the task (1 = very easy, 5 = very hard).',
              minimum: 1,
              maximum: 5,
            },
          },
          required: ['title', 'description', 'difficulty'],
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

  const args = result.choices[0].message.tool_calls?.[0]?.function?.arguments;

  if (!args) {
    throw new Error('Missing or invalid response from GPT function calling');
  }

  const parsed = JSON.parse(args);

  // Opcjonalna walidacja:
  if (!parsed.title?.trim()) {
    throw new Error('GPT returned empty or missing task title');
  }

  return parsed;
}

async function getSummaryAssessment(taskDescription, userSummary) {
  const openai = await getOpenAIClient();

  const messages = [
    {
      role: 'system',
      content: `Today is ${today}. You are an assistant that improves summaries of technical tasks. Make them clear, specific and helpful. Avoid vague language. Always respond in the same language as the user's input.`,
    },
    {
      role: 'user',
      content: `Task description:\n"${taskDescription}"\n\nUser-provided summary:\n"${userSummary}".`,
    },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'assess_summary',
        description: 'Evaluates and improves a summary for a completed task',
        parameters: {
          type: 'object',
          properties: {
            summary: {
              type: 'string',
              description: 'Improved summary based on user input',
            },
            error: {
              type: 'boolean',
              description: 'Whether the original summary was too weak to be improved',
            },
          },
          required: ['error'],
        },
      },
    },
  ];

  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'assess_summary' } },
    temperature: 0.2,
  });

  const call = result.choices[0].message.tool_calls?.[0];
  if (!call || !call.function?.arguments) {
    throw new Error('Missing or invalid function call from GPT (assess_summary)');
  }

  const { summary, error } = JSON.parse(call.function.arguments);
  if (error === true || !summary) {
    return 'error';
  }

  return summary.trim();
}

async function improveSummary(userSummary) {
  const openai = await getOpenAIClient();

  const messages = [
    {
      role: 'system',
      content: `Today is ${today}. You are an assistant that improves summaries of technical tasks. Make them clear, specific and helpful. Avoid vague language. Always respond in the same language as the user's input.`,
    },
    {
      role: 'user',
      content: `Summary to improve:\n"${userSummary}"`,
    },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'improve_summary',
        description: 'Improves the wording and clarity of the user-provided summary',
        parameters: {
          type: 'object',
          properties: {
            summary: {
              type: 'string',
              description: 'Improved version of the original summary',
            },
          },
          required: ['summary'],
        },
      },
    },
  ];

  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'improve_summary' } },
    temperature: 0.2,
  });

  const call = result.choices[0].message.tool_calls?.[0];
  if (!call || !call.function?.arguments) {
    throw new Error('Missing or invalid function call from GPT (improve_summary)');
  }

  const { summary } = JSON.parse(call.function.arguments);
  return summary.trim();
}

module.exports = {
  getTaskStructureFromAI,
  getSummaryAssessment,
  improveSummary,
};
