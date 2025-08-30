const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { getOctokitInstance } = require("./getOctokitInstance");

async function getRepositoryContents({
  installationId,
  repository,
  path,
  branch,
}) {
  const [owner, repoName] = repository.split("/");
  const octokit = await getOctokitInstance(installationId);

  try {
    const res = await octokit.request(
      `GET /repos/${owner}/${repoName}/contents/${path || ""}`,
      {
        ref: branch,
      }
    );

    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      throw new AppError(ConnectRepoErrors.EMPTY_REPO);
    }

    return (Array.isArray(res.data) ? res.data : [res.data]).map((item) => ({
      name: item.name,
      type: item.type, 
      path: item.path,
    }));
  } catch (e) {
    if (e.response?.data?.message.startsWith("No commit found for the ref")) {
      throw new AppError(ConnectRepoErrors.REPO_BRANCH_NOT_FOUND);
    }
    if (e.status === 404) {
      if (!path) throw new AppError(ConnectRepoErrors.EMPTY_REPO);
      throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);
    }
    return [];
  }
}

module.exports = { getRepositoryContents };
