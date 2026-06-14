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

// ✅ Dynamic allowed origins
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://ai-career-coach-nc3m.vercel.app',
    'https://ai-career-coach-eight-phi.vercel.app',
    'https://ai-career-coach.vercel.app'
  ];
  
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  return origins;
};

const app = express();
const server = http.createServer(app);

// ✅ Socket.io
const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// ✅ Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debug middleware
app.use((req, res, next) => {
  console.log(`📢 ${req.method} ${req.url}`);
  next();
});

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
  skip: (req) => req.url === '/api/health'
});
app.use('/api/', limiter);

// ✅ MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://complete_backend:4Bpk2eiH99OpJ1D0@cluster0.i2qqyan.mongodb.net/ai-career-coach';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Routes
app.get('/', (req, res) => {
  res.send('AI Career Coach Backend is running...');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    routes: ['/api/auth', '/api/resume', '/api/interview', '/api/roadmap', '/api/jobs', '/api/chatbot', '/api/coding', '/api/report']
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

// ✅ Register routes
console.log('📦 Registering routes...');

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/report', reportRoutes);

console.log('✅ Routes registered:');
console.log('   - /api/auth');
console.log('   - /api/resume');
console.log('   - /api/interview');
console.log('   - /api/roadmap');
console.log('   - /api/jobs');
console.log('   - /api/chatbot');
console.log('   - /api/coding');
console.log('   - /api/report');

// ✅ Socket.io
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-interview', (sessionId) => {
    socket.join(`interview-${sessionId}`);
  });

  socket.on('voice-response', (data) => {
    io.to(`interview-${data.sessionId}`).emit('voice-response', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ message: err.message, success: false });
});

// ✅ 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: `Route ${req.method} ${req.url} not found`,
    success: false
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS allowed origins:`, getAllowedOrigins());
  console.log(`\n✅ Available endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/resume/upload`);
  console.log(`   - POST /api/chatbot/message`);
  console.log(`\n✨ Server ready!\n`);
});
