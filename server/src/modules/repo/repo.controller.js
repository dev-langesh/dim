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

async function bitbucketOauthCallback(req, res) {
  await repoService.bitbucketOauthCallback(req.query.code, req.user._id);

  return res.json({});
}

async function gitlabOauthCallback(req, res) {
  await repoService.gitlabOauthCallback(req.query.code, req.user._id);

  return res.json({});
}

async function getGitRepos(req, res) {
  const sRes = await repoService.getGitRepos(req.user._id, req.query.q);
  return res.json(sRes);
}

async function getRepo(req, res) {
  const sRes = await repoService.getRepoByUserId(req.user._id);
  return res.json(sRes);
}

async function getConnectionStatus(req, res) {
  const sRes = await repoService.getConnectionStatus(req.user._id);
  return res.json(sRes);
}

async function getRepoBranches(req, res) {
  const sRes = await repoService.getRepoBranches({
    userId: req.user._id,
    ...req.query,
  });
  return res.json(sRes);
}

async function getRepoContents(req, res) {
  const sRes = await repoService.getRepoContents({
    userId: req.user._id,
    ...req.query,
  });
  return res.json(sRes);
}

const repoController = {
  githubOauthCallback: asyncHandler(githubOauthCallback),
  githubInstallAppCallback: asyncHandler(githubInstallAppCallback),
  bitbucketOauthCallback: asyncHandler(bitbucketOauthCallback),
  gitlabOauthCallback: asyncHandler(gitlabOauthCallback),
  getGitRepos: asyncHandler(getGitRepos),
  getRepo: asyncHandler(getRepo),
  getConnectionStatus: asyncHandler(getConnectionStatus),
  getRepoBranches: asyncHandler(getRepoBranches),
  getRepoContents: asyncHandler(getRepoContents),
};

module.exports = { repoController };
