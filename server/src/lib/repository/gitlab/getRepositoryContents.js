const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { gitlabApi } = require("./gitlabApi");

async function getRepositoryContents({
  accessToken,
  repository,
  path,
  branch,
}) {
  const encodedRepo = encodeURIComponent(repository);
  const url = `/projects/${encodedRepo}/repository/tree?path=${encodeURIComponent(
    path || ""
  )}&ref=${branch || "main"}`;

  try {
    const res = await gitlabApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.map((item) => ({
      name: item.name,
      type: item.type, // "tree" or "blob"
      path: item.path,
    }));
  } catch (e) {
    if (e.response?.data?.message === "404 Tree Not Found" && !path) {
      throw new AppError(ConnectRepoErrors.EMPTY_REPO);
    }
    if (e.response?.data?.message === "404 Project Not Found") {
      throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);
    }
    if (
      e.response?.data?.message === "404 invalid revision or path Not Found"
    ) {
      throw new AppError(ConnectRepoErrors.REPO_PATH_NOT_FOUND);
    }
    return [];
  }
}

module.exports = { getRepositoryContents };
