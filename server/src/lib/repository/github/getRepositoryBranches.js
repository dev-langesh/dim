const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { githubApi } = require("./githubApi");

async function getRepositoryBranches({ accessToken, repository }) {
  try {
    const res = await githubApi.get(`/repos/${repository}/branches`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_REPOSITORY_BRANCHES);
  }
}

module.exports = { getRepositoryBranches };
