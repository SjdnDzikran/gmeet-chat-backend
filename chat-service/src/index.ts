import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Configure CORS for your Next.js app's development URL
// IMPORTANT: Update origin for deployed frontend later
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js dev URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000; // Backend service port

interface MessagePayload {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Optional: Notify others in the room
    // socket.to(roomId).emit('userJoined', { userId: socket.id, userName: 'User ' + socket.id.substring(0,5) });
  });

  socket.on('sendMessage', (data: { roomId: string; message: MessagePayload }) => {
    const { roomId, message } = data;
    // Broadcast to everyone in the room including the sender
    io.to(roomId).emit('newMessage', message);
    console.log(`Message in room ${roomId} from ${message.sender} (${socket.id}): ${message.text}`);
  });

  socket.on('leaveRoom', (roomId: string) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    // Optional: Notify others
    // socket.to(roomId).emit('userLeft', { userId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // You'd need to know which rooms the user was in to notify others.
    // This becomes important when using Redis for presence.
  });
});

server.listen(PORT, () => {
  console.log(`Chat service listening on *:${PORT}`);
});