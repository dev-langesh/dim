const { Octokit } = require("@octokit/rest");
const { createAppAuth } = require("@octokit/auth-app");
const fs = require("fs/promises");
const { env } = require("../../../config/env");
const { config } = require("../../../config/constants");

async function getOctokitInstance(installationId) {
  const appId = env.GITHUB_APP_ID;
  const privateKey = await fs.readFile(
    config.GITHUB_APP_PRIVATE_KEY_PATH,
    "utf8"
  );

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });
}

module.exports = { getOctokitInstance };
