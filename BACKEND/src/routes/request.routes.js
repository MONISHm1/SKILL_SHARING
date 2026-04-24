import express from "express";
import {
  createRequest,
  getRequests,
  getMyRequests
} from "../controllers/request.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// create request
router.post("/", verifyJWT, createRequest);

// get others' requests
router.get("/", verifyJWT, getRequests);

// get my requests
router.get("/my", verifyJWT, getMyRequests);

export default router;