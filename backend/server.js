console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Cloudflare + Google DNS
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import dns from "dns";

dotenv.config();
console.log("GROQ =", process.env.GROQ_API_KEY);

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://complete_backend:4Bpk2eiH99OpJ1D0@cluster0.i2qqyan.mongodb.net/ai-career-coach')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Home Route
app.get('/', (req, res) => {
  res.send('AI Career Coach Backend is running...');
});

// Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interview.js';
import roadmapRoutes from './routes/roadmap.js';
import jobRoutes from './routes/job.js';
import chatbotRoutes from './routes/chatbot.js';
import codingRoutes from './routes/coding.js';
import reportRoutes from './routes/report.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/report', reportRoutes);

// Socket.io for real-time interview
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-interview', (sessionId) => {
    socket.join(`interview-${sessionId}`);
  });
  
  socket.on('voice-response', (data) => {
    io.to(`interview-${data.sessionId}`).emit('voice-response', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});