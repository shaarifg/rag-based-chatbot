# Quick Start Guide

## 1. Start All Services (1 command)

```bash
docker-compose up -d
```

This starts:
- Redis (port 6379)
- Qdrant (port 6333)
- PostgreSQL (port 5432)

## 2. Install & Configure

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
JINA_API_KEY=jina_xxxx
GEMINI_API_KEY=AIzaSyXXXX
```

## 3. Ingest News Articles

```bash
npm run ingest
```

Expected output:
```
📰 Fetching RSS feeds...
✅ Fetched 15 articles from NY Times Technology
✅ Fetched 12 articles from BBC Technology
🔄 Processing articles...
📝 Created 127 document chunks
🧮 Generating embeddings...
✅ Successfully ingested 127 documents
```

## 4. Start Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

## 5. Test APIs

**REST API:**
```bash
chmod +x test-api.sh
./test-api.sh
```

**Socket.io:**
```bash
node test-socket.js
```

## 6. Integration Examples

### REST API (curl)

```bash
# Create session
curl -X POST http://localhost:3000/api/chat/session

# Send message
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "message": "What is happening in tech?"
  }'
```

### JavaScript/Node.js

```javascript
// REST API
const response = await fetch('http://localhost:3000/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'user-123',
    message: 'Latest AI news?'
  })
});
const data = await response.json();
console.log(data.response);
```

### Socket.io Client

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const sessionId = 'user-123';

socket.emit('join-session', sessionId);

socket.emit('send-message', {
  sessionId,
  message: 'What are the latest tech trends?'
});

socket.on('response-chunk', (data) => {
  console.log(data.chunk); // Streaming response
});

socket.on('response-complete', (data) => {
  console.log('Done:', data.response);
});
```

## Troubleshooting

**Port already in use:**
```bash
# Check what's using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Docker services not starting:**
```bash
docker-compose down
docker-compose up -d
docker-compose logs
```

**API key errors:**
- Verify keys in `.env`
- Check API quotas
- Test keys with curl

## Next Steps

1. Build React frontend
2. Add authentication (JWT)
3. Implement rate limiting
4. Add monitoring (Prometheus)
5. Deploy to production

## Production Deployment

```bash
# Build
npm install --production

# Use PM2 for clustering
npm install -g pm2
pm2 start src/server.js -i max

# Monitor
pm2 monit
```
