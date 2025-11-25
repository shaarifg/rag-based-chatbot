import { io } from 'socket.io-client';
import { config } from '@/config';

class SocketService {
  constructor() {
    this.socket = null;
    this.sessionId = null;
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(config.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  joinSession(sessionId) {
    this.sessionId = sessionId;
    this.socket?.emit('join-session', sessionId);
  }

  sendMessage(message, onChunk, onComplete, onError) {
    if (!this.socket || !this.sessionId) {
      onError?.('Not connected');
      return;
    }

    this.socket.emit('send-message', {
      sessionId: this.sessionId,
      message,
    });

    const chunkHandler = (data) => {
      onChunk?.(data.chunk);
    };

    const completeHandler = (data) => {
      onComplete?.(data);
      this.socket.off('response-chunk', chunkHandler);
      this.socket.off('response-complete', completeHandler);
      this.socket.off('error', errorHandler);
    };

    const errorHandler = (error) => {
      onError?.(error.error);
      this.socket.off('response-chunk', chunkHandler);
      this.socket.off('response-complete', completeHandler);
      this.socket.off('error', errorHandler);
    };

    this.socket.on('response-chunk', chunkHandler);
    this.socket.on('response-complete', completeHandler);
    this.socket.on('error', errorHandler);
  }

  getHistory(callback) {
    if (!this.socket || !this.sessionId) return;

    this.socket.emit('get-history', { sessionId: this.sessionId });

    const historyHandler = (data) => {
      callback?.(data.history);
      this.socket.off('history', historyHandler);
    };

    this.socket.on('history', historyHandler);
  }

  clearSession(callback) {
    if (!this.socket || !this.sessionId) return;

    this.socket.emit('clear-session', { sessionId: this.sessionId });

    const clearHandler = (data) => {
      callback?.(data);
      this.socket.off('session-cleared', clearHandler);
    };

    this.socket.on('session-cleared', clearHandler);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.sessionId = null;
  }
}

export default new SocketService();
