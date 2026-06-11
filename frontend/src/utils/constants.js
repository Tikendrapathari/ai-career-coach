export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GOOGLE: '/api/auth/google',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ME: '/api/auth/me'
  },
  RESUME: {
    UPLOAD: '/api/resume/upload',
    ANALYZE: '/api/resume/analyze',
    IMPROVE: '/api/resume/improve'
  },
  INTERVIEW: {
    QUESTIONS: '/api/interview/questions',
    EVALUATE: '/api/interview/evaluate',
    SAVE: '/api/interview/save'
  },
  CODING: {
    GENERATE: '/api/coding/generate',
    EVALUATE: '/api/coding/evaluate',
    HINT: '/api/coding/hint'
  }
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const INTERVIEW_TYPES = {
  HR: 'hr',
  TECHNICAL: 'technical',
  BEHAVIORAL: 'behavioral',
  COMPANY: 'company'
};

export const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Accenture'
];

export const PROGRAMMING_LANGUAGES = [
  'JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust'
];