import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join user-specific room
  socket.on('join-user-room', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join course-specific room
  socket.on('join-course-room', (courseId: string) => {
    socket.join(`course:${courseId}`);
    console.log(`Client joined course ${courseId}`);
  });

  // Live session events
  socket.on('join-session', (sessionId: string) => {
    socket.join(`session:${sessionId}`);
    console.log(`Client joined session ${sessionId}`);
  });

  socket.on('leave-session', (sessionId: string) => {
    socket.leave(`session:${sessionId}`);
    console.log(`Client left session ${sessionId}`);
  });

  socket.on('session-message', (data: { sessionId: string; message: string; userId: string }) => {
    io.to(`session:${data.sessionId}`).emit('session-message', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  });

  // Typing indicators for discussions
  socket.on('typing-start', (data: { discussionId: string; userId: string }) => {
    socket.to(`discussion:${data.discussionId}`).emit('user-typing', {
      userId: data.userId,
      discussionId: data.discussionId,
    });
  });

  socket.on('typing-stop', (data: { discussionId: string; userId: string }) => {
    socket.to(`discussion:${data.discussionId}`).emit('user-stopped-typing', {
      userId: data.userId,
      discussionId: data.discussionId,
    });
  });

  // Notification delivery
  socket.on('send-notification', (data: { userId: string; notification: object }) => {
    io.to(`user:${data.userId}`).emit('notification', data.notification);
  });

  // Progress sync events
  socket.on('progress-update', (data: { userId: string; courseId: string; progress: number }) => {
    io.to(`course:${data.courseId}`).emit('course-progress', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/socketio', (req, res) => {
  res.json({
    socketio: 'enabled',
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
    },
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

export { io, httpServer };
