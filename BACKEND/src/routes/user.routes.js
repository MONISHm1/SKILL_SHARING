import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// PUBLIC ROUTES
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// PROTECTED ROUTES
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/update-profile").patch(
  verifyJWT,
  updateAccountDetails
);

router.route("/change-password").patch(
  verifyJWT,
  changeCurrentPassword
);

export default router;