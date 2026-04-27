import Session from "../models/session.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Review from "../models/review.models.js";
import Skill from "../models/skill.models.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { getIO } from "../sockets/chat.socket.js";
import {
  notifySessionCreated,
  notifySessionAccepted,
  notifySessionRejected,
  notifySessionCompleted,
  notifyMeetingLinkAdded,
  notifyLocationAdded,
} from "../services/notification.service.js";

export const createSession = asyncHandler(async (req, res) => {
  const { skillId, date, time, mode } = req.body;
  // VALIDATION
  if (!skillId || !date || !time || !mode) {
    throw new ApiError(400, "All required fields must be provided");
  }

  //  MODE VALIDATION
  const allowedModes = ["Online", "Offline"];
  if (!allowedModes.includes(mode)) {
    throw new ApiError(400, "Invalid mode");
  }

  //  FIND SKILL
  const skill = await Skill.findById(skillId);
  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  //  PREVENT DUPLICATE
  const existingSession = await Session.findOne({
    learner: req.user._id,
    skill: skillId,
    date,
    time,
  });

  if (existingSession) {
    throw new ApiError(400, "Session already booked");
  }

  //  CREATE SESSION
  const session = await Session.create({
    learner: req.user._id,
    mentor: skill.mentor,
    skill: skill._id,
    date,
    time,
    mode,

    location: null,
    meetingLink: null,

    status: "Pending",
  });
  const io = getIO();

  
  notifySessionCreated(session.mentor, io);

  res.status(201).json({
    success: true,
    session,
  });
});

export const getMySessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({
    learner: new mongoose.Types.ObjectId(req.user._id),
  })
    .populate("mentor", "username")
    .populate("skill", "skillName")
    .lean();

  const updatedSessions = await Promise.all(
    sessions.map(async session => {
      const review = await Review.findOne({
        session: session._id,
      });

      return {
        ...session,
        reviewed: !!review,
      };
    })
  );

  res.status(200).json({
    sessions: updatedSessions,
  });
});

export const getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({
    mentor: req.user._id,
    learner: { $ne: req.user._id },
  })
    .populate("learner", "username")
    .populate("skill", "skillName");

  res.status(200).json({
    sessions,
  });
});

export const updateSessionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const allowedStatus = ["Accepted", "Rejected", "Completed"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }
  
  session.status = status;
  await session.save();
  
  const io = getIO();

  
  if (status === "Accepted") {
    notifySessionAccepted(session.learner, io);
  }

  
  if (status === "Rejected") {
    notifySessionRejected(session.learner, io);
  }

  if (status === "Completed") {
  notifySessionCompleted(session.learner, io);
}

  res.status(200).json({
    success: true,
    session,
  });
});

export const markSessionCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  

  session.status = "Completed";
  await session.save();

  const io = getIO();

  res.status(200).json({
    success: true,
    message: "Session marked as completed",
    session,
  });
});

export const addMeetingLink = asyncHandler(async (req, res) => {
  const { meetingLink } = req.body;
  const { id } = req.params;

  if (!meetingLink) {
    throw new ApiError(400, "Meeting link is required");
  }

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== "Accepted") {
    throw new ApiError(400, "Accept session first");
  }

  if (session.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  session.meetingLink = meetingLink;
  await session.save();

  const io = getIO();

  
  notifyMeetingLinkAdded(session.learner, io);

  res.status(200).json({
    success: true,
    session,
  });
});

export const addLocation = asyncHandler(async (req, res) => {
  const { location } = req.body;
  const { id } = req.params;

  if (!location) {
    throw new ApiError(400, "Location is required");
  }

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== "Accepted") {
    throw new ApiError(400, "Accept session first");
  }

  if (session.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  session.location = location;
  await session.save();

  const io = getIO();

  
  notifyLocationAdded(session.learner, io);

  res.status(200).json({
    success: true,
    session,
  });
});

export const deleteSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (
    session.mentor.toString() !== req.user._id.toString() &&
    session.learner.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  await session.deleteOne();

  res.status(200).json({
    success: true,
    message: "Session deleted successfully",
  });
});
