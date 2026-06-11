import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getCareerAdvice = async (question, context) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `As an AI Career Mentor, provide detailed career advice for:
    Question: ${question}
    Context: ${context}
    
    Please provide:
    1. Actionable advice
    2. Resources and learning materials
    3. Timeline for improvement
    4. Success metrics`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const getResumeFeedback = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Analyze this resume and provide detailed feedback:
    Resume: ${resumeText.substring(0, 3000)}
    
    Include:
    1. Overall impression
    2. Strengths (3-5 points)
    3. Areas for improvement (3-5 points)
    4. Specific suggestions for each section
    5. ATS optimization tips`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const getInterviewTips = async (role, company) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Provide interview tips for ${role} position at ${company || 'general tech company'}.
    Include:
    1. Common questions and how to answer
    2. Technical preparation focus areas
    3. Behavioral questions to practice
    4. Company-specific preparation tips
    5. Red flags to avoid`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const getLearningPath = async (targetRole, currentSkills) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Create a learning path to become a ${targetRole}.
    Current skills: ${currentSkills.join(', ')}
    
    Provide:
    1. Required skills gap analysis
    2. Recommended learning order
    3. Free resources for each topic
    4. Project ideas for portfolio
    5. Estimated timeline for completion`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};