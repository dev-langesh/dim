const { getAccessToken } = require("./getAccessToken");
const { getRepositories } = require("./getRepositories");
const { getRepositoryBranches } = require("./getRepositoryBranches");
const { getRepositoryContents } = require("./getRepositoryContents");
const { getUser } = require("./getUser");

const githubService = {
  getAccessToken,
  getUser,
  getRepositories,
  getRepositoryBranches,
  getRepositoryContents,
};

module.exports = { githubService };
