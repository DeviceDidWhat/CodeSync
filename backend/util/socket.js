import { Server } from "socket.io";
import { ENV } from "../env.js";

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-session", (sessionId) => {
      socket.join(sessionId);
    });

    socket.on("code-change", ({ sessionId, code }) => {
      socket.to(sessionId).emit("code-update", code);
    });

    socket.on("language-change", ({ sessionId, language }) => {
      socket.to(sessionId).emit("language-update", language);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};