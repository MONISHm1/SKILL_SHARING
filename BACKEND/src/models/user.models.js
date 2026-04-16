import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },
  refreshToken: {
      type: String,
    },

  location: {
    type: String,
    default:"",
  },

coordinates: {
  type: {
    type: String,
    enum: ["Point"]
  },
  coordinates: {
    type: [Number]
  }
},

  experience: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"]
  },

  skillsOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill"
  }],

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

}, { timestamps: true });

userSchema.index({ coordinates: "2dsphere" });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});


// Check password
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      usernamename: this.name,          
      location: this.location   
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};


//  Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,            
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};


export default mongoose.model("User", userSchema);



// User → has many → Skills
// User → books → Session
// Session → belongs to → Skill
// Session → between → Learner & Mentor
// User → receives → Reviews