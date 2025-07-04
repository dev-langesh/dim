const { validateToken } = require("../../middleware/validateToken.middleware");
const { userController } = require("./user.controller");

const router = require("express").Router();

router.get("/profile", validateToken, userController.getUser);

module.exports = { userRouter: router };
