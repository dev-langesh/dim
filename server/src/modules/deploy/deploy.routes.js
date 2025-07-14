const router = require("express").Router();
const { validateInput } = require("../../middleware/validateInput.middleware");
const { deployController } = require("./deploy.controller");
const { deployInputSchema } = require("./deploy.inputSchema");

router.get("/app-id", deployController.generateAppId);

router.post(
  "/check-os",
  validateInput(deployInputSchema.checkOsSchema),
  deployController.checkOS
);

router.post("/", deployController.deployApplication);

module.exports = {
  deployRouter: router,
};
