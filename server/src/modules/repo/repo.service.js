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

async function updateRepoById(repoId, host, data) {
  const repo = await Repo.findById(repoId);
  if (!repo) throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);

  repo[host] = {
    ...repo[host],
    ...data,
  };
  await repo.save();
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

async function bitbucketOauthCallback(code, userId) {
  const tokenRes = await axios.post(
    "https://bitbucket.org/site/oauth2/access_token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.BITBUCKET_CALLBACK_URL,
    }),
    {
      auth: {
        username: env.BITBUCKET_CLIENT_ID,
        password: env.BITBUCKET_CLIENT_SECRET,
      },
    }
  );

  console.log(tokenRes.data);

  const accessToken = tokenRes.data.access_token;
  const refreshToken = tokenRes.data.refresh_token;

  // Fetch user info
  const userRes = await axios.get("https://api.bitbucket.org/2.0/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  await createRepo("bitbucket", {
    userId,
    username: userRes.data.username,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  return;
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

async function refreshBitbucketToken(refreshToken) {
  try {
    const tokenRes = await axios.post(
      "https://bitbucket.org/site/oauth2/access_token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        auth: {
          username: env.BITBUCKET_CLIENT_ID,
          password: env.BITBUCKET_CLIENT_SECRET,
        },
      }
    );

    return {
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
    };
  } catch (error) {
    console.error("Error refreshing Bitbucket token:", error);
    throw new AppError(ConnectRepoErrors.FAILED_TO_REFRESH_TOKEN);
  }
}

async function getBitbucketRepos({
  accessToken,
  refreshToken,
  query,
  workspace,
  repoId,
}) {
  const q = query ? `name ~ "${query}"` : "";
  const sort = "-updated_on";

  let url = `https://api.bitbucket.org/2.0/repositories/${
    workspace || ""
  }?role=member&sort=${sort}`;
  if (q) {
    url += `&q=${encodeURIComponent(q)}`;
  }

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.values.map((repo) => repo.full_name);
  } catch (error) {
    console.log(error.response);
    try {
      const tokens = await refreshBitbucketToken(refreshToken);

      await updateRepoById(repoId, "bitbucket", {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      return res.data.values.map((repo) => repo.full_name);
    } catch (e) {
      throw new AppError(ConnectRepoErrors.REFRESH_TOKEN_EXPIRED);
    }
  }
}

async function getGitRepos(userId, query, host) {
  const repo = await getRepo(userId);

  if (
    host === "bitbucket" &&
    repo.bitbucket?.accessToken &&
    repo.bitbucket?.username
  ) {
    return await getBitbucketRepos({
      accessToken: repo.bitbucket?.accessToken,
      refreshToken: repo.bitbucket?.refreshToken,
      query,
      repoId: repo._id,
    });
  } else if (
    host === "github" &&
    repo.github?.installationId &&
    repo.github?.username
  ) {
    return await getGithubRepos({ ...repo.github, query });
  } else {
    throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
  }
}

async function getConnectionStatus(userId) {
  const repo = await getRepo(userId);

  if (
    !repo.github?.installationId &&
    !repo.github?.username &&
    !repo.bitbucket?.accessToken
  ) {
    throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
  }
  return { connected: true, repo };
}

const repoService = {
  githubOauthCallback,
  bitbucketOauthCallback,
  githubInstallAppCallback,
  getGitRepos,
  getRepo,
  getConnectionStatus,
};

module.exports = { repoService };
