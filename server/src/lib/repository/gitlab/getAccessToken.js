const { default: axios } = require("axios");
const { env } = require("../../../config/env");
const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");

async function getAccessToken(code) {
  try {
    const res = await axios.post("https://gitlab.com/oauth/token", {
      client_id: env.GITLAB_CLIENT_ID,
      client_secret: env.GITLAB_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: env.GITLAB_CALLBACK_URL,
    });

    return res.data;
  } catch (error) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_ACCESS_TOKEN);
  }
}

module.exports = { getAccessToken };
