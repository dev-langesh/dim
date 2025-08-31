const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { githubApi } = require("./githubApi");

async function getRepositories({ accessToken, username, query }) {
  try {
    const repos = await githubApi.get(
      "/search/repositories?" +
        new URLSearchParams({
          q: `${query || ""} in:name user:${username}`,
          sort: "updated",
          order: "desc",
        }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return repos.data.items.map((r) => `${r.full_name}`);
  } catch (e) {
    throw new AppError(ConnectRepoErrors.FAILED_TO_FETCH_REPOS);
  }
}

module.exports = { getRepositories };
