# API Reference

## Base URL
```
http://localhost:3000
```

---

## REST API Endpoints

### Health Check

**GET** `/health`

Check if server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Create Session

**POST** `/api/chat/session`

Create a new chat session.

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Session created successfully"
}
```

---

### Send Message

**POST** `/api/chat/message`

Send a message and get AI response with RAG.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What's the latest in AI?"
}
```

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "response": "Based on recent news articles, there have been several...",
  "sources": [
    {
      "title": "OpenAI Announces GPT-5",
      "url": "https://example.com/article",
      "score": 0.92
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `500` - Server error

---

### Get Session History

**GET** `/api/chat/history/:sessionId`

Retrieve conversation history for a session.

**Parameters:**
- `sessionId` (path) - UUID of the session

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "history": [
    {
      "role": "user",
      "content": "What's new in AI?",
      "timestamp": "2024-01-15T10:25:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Recent developments include...",
      "timestamp": "2024-01-15T10:25:05.000Z"
    }
  ]
}
```

---

### Clear Session

**DELETE** `/api/chat/session/:sessionId`

Delete a session and all its history.

**Parameters:**
- `sessionId` (path) - UUID of the session

**Response:**
```json
{
  "message": "Session cleared successfully",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### Get All Sessions

**GET** `/api/chat/sessions`

List all active session IDs.

**Response:**
```json
{
  "sessions": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ],
  "count": 2
}
```

---

## Socket.io Events

### Connection

```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected');
});
```

---

### Join Session

**Emit:** `join-session`

```javascript
socket.emit('join-session', sessionId);
```

---

### Send Message (Streaming)

**Emit:** `send-message`

```javascript
socket.emit('send-message', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  message: 'What are the latest tech trends?'
});
```

**Listen:** `message-received`
```javascript
socket.on('message-received', (data) => {
  // { sessionId: '...' }
});
```

**Listen:** `response-chunk`
```javascript
socket.on('response-chunk', (data) => {
  // { chunk: 'tokens...', sessionId: '...' }
  // Called multiple times during streaming
});
```

**Listen:** `response-complete`
```javascript
socket.on('response-complete', (data) => {
  // {
  //   sessionId: '...',
  //   response: 'Full response text',
  //   timestamp: '...'
  // }
});
```

---

### Get History

**Emit:** `get-history`

```javascript
socket.emit('get-history', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000'
});
```

**Listen:** `history`
```javascript
socket.on('history', (data) => {
  // {
  //   sessionId: '...',
  //   history: [...]
  // }
});
```

---

### Clear Session

**Emit:** `clear-session`

```javascript
socket.emit('clear-session', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000'
});
```

**Listen:** `session-cleared`
```javascript
socket.on('session-cleared', (data) => {
  // { sessionId: '...' }
});
```

---

### Error Handling

**Listen:** `error`
```javascript
socket.on('error', (error) => {
  // { error: 'Error message' }
});
```

---

## Complete Examples

### REST API (Python)

```python
import requests

BASE_URL = "http://localhost:3000/api/chat"

# Create session
resp = requests.post(f"{BASE_URL}/session")
session_id = resp.json()["sessionId"]

# Send message
resp = requests.post(
    f"{BASE_URL}/message",
    json={
        "sessionId": session_id,
        "message": "What's new in AI?"
    }
)
data = resp.json()
print(data["response"])
print("Sources:", data["sources"])

# Get history
resp = requests.get(f"{BASE_URL}/history/{session_id}")
print(resp.json()["history"])

# Clear session
requests.delete(f"{BASE_URL}/session/{session_id}")
```

---

### Socket.io (React)

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const sessionId = 'user-session-123';

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      newSocket.emit('join-session', sessionId);
    });

    newSocket.on('response-chunk', (data) => {
      setCurrentResponse(prev => prev + data.chunk);
    });

    newSocket.on('response-complete', (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
      setCurrentResponse('');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (text) => {
    socket.emit('send-message', {
      sessionId,
      message: text
    });
    setMessages(prev => [...prev, { role: 'user', content: text }]);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.role}: {msg.content}</div>
      ))}
      {currentResponse && <div>AI: {currentResponse}</div>}
    </div>
  );
}
```

---

## Rate Limits

Default limits (configurable):

- REST API: Unlimited
- Socket.io: Unlimited
- Jina Embeddings: 60 requests/minute (API tier dependent)
- Gemini API: Varies by tier

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Missing parameters |
| 404 | Not Found - Invalid route |
| 500 | Internal Server Error |
| 503 | Service Unavailable - External API down |

---

## Caching Behavior

**Session Cache (Redis):**
- TTL: 1 hour (configurable)
- Auto-extends on activity
- Cleared on explicit delete

**Embedding Cache (Redis):**
- TTL: 24 hours
- Keyed by text content
- Reduces API calls by ~80%

---

## Performance Tips

1. **Reuse sessions** - Don't create new session per message
2. **Use Socket.io** - Better for streaming responses
3. **Batch queries** - Multiple questions in one message
4. **Cache common queries** - Pre-generate embeddings
5. **Monitor TTL** - Adjust based on usage patterns
