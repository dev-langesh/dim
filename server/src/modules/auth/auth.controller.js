const asyncHandler = require("express-async-handler");
const { authService } = require("./auth.service");
const { cookieOptions } = require("../../config/cookieOptions");
const { otpService } = require("../otp/otp.service");

async function registerUser(req, res) {
  const userData = req.body;
  const sres = await authService.registerUser(userData);

  // res.cookie("accessToken", sres.tokens.accessToken, cookieOptions);
  // res.cookie("refreshToken", sres.tokens.refreshToken, cookieOptions);

  res
    .status(201)
    .json({ message: "User registered successfully", user: sres.user });
}

async function loginUser(req, res) {
  const userData = req.body;
  const sres = await authService.loginUser(userData);

  res.cookie("accessToken", sres.tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", sres.tokens.refreshToken, cookieOptions);

  res.json({ message: "User logged in successfully", user: sres.user });
}

async function sendOtp(req, res) {
  const { notificationType, to, template } = req.body;

  await otpService.sendOTP({
    notificationType,
    to: to,
    template,
  });

  res.json({ message: "OTP sent successfully" });
}

async function verifyOtpToResetPassword(req, res) {
  const { otp, to } = req.body;

  const sRes = await authService.verifyOtpToResetPassword({ to, otp });

  res.json({
    message: "OTP verified successfully",
    token: sRes.token,
  });
}

async function resetPassword(req, res) {
  const { token, password } = req.body;

  await authService.verifyTokenAndResetPassword({ token, password });
  res.json({ message: "Password reset successfully" });
}

async function verifyOtp(req, res) {
  const { otp, to } = req.body;

  const sRes = await authService.verifyOtp({ to, otp });

  res.cookie("accessToken", sRes.tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", sRes.tokens.refreshToken, cookieOptions);

  res.json({ message: "OTP verified successfully" });
}

async function authStatus(req, res) {
  res.json({ user: req.user });
}

async function rotateTokens(req, res) {
  const { refreshToken } = req.cookies;

  const tokens = await authService.rotateTokens(refreshToken);
  res.cookie("accessToken", tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
  res.json({ message: "Tokens rotated successfully" });
}

async function loginUserWithGoogle(req, res) {
  const { idToken } = req.body;

  const sres = await authService.loginWithGoogle(idToken);

  res.cookie("accessToken", sres.tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", sres.tokens.refreshToken, cookieOptions);

  res.json({ message: "User logged in successfully", user: sres.user });
}

async function logoutUser(req, res) {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.json({ message: "User logged out successfully" });
}

const authController = {
  registerUser: asyncHandler(registerUser),
  loginUser: asyncHandler(loginUser),
  sendOtp: asyncHandler(sendOtp),
  verifyOtp: asyncHandler(verifyOtp),
  authStatus: asyncHandler(authStatus),
  rotateTokens: asyncHandler(rotateTokens),
  logoutUser: asyncHandler(logoutUser),
  loginUserWithGoogle: asyncHandler(loginUserWithGoogle),
  verifyOtpToResetPassword: asyncHandler(verifyOtpToResetPassword),
  resetPassword: asyncHandler(resetPassword),
};

module.exports = { authController };
