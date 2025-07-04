const router = require("express").Router();
const { validateInput } = require("../../middleware/validateInput.middleware");
const { deployController } = require("./deploy.controller");
const { deployInputSchema } = require("./deploy.inputSchema");

router.post(
  "/check-os",
  validateInput(deployInputSchema.checkOsSchema),
  deployController.checkOS
);

router.post(
  "/",
  validateInput(deployInputSchema.checkOsSchema), // Assuming the same schema is used for deployment
  deployController.deployApplication
);

module.exports = {
  deployRouter: router,
};
