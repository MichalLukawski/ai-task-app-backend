// backend/services/gptService.js

require('dotenv').config();

const { OpenAI } = require("openai");
const { logGPTFallback } = require("../utils/logger");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const today = new Date().toISOString().split("T")[0]; 

async function getTaskStructureFromAI(description) {
  const messages = [
    {
      role: "system",
      content:
         `Jest ${today}. Jesteś pomocnym asystentem technicznym. Twoim zadaniem jest przekształcenie opisu zadania w obiekt JSON z polami: title, description, dueDate (jeśli występuje), notes (jeśli występuje). Nie dodawaj komentarzy ani znaczników markdown. Zwróć tylko czysty JSON.`
    },
    {
      role: "user",
      content: `Opis zadania:\n${description}`
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.3
    });
  
    const raw = completion.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
  
    try {
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (parseError) {
      console.warn("⚠️ GPT JSON parsing failed – using fallback.");
      logGPTFallback(raw, description);
      return {
        title: "",
        description,
        notes: raw  // surowa odpowiedź jako notatka
      };
    }
  } catch (error) {
    console.error("GPT request error:", error.message);
    throw new Error("Błąd generowania struktury zadania przez GPT");
  }
}

module.exports = { getTaskStructureFromAI };
