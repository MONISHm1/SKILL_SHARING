import Exchange from "../models/exchange.model.js";
import Skill from "../models/skill.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Session from "../models/session.models.js";

// 🔥 SEND REQUEST
export const createExchange = asyncHandler(async (req, res) => {
  const { requestedSkillId, offeredSkillId, message } = req.body;

  if (!requestedSkillId || !offeredSkillId) {
    throw new ApiError(400, "Both skills are required");
  }

  const requestedSkill = await Skill.findById(requestedSkillId);
  const offeredSkill = await Skill.findById(offeredSkillId);

  if (!requestedSkill || !offeredSkill) {
    throw new ApiError(404, "Skill not found");
  }

  // ❌ Prevent self exchange
  if (requestedSkill.mentor.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot exchange your own skill");
  }

  const exchange = await Exchange.create({
    requester: req.user._id,
    receiver: requestedSkill.mentor,
    requestedSkill: requestedSkillId,
    offeredSkill: offeredSkillId,
    message,
  });

  res.status(201).json({
    success: true,
    exchange,
  });
});

export const getMyExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find({
    $or: [
      { requester: req.user._id },
      { receiver: req.user._id }
    ]
  })
    .populate("requestedSkill", "skillName")
    .populate("offeredSkill", "skillName")
    .populate("requester", "username")
    .populate("receiver", "username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    exchanges,
  });
});

export const updateExchangeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const exchange = await Exchange.findById(id)
    .populate("requestedSkill")
    .populate("offeredSkill");

  if (!exchange) {
    throw new ApiError(404, "Exchange not found");
  }

  // 🔐 Only receiver can accept/reject
  if (exchange.receiver.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  exchange.status = status;
  await exchange.save();

  // 🔥🔥🔥 AUTO SESSION CREATION STARTS HERE
  if (status === "Accepted") {


    // ✅ Prevent duplicate session
    const existingSession = await Session.findOne({
      learner: exchange.requester,
      mentor: exchange.receiver,
      skill: exchange.requestedSkill._id,
    });

    if (!existingSession) {
      await Session.create({
        learner: exchange.requester,        // who requested
        mentor: exchange.receiver,          // who teaches
        skill: exchange.requestedSkill._id, // requested skill

        date: new Date(),        // 🔥 default (you can improve later)
        time: "Flexible",        // 🔥 placeholder

        mode: exchange.requestedSkill.mode || "Online",

        status: "Pending",

        meetingLink: null,
        location: null,
      });
    }

    // 🔁 OPTIONAL: reverse session (uncomment if needed)
    
    await Session.create({
      learner: exchange.receiver,
      mentor: exchange.requester,
      skill: exchange.offeredSkill._id,
      date: new Date(),
      time: "Flexible",
      mode: exchange.offeredSkill.mode || "Online",
      status: "Pending",
    });
  }
  // 🔥🔥🔥 AUTO SESSION CREATION ENDS HERE

  res.status(200).json({
    success: true,
    exchange,
  });
});