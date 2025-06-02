import { Server } from "socket.io";
import express from "express";
import http from "http";

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

// Map to store online users
// <userID : socketID>
const onlineUsersMap = {};

// This will run when a user connects
io.on("connection", (socket) => {
  // Add the connected user to online users map
  const userId = socket.handshake.query.userId;
  if (userId) onlineUsersMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(onlineUsersMap));

  socket.on("newMessage", (messageData) => {
    const receiverSocketID = getReceiverSocketId(messageData.receiverId);
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("newMessage", messageData);
    }
  });

  // When a user disconnects, remove them from the onlineUsers Map
  socket.on("disconnect", () => {
    delete onlineUsersMap[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsersMap));
  });
});

export { app, server, io };
