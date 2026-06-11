import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
    type: String
  },
  avatar: {
    type: String
  },
  profile: {
    skills: [String],
    experience: Number,
    education: String,
    dreamJob: String,
    resumeUrl: String,
    resumeScore: Number
  },
  statistics: {
    totalInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    completedRoadmaps: { type: Number, default: 0 },
    codingSessions: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);