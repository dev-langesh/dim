const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { bitbucketApi } = require("./bitbucketApi");

async function getUser(accessToken) {
  try {
    const res = await bitbucketApi.get("/user", {
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
