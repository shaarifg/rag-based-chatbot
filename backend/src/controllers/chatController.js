import { v4 as uuidv4 } from 'uuid';
import ragService from '../services/ragService.js';

export const chatController = {
  async sendMessage(req, res) {
    try {
      const { sessionId = uuidv4(), message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const result = await ragService.processQuery(sessionId, message);

      res.json({
        sessionId,
        response: result.response,
        sources: result.sources,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getHistory(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const history = await ragService.getSessionHistory(sessionId);

      res.json({
        sessionId,
        history,
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async clearSession(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      await ragService.clearSession(sessionId);

      res.json({
        message: 'Session cleared successfully',
        sessionId,
      });
    } catch (error) {
      console.error('Clear session error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getAllSessions(req, res) {
    try {
      const sessions = await ragService.getAllSessions();

      res.json({
        sessions,
        count: sessions.length,
      });
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async createSession(req, res) {
    try {
      const sessionId = uuidv4();

      res.json({
        sessionId,
        message: 'Session created successfully',
      });
    } catch (error) {
      console.error('Create session error:', error);
      res.status(500).json({ error: error.message });
    }
  },
};
