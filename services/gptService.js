// services/gptService.js

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getTaskStructureFromAI(description) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Jesteś AI wspomagającym tworzenie zadań." },
      { role: "user", content: `Stwórz strukturę zadania na podstawie opisu: "${description}"` },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

module.exports = {
  getTaskStructureFromAI,
};
