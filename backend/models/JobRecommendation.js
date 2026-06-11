import mongoose from 'mongoose';

const jobRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recommendedJobs: [{
    title: String,
    company: String,
    description: String,
    requirements: [String],
    salary: String,
    matchScore: Number,
    missingSkills: [String],
    learningPath: [String],
    applicationUrl: String
  }],
  skillGap: [{
    skill: String,
    importance: String,
    resources: [String]
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('JobRecommendation', jobRecommendationSchema);