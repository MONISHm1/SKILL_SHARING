import mongoose from "mongoose"; 
import User from "../models/user.models.js";
import Skill from "../models/skill.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCoordinates } from "../utils/geocoder.js"; 
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const addSkill = asyncHandler(async (req, res) => {
  const {
    skillName,
    category,
    coordinates,
    mode,
    description,
    location,
    videoUrl, 
  } = req.body;

  console.log("REQ BODY:", req.body);

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

  // Frontend coordinates
  if (coordinates && isValidCoords(coordinates.coordinates)) {
    coords = coordinates.coordinates;
  }

  //Location string → geocode
  else if (location && location.trim() !== "") {
    try {
      const cleanLocation = location.trim();
      const geo = await getCoordinates(cleanLocation);
      coords = geo;
    } catch (err) {
      throw new ApiError(400, "Invalid location");
    }
  }

  // fallback user location
  else if (user?.coordinates?.coordinates) {
    coords = user.coordinates.coordinates;
  }

  
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
    location: location?.trim(),
    coordinates: finalCoordinates,
    mentor: req.user._id,

   
    video: {
      url: videoUrl || null,
      publicId: null,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, skill, "Skill added successfully")
  );
});



export const getSkills = asyncHandler(async (req, res) => {
  const { category, mode, search } = req.query;

  let filter = { isActive: true };

  if (category) filter.category = category;
  if (mode) filter.mode = mode;

  if (search) {
    filter.skillName = { $regex: search, $options: "i" };
  }

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



export const getMySkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({
    mentor: req.user._id
  });

  return res.json(new ApiResponse(200, skills));
});



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


export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  if (skill.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  const {
    skillName,
    category,
    description,
    experienceLevel,
    mode,
    location,
    videoUrl,
  } = req.body;


  if (skillName) skill.skillName = skillName;
  if (category) skill.category = category;
  if (description) skill.description = description;
  if (experienceLevel) skill.experienceLevel = experienceLevel;
  if (mode) skill.mode = mode;
  if (location) skill.location = location;

 
  if (videoUrl && videoUrl !== skill.video?.url) {
    
  
    if (skill.video?.publicId) {
      try {
        await cloudinary.uploader.destroy(skill.video.publicId, {
          resource_type: "video",
        });
      } catch (err) {
        console.error("Error deleting old video:", err);
      }
    }

    
    const publicId = videoUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    
    skill.video = {
      url: videoUrl,
      publicId: publicId || null,
    };
  }

  await skill.save();

  return res.json(
    new ApiResponse(200, skill, "Skill updated successfully")
  );
});



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

  
  const skills = await Skill.find({
    isActive: true,
    ...(userId && {
      mentor: { $ne: new mongoose.Types.ObjectId(userId) }
    })
  })
    .populate("mentor", "username averageRating location")
    .lean();


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

  
  const enriched = skills.map((skill) => {
    let coords = skill.coordinates?.coordinates;

  
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

  
  enriched.sort((a, b) => a.distance - b.distance);

  return res.status(200).json({
    success: true,
    skills: enriched,
  });
});