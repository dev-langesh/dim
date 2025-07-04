const roles = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};

const otp = {
  expirationTime: 5 * 60 * 1000, // 5 minutes
  maxAttempts: 3,
  length: 6,
  attemptsExpiry: 2 * 60 * 60 * 1000, // 2 hours
  resendCooldown: 60 * 1000, // 1 minute
};

const hashing = {
  saltRounds: 10, // Number of rounds for bcrypt hashing
};

const config = {
  roles,
  otp,
  hashing,
};

module.exports = {
  config,
};
