import express from "express";
import {
  addSkill,
  getSkills,
  getMySkills,
  deleteSkill,
  updateSkill,
  getSkillById,
  getNearbySkills
} from "../controllers/skill.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🟢 Add Skill (Mentor)
router.post("/", verifyJWT, addSkill);

// 🟢 Get logged-in user's skills
router.get("/my", verifyJWT, getMySkills);


router.get("/nearby", verifyJWT, getNearbySkills);

// 🔍 Get all skills (Explore)
router.get("/", verifyJWT, getSkills);

// 🟢 Delete Skill
router.delete("/:id", verifyJWT, deleteSkill);

// 🟢 Update Skill
router.put("/:id", verifyJWT, updateSkill);

// 🟢 Get skill by ID (MUST BE LAST)
router.get("/:id", verifyJWT, getSkillById);

export default router;