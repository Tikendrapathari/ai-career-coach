// Cloudflare + Google DNS
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
console.log("NODE_ENV =", process.env.NODE_ENV);

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ✅ Dynamic allowed origins - include all your frontend URLs
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ai-career-coach-nc3m.vercel.app',
    'https://ai-career-coach-eight-phi.vercel.app',
    'https://ai-career-coach.vercel.app'
  ];
  
  // Add FRONTEND_URL from environment if exists
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  return origins;
};

const app = express();
const server = http.createServer(app);

// ✅ Socket.io with dynamic CORS
const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// ✅ Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ CORS middleware
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(express.json());

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/', limiter);

// ✅ MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://complete_backend:4Bpk2eiH99OpJ1D0@cluster0.i2qqyan.mongodb.net/ai-career-coach';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Home Route
app.get('/', (req, res) => {
  res.send('AI Career Coach Backend is running...');
});

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ✅ Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interview.js';
import roadmapRoutes from './routes/roadmap.js';
import jobRoutes from './routes/job.js';
import chatbotRoutes from './routes/chatbot.js';
import codingRoutes from './routes/coding.js';
import reportRoutes from './routes/report.js';

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/report', reportRoutes);

// ✅ Socket.io handlers
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  console.log('Origin:', socket.handshake.headers.origin);

  socket.on('join-interview', (sessionId) => {
    console.log(`User ${socket.id} joined interview: ${sessionId}`);
    socket.join(`interview-${sessionId}`);
  });

  socket.on('voice-response', (data) => {
    console.log(`Voice response from ${socket.id}`);
    io.to(`interview-${data.sessionId}`).emit('voice-response', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    success: false
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.method} ${req.url} not found`,
    success: false 
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS allowed origins:`, getAllowedOrigins());
});
