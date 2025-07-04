const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const { AppError } = require("../../utils/error");
const { AuthErrors } = require("../../errors/authErrors");

function getTokenOptions(tokenType) {
  const options = { secret: "", expiresIn: "" };
  switch (tokenType) {
    case "access":
      options.secret = env.ACCESS_TOKEN_SECRET;
      options.expiresIn = env.ACCESS_TOKEN_EXPIRY;
      break;
    case "refresh":
      options.secret = env.REFRESH_TOKEN_SECRET;
      options.expiresIn = env.REFRESH_TOKEN_EXPIRY;
      break;
    case "reset-password":
      options.secret = env.RESET_PASSWORD_TOKEN_SECRET;
      options.expiresIn = env.RESET_PASSWORD_TOKEN_EXPIRY;
      break;
    default:
      throw new AppError(AuthErrors.INVALID_TOKEN_TYPE);
  }

  return options;
}

function generateToken({ userId, role, tokenType }) {
  const payload = { userId, role, tokenType };
  let { secret, expiresIn } = getTokenOptions(tokenType);

  return jwt.sign(payload, secret, { expiresIn });
}

function generateTokens(user) {
  const accessToken = generateToken({
    userId: user._id,
    role: user.role,
    tokenType: "access",
  });
  const refreshToken = generateToken({
    userId: user._id,
    role: user.role,
    tokenType: "refresh",
  });

  return { accessToken, refreshToken };
}

function verifyToken(token, tokenType) {
  const { secret } = getTokenOptions(tokenType);
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(
        tokenType === "access"
          ? AuthErrors.ACCESS_TOKEN_EXPIRED
          : tokenType === "refresh"
          ? AuthErrors.REFRESH_TOKEN_EXPIRED
          : AuthErrors.TOKEN_EXPIRED
      );
    } else {
      console.log(error);
      throw new AppError(AuthErrors.INVALID_TOKEN);
    }
  }
}

const tokenService = { generateToken, generateTokens, verifyToken };

module.exports = { tokenService };
