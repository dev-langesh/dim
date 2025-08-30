const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { githubApi } = require("./githubApi");

async function getUser(accessToken) {
  try {
    const res = await githubApi.get("/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return res.data;
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_USER);
  }
}

module.exports = { getUser };
