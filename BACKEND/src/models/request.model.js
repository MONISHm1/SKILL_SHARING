import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String,
    enum: ["Tech", "Cooking", "Art", "Fitness", "Academic"]
  },

  mode: {
    type: String,
    enum: ["Online", "Offline", "Both"]
  },

  location: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Request", requestSchema);