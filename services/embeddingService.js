require('dotenv').config();
const { OpenAI } = require('openai');
const { getOpenAIKey } = require('./openaiKeyManager');
const Task = require('../models/Task');

/*
 * Generates an OpenAI client using dynamic API key from database
 */
async function getOpenAIClient() {
  const apiKey = await getOpenAIKey();
  return new OpenAI({ apiKey });
}

/*
 * Generates an embedding from the provided text
 */
async function generateEmbedding(text) {
  try {
    const openai = await getOpenAIClient();
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (err) {
    console.error('Embedding generation error:', err.message);
    throw new Error('Failed to generate embedding.');
  }
}

/*
 * Calculates cosine similarity between two embedding vectors
 */
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

  return dotProduct / (normA * normB);
}

/*
 * Finds top 5 similar tasks with cosine similarity >= 0.75
 */
async function findSimilarTasks(newEmbedding) {
  const candidates = await Task.find({
    status: 'closed',
    embedding: { $exists: true, $ne: [] },
  }).lean();

  const scored = candidates
    .map((task) => {
      const score = cosineSimilarity(newEmbedding, task.embedding);
      console.log(`similarity: ${score}`);
      return { taskId: task._id, similarity: score };
    })
    .filter((entry) => entry.similarity >= 0.75)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  return scored;
}

/*
 * Generates and attaches embedding + similarTasks to given task
 */
async function generateAndAttachEmbedding(taskId) {
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    const text = `${task.title}. ${task.description}`;
    const embedding = await generateEmbedding(text);
    const similar = await findSimilarTasks(embedding);

    task.embedding = embedding;
    task.similarTasks = similar.map((s) => s.taskId);
    await task.save();

    console.log(`✅ Embedding + similarTasks updated for task ${taskId}`);
  } catch (err) {
    console.error('Embedding pipeline error:', err.message);
    throw new Error('Failed to attach embedding and similar tasks.');
  }
}

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  findSimilarTasks,
  generateAndAttachEmbedding,
};
