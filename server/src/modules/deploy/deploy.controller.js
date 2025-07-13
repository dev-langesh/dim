const { uuid } = require("../../lib/uuid");
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

async function generateAppId(req, res) {
  const appId = await uuid(req.query.length ? parseInt(req.query.length) : 7);
  res.json({ appId });
}

const deployController = {
  checkOS: asyncHandler(checkOS),
  deployApplication: asyncHandler(deployApplication),
  generateAppId: asyncHandler(generateAppId),
};

module.exports = {
  deployController,
};
