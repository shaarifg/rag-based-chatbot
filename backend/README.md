# RAG-Based Chat Backend with Express.js

Production-ready RAG pipeline with news article ingestion, vector search, and real-time chat capabilities.

## Architecture

```
├── REST API (Express)
├── Socket.io (Real-time chat)
├── Redis (Session caching)
├── Qdrant (Vector store)
├── PostgreSQL (Optional persistence)
├── Jina Embeddings API
└── Google Gemini API
```

## Features

✅ **RAG Pipeline**
- Ingest ~50 news articles from RSS feeds
- Jina Embeddings (free tier)
- Qdrant vector store
- Top-K retrieval with semantic search

✅ **Backend API**
- REST endpoints for chat
- Socket.io for streaming responses
- Session management with Redis
- Optional PostgreSQL persistence

✅ **Caching & Performance**
- Redis for session history (in-memory)
- Embedding cache (1 day TTL)
- Configurable session TTL
- Connection pooling

## Setup

### 1. Install Dependencies

```bash
cd rag-backend
npm install
```

### 2. Start Services

**Redis:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

**Qdrant:**
```bash
docker run -d -p 6333:6333 qdrant/qdrant
```

**PostgreSQL (Optional):**
```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=rag_chat \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
JINA_API_KEY=your_jina_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Get API keys:
- Jina: https://jina.ai/embeddings/
- Gemini: https://makersuite.google.com/app/apikey

### 4. Ingest News Articles

```bash
npm run ingest
```

This fetches ~50 articles from RSS feeds and indexes them.

### 5. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### REST API

**Create Session**
```bash
POST /api/chat/session
Response: { "sessionId": "uuid" }
```

**Send Message**
```bash
POST /api/chat/message
Body: {
  "sessionId": "uuid",
  "message": "What's the latest in AI?"
}
Response: {
  "sessionId": "uuid",
  "response": "...",
  "sources": [...],
  "timestamp": "..."
}
```

**Get History**
```bash
GET /api/chat/history/:sessionId
Response: {
  "sessionId": "uuid",
  "history": [...]
}
```

**Clear Session**
```bash
DELETE /api/chat/session/:sessionId
Response: {
  "message": "Session cleared successfully"
}
```

**Get All Sessions**
```bash
GET /api/chat/sessions
Response: {
  "sessions": ["uuid1", "uuid2"],
  "count": 2
}
```

### Socket.io Events

**Connect & Join Session**
```javascript
const socket = io('http://localhost:3000');
socket.emit('join-session', sessionId);
```

**Send Message (Streaming)**
```javascript
socket.emit('send-message', {
  sessionId: 'uuid',
  message: 'What is happening in tech?'
});

socket.on('message-received', (data) => {
  console.log('Processing...');
});

socket.on('response-chunk', (data) => {
  console.log(data.chunk); // Stream tokens
});

socket.on('response-complete', (data) => {
  console.log('Full response:', data.response);
});
```

**Get History**
```javascript
socket.emit('get-history', { sessionId: 'uuid' });
socket.on('history', (data) => {
  console.log(data.history);
});
```

**Clear Session**
```javascript
socket.emit('clear-session', { sessionId: 'uuid' });
socket.on('session-cleared', (data) => {
  console.log('Session cleared');
});
```

## Caching Strategy

### Redis Configuration

**Session Cache:**
- **TTL**: 3600s (1 hour, configurable)
- **Key pattern**: `session:{sessionId}`
- **Warming**: Sessions created on first message
- **Eviction**: Automatic after TTL expires

**Embedding Cache:**
- **TTL**: 86400s (24 hours)
- **Key pattern**: `embedding:{base64(text)}`
- **Purpose**: Avoid redundant API calls
- **Invalidation**: Automatic expiry

### Cache Warming

To pre-warm cache with common queries:

```javascript
// Add to src/scripts/warmCache.js
const commonQueries = [
  "What's new in AI?",
  "Latest tech news",
  "Current technology trends"
];

for (const query of commonQueries) {
  await embeddingService.generateEmbedding(query);
}
```

### TTL Configuration

In `.env`:
```env
SESSION_TTL=3600        # Session cache (1 hour)
EMBEDDING_CACHE_TTL=86400  # Embedding cache (24 hours)
```

Extend session on activity:
```javascript
await redisClient.extendSessionTTL(sessionId, 3600);
```

## Performance Optimizations

1. **Connection Pooling**: PostgreSQL pool with 10 connections
2. **Batch Embeddings**: Process 10 documents at once
3. **Redis Pipelining**: Multiple operations in single roundtrip
4. **Vector Search**: Cosine similarity with HNSW index
5. **Content Chunking**: 500 char chunks for better retrieval

## Testing

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Send Message:**
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "What is the latest news?"
  }'
```

**Get History:**
```bash
curl http://localhost:3000/api/chat/history/test-123
```

**Clear Session:**
```bash
curl -X DELETE http://localhost:3000/api/chat/session/test-123
```

## Project Structure

```
src/
├── config/          # Environment configuration
├── controllers/     # Request handlers
├── database/        # Redis, Qdrant, PostgreSQL clients
├── services/        # Business logic (RAG, embeddings, LLM)
├── routes/          # API routes
├── sockets/         # Socket.io handlers
├── middleware/      # Error handling
├── scripts/         # Ingestion scripts
└── server.js        # Entry point
```

## System Design Principles

✅ **Separation of Concerns**: Controllers → Services → Database
✅ **Dependency Injection**: Shared service instances
✅ **Error Handling**: Centralized middleware
✅ **Configuration Management**: Environment-based config
✅ **Graceful Shutdown**: Clean resource cleanup
✅ **Logging**: Structured console logs
✅ **Type Safety**: ES6 modules with proper imports

## Production Considerations

1. **Rate Limiting**: Add `express-rate-limit`
2. **Authentication**: Add JWT middleware
3. **Monitoring**: Add Prometheus metrics
4. **Logging**: Use Winston/Pino
5. **Clustering**: PM2 for multi-core
6. **Nginx**: Reverse proxy with load balancing
7. **HTTPS**: SSL certificates
8. **Environment**: Use separate .env per environment

## Troubleshooting

**Redis connection failed:**
```bash
docker ps  # Check if Redis is running
docker logs <container_id>
```

**Qdrant collection not found:**
```bash
npm run ingest  # Re-run ingestion
```

**Embedding API errors:**
- Check Jina API key validity
- Verify API rate limits
- Check network connectivity

**Database connection issues:**
- Verify PostgreSQL credentials
- Check if DB exists
- Test connection manually

## License

MIT
