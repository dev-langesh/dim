const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { getOctokitInstance } = require("./getOctokitInstance");

async function getRepositoryBranches({ installationId, repository }) {
  try {
    const [owner, repoName] = repository.split("/");
    const octokit = await getOctokitInstance(installationId);

    const res = await octokit.request(`GET /repos/${repository}/branches`, {
      owner,
      repo: repoName,
    });

    return res.data;
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_GET_REPOSITORY_BRANCHES);
  }
}

module.exports = { getRepositoryBranches };
