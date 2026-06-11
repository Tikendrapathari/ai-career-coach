import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dreamJob: {
    type: String,
    required: true
  },
  currentSkills: [String],
  timeline: {
    type: String,
    enum: ['3 months', '6 months', '1 year'],
    default: '6 months'
  },
  roadmap: {
    weekly: [{
      week: Number,
      topics: [String],
      resources: [{
        title: String,
        url: String,
        type: String
      }],
      projects: [String],
      milestones: [String]
    }],
    monthly: [{
      month: Number,
      focus: String,
      goals: [String],
      certifications: [String]
    }]
  },
  progress: {
    completedWeeks: [Number],
    completedProjects: [String],
    overallProgress: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Roadmap', roadmapSchema);