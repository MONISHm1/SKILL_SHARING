import mongoose from "mongoose"; // 🔥 ADD THIS
import User from "../models/user.models.js";
import Skill from "../models/skill.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCoordinates } from "../utils/geocoder.js"; // adjust path if needed


// 🟢 ADD SKILL (MENTOR)
export const addSkill = asyncHandler(async (req, res) => {
  const {
    skillName,
    category,
    coordinates,
    mode,
    description,
    location,
  } = req.body;

  console.log("REQ BODY:", req.body); // 🔥 CHANGE

  if (!skillName || !category || !description || !mode) {
    throw new ApiError(400, "Required fields missing");
  }

  let coords;

  const user = await User.findById(req.user._id);

  const isValidCoords = (arr) =>
    Array.isArray(arr) &&
    arr.length === 2 &&
    typeof arr[0] === "number" &&
    typeof arr[1] === "number";

  // ✅ CASE 1: frontend coords
  if (coordinates && isValidCoords(coordinates.coordinates)) {
    coords = coordinates.coordinates;
  }

  // 🔥 CHANGE: clean + validate location
  else if (location && location.trim() !== "") {
    try {
      const cleanLocation = location.trim(); // 🔥 CHANGE
      const geo = await getCoordinates(cleanLocation);
      coords = geo;
    } catch (err) {
      throw new ApiError(400, "Invalid location");
    }
  }

  // ✅ CASE 3: fallback
  else if (user?.coordinates?.coordinates) {
    coords = user.coordinates.coordinates;
  }

  // 🔥 FINAL SAFETY
  if (!isValidCoords(coords)) {
    throw new ApiError(400, "Unable to determine location coordinates");
  }

  const finalCoordinates = {
    type: "Point",
    coordinates: coords,
  };

  const skill = await Skill.create({
    skillName,
    category,
    description,
    mode,
    location: location?.trim(), // 🔥 CHANGE
    coordinates: finalCoordinates,
    mentor: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, skill, "Skill added successfully")
  );
});


// 🔵 SEARCH SKILLS (FILTER + EXPLORE)
export const getSkills = asyncHandler(async (req, res) => {
  const { category, mode, search } = req.query;

  let filter = { isActive: true };

  if (category) filter.category = category;
  if (mode) filter.mode = mode;

  if (search) {
    filter.skillName = { $regex: search, $options: "i" };
  }

  // ❗ Exclude own skills
  // 🔥 CHANGE: only exclude if user exists properly
if (req.user && req.user._id) {
  filter.mentor = { $ne: req.user._id };
}
console.log("USER ID:", req.user?._id);
console.log("FILTER:", filter);

  const skills = await Skill.find(filter)
    .populate("mentor", "username averageRating totalReviews")
    .sort({ createdAt: -1 });

  return res.json(new ApiResponse(200, skills));
});


// 🟡 GET MY SKILLS
export const getMySkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({
    mentor: req.user._id
  });

  return res.json(new ApiResponse(200, skills));
});


// 🔴 DELETE SKILL
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  if (skill.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await skill.deleteOne();

  return res.json(new ApiResponse(200, null, "Skill deleted successfully"));
});


// 🟠 UPDATE SKILL
export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  if (skill.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  Object.assign(skill, req.body);
  await skill.save();

  return res.json(new ApiResponse(200, skill, "Skill updated"));
});


// 🔍 GET SINGLE SKILL
export const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  if (skill.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  return res.json(new ApiResponse(200, skill));
});


// 🌍 NEARBY SKILLS (FINAL CLEAN VERSION)

export const getNearbySkills = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, "Location required");
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new ApiError(400, "Invalid coordinates");
  }

  const userId = req.user?._id;

  // 🔥 STEP 1: FETCH ALL SKILLS (LIKE EXPLORE)
  const skills = await Skill.find({
    isActive: true,
    ...(userId && {
      mentor: { $ne: new mongoose.Types.ObjectId(userId) }
    })
  })
    .populate("mentor", "username averageRating location")
    .lean();

  // 🔥 DISTANCE FUNCTION
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 🔥 STEP 2: ADD DISTANCE (WITH FALLBACK)
  const enriched = skills.map((skill) => {
    let coords = skill.coordinates?.coordinates;

    // fallback from "lat, lng"
    if (!coords && skill.location?.includes(",")) {
      const parts = skill.location.split(",");
      if (parts.length === 2) {
        const latVal = parseFloat(parts[0]);
        const lngVal = parseFloat(parts[1]);

        if (!isNaN(latVal) && !isNaN(lngVal)) {
          coords = [lngVal, latVal];
        }
      }
    }

    if (!coords) {
      return { ...skill, distance: 9999 };
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      coords[1],
      coords[0]
    );

    return {
      ...skill,
      distance: Number(distance.toFixed(2)),
    };
  });

  // 🔥 STEP 3: SORT ONLY (NO FILTER)
  enriched.sort((a, b) => a.distance - b.distance);

  return res.status(200).json({
    success: true,
    skills: enriched,
  });
});