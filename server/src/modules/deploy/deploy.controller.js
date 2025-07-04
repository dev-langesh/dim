const { deployService } = require("./deploy.service");
const asyncHandler = require("express-async-handler");

async function checkOS(req, res) {
  const data = req.body;

  const sRes = await deployService.checkOS(data);

  res.json(sRes);
}

async function deployApplication(req, res) {
  const data = req.body;
  const sRes = await deployService.deployApplication(data);
  res.json(sRes);
}

const deployController = {
  checkOS: asyncHandler(checkOS),
  deployApplication: asyncHandler(deployApplication),
};

module.exports = {
  deployController,
};
