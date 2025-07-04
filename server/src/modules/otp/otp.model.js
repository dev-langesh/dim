const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: { type: Number, default: 1 },
    lastAttempt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = { Otp };
