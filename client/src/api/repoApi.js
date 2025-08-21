import { protectedApi } from "./axios";

export const repoApi = {
  githubOauthCallback: (q) =>
    protectedApi.get("/repos/github/oauth/callback/?" + q),
  githubInstallAppCallback: (q) =>
    protectedApi.get("/repos/github/install-app/callback/?" + q),
  bitbucketOauthCallback: (q) =>
    protectedApi.get("/repos/bitbucket/oauth/callback/?" + q),
  getGitRepos: (param, q) => protectedApi.get(`/repos/${param}/?${q}`),
};
