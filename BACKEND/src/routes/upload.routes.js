import express from "express";
import {upload} from "../middleware/multer.js";
import { uploadVideo } from "../controllers/upload.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; 
const router = express.Router();

// PROTECTED VIDEO UPLOAD
router.post(
  "/video",
  verifyJWT,                
  upload.single("video"),
  uploadVideo
);

export default router;