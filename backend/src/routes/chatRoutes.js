import express from 'express';
import { chatController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/message', chatController.sendMessage);
router.get('/history/:sessionId', chatController.getHistory);
router.delete('/session/:sessionId', chatController.clearSession);
router.get('/sessions', chatController.getAllSessions);
router.post('/session', chatController.createSession);

export default router;
