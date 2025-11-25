import Redis from 'ioredis';
import config from '../config/index.js';

class RedisClient {
  constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });
  }

  async setSession(sessionId, messages, ttl = config.sessionTTL) {
    await this.client.setex(
      `session:${sessionId}`,
      ttl,
      JSON.stringify(messages)
    );
  }

  async getSession(sessionId) {
    const data = await this.client.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : [];
  }

  async deleteSession(sessionId) {
    await this.client.del(`session:${sessionId}`);
  }

  async extendSessionTTL(sessionId, ttl = config.sessionTTL) {
    await this.client.expire(`session:${sessionId}`, ttl);
  }

  async getAllSessions() {
    const keys = await this.client.keys('session:*');
    return keys.map(key => key.replace('session:', ''));
  }

  async cacheEmbedding(text, embedding, ttl = 86400) {
    const key = `embedding:${Buffer.from(text).toString('base64')}`;
    await this.client.setex(key, ttl, JSON.stringify(embedding));
  }

  async getCachedEmbedding(text) {
    const key = `embedding:${Buffer.from(text).toString('base64')}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async close() {
    await this.client.quit();
  }
}

export default new RedisClient();
