const DeployPipelineErrors = {
  SSH_AUTHENTICATION_FAILED: {
    errorCode: 3001,
    message: "SSH authentication failed. Please check your credentials.",
    statusCode: 401,
  },
  SSH_CONNECTION_FAILED: {
    errorCode: 3002,
    message: "SSH connection failed. Please check the server address and port.",
    statusCode: 500,
  },
  UNSUPPORTED_OS: {
    errorCode: 3003,
    message: "Unsupported operating system.",
    statusCode: 400,
  },
  UNSUPPORTED_DISTRIBUTION: {
    errorCode: 3004,
    message: "Unsupported distribution.",
    statusCode: 400,
  },
  SSH_PRIVATE_KEY_NOT_FOUND: {
    errorCode: 3005,
    message: "SSH private key file not found.",
    statusCode: 404,
  },
  SSH_COMMAND_FAILED: {
    errorCode: 3006,
    message: "Failed to execute SSH command.",
    statusCode: 500,
  },
  DEPLOYMENT_FAILED: {
    errorCode: 3007,
    message: "Deployment failed. Please check the logs for more details.",
    statusCode: 500,
  },
};

module.exports = { DeployPipelineErrors };
