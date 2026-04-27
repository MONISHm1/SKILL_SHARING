import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO } from "../sockets/chat.socket.js";
import { notifyNewMessage } from "../services/notification.service.js";

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  if (receiverId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Cannot chat with yourself");
  }

  const userId = req.user._id;

  const members = [userId, receiverId].map(String).sort();

  let conversation = await Conversation.findOne({
    members: members,
  }).populate("members", "username email");

  if (!conversation) {
    try {
      conversation = await Conversation.create({
        members: members,
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "members",
        "username email"
      );
    } catch (err) {
      if (err.code === 11000) {
        console.log("⚠️ Duplicate detected, fetching again");

        conversation = await Conversation.findOne({
          members: members,
        }).populate("members", "username email");
      } else {
        console.error("❌ Create error:", err);
        throw new ApiError(500, "Conversation creation failed");
      }
    }
  }

  if (!conversation) {
    throw new ApiError(500, "Conversation creation failed");
  }

  return res.status(200).json(new ApiResponse(200, conversation, "Conversation ready"));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;

  if (!conversationId) {
    throw new ApiError(400, "Conversation ID is required");
  }

  if (!text || !text.trim()) {
    throw new ApiError(400, "Message cannot be empty");
  }

  const trimmedText = text.trim();

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isMember = conversation.members.some(memberId => String(memberId) === String(req.user._id));

  if (!isMember) {
    throw new ApiError(403, "You are not part of this conversation");
  }

  const receiverId = conversation.members.find(id => String(id) !== String(req.user._id));

  if (!receiverId) {
    throw new ApiError(400, "Receiver not found in conversation");
  }

  const message = await Message.create({
    conversationId,
    sender: req.user._id,
    receiver: receiverId,
    text: trimmedText,
  });

  const now = new Date();

  conversation.lastMessage = {
    text: trimmedText,
    sender: req.user._id,
    createdAt: now,
  };

  conversation.lastMessageAt = now;

  conversation.updatedAt = now;

  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "username")
    .populate("receiver", "username");

  try {
    const io = getIO();

    if (io) {
      io.to(String(receiverId)).emit("receiveMessage", {
        _id: populatedMessage._id,
        senderId: populatedMessage.sender._id,
        text: populatedMessage.text,
        conversationId: populatedMessage.conversationId,
        createdAt: populatedMessage.createdAt,
      });
      // io.to(String(req.user._id)).emit("getMessage", populatedMessage);
    }
    //  Notify receiver
    notifyNewMessage(receiverId, req.user.username, trimmedText, conversationId, io);
  } catch (err) {
    console.log("Socket/Notification error:", err.message);
  }

  return res.status(201).json(new ApiResponse(201, populatedMessage, "Message sent successfully"));
});

export const getMessages = asyncHandler(async (req, res) => {
  const { id: conversationId } = req.params;

  if (!conversationId) {
    throw new ApiError(400, "Conversation ID is required");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.members.some(m => String(m) === String(req.user._id))) {
    throw new ApiError(403, "You are not authorized to view messages");
  }

  const messages = await Message.find({ conversationId })
    .populate("sender", "username")
    .sort({ createdAt: 1 });

  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "username email avatar")
      .populate("skill", "title")
      .sort({ updatedAt: -1 });

    const formatted = conversations.map(conv => {
      const otherUser = conv.members.find(m => String(m._id) !== String(userId));

      return {
        _id: String(conv._id),

        otherUser: otherUser
          ? {
              _id: String(otherUser._id),
              username: otherUser.username || "Unknown",
              avatar: otherUser.avatar || null,
            }
          : {
              _id: null,
              username: "Unknown",
              avatar: null,
            },

        lastMessage: conv.lastMessage || { text: "Start chatting..." },

        skill: conv.skill || null,

        members: conv.members.map(m => String(m._id)),

        updatedAt: conv.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      conversations: formatted,
    });
  } catch (error) {
    console.error("getUserConversations error:", error);
    throw new ApiError(500, "Failed to fetch conversations");
  }
};
