import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  mode: {
    type: String,
    enum: ["Online", "Offline"]
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Completed", "Rejected"],
    default: "Pending",
    index: true
  },

  meetingLink: {
  type: String,
  default: null
},

  location: {
  type: String,
  default: null,
},

}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);