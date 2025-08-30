const { default: axios } = require("axios");
const { env } = require("../../../config/env");
const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");

async function getAccessToken(code) {
  try {
    const res = await axios.post(
      "https://bitbucket.org/site/oauth2/access_token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: env.BITBUCKET_CALLBACK_URL,
      }),
      {
        auth: {
          username: env.BITBUCKET_CLIENT_ID,
          password: env.BITBUCKET_CLIENT_SECRET,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_ACCESS_TOKEN);
  }
}

module.exports = { getAccessToken };
