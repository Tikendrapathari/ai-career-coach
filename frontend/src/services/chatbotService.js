import api from './api';

export const chatbotService = {
  sendMessage: async (message) => {
    const response = await api.post('/api/chatbot/message', { message });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/api/chatbot/history');
    return response.data;
  },

  clearHistory: async () => {
    const response = await api.delete('/api/chatbot/clear');
    return response.data;
  }
};