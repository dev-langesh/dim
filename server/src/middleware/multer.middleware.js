const multer = require("multer");
const path = require("path");
const { config } = require("../config/constants");
const { uuid } = require("../lib/uuid");
const { fsService } = require("../lib/fs/fs.service");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = req.header("x-upload-path")
      ? path.join(process.cwd(), req.header("x-upload-path"))
      : config.fileUploadPath;

    await fsService.createDirectoryIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuid(16)}${ext}`;
    cb(null, uniqueName);
  },
});

// Allow only .zip, .tar, .pem
const fileFilter = (req, file, cb) => {
  const allowedTypes = /\.(zip|tar|pem|png|jpg)$/i;
  const isValid = allowedTypes.test(path.extname(file.originalname));
  if (isValid) cb(null, true);
  else cb(new Error("Only .zip, .tar, and .pem files are allowed!"));
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// Export reusable middlewares
module.exports = {
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount = 5) =>
    upload.array(fieldName, maxCount),
  uploadFields: (fields) => upload.fields(fields),
};
