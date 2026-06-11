import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: String,
  fileUrl: String,
  extractedText: String,
  atsScore: Number,
  analysis: {
    strengths: [String],
    weaknesses: [String],
    missingKeywords: [String],
    skillGap: [String],
    suggestions: [String]
  },
  improvedResume: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Resume', resumeSchema);