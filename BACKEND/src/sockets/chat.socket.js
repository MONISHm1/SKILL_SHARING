import { Server } from "socket.io";

let io;


const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    socket.on("join", ({ userId, username }) => {
      if (!userId) return;

      onlineUsers.set(userId, {
        socketId: socket.id,
        username: username || "User",
      });

      socket.join(userId);

      console.log(`🟢 ${username} is online`);

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.entries()).map(([id, data]) => ({
          userId: id,
          username: data.username,
        }))
      );
    });

  
    socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text, conversationId } = data;

      if (!senderId || !receiverId || !text?.trim()) return;

      const messagePayload = {
        senderId,
        text,
        conversationId,
        createdAt: new Date(),
      };

    
      const receiver = onlineUsers.get(receiverId);
      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("receiveMessage", messagePayload);
      }

   
      const sender = onlineUsers.get(senderId);
      if (sender?.socketId) {
        io.to(sender.socketId).emit("receiveMessage", messagePayload);
      }
    });


    socket.on("typing", ({ senderId, receiverId }) => {
      const receiver = onlineUsers.get(receiverId);
      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("typing", { senderId });
      }
    });

   
    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiver = onlineUsers.get(receiverId);
      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("stopTyping", { senderId });
      }
    });

   
    socket.on("disconnect", () => {
      console.log(`🔴 User Disconnected: ${socket.id}`);

      for (let [userId, userData] of onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`⚪ User ${userData.username} removed`);
          break;
        }
      }

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.entries()).map(([id, data]) => ({
          userId: id,
          username: data.username,
        }))
      );
    });
  });
};


export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};