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
      content: `Dziś jest ${today}. Na podstawie opisu użytkownika wygeneruj dane potrzebne do utworzenia zadania. Uwzględnij także ocenę trudności zadania w skali 1–5`,
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
              description: 'Opis zadania',
            },
            dueDate: {
              type: 'string',
              description: 'Termin wykonania zadania (ISO format)',
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
      throw new Error('Brak poprawnej odpowiedzi funkcji');
    }

    const parsed = JSON.parse(call.function.arguments);
    return parsed;
  } catch (error) {
    console.error('GPT function call error:', error.message);
    throw new Error('Błąd generowania zadania z AI (function calling)');
  }
}

module.exports = { getTaskStructureFromAI };
