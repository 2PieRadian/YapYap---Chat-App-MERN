import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// My Imports
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server, io } from "./lib/socket.js";

// Use .env variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Connect to DB
connectDB(() => {
  server.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
  });
});
