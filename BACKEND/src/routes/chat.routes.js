import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getUserConversations,
} from "../controllers/chat.controller.js";

import { verifyJWT as protect } from "../middleware/auth.middleware.js";

const router = express.Router();




router.get(
  "/conversations",
  protect,
  getUserConversations
);


router.post(
  "/conversation",
  protect,
  getOrCreateConversation
);


router.post(
  "/message",
  protect,
  sendMessage
);


router.get(
  "/messages/:id",
  protect,
  getMessages
);

export default router;