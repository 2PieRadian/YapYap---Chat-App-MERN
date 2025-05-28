import express from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  sendMessage,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

// GET the users for the Sidebar, that we can chat with
router.get("/users", authenticateJWT, getUsersForSidebar);

// POST a message to a receiver ID
router.post("/send/:id", authenticateJWT, sendMessage);

// GET the messages for a userID
router.get("/:id", authenticateJWT, getMessages);

export default router;
