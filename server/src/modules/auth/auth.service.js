const { env } = require("../../config/env");
const { AuthErrors } = require("../../errors/authErrors");
const { tokenService } = require("../../lib/jwt/token.service");
const { AppError } = require("../../utils/error");
const { userService } = require("../user/user.service");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const { otpService } = require("../otp/otp.service");
const { generateHash } = require("../../utils/auth/hash");

async function registerUser(data) {
  const payload = { ...data };

  payload.password = await bcrypt.hash(payload.password, 10);

  const user = await userService.createUser(payload);

  // await otpService.sendOTP({
  //   notificationType: "email",
  //   to: user.email,
  //   templateName: "auth/otp",
  // });

  return { user };
}

async function loginUser(data) {
  const { email, password } = data;
  const user = await userService.findUserByEmail(email, true);

  if (!user.password && user.provider === "google") {
    throw new AppError(AuthErrors.GOOGLE_LOGIN_REQUIRED);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(AuthErrors.INVALID_CREDENTIALS);
  }

  if (!user.verified) {
    throw new AppError(AuthErrors.USER_NOT_VERIFIED);
  }

  const tokens = tokenService.generateTokens(user);

  return { user, tokens };
}

async function verifyOtp({ to, otp }) {
  await otpService.verifyOtp({ to, otp });

  const user = await userService.verifyUserByEmail(to);

  const tokens = tokenService.generateTokens(user);

  return { user, tokens };
}

async function rotateTokens(refreshToken) {
  if (!refreshToken) {
    throw new AppError(AuthErrors.MISSING_TOKEN);
  }

  try {
    const decoded = tokenService.verifyToken(refreshToken, "refresh");
    const user = await userService.findUserById(decoded.userId);

    const tokens = tokenService.generateTokens(user);

    return tokens;
  } catch (error) {
    throw new AppError(AuthErrors.REFRESH_TOKEN_EXPIRED);
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyIdToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID, // Make sure this matches your frontend
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      throw new AppError(AuthErrors.GOOGLE_EMAIL_NOT_VERIFIED);
    }

    return { googleId, email, name, picture };
  } catch (err) {
    console.error("Failed to verify Google ID token:", err.message);
    throw new AppError(AuthErrors.GOOGLE_ID_TOKEN_VERIFICATION_FAILED);
  }
}

async function loginWithGoogle(idToken) {
  const { googleId, email, name, picture } = await verifyIdToken(idToken);

  let user = await userService.findUserByEmail(email, false, false);

  if (!user?.verified) {
    await otpService.sendOTP({
      notificationType: "email",
      to: user.email,
      templateName: "auth/otp",
    });
    throw new AppError(AuthErrors.USER_NOT_VERIFIED);
  }

  // If user does not exist, create a new one
  if (!user) {
    user = await userService.createUser({
      googleId,
      email,
      name,
      picture,
      provider: "google",
    });

    await otpService.sendOTP({
      notificationType: "email",
      to: user.email,
      templateName: "auth/otp",
    });
  }

  const tokens = tokenService.generateTokens(user);

  return { user, tokens };
}

async function verifyOtpToResetPassword({ otp, to }) {
  await otpService.verifyOtp({ to, otp });

  const user = await userService.findUserByEmail(to);

  const token = tokenService.generateToken({
    userId: user._id,
    tokenType: "reset-password",
    role: user.role,
  });

  return { token };
}

async function verifyTokenAndResetPassword({ password, token }) {
  const decoded = tokenService.verifyToken(token, "reset-password");

  const hashedPassword = await generateHash(password);
  await userService.resetPassword(decoded.userId, hashedPassword);
}

const authService = {
  registerUser,
  loginUser,
  verifyOtp,
  rotateTokens,
  verifyIdToken,
  loginWithGoogle,
  verifyOtpToResetPassword,
  verifyTokenAndResetPassword,
};

module.exports = { authService };
