const axios = require("axios");
const { env } = require("../../../config/env");
const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");

async function rotateTokens(refreshToken) {
  try {
    const res = await axios.post(
      "https://bitbucket.org/site/oauth2/access_token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        auth: {
          username: env.BITBUCKET_CLIENT_ID,
          password: env.BITBUCKET_CLIENT_SECRET,
        },
      }
    );

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  } catch (error) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_REFRESH_TOKEN);
  }
}

module.exports = {
  rotateTokens,
};
