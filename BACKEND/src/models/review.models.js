import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  review: {
    type: String
  }

}, { timestamps: true });

reviewSchema.index({ session: 1, reviewer: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);