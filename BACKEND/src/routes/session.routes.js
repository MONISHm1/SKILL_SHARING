import express from "express";
import {
  createSession,
  getMySessions,
  getMentorSessions,
  updateSessionStatus,
  markSessionCompleted,
  addMeetingLink,
  addLocation,
  deleteSession,
} from "../controllers/session.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createSession);
router.get("/my", verifyJWT, getMySessions);
router.get("/mentor", verifyJWT, getMentorSessions);
router.patch("/status/:id", verifyJWT, updateSessionStatus);
router.patch(
  "/:id/complete",
  verifyJWT,
  markSessionCompleted
);
router.patch("/add-link/:id", verifyJWT, addMeetingLink);
router.patch("/add-location/:id", verifyJWT, addLocation);
router.delete("/:id", verifyJWT, deleteSession);
router.get("/sessions", verifyJWT, getMySessions);

export default router;