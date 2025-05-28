import { Server } from "socket.io";
import express from "express";
import http, { get } from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// To get the socket ID of the receiver to later emit the message to
export const getReceiverSocketId = (userId) => {
  return onlineUsersMap[userId];
};

// To store online users
const onlineUsersMap = {}; // <userID : socketID>

io.on("connection", (socket) => {
  // Add the connected user to online users map
  const userId = socket.handshake.query.userId;
  if (userId) onlineUsersMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(onlineUsersMap));

  socket.on("disconnect", () => {
    delete onlineUsersMap[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsersMap));
  });
});

export { app, server, io };
