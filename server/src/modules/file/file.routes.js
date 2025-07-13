const { uploadSingle } = require("../../middleware/multer.middleware");
const fileController = require("./file.controller");

const router = require("express").Router();

router.post("/", uploadSingle("file"), fileController.uploadFile);

module.exports = {
  fileRouter: router,
};
