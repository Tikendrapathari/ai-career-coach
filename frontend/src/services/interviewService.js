import api from './api';

export const interviewService = {
  generateQuestions: async (config) => {
    const response = await api.post('/api/interview/questions', config);
    return response.data;
  },

  evaluateAnswer: async (evaluationData) => {
    const response = await api.post('/api/interview/evaluate', evaluationData);
    return response.data;
  },

  saveInterview: async (interviewData) => {
    const response = await api.post('/api/interview/save', interviewData);
    return response.data;
  },

  getInterviews: async () => {
    const response = await api.get('/api/interview/history');
    return response.data;
  },

  getInterviewById: async (id) => {
    const response = await api.get(`/api/interview/${id}`);
    return response.data;
  }
};