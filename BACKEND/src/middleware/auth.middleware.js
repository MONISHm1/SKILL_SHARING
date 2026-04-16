import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.accessToken ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // OPTIONAL (enable later if needed)
    // if (!user.isVerified) {
    //   throw new ApiError(403, "User not verified");
    // }

    req.user = user;
    next();

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

