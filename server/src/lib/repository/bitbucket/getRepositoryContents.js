const { ConnectRepoErrors } = require("../../../errors/connectRepoErrors");
const { AppError } = require("../../../utils/error");
const { bitbucketApi } = require("./bitbucketApi");

async function getRepositoryContents({
  accessToken,
  repository,
  path,
  branch,
}) {
  const url = `/repositories/${repository}/src/${encodeURIComponent(
    branch || "HEAD"
  )}/${path || ""}`;

  try {
    const res = await bitbucketApi.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const values = res.data.values || [];
    if (values.length === 0 && !path) {
      throw new AppError(ConnectRepoErrors.EMPTY_REPO);
    }

    return values.map((item) => ({
      name: item.path.replace(/^.*\//, ""),
      type: item.type,
      path: item.path,
    }));
  } catch (e) {
    console.log(e.response?.data);
    if (e.response?.data?.error?.message.startsWith("No such file")) {
      throw new AppError(ConnectRepoErrors.REPO_PATH_NOT_FOUND);
    }
    if (e.response?.data?.error?.message.startsWith("Commit not found")) {
      throw new AppError(ConnectRepoErrors.REPO_BRANCH_NOT_FOUND);
    }
    if (e.response?.status === 404) {
      throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);
    }
    return [];
  }
}

module.exports = { getRepositoryContents };
