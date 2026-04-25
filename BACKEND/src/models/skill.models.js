import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    skillName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["Tech", "Cooking", "Art", "Fitness", "Academic"],
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Both"],
      default: "Online",
      index: true,
    },

    location: {
      type: String,
      required: true,
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },

    tags: {
      type: [String],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    video: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

skillSchema.index({ coordinates: "2dsphere" });
skillSchema.index({ skillName: "text", description: "text" });

export default mongoose.model("Skill", skillSchema);
