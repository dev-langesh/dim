const axios = require("axios");
const fs = require("fs").promises;
const { config } = require("../../config/constants");
const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const { env } = require("../../config/env");
const { Repo } = require("./repo.model");
const { AppError } = require("../../utils/error");
const { ConnectRepoErrors } = require("../../errors/connectRepoErrors");

async function createRepo(remoteRepo, data) {
  let repo = await Repo.findOne({ user: data.userId });
  const payload = {
    ...repo[remoteRepo],
    ...data,
  };
  if (!repo) {
    repo = await Repo.create({
      user: data.userId,
      [remoteRepo]: payload,
    });
  } else {
    repo[remoteRepo] = payload;
    await repo.save();
  }
  return repo;
}

async function getRepo(userId) {
  const repo = await Repo.findOne({ user: userId });

  if (!repo) throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);

  return repo;
}

async function githubOauthCallback(code, userId) {
  const tokenRes = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const accessToken = tokenRes.data.access_token;

  const userRes = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  await createRepo("github", {
    userId,
    username: userRes.data.login,
  });

  return;
}

async function getOctokitInstance(installationId) {
  const appId = env.GITHUB_APP_ID;
  const privateKey = await fs.readFile(
    config.GITHUB_APP_PRIVATE_KEY_PATH,
    "utf8"
  );

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });
}

async function githubInstallAppCallback(installationId, userId) {
  const octokit = await getOctokitInstance(installationId);

  // Generate installation token
  const { token } = await octokit.auth({
    type: "installation",
  });

  const repo = await createRepo("github", {
    userId,
    token,
    installationId,
  });

  return repo;
}

async function getGithubRepos(data) {
  const octokit = await getOctokitInstance(data.installationId);

  const repos = await octokit.request("GET /search/repositories", {
    q: `${data.query || ""} in:name user:${data.username}`,
    sort: "updated", // or "pushed"
    order: "desc",
    per_page: 10,
  });
  return repos.data.items.map((r) => `${r.full_name}`);
}

async function getGitRepos(userId, query) {
  const repo = await getRepo(userId);
  if (repo.github?.installationId && repo.github?.username)
    return await getGithubRepos({ ...repo.github, query });
  else throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
}

const repoService = {
  githubOauthCallback,
  githubInstallAppCallback,
  getGitRepos,
  getRepo,
};

module.exports = { repoService };
