import api from './api';

export const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/api/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAnalysis: async (resumeId) => {
    const response = await api.get(`/api/resume/analysis/${resumeId}`);
    return response.data;
  },

  generateImprovedResume: async (resumeId) => {
    const response = await api.post(`/api/resume/improve/${resumeId}`);
    return response.data;
  },

  getResumeHistory: async () => {
    const response = await api.get('/api/resume/history');
    return response.data;
  }
};