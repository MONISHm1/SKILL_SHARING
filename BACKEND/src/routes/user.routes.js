import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getUserProfile,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/update-profile").patch(
  verifyJWT,
  updateAccountDetails
);

router.route("/change-password").patch(
  verifyJWT,
  changeCurrentPassword
);
router.route("/:id").get(getUserProfile);

export default router;