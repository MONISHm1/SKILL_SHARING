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
    trim: true
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
    default: "Online"
  },

  location: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Skill", skillSchema);