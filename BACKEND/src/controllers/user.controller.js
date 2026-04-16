import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";



const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in DB
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("Token generation error:", error);

    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {

  // 1. Get user details
  const { username, email, password, location, experience, latitude, longitude } = req.body;

  // 2. Validation (ONLY REQUIRED FIELDS)
  if ([username, email, password].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  // 3. Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // 4. Handle optional coordinates
  let coordinatesData = undefined;

  if (latitude && longitude) {
    coordinatesData = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
  }

  // 5. Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    location: location || "",
    experience: experience || "Beginner",
    coordinates: coordinatesData
  });

  // 6. Fetch user without password
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  // 7. Send response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {

  // 1. Get data
  const { username, email, password } = req.body;

  // 2. Validation
  if ((!username && !email) || !password) {
    throw new ApiError(400, "Username/email and password are required");
  }

  // 3. Find user (IMPORTANT: include password)
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 4. Check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 5. Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // OPTIONAL: save refresh token in DB (recommended)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 6. Remove sensitive fields manually
  const userData = user.toObject();
  delete userData.password;
  delete userData.refreshToken;

  // 7. Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // FIXED
    sameSite: "strict"
  };

  // 8. Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: userData,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {

  // Remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" }
    },
    { new: true }
  );

  // Cookie options (must match login)
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };

  // Clear cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Check token match (IMPORTANT SECURITY CHECK)
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // Cookie options
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // 1. Validate input
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  // 2. Get user WITH password
  const user = await User.findById(req.user?._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Check old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  // 4. Prevent same password reuse
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  // 5. Set new password (will auto hash via pre-save)
  user.password = newPassword;

  await user.save(); // ✅ DO NOT skip validation

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access");
  }

  return res.status(200).json(
    new ApiResponse(200, req.user, "User fetched successfully")
  );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email, location, experience } = req.body;

  // Validate required fields
  if (!username || !email) {
    throw new ApiError(400, "Username and email are required");
  }

  // Check if email already exists (for another user)
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Email already in use");
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        email,
        location,
        experience
      },
    },
    { new: true, runValidators: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Account details updated successfully")
  );
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
};