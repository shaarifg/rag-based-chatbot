import { v4 as uuidv4 } from 'uuid';
import ragService from '../services/ragService.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('join-session', (sessionId) => {
      socket.join(sessionId);
      console.log(`Client ${socket.id} joined session: ${sessionId}`);
    });

    socket.on('send-message', async (data) => {
      try {
        const { sessionId = uuidv4(), message } = data;

        if (!message) {
          socket.emit('error', { error: 'Message is required' });
          return;
        }

        socket.emit('message-received', { sessionId });

        // Stream response
        let fullResponse = '';
        const stream = ragService.processQueryStream(sessionId, message);

        for await (const chunk of stream) {
          fullResponse += chunk;
          socket.emit('response-chunk', { chunk, sessionId });
        }

        socket.emit('response-complete', {
          sessionId,
          response: fullResponse,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('error', { error: error.message });
      }
    });

    socket.on('get-history', async (data) => {
      try {
        const { sessionId } = data;

        if (!sessionId) {
          socket.emit('error', { error: 'Session ID is required' });
          return;
        }

        const history = await ragService.getSessionHistory(sessionId);
        socket.emit('history', { sessionId, history });
      } catch (error) {
        console.error('Socket history error:', error);
        socket.emit('error', { error: error.message });
      }
    });

    socket.on('clear-session', async (data) => {
      try {
        const { sessionId } = data;

        if (!sessionId) {
          socket.emit('error', { error: 'Session ID is required' });
          return;
        }

        await ragService.clearSession(sessionId);
        socket.emit('session-cleared', { sessionId });
      } catch (error) {
        console.error('Socket clear session error:', error);
        socket.emit('error', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
