const { Octokit } = require("@octokit/rest");
const { env } = require("../../../config/env");
const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");

const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");

const octokit = new Octokit({
  authStrategy: createOAuthAppAuth,
  auth: {
    clientType: "oauth-app",
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  },
});

async function revokeOAuthAppToken(accessToken) {
  try {
    await octokit.request(
      `DELETE /applications/${env.GITHUB_CLIENT_ID}/token`,
      {
        access_token: accessToken,
      }
    );
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_REVOKE_TOKEN);
  }
}

module.exports = { revokeOAuthAppToken };
