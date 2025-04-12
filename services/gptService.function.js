// services/gptService.function.js

require('dotenv').config();

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const today = new Date().toISOString().split('T')[0];

/**
 * Nowa wersja z użyciem function calling
 */
async function getTaskStructureFromAI(description) {
  const messages = [
    {
      role: 'system',
      content: `Today is ${today}. Based on the user's description, generate the data required to create a task.
  The description should be as specific and technically detailed as possible.
  Avoid general or vague language. Always respond in the same language as the user's input.`,
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

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
      tool_choice: { type: 'function', function: { name: 'create_task' } },
      temperature: 0.3,
    });

    const call = response.choices[0].message.tool_calls?.[0];
    if (!call || !call.function?.arguments) {
      throw new Error('Missing or invalid response from function call');
    }

    const parsed = JSON.parse(call.function.arguments);
    return parsed;
  } catch (error) {
    console.error('GPT function call error:', error.message);
    throw new Error('Error while generating task via AI function calling');
  }
}

async function getSummaryAssessment(taskDescription, userInput) {
  const messages = [
    {
      role: 'system',
      content: `Today is ${today}. You are an assistant that improves summaries of technical tasks. Make them clear, specific and helpful. Avoid vague language. Always respond in the same language as the user's input.`,
    },
    {
      role: 'user',
      content: `Task description:\n"${taskDescription}"\n\nUser-provided summary:\n"${userInput}".`,
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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'assess_summary' } },
    temperature: 0.2,
  });

  const call = response.choices[0].message.tool_calls?.[0];
  if (!call || !call.function?.arguments) {
    throw new Error('Missing or invalid function call from GPT (assess_summary)');
  }

  const { summary, error } = JSON.parse(call.function.arguments);
  if (error === true || !summary) {
    return 'error';
  }

  return summary.trim();
}

async function improveSummary(userInput) {
  const messages = [
    {
      role: 'system',
      content: `Today is ${today}. You are an assistant that improves summaries of technical tasks. Make them clear, specific and helpful. Avoid vague language. Always respond in the same language as the user's input.`,
    },
    {
      role: 'user',
      content: `Summary to improve:\n"${userInput}"`,
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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'improve_summary' } },
    temperature: 0.2,
  });

  const call = response.choices[0].message.tool_calls?.[0];
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
