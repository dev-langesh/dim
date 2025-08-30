const { getAccessToken } = require("./getAccessToken");
const { getOctokitInstance } = require("./getOctokitInstance");
const { getRepositories } = require("./getRepositories");
const { getRepositoryBranches } = require("./getRepositoryBranches");
const { getRepositoryContents } = require("./getRepositoryContents");
const { getUser } = require("./getUser");

const githubService = {
  getAccessToken,
  getUser,
  getOctokitInstance,
  getRepositories,
  getRepositoryBranches,
  getRepositoryContents,
};

module.exports = { githubService };
