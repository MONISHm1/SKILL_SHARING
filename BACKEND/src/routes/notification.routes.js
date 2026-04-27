import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getNotifications);
router.patch("/:id/read", verifyJWT, markAsRead);
router.patch("/read-all", verifyJWT, markAllAsRead);

export default router;