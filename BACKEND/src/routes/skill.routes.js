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


router.post("/", verifyJWT, addSkill);


router.get("/my", verifyJWT, getMySkills);


router.get("/nearby", verifyJWT, getNearbySkills);


router.get("/", verifyJWT, getSkills);


router.delete("/:id", verifyJWT, deleteSkill);


router.put("/:id", verifyJWT, updateSkill);


router.get("/:id", verifyJWT, getSkillById);

export default router;