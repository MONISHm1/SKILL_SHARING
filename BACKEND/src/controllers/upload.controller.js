import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadOnCloudinary(req.file.path);

    if (!result) {
      return res.status(500).json({ message: "Upload failed" });
    }

    res.status(200).json({
      success: true,
      videoUrl: result.secure_url,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};