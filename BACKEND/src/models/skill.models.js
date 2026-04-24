import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  skillName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  category: {
    type: String,
    enum: ["Tech", "Cooking", "Art", "Fitness", "Academic"],
    required: true,
    index: true
  },

  description: {
    type: String,
    required: true
  },

  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"]
  },

  mode: {
    type: String,
    enum: ["Online", "Offline", "Both"],
    default: "Online",
    index: true
  },

  location: {
    type: String,
    required: true // ✅ Recommended
  },

  // 🌍 GEO LOCATION
  coordinates: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    required: false
  }
},

  // 🔍 SEARCH TAGS
  tags: {
    type: [String],
    default: []
  },

  // ⭐ RATING
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  }

}, { timestamps: true });


// 🌍 GEO INDEX
skillSchema.index({ coordinates: "2dsphere" });

// 🔍 TEXT SEARCH INDEX (ADVANCED 🔥)
skillSchema.index({ skillName: "text", description: "text" });

export default mongoose.model("Skill", skillSchema);