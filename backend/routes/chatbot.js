import express from 'express';
import { sendMessage, getChatHistory, clearChat } from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/clear', protect, clearChat);

export default router;