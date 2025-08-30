const { getAccessToken } = require("./getAccessToken");
const { getRepositories } = require("./getRepositories");
const { getRepositoryBranches } = require("./getRepositoryBranches");
const { getRepositoryContents } = require("./getRepositoryContents");
const { getUser } = require("./getUser");
const { rotateTokens } = require("./rotateTokens");

const gitlabService = {
  getAccessToken,
  getUser,
  getRepositories,
  rotateTokens,
  getRepositoryBranches,
  getRepositoryContents,
};

module.exports = { gitlabService };
