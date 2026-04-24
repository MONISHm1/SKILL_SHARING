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


    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: false,
    },

 
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

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ members: 1}
);

conversationSchema.index({ lastMessageAt: -1 });


// conversationSchema.index(
//   { members: 1, skill: 1 },
//   { unique: true, sparse: true }
// );

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;