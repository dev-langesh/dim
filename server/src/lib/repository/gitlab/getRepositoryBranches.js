const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { gitlabApi } = require("./gitlabApi");

async function getRepositoryBranches({ accessToken, repository }) {
  try {
    const encodedRepo = encodeURIComponent(repository);

    const url = `projects/${encodedRepo}/repository/branches`;
    const res = await gitlabApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data;
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_REPOSITORY_BRANCHES);
  }
}

module.exports = {
  getRepositoryBranches,
};
