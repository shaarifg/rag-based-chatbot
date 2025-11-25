# NewsVoosh Frontend

React + Vite + SCSS frontend for RAG-based chat application with real-time streaming.

## Features

✅ **Full Viewport Landing Page**

- Sketchy background with grid patterns
- No borders, rounded corners, or shadows
- Minimalist tech aesthetic

✅ **Chat Interface**

- Display past messages
- Real-time streaming responses
- Typing indicators
- Message timestamps
- Session management

✅ **Advanced System Design**

- Service-based architecture
- Socket.io for real-time
- Fallback to REST API
- Component-based structure
- SCSS modules

## Project Structure

```
src/
├── components/
│   ├── ChatContainer/      # Main chat component
│   ├── Message/            # Message display
│   ├── ChatInput/          # Input field + buttons
│   └── Header/             # App header
├── services/
│   ├── socketService.js    # Socket.io client
│   └── apiService.js       # REST API client
├── config/
│   └── index.js            # Configuration
├── styles/
│   └── global.scss         # Global styles
├── App.jsx
└── main.jsx
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Features Detail

### Real-Time Streaming

- Uses Socket.io for WebSocket connection
- Streams response tokens as they arrive
- Shows typing indicator during generation
- Graceful fallback to REST API

### Session Management

- Persistent session ID in localStorage
- Load chat history on reconnect
- Reset button clears session
- Confirmation before reset

### UI/UX

- **Sketchy Background**: Multi-layer gradient patterns
- **No Borders/Shadows**: Flat, minimalist design
- **Monospace Font**: Courier New for tech aesthetic
- **Color Scheme**: Dark theme with accent green
- **Animations**: Smooth slide-in, typing dots, pulse effects

### Responsive Design

- Full viewport height
- Scrollable message area
- Fixed input at bottom
- Works on desktop and mobile

## Component Architecture

### ChatContainer

- Main orchestrator
- Manages state and socket connection
- Handles message flow

### Message

- Displays user/assistant messages
- Shows timestamps
- Typing indicator animation

### ChatInput

- Input field with send button
- Reset session button
- Keyboard shortcuts (Enter to send)

### Header

- App title
- Connection status
- Session ID display

## Service Layer

### socketService

```javascript
socketService.connect();
socketService.joinSession(sessionId);
socketService.sendMessage(message, onChunk, onComplete, onError);
socketService.getHistory(callback);
socketService.clearSession(callback);
```

### apiService (REST fallback)

```javascript
await chatApi.createSession();
await chatApi.sendMessage(sessionId, message);
await chatApi.getHistory(sessionId);
await chatApi.clearSession(sessionId);
```

## Styling Guidelines

- **No borders**: Use background colors for separation
- **No rounded corners**: Sharp, geometric design
- **No box shadows**: Flat layers only
- **Accent color**: #00ff88 (green)
- **Background**: Layered sketchy patterns
- **Typography**: Monospace (Courier New)

## Path Aliases

```javascript
import Component from "@/components/Component";
import service from "@/services/service";
import config from "@/config";
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development Tips

1. **Hot Reload**: Vite provides instant HMR
2. **SCSS**: Use nested selectors and variables
3. **Services**: Keep business logic in services
4. **Components**: Keep components pure and reusable

## Troubleshooting

**Socket not connecting:**

- Check backend is running on port 3000
- Verify CORS settings in backend
- Check browser console for errors

**Messages not streaming:**

- Verify Socket.io is enabled in backend
- Check network tab for WebSocket connection
- Fallback to REST API if needed

**Styles not applying:**

- Clear browser cache
- Check SCSS syntax
- Verify imports

## Integration with Backend

Make sure backend is running:

```bash
cd ../rag-backend
npm run dev
```

Backend should be on `http://localhost:3000`

## Performance

- Lazy loading components
- Debounced scroll events
- Optimized re-renders with React.memo
- Efficient socket event listeners

## Security

- Session IDs are UUID v4
- No sensitive data in localStorage
- CORS configured in backend
- XSS protection via React

## License

MIT
