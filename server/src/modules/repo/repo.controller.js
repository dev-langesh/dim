const { repoService } = require("./repo.service");
const asyncHandler = require("express-async-handler");

async function githubOauthCallback(req, res) {
  await repoService.githubOauthCallback(req.query.code, req.user._id);

  return res.json({});
}

async function githubInstallAppCallback(req, res) {
  const sRes = await repoService.githubInstallAppCallback(
    req.query.installation_id,
    req.user._id
  );

  return res.json(sRes);
}

async function getGitRepos(req, res) {
  const sRes = await repoService.getGitRepos(req.user._id);
  return res.json(sRes);
}

async function getRepo(req, res) {
  const sRes = await repoService.getRepo(req.user._id);
  return res.json(sRes);
}

const repoController = {
  githubOauthCallback: asyncHandler(githubOauthCallback),
  githubInstallAppCallback: asyncHandler(githubInstallAppCallback),
  getGitRepos: asyncHandler(getGitRepos),
  getRepo: asyncHandler(getRepo),
};

module.exports = { repoController };
