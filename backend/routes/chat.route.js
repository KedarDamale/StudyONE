import express from "express";
import { chatWithBot } from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/api/chat' , async (req, res) => {
  try {
    await chatWithBot(req, res);
  } catch (error) {
    console.error('Error with chatbot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;