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
  if (!repo) {
    repo = await Repo.create({
      user: data.userId,
      [remoteRepo]: data,
    });
  } else {
    const hosts = ["github", "bitbucket", "gitlab"];
    repo[remoteRepo] = {
      ...repo[remoteRepo],
      ...data,
    };

    hosts.forEach((host) => {
      if (host !== remoteRepo) {
        repo[host] = null;
      }
    });
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

async function getRepoByUserId(userId) {
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

async function gitlabOauthCallback(code, userId) {
  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post("https://gitlab.com/oauth/token", {
      client_id: env.GITLAB_CLIENT_ID,
      client_secret: env.GITLAB_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: env.GITLAB_CALLBACK_URL,
    });

    const accessToken = tokenRes.data.access_token;
    const refreshToken = tokenRes.data.refresh_token;

    // 2. Fetch user profile
    const userRes = await axios.get("https://gitlab.com/api/v4/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { username } = userRes.data;

    // 3. Save/update in Repo collection
    await createRepo("gitlab", {
      userId,
      accessToken,
      refreshToken,
      username,
    });

    return;
  } catch (e) {
    console.error("GitLab OAuth error:", e.response?.data || e.message);
  }
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

async function refreshGitlabToken(refreshToken) {
  try {
    const tokenRes = await axios.post("https://gitlab.com/oauth/token", {
      client_id: env.GITLAB_CLIENT_ID,
      client_secret: env.GITLAB_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: env.GITLAB_CALLBACK_URL,
    });

    return {
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
    };
  } catch (error) {
    throw new AppError(ConnectRepoErrors.REFRESH_TOKEN_EXPIRED);
  }
}

async function getGitlabRepos({ accessToken, refreshToken, repoId, query }) {
  let url = `https://gitlab.com/api/v4/projects?membership=true&order_by=last_activity_at&sort=desc`;

  if (query) {
    url += `&search=${encodeURIComponent(query)}`;
  }

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data.map((repo) => repo.path_with_namespace);
  } catch (error) {
    try {
      const tokens = await refreshGitlabToken(refreshToken);

      await updateRepoById(repoId, "gitlab", {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      return res.data.map((repo) => repo.path_with_namespace);
    } catch (e) {
      throw new AppError(ConnectRepoErrors.REFRESH_TOKEN_EXPIRED);
    }
  }
}

async function getGitRepos(userId, query) {
  const repo = await getRepoByUserId(userId);
  if (repo.github?.installationId && repo.github?.username) {
    return await getGithubRepos({ ...repo.github, query });
  } else if (repo.bitbucket?.accessToken && repo.bitbucket?.username) {
    return await getBitbucketRepos({
      accessToken: repo.bitbucket?.accessToken,
      refreshToken: repo.bitbucket?.refreshToken,
      query,
      repoId: repo._id,
    });
  } else if (repo.gitlab?.accessToken && repo.gitlab?.username) {
    return await getGitlabRepos({
      accessToken: repo.gitlab?.accessToken,
      refreshToken: repo.gitlab?.refreshToken,
      query,
      repoId: repo._id,
    });
  } else {
    throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
  }
}

async function getConnectionStatus(userId) {
  const repo = await getRepoByUserId(userId);

  if (
    !repo.github?.installationId &&
    !repo.github?.username &&
    !repo.bitbucket?.accessToken &&
    !repo.gitlab?.accessToken
  ) {
    throw new AppError(ConnectRepoErrors.REPO_NOT_CONNECTED);
  }
  return { connected: true, repo };
}

async function getGithubBranches({ installationId, repository }) {
  const [owner, repoName] = repository.split("/");
  const octokit = await getOctokitInstance(installationId);

  const res = await octokit.request(`GET /repos/${repository}/branches`, {
    owner,
    repo: repoName,
  });

  return res.data.map((branch) => branch.name);
}

async function getGitlabBranches({ accessToken, repository }) {
  const encodedRepo = encodeURIComponent(repository);

  const url = `https://gitlab.com/api/v4/projects/${encodedRepo}/repository/branches`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return res.data.map((branch) => branch.name);
}

async function getBitbucketBranches({ accessToken, repository }) {
  const url = `https://api.bitbucket.org/2.0/repositories/${repository}/refs/branches`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return res.data.values.map((branch) => branch.name);
}

async function getRepoBranches({ provider, userId, repository }) {
  const repo = await getRepoByUserId(userId);
  switch (provider.toLowerCase()) {
    case "github":
      return await getGithubBranches({
        installationId: repo.github?.installationId,
        repository,
      });
    case "gitlab":
      return await getGitlabBranches({
        accessToken: repo.gitlab?.accessToken,
        repository,
      });
    case "bitbucket":
      return await getBitbucketBranches({
        accessToken: repo.bitbucket?.accessToken,
        repository,
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// ---------- GitHub ----------
async function getGithubContents({ installationId, repository, path, branch }) {
  const [owner, repoName] = repository.split("/");
  const octokit = await getOctokitInstance(installationId);

  try {
    const res = await octokit.request(`GET /repos/${owner}/${repoName}/contents/${path || ""}`, {
      ref: branch || "main",
    });

    // If repo is empty, GitHub returns an array or object differently
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      throw new AppError(ConnectRepoErrors.EMPTY_REPO);
    }

    return (Array.isArray(res.data) ? res.data : [res.data]).map((item) => ({
      name: item.name,
      type: item.type, // "file" or "dir"
      path: item.path,
    }));
  } catch (e) {
    console.log(e.response?.data)
    if (e.response?.data?.message.startsWith("No commit found for the ref")) {
      throw new AppError(ConnectRepoErrors.REPO_BRANCH_NOT_FOUND);
    }
    if (e.status === 404) {
      if (!path) throw new AppError(ConnectRepoErrors.EMPTY_REPO);
      throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);
    }
    return [];
  }
}

// ---------- GitLab ----------
async function getGitlabContents({ accessToken, repository, path, branch }) {
  const encodedRepo = encodeURIComponent(repository);
  const url = `https://gitlab.com/api/v4/projects/${encodedRepo}/repository/tree?path=${encodeURIComponent(
    path || ""
  )}&ref=${branch || "main"}`;

  try {
    const res = await axios.get(url, {
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
    } if (
      e.response?.data?.message === "404 invalid revision or path Not Found"
    ) {
      throw new AppError(ConnectRepoErrors.REPO_PATH_NOT_FOUND);
    }
    return [];
  }
}

// ---------- Bitbucket ----------
async function getBitbucketContents({ accessToken, repository, path, branch }) {
  const url = `https://api.bitbucket.org/2.0/repositories/${repository}/src/${
    encodeURIComponent(branch || "HEAD")
  }/${path || ""}`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const values = res.data.values || [];
    if (values.length === 0 && !path) {
      throw new AppError(ConnectRepoErrors.EMPTY_REPO);
    }

    return values.map((item) => ({
      name: item.path.replace(/^.*\//, ""),
      type: item.type, // "commit_file" or "directory"
      path: item.path,
    }));
  } catch (e) {
    console.log(e.response?.data)
    if(e.response?.data?.error?.message.startsWith("No such file")) { throw new AppError(ConnectRepoErrors.REPO_PATH_NOT_FOUND);}
    if (e.response?.data?.error?.message.startsWith("Commit not found")) {
      throw new AppError(ConnectRepoErrors.REPO_BRANCH_NOT_FOUND);
    }
    if (e.response?.status === 404) {
      throw new AppError(ConnectRepoErrors.REPO_NOT_FOUND);
    }
    return [];
  }
}

async function getRepoContents({
  userId,
  provider,
  repository,
  path = "",
  returnFormat = "all",
  branch,
}) {
  const repo = await getRepoByUserId(userId);

  let contents;
  switch (provider.toLowerCase()) {
    case "github":
      contents = await getGithubContents({
        installationId: repo.github?.installationId,
        repository,
        path,
        branch,
      });
      break;
    case "gitlab":
      contents = await getGitlabContents({
        accessToken: repo.gitlab?.accessToken,
        repository,
        path,
        branch,
      });
      break;
    case "bitbucket":
      contents = await getBitbucketContents({
        accessToken: repo.bitbucket?.accessToken,
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
};

module.exports = { repoService };
