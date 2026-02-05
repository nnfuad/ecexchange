const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    roll: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "member"
    },

    // 🔐 Forgot-password OTP fields
    otp: String,
    otpExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);