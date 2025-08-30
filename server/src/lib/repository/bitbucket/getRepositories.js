const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { bitbucketApi } = require("./bitbucketApi");
const { rotateTokens } = require("./rotateTokens");

async function getRepositories({
  accessToken,
  refreshToken,
  query,
  workspace,
}) {
  const q = query ? `name ~ "${query}"` : "";
  const sort = "-updated_on";

  let url = `/repositories/${workspace || ""}?role=member&sort=${sort}`;
  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  try {
    const res = await bitbucketApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      repositories: res.data.values.map((repo) => repo.full_name),
    };
  } catch (error) {
    try {
      const tokens = await rotateTokens(refreshToken);

      const res = await bitbucketApi.get(url, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      return {
        repositories: res.data.values.map((repo) => repo.full_name),
        rotateTokens: tokens,
      };
    } catch (e) {
      throw new AppError(ConnectRepoErrors.REFRESH_TOKEN_EXPIRED);
    }
  }
}

module.exports = {
  getRepositories,
};
