import { protectedApi } from "./axios";

export const repoApi = {
  githubOauthCallback: (q) =>
    protectedApi.get("/repos/github/oauth/callback/?" + q),
  githubInstallAppCallback: (q) =>
    protectedApi.get("/repos/github/install-app/callback/?" + q),
  bitbucketOauthCallback: (q) =>
    protectedApi.get("/repos/bitbucket/oauth/callback/?" + q),
  gitlabOauthCallback: (q) =>
    protectedApi.get("/repos/gitlab/oauth/callback/?" + q),
  getGitRepos: (q) => protectedApi.get(`/repos/git/?${q}`),
  getRepoConnectionStatus: () => protectedApi.get(`/repos/connection-status`),
  getRepoBranches: (q) => protectedApi.get(`/repos/git/branches/?${q}`),
  getRepoContents: (q) => protectedApi.get(`/repos/git/contents/?${q}`),
  switchGitProvider: (payload) =>
    protectedApi.put(`/repos/switch-provider`, payload),
};
