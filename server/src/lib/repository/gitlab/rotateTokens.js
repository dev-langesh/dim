const axios = require("axios");
const { env } = require("../../../config/env");
const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");

async function rotateTokens(refreshToken) {
  try {
    const tokenRes = await axios.post("https://gitlab.com/oauth/token", {
      client_id: env.GITLAB_CLIENT_ID,
      client_secret: env.GITLAB_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: env.GITLAB_CALLBACK_URL,
    });

    return {
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
    };
  } catch (error) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_REFRESH_TOKEN);
  }
}

module.exports = {
  rotateTokens,
};
