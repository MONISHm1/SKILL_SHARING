import express from "express";
import {
  createExchange,
  getMyExchanges,
  updateExchangeStatus
} from "../controllers/exchange.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createExchange);
router.get("/", verifyJWT, getMyExchanges);
router.patch("/:id", verifyJWT, updateExchangeStatus);


export default router;