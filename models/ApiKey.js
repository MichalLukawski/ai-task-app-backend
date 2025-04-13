const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  scope: { type: String, required: true }, // "global" or e.g. userId
  encryptedKey: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rotatedAt: { type: Date },
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
