const asyncHandler = require("express-async-handler");
const path = require("path");
const { fsService } = require("../../lib/fs/fs.service");

function uploadFile(req, res) {
  console.log(req.body.path)
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const ext = path.extname(file.originalname);

  if(ext === ".pem") fsService.chmod(file.path, 0o400);

  res.status(200).send({
    message: "File uploaded successfully",
    file: {
      filename: file.filename,
      path: file.path,
    },
  });
}

const fileController = {
  uploadFile: asyncHandler(uploadFile),
};

module.exports = fileController;
