import axios from 'axios';
import { config } from '@/config';

const api = axios.create({
  baseURL: `${config.apiUrl}/api/chat`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  createSession: async () => {
    const { data } = await api.post('/session');
    return data.sessionId;
  },

  sendMessage: async (sessionId, message) => {
    const { data } = await api.post('/message', {
      sessionId,
      message,
    });
    return data;
  },

  getHistory: async (sessionId) => {
    const { data } = await api.get(`/history/${sessionId}`);
    return data.history;
  },

  clearSession: async (sessionId) => {
    const { data } = await api.delete(`/session/${sessionId}`);
    return data;
  },

  getAllSessions: async () => {
    const { data } = await api.get('/sessions');
    return data.sessions;
  },
};
