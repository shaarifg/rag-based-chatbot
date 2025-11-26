import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import ChatContainer from '@/components/ChatContainer/ChatContainer';

function App() {
  return (
    <ThemeProvider>
      <ChatContainer />
    </ThemeProvider>
  );
}

export default App;
