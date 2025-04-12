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
      content: `Dziś jest ${today}. Na podstawie opisu użytkownika wygeneruj dane potrzebne do utworzenia zadania. Opis powinien być maksymalnie konkretny i zoptymalizowany pod późniejsze porównywanie przez modele embeddingowe (np. OpenAI embeddings).
Unikaj ogólników.`,
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
        description: 'Tworzy strukturę zadania na podstawie opisu użytkownika',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Krótki tytuł zadania',
            },
            description: {
              type: 'string',
              description:
                'Pełny opis zadania, zoptymalizowany pod embedding (techniczne szczegóły, konkretne komunikaty, kody błędów itd.)',
            },
            dueDate: {
              type: 'string',
              description: 'Termin wykonania zadania (ISO format), tylko jeśli podano w opisie.',
              format: 'date',
            },
            difficulty: {
              type: 'number',
              description:
                'Szacowany poziom trudności zadania (od 1 = bardzo łatwe do 5 = bardzo trudne)',
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
      content:
        'You are an assistant helping users improve summaries of technical tasks. Respond using function calling.',
    },
    {
      role: 'user',
      content: `Task description:\n"${taskDescription}"\n\nUser-provided summary:\n"${userInput}"`,
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
      content:
        'You are an assistant that improves summaries of technical tasks. Return only the improved version using a function call.',
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
