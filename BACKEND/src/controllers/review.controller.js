import mongoose from "mongoose";
import Review from "../models/review.models.js";
import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ ADD REVIEW
export const addReview = asyncHandler(async (req, res) => {
  const { mentorId, rating, review, sessionId } = req.body;

  // 🔥 1. CHECK DUPLICATE REVIEW
  const existingReview = await Review.findOne({
    reviewer: req.user._id,
    session: sessionId,
  });

  if (existingReview) {
    throw new ApiError(400, "You already reviewed this session");
  }

  // 🔥 2. CREATE REVIEW
  const newReview = await Review.create({
    reviewer: req.user._id,
    mentor: mentorId,
    rating,
    review,
    session: sessionId,
  });

  // 🔥 3. CALCULATE AVG + TOTAL USING AGGREGATION (BEST PRACTICE)
  const stats = await Review.aggregate([
    {
      $match: {
        mentor: new mongoose.Types.ObjectId(mentorId),
      },
    },
    {
      $group: {
        _id: "$mentor",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  // 🔥 4. UPDATE USER
  await User.findByIdAndUpdate(mentorId, {
    averageRating: stats[0]?.avgRating || 0,
    totalReviews: stats[0]?.totalReviews || 0,
  });

  // 🔥 5. RESPONSE
  res.status(201).json({
    success: true,
    message: "Review submitted",
    newReview,
  });
});

// ✅ GET REVIEWS FOR MENTOR
export const getMentorReviews = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;

  const reviews = await Review.find({
    mentor: mentorId,
  })
    .populate("reviewer", "username")
    .populate({
      path: "session",
      populate: {
        path: "skill",
        select: "skillName",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    reviews,
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  const existingReview = await Review.findById(req.params.id);

  if (!existingReview) {
    return res.status(404).json({ message: "Review not found" });
  }

  // 🔐 Only reviewer can edit
  if (existingReview.reviewer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  existingReview.rating = rating;
  existingReview.review = review;

  await existingReview.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review: existingReview
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // ✅ Only reviewer can delete
  if (review.reviewer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  const mentorId = review.mentor;

  await review.deleteOne();

  // 🔥 RECALCULATE RATING
  const stats = await Review.aggregate([
    { $match: { mentor: mentorId } },
    {
      $group: {
        _id: "$mentor",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  await User.findByIdAndUpdate(mentorId, {
    averageRating: stats[0]?.avgRating || 0,
    totalReviews: stats[0]?.totalReviews || 0
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully"
  });
});
