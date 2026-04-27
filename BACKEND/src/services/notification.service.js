import { createNotification } from "../controllers/notification.controller.js";

export const notifyExchangeRequest = (receiverId, io) => {
  createNotification({
    userId: receiverId,
    type: "exchange",
    message: "New exchange request received",
    link: "/exchange",
    io,
  }).catch(console.error);
};

export const notifyExchangeAccepted = (senderId, io) => {
  createNotification({
    userId: senderId,
    type: "exchange",
    message: "Your exchange request was accepted",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

export const notifyExchangeRejected = (senderId, io) => {
  createNotification({
    userId: senderId,
    type: "exchange",
    message: "Your exchange request was rejected",
    link: "/exchange",
    io,
  }).catch(console.error);
};

//  New session created (booking / auto from exchange)
export const notifySessionCreated = (userId, io) => {
  createNotification({
    userId,
    type: "session",
    message: "New session scheduled",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

//  Session accepted
export const notifySessionAccepted = (userId, io) => {
  createNotification({
    userId,
    type: "session",
    message: "Your session was accepted",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

//  Session rejected (FIXED)
export const notifySessionRejected = (userId, io) => {
  createNotification({
    userId,
    type: "session",
    message: "Your session was rejected",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

//  Meeting link added
export const notifyMeetingLinkAdded = (userId, io) => {
  createNotification({
    userId,
    type: "session",
    message: "Meeting link added to your session",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

//  Location added
export const notifyLocationAdded = (userId, io) => {
  createNotification({
    userId,
    type: "session",
    message: "Session location has been updated",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

//  Session completed
export const notifySessionCompleted = (userId, io) => {
  createNotification({
    userId,
    type: "session",
    message: "Session marked as completed",
    link: "/manage-sessions",
    io,
  }).catch(console.error);
};

export const notifyNewMessage = (receiverId, senderName, text, conversationId, io) => {
  createNotification({
    userId: receiverId,
    type: "message",
    message: `${senderName}: ${text}`,
    link: `/chat/${conversationId}`,
    io,
  }).catch(console.error);
};
