const { Repo } = require("./repo.model");
const { AppError } = require("../../utils/error");
const { ConnectRepoErrors } = require("../../errors/connectRepoErrors");
const { githubService } = require("../../lib/repository/github/github.service");
const {
  bitbucketService,
} = require("../../lib/repository/bitbucket/bitbucket.service");
const { gitlabService } = require("../../lib/repository/gitlab/gitlab.service");

async function createRepo(provider, data) {
  let repo = await Repo.findOne({ user: data.userId });
  if (!repo) {
    repo = await Repo.create({
      user: data.userId,
      currentProvider: provider,
      [provider]: data,
    });
  } else {
    repo[provider] = {
      ...repo[provider],
      ...data,
    };
    repo.currentProvider = provider;
    await repo.save();
  }
  return repo;
}

async function updateRepoById(repoId, provider, data) {
  const repo = await Repo.findById(repoId);
  if (!repo) throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);

  repo[provider] = {
    ...repo[provider],
    ...data,
  };
  await repo.save();
  return repo;
}

async function getRepoByUserId(userId) {
  const repo = await Repo.findOne({ user: userId });

  if (!repo) throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);

  return repo;
}

async function githubOauthCallback(code, userId) {
  const token = await githubService.getAccessToken(code);

  const user = await githubService.getUser(token.access_token);

  await createRepo("github", {
    userId,
    username: user.login,
    accessToken: token.access_token,
  });
}

async function githubInstallAppCallback(installationId, userId) {
  await createRepo("github", {
    userId,
    installationId,
  });
}

async function bitbucketOauthCallback(code, userId) {
  const tokens = await bitbucketService.getAccessToken(code);

  const user = await bitbucketService.getUser(tokens.access_token);

  await createRepo("bitbucket", {
    userId,
    username: user.username,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  });
}

async function gitlabOauthCallback(code, userId) {
  const tokens = await gitlabService.getAccessToken(code);

  const user = await gitlabService.getUser(tokens.access_token);

  await createRepo("gitlab", {
    userId,
    username: user.username,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  });

  return;
}

async function getGitRepos({ userId, query }) {
  let res;
  const repo = await getRepoByUserId(userId);
  switch (repo.currentProvider) {
    case "github":
      const splitted = query.split("/");
      const payload = { ...repo.github, query };

      if (splitted.length === 2) {
        payload.username = splitted[0];
        payload.query = splitted[1];
      }

      return await githubService.getRepositories(payload);
    case "bitbucket":
      res = await bitbucketService.getRepositories({
        accessToken: repo.bitbucket?.accessToken,
        refreshToken: repo.bitbucket?.refreshToken,
        query,
      });

      if (res.rotateTokens) {
        await updateRepoById(repo._id, "bitbucket", {
          accessToken: res.rotateTokens.accessToken,
          refreshToken: res.rotateTokens.refreshToken,
        });
      }

      return res.repositories;

    case "gitlab":
      res = await gitlabService.getRepositories({
        accessToken: repo.gitlab?.accessToken,
        refreshToken: repo.gitlab?.refreshToken,
        query,
      });

      if (res.rotateTokens) {
        await updateRepoById(repo._id, "gitlab", {
          accessToken: res.rotateTokens.accessToken,
          refreshToken: res.rotateTokens.refreshToken,
        });
      }

      return res.repositories;
  }
}

async function getConnectionStatus(userId) {
  const repo = await getRepoByUserId(userId);

  if (!repo.currentProvider) {
    throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
  }
  return { connected: true, repo };
}

async function getRepoBranches({ provider, userId, repository }) {
  const repo = await getRepoByUserId(userId);
  let branches = [];
  switch (repo.currentProvider) {
    case "github":
      branches = await githubService.getRepositoryBranches({
        accessToken: repo.github?.accessToken,
        repository,
      });
      return branches.map((branch) => branch.name);
    case "bitbucket":
      branches = await bitbucketService.getRepositoryBranches({
        accessToken: repo.bitbucket?.accessToken,
        repository,
      });
      return branches.map((branch) => branch.name);
    case "gitlab":
      branches = await gitlabService.getRepositoryBranches({
        accessToken: repo.gitlab?.accessToken,
        repository,
      });
      return branches.map((branch) => branch.name);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function getRepoContents({
  userId,
  repository,
  path = "",
  returnFormat = "all",
  branch,
}) {
  const repo = await getRepoByUserId(userId);

  let contents;
  switch (repo.currentProvider) {
    case "github":
      contents = await githubService.getRepositoryContents({
        accessToken: repo.github?.accessToken,
        repository,
        path,
        branch,
      });
      break;
    case "bitbucket":
      contents = await bitbucketService.getRepositoryContents({
        accessToken: repo.bitbucket?.accessToken,
        repository,
        path,
        branch,
      });
      break;
    case "gitlab":
      contents = await gitlabService.getRepositoryContents({
        accessToken: repo.gitlab?.accessToken,
        repository,
        path,
        branch,
      });
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  if (returnFormat === "all") return contents;

  return contents.filter((item) => {
    if (returnFormat === "folders")
      return (
        item.type === "dir" || item.type === "tree" || item.type === "directory"
      );
    if (returnFormat === "files")
      return (
        item.type === "file" ||
        item.type === "blob" ||
        item.type === "commit_file"
      );
  });
}

async function switchGitProvider({ userId, newProvider }) {
  const repo = await getRepoByUserId(userId);

  if (!repo[newProvider]) {
    throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
  }

  repo.currentProvider = newProvider;
  await repo.save();

  return repo;
}

const repoService = {
  githubOauthCallback,
  bitbucketOauthCallback,
  githubInstallAppCallback,
  getGitRepos,
  getRepoByUserId,
  getConnectionStatus,
  gitlabOauthCallback,
  getRepoBranches,
  getRepoContents,
  switchGitProvider,
};

module.exports = { repoService };
