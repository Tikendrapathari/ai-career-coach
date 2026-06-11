import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateContent = async (prompt, model = 'gemini-pro') => {
  try {
    const generativeModel = genAI.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

export const analyzeResume = async (resumeText) => {
  const prompt = `Analyze this resume and provide:
  1. ATS Score (0-100)
  2. Top 5 strengths
  3. Top 5 weaknesses
  4. Missing keywords
  5. Skill gaps
  6. Improvement suggestions
  
  Resume: ${resumeText.substring(0, 3000)}`;
  
  const response = await generateContent(prompt);
  return JSON.parse(response);
};

export const generateInterviewQuestions = async (role, type, company = null) => {
  let prompt = `Generate 5 ${type} interview questions for a ${role} position.`;
  if (company) {
    prompt = `Generate 5 ${company} specific interview questions for a ${role} position.`;
  }
  
  const response = await generateContent(prompt);
  return response.split('\n').filter(q => q.trim());
};