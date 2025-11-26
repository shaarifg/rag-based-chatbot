import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socketService from '@/services/socketService';
import Header from '@/components/Header/Header';
import Message from '@/components/Message/Message';
import ChatInput from '@/components/ChatInput/ChatInput';
import Loader from '@/components/Loader/Loader';
import './ChatContainer.scss';

const SUGGESTIONS = [
  'What are the latest developments in AI?',
  'Tell me about recent technology news',
  'What is happening in the tech industry?',
  'Latest trends in machine learning',
];

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Generate or retrieve session ID
        const storedSessionId = localStorage.getItem('sessionId');
        const newSessionId = storedSessionId || uuidv4();

        if (!storedSessionId) {
          localStorage.setItem('sessionId', newSessionId);
        }

        setSessionId(newSessionId);

        // Connect socket
        socketService.connect();
        socketService.joinSession(newSessionId);

        // Wait for connection
        await new Promise((resolve) => {
          const checkConnection = setInterval(() => {
            if (socketService.socket?.connected) {
              clearInterval(checkConnection);
              setConnected(true);
              resolve();
            }
          }, 100);

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkConnection);
            resolve();
          }, 5000);
        });

        // Load history
        socketService.getHistory((history) => {
          if (history && history.length > 0) {
            setMessages(history);
          }
          setIsLoading(false);
        });

        // If no history loaded after 2 seconds, remove loader
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeChat();

    // Connection status updater
    const checkConnection = setInterval(() => {
      setConnected(socketService.socket?.connected || false);
    }, 1000);

    return () => {
      clearInterval(checkConnection);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  const handleSend = (message) => {
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setCurrentResponse('');

    socketService.sendMessage(
      message,
      (chunk) => {
        setCurrentResponse((prev) => prev + chunk);
      },
      (data) => {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentResponse('');
        setIsTyping(false);
      },
      (error) => {
        console.error('Send error:', error);
        const errorMessage = {
          role: 'assistant',
          content: `❌ Error: ${error || 'Failed to generate response. Please check backend connection.'}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
        setCurrentResponse('');
      }
    );
  };

  const handleReset = () => {
    if (!window.confirm('Reset session and clear all messages?')) return;

    socketService.clearSession(() => {
      setMessages([]);
      setCurrentResponse('');
      setIsTyping(false);

      // Generate new session
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
      socketService.joinSession(newSessionId);
    });
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  if (isLoading) {
    return <Loader message="Connecting to chat" />;
  }

  return (
    <div className="chat-container">
      <Header connected={connected} sessionId={sessionId} />

      <div className="chat-container__messages">
        {messages.length === 0 && !isTyping ? (
          <div className="chat-container__empty">
            <div className="chat-container__empty-icon">◆</div>
            <h2 className="chat-container__empty-title">Welcome to RAG Chat</h2>
            <p className="chat-container__empty-subtitle">
              Ask me anything about recent news and technology. I have access to
              the latest articles and can provide informed answers.
            </p>
            <div className="chat-container__empty-suggestions">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="chat-container__empty-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
            {isTyping && currentResponse && (
              <Message
                message={{
                  role: 'assistant',
                  content: currentResponse,
                  timestamp: new Date().toISOString(),
                }}
              />
            )}
            {isTyping && !currentResponse && (
              <Message
                message={{ role: 'assistant', content: '' }}
                isTyping={true}
              />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSend={handleSend} onReset={handleReset} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
