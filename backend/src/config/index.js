import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },

  sessionTTL: parseInt(process.env.SESSION_TTL) || 3600,

  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collection: process.env.QDRANT_COLLECTION || "news_embeddings",
  },

  jina: {
    apiKey: process.env.JINA_API_KEY,
    model: process.env.JINA_MODEL || "jina-embeddings-v2-base-en",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-pro",
  },

  database: {
    type: process.env.DB_TYPE || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "rag_chat",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    enabled: process.env.DB_ENABLED !== "false",
  },

  rag: {
    topK: parseInt(process.env.TOP_K_RESULTS) || 5,
    maxContextLength: parseInt(process.env.MAX_CONTEXT_LENGTH) || 4000,
  },
};
