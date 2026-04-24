import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // 🔥 Link chat to skill (NO CHANGE)
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: false,
    },

    // 🔥 Last message (NO CHANGE)
    lastMessage: {
      text: {
        type: String,
        default: "",
        trim: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },

    // 🔥 Last message time (NO CHANGE)
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    // 🔥 Unread count (NO CHANGE)
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// =========================================
// ✅ SAFE INDEXES (KEEP)
// =========================================

// Fast lookup
conversationSchema.index({ members: 1}
);

// Sort by latest
conversationSchema.index({ lastMessageAt: -1 });

// =========================================
// ❌ REMOVED BROKEN INDEX
// =========================================
// conversationSchema.index(
//   { members: 1, skill: 1 },
//   { unique: true, sparse: true }
// );

// =========================================
// ✅ PREVENT MODEL OVERWRITE (KEEP)
// =========================================
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;