import { io } from "socket.io-client";

let socket = null;

// Initialize socket 
export const connectSocket = (user) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);

      // Send user info to backend
      socket.emit("join", {
        userId: user._id,
        username: user.username,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });
  }

  return socket;
};


export const getSocket = () => socket;