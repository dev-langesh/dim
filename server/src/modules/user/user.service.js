const { AuthErrors } = require("../../errors/authErrors");
const { AppError } = require("../../utils/error");
const { User } = require("./user.model");

async function createUser(data) {
  let user = await User.findOne({ email: data.email });

  if (user) {
    throw new AppError(AuthErrors.USER_ALREADY_EXISTS);
  }

  return await User.create(data);
}

async function findUserByEmail(
  email,
  includePassword = false,
  throwIfNotFound = true
) {
  const user = await User.findOne({ email }).select(
    (includePassword ? "+" : "-") + "password"
  );

  if (!user && throwIfNotFound) {
    throw new AppError(AuthErrors.USER_NOT_FOUND);
  }

  return user;
}

async function findUserById(id) {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new AppError(AuthErrors.USER_NOT_FOUND);
  }
  return user;
}

async function verifyUserByEmail(email) {
  const user = await findUserByEmail(email);

  user.verified = true;
  return await user.save();
}

async function resetPassword(userId, password) {
  const user = await findUserById(userId);

  user.password = password;
  return await user.save();
}

const userService = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyUserByEmail,
  resetPassword,
};

module.exports = { userService };
