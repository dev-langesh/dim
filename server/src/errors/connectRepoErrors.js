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
};

module.exports = { ConnectRepoErrors };
