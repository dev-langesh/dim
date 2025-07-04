const { validateInput } = require("../../middleware/validateInput.middleware");
const { validateToken } = require("../../middleware/validateToken.middleware");
const { authController } = require("./auth.controller");
const { authInputSchema } = require("./auth.inputSchema");

const router = require("express").Router();

router.get("/status", validateToken, authController.authStatus);

router.post(
  "/register",
  validateInput(authInputSchema.registerSchema),
  authController.registerUser
);
router.post(
  "/login",
  validateInput(authInputSchema.loginSchema),
  authController.loginUser
);
router.post(
  "/login/google",
  validateInput(authInputSchema.googleLoginSchema),
  authController.loginUserWithGoogle
);
router.post("/rotate-tokens", authController.rotateTokens);
router.post(
  "/reset-password",
  validateInput(authInputSchema.resetPasswordSchema),
  authController.resetPassword
);

router.post(
  "/send-otp",
  validateInput(authInputSchema.sendOtpSchema),
  authController.sendOtp
);
router.post(
  "/verify-otp",
  validateInput(authInputSchema.verifyOtpSchema),
  authController.verifyOtp
);
router.post(
  "/verify-otp-reset-password",
  validateInput(authInputSchema.verifyOtpToResetPasswordSchema),
  authController.verifyOtpToResetPassword
);

router.post("/logout", authController.logoutUser);

module.exports = { authRouter: router };
