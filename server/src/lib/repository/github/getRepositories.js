const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { getOctokitInstance } = require("./getOctokitInstance");

async function getRepositories({ installationId, username, query }) {
  try {
    const octokit = await getOctokitInstance(installationId);

    const repos = await octokit.request("GET /search/repositories", {
      q: `${query || ""} in:name user:${username}`,
      sort: "updated",
      order: "desc",
      per_page: 10,
    });

    return repos.data.items.map((r) => `${r.full_name}`);
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_FETCH_REPOS);
  }
}

module.exports = { getRepositories };
