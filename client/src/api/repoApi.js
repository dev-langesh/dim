import { protectedApi } from "./axios";

export const repoApi = {
  githubOauthCallback: (q) =>
    protectedApi.get("/repos/github/oauth/callback/?" + q),
  githubInstallAppCallback: (q) =>
    protectedApi.get("/repos/github/install-app/callback/?" + q),
  getGitRepos: () => protectedApi.get("/repos/git"),
};
