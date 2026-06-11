import { Server } from 'socket.io';

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('join-interview', (sessionId) => {
      socket.join(`interview:${sessionId}`);
    });

    socket.on('voice-response', (data) => {
      socket.to(`interview:${data.sessionId}`).emit('voice-response', data);
    });

    socket.on('typing', (data) => {
      socket.to(`interview:${data.sessionId}`).emit('typing', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};