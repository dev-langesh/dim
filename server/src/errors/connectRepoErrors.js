const ConnectRepoErrors = {
  REPO_NOT_CONNECTED: {
    errorCode: 4001,
    message: "Repository not connected.",
    statusCode: 400,
  },
  ACCESS_TOKEN_EXPIRED: {
    errorCode: 4002,
    message: "Access token expired.",
    statusCode: 401,
  },
  REFRESH_TOKEN_EXPIRED: {
    errorCode: 4003,
    message: "Refresh token expired.",
    statusCode: 401,
  },
  FAILED_TO_FETCH_REPOS: {
    errorCode: 4004,
    message: "Failed to fetch repositories.",
    statusCode: 500,
  },
  EMPTY_REPO: {
    errorCode: 4005,
    message: "Repository is empty.",
    statusCode: 400,
  },
  REPO_NOT_FOUND: {
    errorCode: 4006,
    message: "Repository not found.",
    statusCode: 404,
  },
  REPO_PATH_NOT_FOUND: {
    errorCode: 4007,
    message: "Repository path not found.",
    statusCode: 404,
  },
  REPO_BRANCH_NOT_FOUND: {
    errorCode: 4008,
    message: "Repository branch not found.",
    statusCode: 404,
  },
  FAILED_TO_GET_ACCESS_TOKEN: {
    errorCode: 4009,
    message: "Failed to get access token.",
    statusCode: 401,
  },
  FAILED_TO_GET_USER: {
    errorCode: 4010,
    message: "Failed to get user.",
    statusCode: 401,
  },
  FAILED_TO_GET_REPOSITORY_BRANCHES: {
    errorCode: 4011,
    message: "Failed to get repository branches.",
    statusCode: 401,
  },
  FAILED_TO_REVOKE_TOKEN: {
    errorCode: 4012,
    message: "Failed to revoke token",
    statusCode: 400,
  },
};

module.exports = { ConnectRepoErrors };
