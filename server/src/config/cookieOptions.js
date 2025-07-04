const { env } = require("./env");
const ms = require("ms");

const cookieOptions = {
  httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  secure: env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
  sameSite: env.NODE_ENV === "production" ? "Strict" : "Lax", // Strict in production, Lax in development
  maxAge: ms(env.REFRESH_TOKEN_EXPIRY), // Sets the cookie max age based on the refresh token expiry
};

module.exports = {
  cookieOptions,
};
