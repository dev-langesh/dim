const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { gitlabApi } = require("./gitlabApi");

async function getUser(accessToken) {
  try {
    const res = await gitlabApi.get("/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_USER);
  }
}

module.exports = { getUser };
