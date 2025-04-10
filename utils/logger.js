// backend/utils/logger.js

const fs = require("fs");
const path = require("path");

const logGPTFallback = (rawResponse, userDescription) => {
  const timestamp = new Date().toISOString();
  const entry = `
[${timestamp}]
🟡 Fallback JSON parsing failed
Opis użytkownika:
${userDescription}

Odpowiedź GPT:
${rawResponse}

-----------------------------------------------
`;

  const logPath = path.join(__dirname, "../logs/gpt_fallbacks.log");

  fs.appendFile(logPath, entry, (err) => {
    if (err) console.error("❌ Nie udało się zapisać fallbacka GPT:", err);
  });
};

module.exports = { logGPTFallback };
