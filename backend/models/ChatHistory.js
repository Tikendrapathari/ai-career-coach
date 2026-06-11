import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  context: {
    type: String,
    default: 'career_advice'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ChatHistory', chatHistorySchema);