import api from './api';

export const codingService = {
  generateProblem: async (difficulty, topic) => {
    const response = await api.post('/api/coding/generate-problem', { difficulty, topic });
    return response.data;
  },

  evaluateSolution: async (code, language, problemId, testCases) => {
    const response = await api.post('/api/coding/evaluate', { code, language, problemId, testCases });
    return response.data;
  },

  getHint: async (problemId, userCode) => {
    const response = await api.post('/api/coding/hint', { problemId, userCode });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/coding/stats');
    return response.data;
  },

  getSessionHistory: async () => {
    const response = await api.get('/api/coding/history');
    return response.data;
  }
};