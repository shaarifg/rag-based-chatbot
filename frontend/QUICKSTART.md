# Quick Start Guide - Frontend

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

The default configuration connects to backend on `localhost:3000`.

## 3. Start Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 4. Open Browser

Navigate to `http://localhost:5173`

You should see:
- ✅ Full viewport chat interface
- ✅ Sketchy background pattern
- ✅ Connection status in header
- ✅ Welcome message with suggestions

## 5. Test Chat

1. Click a suggestion or type a message
2. Press Enter or click SEND
3. Watch real-time streaming response
4. Click RESET to clear session

## Features Checklist

✅ **Full Viewport Design**
- No borders
- No rounded corners
- No shadows
- Sketchy background

✅ **Chat Functionality**
- Display past messages
- Input box for new messages
- Streaming bot responses
- Reset session button

✅ **Real-Time**
- Socket.io connection
- Live typing indicator
- Token-by-token streaming

## Test Scenarios

### 1. Send Message
```
Type: "What are the latest AI developments?"
Expected: Streaming response with sources
```

### 2. Multiple Messages
```
Send several questions in sequence
Expected: Conversation history maintained
```

### 3. Reset Session
```
Click RESET button
Expected: Confirmation dialog, then clear all messages
```

### 4. Reconnection
```
Stop backend, restart it
Expected: Auto-reconnect, status updates
```

## Styling Verification

Open browser DevTools and verify:
- No `border-radius` applied
- No `box-shadow` applied
- No `border` except 1px solid lines
- Background has multiple gradient layers
- Font is monospace (Courier New)

## Integration Test

With both frontend and backend running:

1. **Frontend**: `http://localhost:5173`
2. **Backend**: `http://localhost:3000`

Send a message and check:
- Network tab shows WebSocket connection
- Response streams token by token
- Message appears in chat history
- Session persists on refresh

## Common Issues

### Socket Not Connecting
```
Check: Backend is running
Check: CORS enabled in backend
Check: Ports match in .env
```

### No Streaming
```
Check: Socket.io enabled in backend
Check: WebSocket connection in Network tab
```

### Messages Not Persisting
```
Check: Redis is running
Check: Session ID in localStorage
```

### Styles Not Loading
```
Run: npm install sass
Clear: Browser cache
Check: SCSS files imported correctly
```

## Build for Production

```bash
npm run build
```

Output in `dist/` folder.

Preview production build:
```bash
npm run preview
```

## Deploy

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm run build
vercel --prod
```

### Nginx
```nginx
server {
  listen 80;
  root /path/to/dist;
  
  location / {
    try_files $uri /index.html;
  }
}
```

## Environment Variables

For production, update `.env`:
```env
VITE_API_URL=https://your-backend.com
VITE_SOCKET_URL=https://your-backend.com
```

## Next Steps

1. ✅ Backend running with ingested data
2. ✅ Frontend connected to backend
3. ✅ Test all features
4. 🚀 Deploy to production
