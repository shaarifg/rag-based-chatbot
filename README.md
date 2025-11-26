# RAG-Powered Chatbot

A production-ready RAG (Retrieval-Augmented Generation) chatbot with real-time streaming, vector search, and modern UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📑 Quick Navigation

- [**Frontend Documentation**](./frontend/README.md) - React + Vite UI with markdown support
- [**Backend Documentation**](./backend/README.md) - Express.js API with RAG pipeline
- [**Local Development Setup**](#-local-development-setup) - Get started in 5 minutes
- [**Production Deployment**](#-production-deployment) - Deploy to GCP VM

---

## 🚀 Features

### Backend

- ✅ Express.js REST API + Socket.io (real-time streaming)
- ✅ RAG pipeline with Jina embeddings + Qdrant vector store
- ✅ Redis session caching (1hr TTL)
- ✅ Google Gemini LLM integration
- ✅ News article ingestion from RSS feeds

### Frontend

- ✅ React 18 + Vite
- ✅ Light/Dark theme toggle
- ✅ GitHub-style markdown rendering
- ✅ Real-time message streaming
- ✅ Paper-like modern design
- ✅ No borders, shadows, or rounded corners

---

## 📁 Project Structure

```
rag-based-chatbot/
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic (RAG, LLM, embeddings)
│   │   ├── database/        # Redis, Qdrant clients
│   │   ├── routes/          # API routes
│   │   ├── sockets/         # Socket.io handlers
│   │   ├── middleware/      # Error handling
│   │   └── scripts/         # Data ingestion
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Theme context
│   │   ├── services/        # API & Socket services
│   │   ├── config/          # Configuration
│   │   └── styles/          # SCSS styles
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml        # Production (all services)
├── docker-compose.dev.yml    # Development (Redis + Qdrant only)
└── README.md                 # This file
```

---

## 🛠 Local Development Setup

### Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose
- npm or yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/rag-based-chatbot.git
cd rag-based-chatbot
```

### Step 2: Start Docker Services (Redis + Qdrant)

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:

- **Redis** on `localhost:6379`
- **Qdrant** on `localhost:6333`

Verify services are running:

```bash
docker ps
```

### Step 3: Backend Setup

#### 3.1 Install Dependencies

```bash
cd backend
npm install
```

#### 3.2 Configure Environment

```bash
cp .env.example .env
```

**Edit `backend/.env` and add your API keys:**

```env
PORT=3000
NODE_ENV=development

# Docker services (already running)
REDIS_HOST=localhost
REDIS_PORT=6379
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=news_embeddings

# ⚠️ REQUIRED: Add your API keys here
JINA_API_KEY=your_jina_api_key_here
JINA_MODEL=jina-embeddings-v2-base-en

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional
DB_ENABLED=false
SESSION_TTL=3600
TOP_K_RESULTS=5
```

**Get API Keys:**

- **Jina Embeddings**: https://jina.ai/embeddings/ (Free tier available)
- **Google Gemini**: https://makersuite.google.com/app/apikey (Free tier available)

#### 3.3 Ingest News Data

```bash
npm run ingest
```

Expected output:

```
📰 Fetching RSS feeds...
✅ Fetched 15 articles from NY Times
✅ Fetched 12 articles from BBC
📝 Created 127 document chunks
🧮 Generating embeddings...
✅ Successfully ingested 127 documents
```

#### 3.4 Start Backend Server

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

Test:

```bash
curl http://localhost:3000/health
```

### Step 4: Frontend Setup

Open a **new terminal**.

#### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

#### 4.2 Configure Environment

```bash
cp .env.example .env
```

**Edit `frontend/.env`:**

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

#### 4.3 Start Frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 5: Open Browser

Navigate to `http://localhost:5173`

You should see:

- ✅ Chat interface with light theme
- ✅ Connection status: "Connected"
- ✅ Welcome message with suggestions

---

## 🧪 Testing

### Test Chat Flow

1. Click a suggestion or type: "What are the latest AI developments?"
2. Observe:
   - Message appears instantly
   - Typing indicator shows
   - Response streams token by token
   - Markdown formatted response

### Test Theme Toggle

1. Click moon icon (🌙) in header
2. Theme switches to dark
3. Refresh page - theme persists

### Test Reset

1. Send a few messages
2. Click "RESET" button
3. Confirm dialog
4. Messages clear, new session starts

---

## 🐳 Production Deployment

### Option 1: Docker Compose (All-in-One)

**Step 1: Configure Environment**

```bash
# Backend
cp backend/.env.example backend/.env
# Add your API keys to backend/.env

# Frontend
cp frontend/.env.example frontend/.env
# Update with your production URLs
```

**Step 2: Build and Start**

```bash
docker compose up -d --build
```

Services:

- Frontend: `http://localhost:80`
- Backend: `http://localhost:3000`
- Redis: Internal
- Qdrant: Internal

**Step 3: Ingest Data**

```bash
docker compose exec backend node src/scripts/ingestNews.js
```

### Option 2: GCP VM with GitHub Actions

See [deployment guide](./.github/workflows/deploy.yml) for automated CI/CD setup.

---

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│      React Frontend (localhost:5173)        │
│  • Light/Dark theme                         │
│  • Markdown rendering                       │
│  • Real-time streaming                      │
└─────────────────┬───────────────────────────┘
                  │
        WebSocket + REST API
                  │
┌─────────────────▼───────────────────────────┐
│   Express Backend (localhost:3000)          │
│  • RAG Pipeline                             │
│  • Session Management                       │
│  • Vector Search                            │
└───┬─────────┬──────────┬────────────────────┘
    │         │          │
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌──────────┐
│ Redis  │ │ Qdrant │ │  APIs    │
│ :6379  │ │ :6333  │ │ (Jina +  │
│        │ │        │ │  Gemini) │
└────────┘ └────────┘ └──────────┘
```

---

## 🔧 Configuration

### Backend Environment Variables

| Variable         | Description             | Required | Default               |
| ---------------- | ----------------------- | -------- | --------------------- |
| `JINA_API_KEY`   | Jina embeddings API key | ✅ Yes   | -                     |
| `GEMINI_API_KEY` | Google Gemini API key   | ✅ Yes   | -                     |
| `REDIS_HOST`     | Redis hostname          | No       | localhost             |
| `QDRANT_URL`     | Qdrant URL              | No       | http://localhost:6333 |
| `GEMINI_MODEL`   | Gemini model name       | No       | gemini-1.5-flash      |
| `PORT`           | Backend port            | No       | 3000                  |

### Frontend Environment Variables

| Variable          | Description     | Required | Default               |
| ----------------- | --------------- | -------- | --------------------- |
| `VITE_API_URL`    | Backend API URL | No       | http://localhost:3000 |
| `VITE_SOCKET_URL` | Socket.io URL   | No       | http://localhost:3000 |

---

## 📚 API Documentation

### REST Endpoints

```bash
# Health check
GET /health

# Create session
POST /api/chat/session

# Send message
POST /api/chat/message
Body: { "sessionId": "uuid", "message": "text" }

# Get history
GET /api/chat/history/:sessionId

# Clear session
DELETE /api/chat/session/:sessionId

# List sessions
GET /api/chat/sessions
```

### Socket.io Events

```javascript
// Connect and join
socket.emit("join-session", sessionId);

// Send message (streaming)
socket.emit("send-message", { sessionId, message });
socket.on("response-chunk", (data) => {
  /* streaming token */
});
socket.on("response-complete", (data) => {
  /* full response */
});

// Get history
socket.emit("get-history", { sessionId });
socket.on("history", (data) => {
  /* message history */
});

// Clear session
socket.emit("clear-session", { sessionId });
socket.on("session-cleared", (data) => {
  /* confirmed */
});
```

---

## 🛠 Troubleshooting

### Backend Issues

**Redis connection failed:**

```bash
# Check if Redis is running
docker ps | grep redis

# Restart Redis
docker compose -f docker-compose.dev.yml restart redis
```

**Qdrant connection failed:**

```bash
# Check Qdrant
curl http://localhost:6333/collections

# Restart Qdrant
docker compose -f docker-compose.dev.yml restart qdrant
```

**No embeddings found:**

```bash
# Check collection
curl http://localhost:6333/collections/news_embeddings

# Re-ingest data
cd backend
npm run ingest
```

### Frontend Issues

**Socket not connecting:**

1. Check backend is running: `curl http://localhost:3000/health`
2. Verify `VITE_SOCKET_URL` in `.env`
3. Check browser console for errors

**Theme not persisting:**

1. Clear localStorage: `localStorage.clear()`
2. Check browser allows localStorage

---

## 📦 Dependencies

### Backend

- express: 4.18.2
- socket.io: 4.6.2
- ioredis: 5.3.2
- @qdrant/js-client-rest: 1.7.0
- @google/generative-ai: 0.1.3
- axios: 1.6.2
- rss-parser: 3.13.0
- cheerio: 1.0.0-rc.12

### Frontend

- react: 18.2.0
- socket.io-client: 4.6.2
- react-markdown: 9.0.1
- remark-gfm: 4.0.0
- axios: 1.6.2
- sass: 1.69.5

---

## 🔗 Links

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [API Reference](./backend/API_REFERENCE.md)
- [Deployment Guide](./.github/workflows/deploy.yml)

---

## 💡 Tips

**For Development:**

- Use `docker-compose.dev.yml` (only Redis + Qdrant)
- Run backend and frontend separately with `npm run dev`
- Hot reload enabled for both

**For Production:**

- Use `docker-compose.yml` (all services containerized)
- Set `NODE_ENV=production`
- Use reverse proxy (Nginx) for SSL

**Performance:**

- Embeddings cached in Redis (24hr TTL)
- Sessions cached (1hr TTL, configurable)
- Vector search uses HNSW index

---

## 📧 Support

For issues and questions:

- Open an issue on GitHub
- Check [Troubleshooting](#-troubleshooting) section
- Review component READMEs

---
