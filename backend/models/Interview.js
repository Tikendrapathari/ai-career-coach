import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hr', 'technical', 'behavioral', 'company'],
    required: true
  },
  company: String,
  questions: [{
    question: String,
    userAnswer: String,
    aiFeedback: String,
    score: Number
  }],
  scores: {
    communication: Number,
    technical: Number,
    confidence: Number,
    overall: Number
  },
  facialAnalysis: {
    eyeContact: Number,
    smile: Number,
    headPosition: String,
    confidenceLevel: Number
  },
  communicationAnalysis: {
    fillerWords: Number,
    grammarErrors: Number,
    speechSpeed: Number,
    pronunciationIssues: [String]
  },
  completedAt: Date
});

export default mongoose.model('Interview', interviewSchema);