import axios from 'axios';
import config from '../config/index.js';
import redisClient from '../database/redis.js';

class EmbeddingService {
  constructor() {
    this.apiUrl = 'https://api.jina.ai/v1/embeddings';
    this.apiKey = config.jina.apiKey;
    this.model = config.jina.model;
  }

  async generateEmbedding(text) {
    // Check cache first
    const cached = await redisClient.getCachedEmbedding(text);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          input: [text],
          model: this.model,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      const embedding = response.data.data[0].embedding;
      
      // Cache the embedding
      await redisClient.cacheEmbedding(text, embedding);
      
      return embedding;
    } catch (error) {
      console.error('Embedding generation error:', error.message);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(texts) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          input: texts,
          model: this.model,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.data.map(item => item.embedding);
    } catch (error) {
      console.error('Batch embedding generation error:', error.message);
      throw new Error('Failed to generate batch embeddings');
    }
  }
}

export default new EmbeddingService();
