const { config } = require("../config/constants");

const AuthErrors = {
  USER_NOT_VERIFIED: {
    errorCode: 1006,
    message: "User not verified. Please verify your email.",
    statusCode: 403,
  },
  INVALID_CREDENTIALS: {
    errorCode: 1007,
    message: "Sign In failed. Check your credentials.",
    statusCode: 401,
  },
  USER_NOT_FOUND: {
    errorCode: 1008,
    message: "User not found. Please register.",
    statusCode: 404,
  },
  USER_ALREADY_EXISTS: {
    errorCode: 1009,
    message: "User already exists with this email.",
    statusCode: 409,
  },
  GOOGLE_ID_TOKEN_VERIFICATION_FAILED: {
    errorCode: 1010,
    message: "Failed to verify Google ID token.",
    statusCode: 401,
  },
  GOOGLE_EMAIL_NOT_VERIFIED: {
    errorCode: 1011,
    message: "Google email not verified. Please use a verified email.",
    statusCode: 401,
  },
  GOOGLE_LOGIN_REQUIRED: {
    errorCode: 1012,
    message: "Google login required. Please log in with Google.",
    statusCode: 401,
  },

  // OTP Errors
  MAX_OTP_ATTEMPTS_REACHED: {
    errorCode: 1100,
    message: `Maximum OTP attempts reached. Try again after ${config.otp.attemptsExpiry / 3600000} hours.`,
    statusCode: 429,
  },
  OTP_RESEND_COOLDOWN: {
    errorCode: 1101,
    message: "Please wait before requesting a new OTP.",
    statusCode: 429,
  },
  OTP_EXPIRED: {
    errorCode: 1102,
    message: "OTP has expired. Please request a new one.",
    statusCode: 410,
  },
  OTP_INVALID: {
    errorCode: 1103,
    message: "Invalid OTP provided.",
    statusCode: 400,
  },

  //  Token Errors
  REFRESH_TOKEN_EXPIRED: {
    errorCode: 2000,
    message: "Session expired, please login again",
    statusCode: 401,
  },
  ACCESS_TOKEN_EXPIRED: {
    errorCode: 2001,
    message: "Access token expired",
    statusCode: 401,
  },
  MISSING_TOKEN: {
    errorCode: 2002,
    message: "Missing token. Please provide a valid token.",
    statusCode: 401,
  },
  INVALID_TOKEN: {
    errorCode: 2003,
    message: "Invalid token. Please log in again.",
    statusCode: 401,
  },
  INVALID_TOKEN_TYPE: {
    errorCode: 2004,
    message: "Invalid token type. Please provide a valid token type.",
    statusCode: 400,
  },
  TOKEN_EXPIRED: {
    errorCode: 2005,
    message: "Token has expired",
    statusCode: 401,
  },
};

module.exports = { AuthErrors };
