# Frontend - RAG Chat UI

Modern React frontend with light/dark themes, markdown rendering, and real-time streaming.

---

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup](#-setup)
- [Features](#-features)
- [Components](#-components)
- [Services](#-services)
- [Styling](#-styling)

---

## 🏗 Architecture

```
┌──────────────────────────────────────┐
│         React Application            │
│  ┌───────────────────────────────┐  │
│  │      Components Layer         │  │
│  │  • ChatContainer              │  │
│  │  • Message (Markdown)         │  │
│  │  • ChatInput                  │  │
│  │  • Header                     │  │
│  │  • Loader                     │  │
│  └────────────┬──────────────────┘  │
│               │                      │
│  ┌────────────▼──────────────────┐  │
│  │      Context Layer            │  │
│  │  • ThemeContext (Light/Dark)  │  │
│  └────────────┬──────────────────┘  │
│               │                      │
│  ┌────────────▼──────────────────┐  │
│  │      Services Layer           │  │
│  │  • socketService (WebSocket)  │  │
│  │  • apiService (REST)          │  │
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Design Principles:**

- **Component-based**: Reusable, isolated components
- **Context API**: Global state (theme)
- **Service Layer**: Separation of API logic
- **SCSS Modules**: Scoped styling
- **Type Safety**: PropTypes (optional)

---

## 🛠 Tech Stack

### Core Framework

- **React** `18.2.0` - UI library
- **Vite** `5.0.8` - Build tool (fast HMR)

### Communication

- **Socket.io Client** `4.6.2` - Real-time WebSocket
- **Axios** `1.6.2` - HTTP client

### UI/Styling

- **SCSS** `1.69.5` - Preprocessor
- **React Markdown** `9.0.1` - Markdown rendering
- **Remark GFM** `4.0.0` - GitHub flavored markdown

### Utilities

- **UUID** `9.0.1` - Session IDs

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatContainer/
│   │   │   ├── ChatContainer.jsx     # Main chat logic
│   │   │   └── ChatContainer.scss    # Chat styles
│   │   │
│   │   ├── Message/
│   │   │   ├── Message.jsx           # Message display
│   │   │   └── Message.scss          # Message styles
│   │   │
│   │   ├── ChatInput/
│   │   │   ├── ChatInput.jsx         # Input field
│   │   │   └── ChatInput.scss        # Input styles
│   │   │
│   │   ├── Header/
│   │   │   ├── Header.jsx            # App header
│   │   │   └── Header.scss           # Header styles
│   │   │
│   │   └── Loader/
│   │       ├── Loader.jsx            # Loading spinner
│   │       └── Loader.scss           # Loader styles
│   │
│   ├── context/
│   │   └── ThemeContext.jsx          # Theme management
│   │
│   ├── services/
│   │   ├── socketService.js          # Socket.io client
│   │   └── apiService.js             # REST API client
│   │
│   ├── config/
│   │   └── index.js                  # Configuration
│   │
│   ├── styles/
│   │   └── global.scss               # Global styles
│   │
│   ├── App.jsx                       # Root component
│   └── main.jsx                      # Entry point
│
├── public/
├── index.html
├── vite.config.js                    # Vite config
├── package.json
└── .env.example
```

---

## 🚀 Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**Exact versions (no conflicts):**

- react: `18.2.0`
- socket.io-client: `4.6.2`
- react-markdown: `9.0.1`
- remark-gfm: `4.0.0`
- axios: `1.6.2`
- sass: `1.69.5`

### 2. Configure Environment

```bash
cp .env.example .env
```

**Edit `.env`:**

```env
# Local development
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Production example
# VITE_API_URL=https://your-api.com
# VITE_SOCKET_URL=https://your-api.com
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

---

## ✨ Features

### Light/Dark Theme Toggle

**Default:** Light theme

**Toggle:**

- Click sun (☀️) for light mode
- Click moon (🌙) for dark mode
- Theme persists in localStorage

**Implementation:**

```javascript
import { useTheme } from "@/context/ThemeContext";

const { theme, toggleTheme } = useTheme();
// theme = 'light' | 'dark'
```

### GitHub-Style Markdown

Bot responses render as formatted markdown:

**Supported:**

- Headers (`# H1`, `## H2`, etc.)
- **Bold**, _italic_, ~~strikethrough~~
- `inline code` and `code blocks`
- Lists (ordered/unordered)
- Tables
- Blockquotes
- Links
- Images

**Example:**

```markdown
# AI News Update

Recent developments include:

- **GPT-4 Turbo** released
- Vision capabilities added

See more at [OpenAI](https://openai.com)
```

### Real-Time Streaming

Messages stream token-by-token via Socket.io:

1. User sends message
2. Typing indicator appears
3. Response streams in real-time
4. Full message displayed with formatting

**Visual:**

```
User: What's new in AI?
AI: ⋯⋯⋯ (typing)
AI: Recent dev... (streaming)
AI: Recent developments in AI include... (complete)
```

### Loading States

**Initial Load:**

- Shows spinner while connecting
- "Connecting to chat..." message

**Message Sending:**

- Input disabled
- Typing indicator
- Streaming animation

### Session Management

**Features:**

- UUID-based sessions
- Persists in localStorage
- History loaded on reconnect
- Reset clears session + creates new

---

## 🧩 Components

### ChatContainer

**Purpose:** Main orchestrator

**Responsibilities:**

- Socket connection management
- Message state management
- History loading
- Error handling

**State:**

```javascript
messages: []; // Chat history
isTyping: boolean; // Bot typing state
connected: boolean; // Socket status
sessionId: string; // Session UUID
currentResponse: ""; // Streaming buffer
isLoading: boolean; // Initial load
```

### Message

**Purpose:** Display individual messages

**Features:**

- User/assistant differentiation
- Markdown rendering (ReactMarkdown + remark-gfm)
- Timestamp display
- Typing indicator

**Props:**

```javascript
{
  message: {
    role: 'user' | 'assistant',
    content: string,
    timestamp: string
  },
  isTyping: boolean
}
```

### ChatInput

**Purpose:** Message input field

**Features:**

- Text input
- Send button (disabled when empty/typing)
- Reset button (with confirmation)
- Enter to send (Shift+Enter for newline)

**Props:**

```javascript
{
  onSend: (message: string) => void,
  onReset: () => void,
  disabled: boolean
}
```

### Header

**Purpose:** App header with status

**Features:**

- App title with icon
- Session ID display
- Connection status (animated dot)
- Theme toggle button

**Props:**

```javascript
{
  connected: boolean,
  sessionId: string
}
```

### Loader

**Purpose:** Loading spinner

**Features:**

- Three rotating rings
- Animated dots in text
- Backdrop blur
- Customizable message

**Props:**

```javascript
{
  message: string; // Default: "Loading"
}
```

---

## 🔌 Services

### Socket Service (`socketService.js`)

**Purpose:** WebSocket communication

**Methods:**

```javascript
// Connect to server
connect();

// Join session
joinSession(sessionId);

// Send message with streaming
sendMessage(message, onChunk, onComplete, onError);

// Get history
getHistory(callback);

// Clear session
clearSession(callback);

// Disconnect
disconnect();
```

**Usage Example:**

```javascript
import socketService from "@/services/socketService";

// Connect
socketService.connect();
socketService.joinSession("uuid-123");

// Send message
socketService.sendMessage(
  "Hello",
  (chunk) => console.log("Chunk:", chunk),
  (data) => console.log("Complete:", data),
  (error) => console.error("Error:", error)
);
```

### API Service (`apiService.js`)

**Purpose:** REST API client (fallback)

**Methods:**

```javascript
// Create session
createSession();

// Send message
sendMessage(sessionId, message);

// Get history
getHistory(sessionId);

// Clear session
clearSession(sessionId);

// Get all sessions
getAllSessions();
```

**Usage Example:**

```javascript
import { chatApi } from "@/services/apiService";

// Create session
const sessionId = await chatApi.createSession();

// Send message
const response = await chatApi.sendMessage(sessionId, "Hello");
console.log(response.response);
```

---

## 🎨 Styling

### Design System

**Colors (Light Theme):**

```scss
--bg-primary: #fafafa        // Main background
--bg-secondary: #ffffff      // Cards, header
--bg-paper: #f5f5f5          // Subtle elements
--text-primary: #1a1a1a      // Main text
--text-secondary: #666666    // Secondary text
--text-muted: #999999        // Muted text
--accent-primary: #ff6b35    // Orange-red
--accent-secondary: #004e89  // Navy blue
--user-bg: #fff5f2          // User messages
--bot-bg: #f0f7ff           // Bot messages
```

**Colors (Dark Theme):**

```scss
--bg-primary: #0a0a0a
--bg-secondary: #151515
--accent-primary: #ff6b35
--accent-secondary: #1e88e5
// ... (same structure)
```

### Typography

```scss
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell';
font-size: 14px             // Base
line-height: 1.7            // Readable
```

### Layout Principles

✅ **No borders** (except 1px functional lines)
✅ **No rounded corners** (sharp, geometric)
✅ **No shadows** (flat design)
✅ **Paper texture** (subtle grid pattern)
✅ **Full viewport** (100vh)

### Animations

```scss
// Message slide-in
@keyframes messageSlide {
  from: opacity 0, translateY(10px)
  to: opacity 1, translateY(0)
}

// Typing dots
@keyframes typing {
  0%, 60%, 100%: scale(1), opacity(0.4)
  30%: scale(1.3), opacity(1)
}

// Pulse (status dot)
@keyframes pulse {
  0%, 100%: opacity(1)
  50%: opacity(0.6)
}

// Float (empty state icon)
@keyframes float {
  0%, 100%: translateY(0)
  50%: translateY(-12px)
}
```

### Responsive Design

```scss
// Mobile (< 768px)
@media (max-width: 768px) {
  .message__content {
    max-width: 85%;
  }
  .chat-input {
    padding: 16px;
  }
}

// Tablet (768px - 1024px)
@media (max-width: 1024px) {
  .message__content {
    max-width: 80%;
  }
}

// Desktop (> 1024px)
@media (min-width: 1025px) {
  .message__content {
    max-width: 70%;
  }
}
```

---

## 🔧 Configuration

### Vite Config

```javascript
export default defineConfig({
  plugins: [react()],
  base: "/chatbot/", // For subdirectory deployment
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});
```

### Environment Variables

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;
```

**Note:** Variables must start with `VITE_` to be exposed.

---

## 🧪 Testing Scenarios

### Test Theme Toggle

1. Page loads in light theme
2. Click moon icon → Dark theme
3. Refresh page → Dark theme persists
4. Click sun icon → Light theme
5. All components adapt colors

### Test Markdown Rendering

Send messages with markdown:

**Headers:**

```
# Heading 1
## Heading 2
### Heading 3
```

**Formatting:**

```
**Bold text**
*Italic text*
`Code snippet`
```

**Lists:**

```
- Item 1
- Item 2
  - Nested item
```

**Code Block:**

````
```javascript
const hello = 'world';
```
````

**Table:**

```
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Test Streaming

1. Send message
2. Watch typing indicator (⋯⋯⋯)
3. See tokens appear one by one
4. Full message renders with markdown
5. Timestamp appears

### Test Session Management

1. Send 2-3 messages
2. Refresh page
3. History loads automatically
4. Click RESET
5. Confirm dialog
6. Messages clear
7. New session created

---

## 🐛 Troubleshooting

### Socket Not Connecting

**Check:**

1. Backend running: `curl http://localhost:3000/health`
2. `.env` has correct URLs
3. Browser console for errors
4. CORS enabled in backend

**Fix:**

```javascript
// Check socketService.js
const socket = io(config.socketUrl, {
  transports: ["websocket", "polling"], // Add polling fallback
  reconnection: true,
});
```

### Theme Not Persisting

**Check:**

1. localStorage enabled in browser
2. No errors in console
3. ThemeContext wrapping App

**Fix:**

```javascript
// Clear and test
localStorage.clear();
// Toggle theme
// Refresh
```

### Markdown Not Rendering

**Check:**

1. `react-markdown` installed
2. `remark-gfm` imported
3. Content has markdown syntax

**Fix:**

```bash
npm install react-markdown remark-gfm
```

### Styles Not Loading

**Check:**

1. SCSS files imported
2. Vite processing SCSS
3. `sass` dependency installed

**Fix:**

```bash
npm install sass
```

---

## 🚀 Performance Tips

### Optimize Re-renders

```javascript
import React, { memo } from "react";

const Message = memo(({ message }) => {
  // Component only re-renders if message changes
});
```

### Lazy Load Components

```javascript
const ChatContainer = lazy(() =>
  import("./components/ChatContainer/ChatContainer")
);

<Suspense fallback={<Loader />}>
  <ChatContainer />
</Suspense>;
```

### Debounce Scroll

```javascript
const debouncedScroll = debounce(() => {
  messagesEndRef.current?.scrollIntoView();
}, 100);
```

---

## 📦 Build Optimization

### Production Build

```bash
npm run build
```

**Output:**

- Minified JS
- Minified CSS
- Tree-shaken
- Code-split
- Gzipped ready

**Size:** ~150KB (gzipped)

### Analyze Bundle

```bash
npm run build -- --mode analyze
```

---

## 🎯 Best Practices

1. **Component Isolation**: Each component in own folder
2. **SCSS Modules**: Scoped styles per component
3. **Service Layer**: API logic separate from UI
4. **Error Boundaries**: Catch component errors
5. **Accessibility**: Keyboard navigation, ARIA labels
6. **Performance**: Memoization, lazy loading
7. **Type Safety**: PropTypes or TypeScript

---

## 📝 License

MIT
