import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeScore: {
    score: Number,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String]
  },
  communicationScore: {
    score: Number,
    fillerWords: Number,
    grammarErrors: Number,
    speechClarity: Number,
    suggestions: [String]
  },
  technicalScore: {
    score: Number,
    codingSkills: Number,
    problemSolving: Number,
    systemDesign: Number,
    suggestions: [String]
  },
  confidenceScore: {
    score: Number,
    eyeContact: Number,
    bodyLanguage: Number,
    voiceClarity: Number,
    suggestions: [String]
  },
  careerReadiness: {
    score: Number,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    recommendations: [String],
    nextSteps: [String]
  },
  overallAssessment: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Report', reportSchema);