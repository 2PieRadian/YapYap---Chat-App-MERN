import { Server } from "socket.io";
import express from "express";
import http from "http";
import User from "../models/user.model.js";

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

  // New Message Event
  socket.on("newMessage", (messageData) => {
    const receiverSocketID = getReceiverSocketId(messageData.receiverId);
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("newMessage", messageData);
    }
  });

  // Typing Event
  socket.on("typing", (userIdToWhichImTyping) => {
    const socketIdOfThisUser = getReceiverSocketId(userIdToWhichImTyping);
    if (socketIdOfThisUser) {
      io.to(socketIdOfThisUser).emit("typing");
    }
  });

  // Not Typing Event
  socket.on("not-typing", (userIdToWhichImNotTyping) => {
    const socketIdOfThisUser = getReceiverSocketId(userIdToWhichImNotTyping);
    if (socketIdOfThisUser) {
      io.to(socketIdOfThisUser).emit("not-typing");
    }
  });

  // When a user disconnects, remove them from the onlineUsers Map
  socket.on("disconnect", async () => {
    // Updating Last Seen
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const year = new Date().getFullYear();
    const month = new Date().toLocaleDateString("default", { month: "long" });
    const day = new Date().getDate();

    const lastOnline = `${currentTime}, ${day} ${month} ${year}`;

    io.emit("update-last-seen", { userId, lastOnline }); // Sending a Socket Event
    await User.findByIdAndUpdate(userId, { lastOnline }); // Saving last seen to DB

    // Deleting the user from the online users list
    delete onlineUsersMap[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsersMap));
  });
});

export { app, server, io };
