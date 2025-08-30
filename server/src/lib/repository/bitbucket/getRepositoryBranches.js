const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { bitbucketApi } = require("./bitbucketApi");

async function getRepositoryBranches({ accessToken, repository }) {
  try {
    const url = `/repositories/${repository}/refs/branches`;

    const res = await bitbucketApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.values;
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_REPOSITORY_BRANCHES);
  }
}

module.exports = {
  getRepositoryBranches,
};
