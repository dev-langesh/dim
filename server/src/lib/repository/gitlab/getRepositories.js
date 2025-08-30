const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { gitlabApi } = require("./gitlabApi");
const { rotateTokens } = require("./rotateTokens");

async function getRepositories({ accessToken, refreshToken, query }) {
  let url = `/projects?membership=true&order_by=last_activity_at&sort=desc`;

  if (query) {
    url += `&search=${encodeURIComponent(query)}`;
  }

  try {
    const res = await gitlabApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      repositories: res.data.map((repo) => repo.path_with_namespace),
    };
  } catch (error) {
    try {
      const tokens = await rotateTokens(refreshToken);

      const res = await gitlabApi.get(url, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      return {
        rotateTokens: tokens,
        repositories: res.data.map((repo) => repo.path_with_namespace),
      };
    } catch (e) {
      throw new AppError(ConnectRepoErrors.REFRESH_TOKEN_EXPIRED);
    }
  }
}

module.exports = {
  getRepositories,
};
