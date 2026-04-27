import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO, getOnlineUsers } from "../sockets/chat.socket.js";

//  Get all notifications
export const getNotifications = asyncHandler(async (req, res) => {
  //  CLEAN OLD READ NOTIFICATIONS FIRST
  await Notification.deleteMany({
    userId: req.user._id,
    isRead: true,
    createdAt: {
      $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

//  Mark as read
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    {
      _id: id,
      userId: req.user._id, 
    },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

//  Create notification (USED INTERNALLY)
export const createNotification = async ({ userId, type, message, link }) => {
  const notification = await Notification.create({
    userId,
    type,
    message,
    link,
  });
  const io = getIO(); // get here safely
  // USE YOUR EXISTING SOCKET SYSTEM
  const onlineUsers = getOnlineUsers(); 

  
  console.log("📤 Sending notification to:", userId);
  console.log("🧑 Online user data:", onlineUsers.get(userId.toString()));
  

  const receiver = onlineUsers.get(userId.toString());

  if (receiver?.socketId) {
    console.log("✅ Emitting to socket:", receiver.socketId);
    io.to(receiver.socketId).emit("newNotification", notification);
  } else {
    console.log("❌ User not online, cannot emit");
  }

  return notification;
};
