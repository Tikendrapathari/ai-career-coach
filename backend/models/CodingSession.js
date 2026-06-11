import mongoose from 'mongoose';

const codingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    title: String,
    description: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    constraints: [String],
    examples: [{
      input: String,
      output: String,
      explanation: String
    }],
    testCases: [{
      input: String,
      output: String,
      hidden: Boolean
    }]
  },
  solution: {
    code: String,
    language: String,
    passedTests: Number,
    totalTests: Number,
    executionTime: Number,
    memoryUsed: Number
  },
  hints: [{
    hint: String,
    usedAt: Date
  }],
  completed: {
    type: Boolean,
    default: false
  },
  score: Number,
  startedAt: Date,
  completedAt: Date
});

export default mongoose.model('CodingSession', codingSessionSchema);