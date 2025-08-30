const axios = require("axios");
const { env } = require("../../../config/env");
const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");

async function getAccessToken(code) {
  try {
    const res = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_ACCESS_TOKEN);
  }
}

module.exports = { getAccessToken };
