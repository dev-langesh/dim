const { config } = require("dotenv");
const path = require("path");
const { fsService } = require("../lib/fs/fs.service");

async function init() {
  const rootPath = process.cwd();

  const deployGroundPath =
    config.deployGroundPath || path.join(rootPath, "deployGround");

  await fsService.createDirectoryIfNotExists(deployGroundPath);

  const fileUploadPath =
    config.fileUploadPath || path.join(rootPath, "uploads");

  await fsService.createDirectoryIfNotExists(fileUploadPath);
}

module.exports = {
  init,
};
