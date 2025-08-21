const { validateInput } = require("../../middleware/validateInput.middleware");
const { validateToken } = require("../../middleware/validateToken.middleware");
const { repoController } = require("./repo.controller");
const { repoInputSchema } = require("./repo.inputSchema");

const router = require("express").Router();

router.get("/", validateToken, repoController.getRepo);
router.get("/connection-status", validateToken, repoController.getConnectionStatus);
router.get("/:host", validateToken, repoController.getGitRepos);

router.get(
  "/github/oauth/callback",
  validateInput(repoInputSchema.githubCallbackSchema),
  validateToken,
  repoController.githubOauthCallback
);

router.get(
  "/bitbucket/oauth/callback",
  validateToken,
  repoController.bitbucketOauthCallback
);

router.get(
  "/github/install-app/callback",
  validateToken,
  repoController.githubInstallAppCallback
);

module.exports = { repoRouter: router };
