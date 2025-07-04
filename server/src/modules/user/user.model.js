const mongoose = require("mongoose");
const { config } = require("../../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      default: null, // Default to null for Google users
    },
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows for null values without index conflicts
    },
    picture: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(config.roles),
      default: config.roles.USER,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disable __v field
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
