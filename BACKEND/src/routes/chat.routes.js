import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getUserConversations,
} from "../controllers/chat.controller.js";

import { verifyJWT as protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * 📌 CHAT ROUTES
 * Base: /api/v1/chat
 */

/**
 * 🔹 Get all conversations for logged-in user
 * MUST be before /:id routes (safe ordering)
 */
router.get(
  "/conversations",
  protect,
  getUserConversations
);

/**
 * 🔹 Create or get conversation
 */
router.post(
  "/conversation",
  protect,
  getOrCreateConversation
);

/**
 * 🔹 Send a message
 */
router.post(
  "/message",
  protect,
  sendMessage
);

/**
 * 🔹 Get all messages of a conversation
 * 👉 Supports future pagination
 */
router.get(
  "/messages/:id",
  protect,
  getMessages
);

export default router;