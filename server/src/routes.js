const { authRouter } = require("./modules/auth/auth.routes");
const { deployRouter } = require("./modules/deploy/deploy.routes");
const { fileRouter } = require("./modules/file/file.routes");
const { userRouter } = require("./modules/user/user.routes");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/deploy", deployRouter);
router.use("/files", fileRouter);

module.exports = { apiRouter: router };
