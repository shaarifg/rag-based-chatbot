# Backend - RAG Chat API

Express.js backend with RAG pipeline, real-time streaming, and vector search.

---

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup](#-setup)
- [API Reference](#-api-reference)
- [Services](#-services)
- [Configuration](#-configuration)
- [Scripts](#-scripts)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│         Express.js Server               │
│  ┌─────────────────────────────────┐   │
│  │     Routes & Controllers        │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│  ┌────────────▼────────────────────┐   │
│  │      Services Layer             │   │
│  │  • RAG Service                  │   │
│  │  • LLM Service (Gemini)         │   │
│  │  • Embedding Service (Jina)     │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│  ┌────────────▼────────────────────┐   │
│  │      Database Layer             │   │
│  │  • Redis (sessions)             │   │
│  │  • Qdrant (vectors)             │   │
│  │  • PostgreSQL (optional)        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Design Principles:**
- **Separation of Concerns**: Controllers → Services → Database
- **Dependency Injection**: Shared service instances
- **Error Handling**: Centralized middleware
- **Configuration**: Environment-based
- **Type Safety**: ES6 modules

---

## 🛠 Tech Stack

### Core Framework
- **Express.js** `4.18.2` - Web framework
- **Socket.io** `4.6.2` - Real-time communication

### Databases
- **Redis (ioredis)** `5.3.2` - Session caching
- **Qdrant** `1.7.0` - Vector database
- **PostgreSQL (pg)** `8.11.3` - Optional persistence

### AI/ML Services
- **Google Generative AI** `0.1.3` - LLM (Gemini)
- **Jina Embeddings** - Vector embeddings API

### Data Processing
- **Axios** `1.6.2` - HTTP client
- **RSS Parser** `3.13.0` - Feed parsing
- **Cheerio** `1.0.0-rc.12` - HTML parsing

### Utilities
- **UUID** `9.0.1` - Session IDs
- **Dotenv** `16.3.1` - Environment config

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.js              # Environment configuration
│   │
│   ├── controllers/
│   │   └── chatController.js     # Request handlers
│   │
│   ├── services/
│   │   ├── ragService.js         # RAG orchestration
│   │   ├── llmService.js         # Gemini API integration
│   │   └── embeddingService.js   # Jina embeddings
│   │
│   ├── database/
│   │   ├── redis.js              # Redis client
│   │   ├── vectorStore.js        # Qdrant client
│   │   └── postgres.js           # PostgreSQL client
│   │
│   ├── routes/
│   │   └── chatRoutes.js         # API routes
│   │
│   ├── sockets/
│   │   └── chatSocket.js         # Socket.io handlers
│   │
│   ├── middleware/
│   │   └── errorHandler.js       # Error handling
│   │
│   ├── scripts/
│   │   └── ingestNews.js         # Data ingestion
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Entry point
│
├── package.json
├── Dockerfile
└── .env.example
```

---

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

**Edit `.env`:**

```env
# Server
PORT=3000
NODE_ENV=development

# Redis (use localhost for local dev)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
SESSION_TTL=3600

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=news_embeddings

# Jina Embeddings (REQUIRED)
JINA_API_KEY=your_key_here
JINA_MODEL=jina-embeddings-v2-base-en

# Google Gemini (REQUIRED)
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash

# PostgreSQL (Optional)
DB_ENABLED=false
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rag_chat
DB_USER=postgres
DB_PASSWORD=postgres

# RAG Settings
TOP_K_RESULTS=5
MAX_CONTEXT_LENGTH=4000
```

### 3. Start Dependencies

```bash
# From project root
docker compose -f docker-compose.dev.yml up -d
```

### 4. Ingest Data

```bash
npm run ingest
```

### 5. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## 📡 API Reference

### REST Endpoints

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Create Session
```http
POST /api/chat/session
```

Response:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Session created successfully"
}
```

#### Send Message
```http
POST /api/chat/message
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What's new in AI?"
}
```

Response:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "response": "Based on recent articles...",
  "sources": [
    {
      "title": "Article Title",
      "url": "https://example.com",
      "score": 0.92
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get History
```http
GET /api/chat/history/:sessionId
```

Response:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "history": [
    {
      "role": "user",
      "content": "What's new in AI?",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Based on recent articles...",
      "timestamp": "2024-01-15T10:30:05.000Z"
    }
  ]
}
```

#### Clear Session
```http
DELETE /api/chat/session/:sessionId
```

Response:
```json
{
  "message": "Session cleared successfully",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### List Sessions
```http
GET /api/chat/sessions
```

Response:
```json
{
  "sessions": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ],
  "count": 2
}
```

### Socket.io Events

#### Client → Server

**Join Session:**
```javascript
socket.emit('join-session', sessionId)
```

**Send Message:**
```javascript
socket.emit('send-message', {
  sessionId: 'uuid',
  message: 'Your question'
})
```

**Get History:**
```javascript
socket.emit('get-history', {
  sessionId: 'uuid'
})
```

**Clear Session:**
```javascript
socket.emit('clear-session', {
  sessionId: 'uuid'
})
```

#### Server → Client

**Message Received:**
```javascript
socket.on('message-received', (data) => {
  // { sessionId: 'uuid' }
})
```

**Response Chunk (Streaming):**
```javascript
socket.on('response-chunk', (data) => {
  // { chunk: 'text', sessionId: 'uuid' }
})
```

**Response Complete:**
```javascript
socket.on('response-complete', (data) => {
  // { sessionId, response, timestamp }
})
```

**History:**
```javascript
socket.on('history', (data) => {
  // { sessionId, history: [...] }
})
```

**Session Cleared:**
```javascript
socket.on('session-cleared', (data) => {
  // { sessionId: 'uuid' }
})
```

**Error:**
```javascript
socket.on('error', (error) => {
  // { error: 'message' }
})
```

---

## 🔧 Services

### RAG Service (`ragService.js`)

**Purpose:** Orchestrates the RAG pipeline

**Methods:**
- `processQuery(sessionId, query)` - Process query with RAG
- `processQueryStream(sessionId, query)` - Stream response
- `getSessionHistory(sessionId)` - Get conversation history
- `clearSession(sessionId)` - Clear session data
- `getAllSessions()` - List all sessions

**Flow:**
1. Generate query embedding
2. Search vector store (top-K)
3. Retrieve conversation history
4. Generate response with LLM
5. Update session cache
6. Persist to database (optional)

### LLM Service (`llmService.js`)

**Purpose:** Interface with Google Gemini API

**Methods:**
- `generateResponse(query, context, history)` - Generate response
- `generateStreamResponse(query, context, history)` - Stream response

**Features:**
- Context injection from vector search
- Conversation history management
- Streaming token generation
- Error handling

### Embedding Service (`embeddingService.js`)

**Purpose:** Generate text embeddings via Jina API

**Methods:**
- `generateEmbedding(text)` - Single embedding
- `generateBatchEmbeddings(texts)` - Batch embeddings

**Features:**
- Embedding caching (24hr TTL)
- Batch processing (10 texts/batch)
- Error handling

---

## 🗄 Database Clients

### Redis (`redis.js`)

**Purpose:** Session caching

**Methods:**
- `setSession(sessionId, messages, ttl)` - Cache session
- `getSession(sessionId)` - Retrieve session
- `deleteSession(sessionId)` - Clear session
- `extendSessionTTL(sessionId, ttl)` - Extend TTL
- `cacheEmbedding(text, embedding, ttl)` - Cache embedding
- `getCachedEmbedding(text)` - Get cached embedding

**Key Patterns:**
- `session:{sessionId}` - Session data
- `embedding:{base64(text)}` - Cached embeddings

### Qdrant (`vectorStore.js`)

**Purpose:** Vector database for semantic search

**Methods:**
- `initialize()` - Create collection
- `upsertDocuments(documents)` - Store embeddings
- `search(queryEmbedding, topK)` - Semantic search
- `deleteCollection()` - Delete collection
- `getCollectionInfo()` - Get collection stats

**Schema:**
```javascript
{
  id: number,
  vector: [768 dimensions],
  payload: {
    text: string,
    source: string,
    title: string,
    url: string,
    timestamp: string
  }
}
```

### PostgreSQL (`postgres.js`)

**Purpose:** Optional persistent storage

**Methods:**
- `initialize()` - Create tables
- `saveSession(sessionId)` - Save session
- `saveMessage(sessionId, role, content)` - Save message
- `getSessionHistory(sessionId)` - Get history
- `deleteSession(sessionId)` - Delete session

**Schema:**
```sql
CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
);
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | 3000 | Server port |
| `NODE_ENV` | string | development | Environment |
| `REDIS_HOST` | string | localhost | Redis host |
| `REDIS_PORT` | number | 6379 | Redis port |
| `REDIS_PASSWORD` | string | - | Redis password |
| `SESSION_TTL` | number | 3600 | Session cache TTL (seconds) |
| `QDRANT_URL` | string | http://localhost:6333 | Qdrant URL |
| `QDRANT_COLLECTION` | string | news_embeddings | Collection name |
| `JINA_API_KEY` | string | - | Jina API key |
| `JINA_MODEL` | string | jina-embeddings-v2-base-en | Embedding model |
| `GEMINI_API_KEY` | string | - | Gemini API key |
| `GEMINI_MODEL` | string | gemini-1.5-flash | LLM model |
| `DB_ENABLED` | boolean | false | Enable PostgreSQL |
| `DB_HOST` | string | localhost | Database host |
| `DB_PORT` | number | 5432 | Database port |
| `DB_NAME` | string | rag_chat | Database name |
| `DB_USER` | string | postgres | Database user |
| `DB_PASSWORD` | string | postgres | Database password |
| `TOP_K_RESULTS` | number | 5 | Vector search results |
| `MAX_CONTEXT_LENGTH` | number | 4000 | Max context chars |

---

## 📜 Scripts

### Development

```bash
# Start dev server (with nodemon)
npm run dev

# Start production server
npm start

# Ingest news data
npm run ingest
```

### Testing

```bash
# Test REST API
chmod +x test-api.sh
./test-api.sh

# Test Socket.io
node test-socket.js
```

### Data Management

```bash
# Check Qdrant collection
curl http://localhost:6333/collections/news_embeddings

# Check Redis keys
docker exec -it <redis-container> redis-cli KEYS "*"

# Re-ingest data
npm run ingest
```

---

## 🔍 Troubleshooting

### Redis Connection Error

```bash
# Check Redis is running
docker ps | grep redis

# Test connection
redis-cli ping

# Restart Redis
docker compose -f docker-compose.dev.yml restart redis
```

### Qdrant Connection Error

```bash
# Check Qdrant
curl http://localhost:6333

# View collections
curl http://localhost:6333/collections

# Restart Qdrant
docker compose -f docker-compose.dev.yml restart qdrant
```

### Gemini API Error

Common issues:
- Invalid API key → Check `.env`
- Wrong model name → Use `gemini-1.5-flash` or `gemini-1.5-pro`
- Rate limit → Wait or upgrade plan
- Network error → Check internet connection

### Jina API Error

Common issues:
- Invalid API key → Check `.env`
- Rate limit (60/min) → Implement backoff
- Network error → Check connection

### No Embeddings Found

```bash
# Check collection exists
curl http://localhost:6333/collections/news_embeddings

# Check vector count
curl http://localhost:6333/collections/news_embeddings | jq '.result.vectors_count'

# Re-ingest if count is 0
npm run ingest
```

---

## 🚀 Performance Optimization

### Caching Strategy

**Session Cache:**
- TTL: 1 hour (configurable)
- Auto-extends on activity
- Cleared on explicit delete

**Embedding Cache:**
- TTL: 24 hours
- Reduces API calls by ~80%
- Base64 text key

### Connection Pooling

- PostgreSQL: 10 connections
- Redis: Persistent connection with retry
- Qdrant: HTTP client with keep-alive

### Batch Processing

- Embeddings: 10 texts per batch
- Vector upsert: Bulk insert
- RSS feeds: Parallel fetching

---

## 📊 Monitoring

### Health Checks

```bash
# Server health
curl http://localhost:3000/health

# Redis health
docker exec <redis-container> redis-cli ping

# Qdrant health
curl http://localhost:6333/collections
```

### Logs

```bash
# View server logs
npm run dev

# Docker logs
docker compose logs -f backend
```

---

## 📝 License

MIT
