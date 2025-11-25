import embeddingService from './embeddingService.js';
import llmService from './llmService.js';
import vectorStore from '../database/vectorStore.js';
import redisClient from '../database/redis.js';
import database from '../database/postgres.js';
import config from '../config/index.js';

class RAGService {
  async processQuery(sessionId, query) {
    // Get query embedding
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // Search vector store
    const relevantDocs = await vectorStore.search(queryEmbedding, config.rag.topK);

    // Get conversation history
    const history = await redisClient.getSession(sessionId);

    // Generate response
    const response = await llmService.generateResponse(query, relevantDocs, history);

    // Update session
    const updatedHistory = [
      ...history,
      { role: 'user', content: query, timestamp: new Date().toISOString() },
      { role: 'assistant', content: response, timestamp: new Date().toISOString() },
    ];

    await redisClient.setSession(sessionId, updatedHistory);

    // Optionally persist to database
    await database.saveMessage(sessionId, 'user', query);
    await database.saveMessage(sessionId, 'assistant', response);

    return {
      response,
      sources: relevantDocs.map(doc => ({
        title: doc.title,
        url: doc.url,
        score: doc.score,
      })),
    };
  }

  async *processQueryStream(sessionId, query) {
    const queryEmbedding = await embeddingService.generateEmbedding(query);
    const relevantDocs = await vectorStore.search(queryEmbedding, config.rag.topK);
    const history = await redisClient.getSession(sessionId);

    let fullResponse = '';

    for await (const chunk of llmService.generateStreamResponse(query, relevantDocs, history)) {
      fullResponse += chunk;
      yield chunk;
    }

    // Update session after streaming completes
    const updatedHistory = [
      ...history,
      { role: 'user', content: query, timestamp: new Date().toISOString() },
      { role: 'assistant', content: fullResponse, timestamp: new Date().toISOString() },
    ];

    await redisClient.setSession(sessionId, updatedHistory);
    await database.saveMessage(sessionId, 'user', query);
    await database.saveMessage(sessionId, 'assistant', fullResponse);

    return {
      sources: relevantDocs.map(doc => ({
        title: doc.title,
        url: doc.url,
        score: doc.score,
      })),
    };
  }

  async getSessionHistory(sessionId) {
    return await redisClient.getSession(sessionId);
  }

  async clearSession(sessionId) {
    await redisClient.deleteSession(sessionId);
    await database.deleteSession(sessionId);
  }

  async getAllSessions() {
    return await redisClient.getAllSessions();
  }
}

export default new RAGService();
