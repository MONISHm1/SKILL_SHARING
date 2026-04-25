import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false
    },

    refreshToken: {
      type: String
    },

    
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },

   
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point" 
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: function (val) {
            return val.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]"
        }
      }
    },

    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Beginner"
    },

    skillsOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
      }
    ],

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.index({ geoLocation: "2dsphere" });;

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error; 
  }
});


userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      location: this.location
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
    }
  );
};


userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
    }
  );
};

export default mongoose.model("User", userSchema);



// User → has many → Skills
// User → books → Session
// Session → belongs to → Skill
// Session → between → Learner & Mentor
// User → receives → Reviews