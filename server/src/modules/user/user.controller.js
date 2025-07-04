const asyncHandler = require("express-async-handler");

async function getUser(req, res) {
  res.status(200).json({ user: req.user });
}

const userController = {
  getUser: asyncHandler(getUser),
};

module.exports = { userController };
