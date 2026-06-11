import ChatHistory from '../models/ChatHistory.js';
import { generateWithGroq } from '../services/groqService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Get chat history for context
    let chatHistory = await ChatHistory.findOne({ userId: req.userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.userId,
        messages: [],
        context: context || 'career_advice'
      });
    }
    
    // Get last 10 messages for better context
    const lastMessages = chatHistory.messages.slice(-10);
    const conversationHistory = lastMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    
    const prompt = `You are an AI Career Coach. Respond naturally like ChatGPT.

Conversation history:
${conversationHistory || 'New conversation'}

User: ${message}

Instructions:
- Read the user's question carefully
- If the question is short (like "hi", "hello", "what is React?"), give a short answer
- If the question asks for details or roadmap, give a detailed answer
- If the user asks a follow-up question, use conversation history for context
- Be helpful, accurate, and conversational
- Don't force a fixed length - let the question determine the answer length
- Just respond naturally like a human career coach would

Assistant:`;

    const aiResponse = await generateWithGroq(prompt);
    
    // Save messages
    chatHistory.messages.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: aiResponse, timestamp: new Date() }
    );
    
    // Keep only last 50 messages for performance
    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }
    
    await chatHistory.save();
    
    res.json({
      response: aiResponse,
      history: chatHistory.messages.slice(-10)
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ userId: req.userId });
    res.json(chatHistory?.messages || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearChat = async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.userId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};