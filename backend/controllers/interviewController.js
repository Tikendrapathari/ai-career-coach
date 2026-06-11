import Interview from '../models/Interview.js';
import User from '../models/User.js';
import { generateWithGroq, generateJSONResponse } from '../services/groqService.js';
import { sendInterviewReport } from '../services/emailService.js';

export const generateQuestions = async (req, res) => {
  try {
    const { type, role, difficulty, company } = req.body;
    
    let prompt = '';
    if (type === 'company' && company) {
      prompt = `Generate 5 ${difficulty} difficulty ${company} interview questions for a ${role} position.
      Include a mix of technical, behavioral, and problem-solving questions.
      Return ONLY a JSON array of strings. Example: ["Question 1", "Question 2", ...]`;
    } else {
      prompt = `Generate 5 ${difficulty} difficulty ${type} interview questions for a ${role} position.
      Return ONLY a JSON array of strings. Example: ["Question 1", "Question 2", ...]`;
    }
    
    // Fallback questions
    const fallbackQuestions = [
      "Tell me about yourself and your background.",
      "What are your greatest strengths and weaknesses?",
      "Why do you want to work here?",
      "Describe a challenging project you worked on.",
      "Where do you see yourself in 5 years?"
    ];
    
    // ✅ Using Groq API instead of Gemini
    const response = await generateWithGroq(prompt);
    
    let questions;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = fallbackQuestions;
      }
    } catch (e) {
      questions = fallbackQuestions;
    }
    
    // Ensure we have exactly 5 questions
    if (!questions || questions.length < 3) {
      questions = fallbackQuestions;
    }
    
    res.json({ questions: questions.slice(0, 5) });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateCompanyQuestions = async (req, res) => {
  try {
    const { company, role } = req.body;
    
    const prompt = `Generate 10 common ${company} interview questions for a ${role || 'software engineer'} position.
    Include both technical and behavioral questions.
    Also provide 5 preparation tips specific to ${company}.
    Return ONLY a JSON object with 'questions' array and 'tips' array.
    Example: { "questions": ["q1", "q2"], "tips": ["tip1", "tip2"] }`;
    
    const fallbackData = {
      questions: [
        "Describe a time you demonstrated leadership.",
        "How do you handle conflict at work?",
        "Explain a complex technical concept simply.",
        "Why do you want to join ${company}?",
        "Tell me about a failed project and what you learned.",
        "How do you stay updated with technology?",
        "Describe your ideal work environment.",
        "How do you prioritize tasks?",
        "Tell me about a time you worked in a team.",
        "What are your career goals?"
      ],
      tips: [
        "Research company values and mission",
        "Practice behavioral questions using STAR method",
        "Review technical fundamentals related to the role",
        "Prepare thoughtful questions for the interviewer",
        "Be ready for system design questions"
      ]
    };
    
    // ✅ Using Groq API instead of Gemini
    const data = await generateJSONResponse(prompt, fallbackData);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, type } = req.body;
    
    const prompt = `Evaluate this ${type} interview answer.
    Question: ${question}
    Answer: ${answer}
    
    Return ONLY valid JSON (no other text, no markdown):
    {
      "score": number (0-10),
      "feedback": "string (2-3 sentences)",
      "improvements": ["string", "string", "string"],
      "communication_score": number (0-10),
      "technical_accuracy": number (0-10),
      "confidence_level": number (0-10)
    }`;
    
    const fallbackEvaluation = {
      score: 7,
      feedback: "Good answer with room for improvement. Add more specific examples from your experience.",
      improvements: ["Add specific metrics", "Use STAR method", "Be more concise"],
      communication_score: 7,
      technical_accuracy: 7,
      confidence_level: 7
    };
    
    // ✅ Using Groq API instead of Gemini
    const evaluation = await generateJSONResponse(prompt, fallbackEvaluation);
    
    res.json(evaluation);
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const saveInterview = async (req, res) => {
  try {
    const { type, company, questions, facialAnalysis, scores } = req.body;
    
    const interview = new Interview({
      userId: req.userId,
      type,
      company: company || null,
      questions: questions || [],
      scores: scores || {
        communication: 0,
        technical: 0,
        confidence: 0,
        overall: 0
      },
      facialAnalysis: facialAnalysis || {},
      completedAt: new Date()
    });
    
    await interview.save();
    
    // Update user statistics
    const user = await User.findById(req.userId);
    const totalInterviews = (user.statistics.totalInterviews || 0) + 1;
    const newAverageScore = ((user.statistics.averageScore || 0) + (scores?.overall || 0)) / totalInterviews;
    
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'statistics.totalInterviews': 1 },
      $set: { 'statistics.averageScore': newAverageScore }
    });
    
    // Send email report (try-catch to avoid breaking if email fails)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendInterviewReport(user.email, user.name, {
          overallScore: scores?.overall || 0,
          communicationScore: scores?.communication || 0,
          technicalScore: scores?.technical || 0,
          confidenceScore: scores?.confidence || 0
        });
      }
    } catch (emailError) {
      console.log('Email not sent - email configuration missing:', emailError.message);
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Save interview error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ completedAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};