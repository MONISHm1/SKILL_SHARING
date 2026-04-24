import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addReview,
  getMentorReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyJWT, addReview);
router.get("/mentor/:mentorId", getMentorReviews);
router.delete("/:id", verifyJWT, deleteReview);
router.patch("/:id", verifyJWT, updateReview);

export default router;