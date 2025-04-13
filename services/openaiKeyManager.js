// services/openaiKeyManager.js

const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

const ALGORITHM = 'aes-256-gcm';
const GLOBAL_SCOPE = 'global';

let ENCRYPTION_KEY;
if (process.env.SECRET_ENCRYPTION_KEY) {
  ENCRYPTION_KEY = Buffer.from(process.env.SECRET_ENCRYPTION_KEY, 'hex');
}

// Encrypt API key
function encryptKey(apiKeyPlaintext) {
  if (!ENCRYPTION_KEY) {
    throw new Error('Missing SECRET_ENCRYPTION_KEY – cannot encrypt API key.');
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(apiKeyPlaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedKey: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

// Decrypt API key
function decryptKey({ encryptedKey, iv, tag }) {
  if (!ENCRYPTION_KEY) {
    throw new Error('Missing SECRET_ENCRYPTION_KEY – cannot decrypt API key.');
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedKey, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

// Get active OpenAI API key (default: global)
let cachedKey = null;
async function getOpenAIKey(scope = GLOBAL_SCOPE) {
  if (cachedKey && scope === GLOBAL_SCOPE) return cachedKey;

  const record = await ApiKey.findOne({ scope });
  if (record) {
    try {
      const key = decryptKey(record);
      if (scope === GLOBAL_SCOPE) cachedKey = key;
      return key;
    } catch (err) {
      console.warn('⚠️ Failed to decrypt OpenAI key from database:', err.message);
    }
  }

  if (scope === GLOBAL_SCOPE && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }

  throw new Error(`Missing OpenAI key for scope: ${scope}`);
}

// Add or update an API key (e.g. admin sets global key)
async function setOpenAIKey({ apiKeyPlaintext, scope = GLOBAL_SCOPE }) {
  if (!ENCRYPTION_KEY) {
    throw new Error('SECRET_ENCRYPTION_KEY is required to store API key securely.');
  }
  const encrypted = encryptKey(apiKeyPlaintext);
  await ApiKey.findOneAndUpdate(
    { scope },
    { ...encrypted, rotatedAt: new Date() },
    { upsert: true }
  );
  if (scope === GLOBAL_SCOPE) cachedKey = apiKeyPlaintext;
}

module.exports = {
  getOpenAIKey,
  setOpenAIKey,
  encryptKey,
  decryptKey,
};
