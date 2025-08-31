const axios = require("axios");
const { env } = require("../../../config/env");

const githubApi = axios.create({
  baseURL: env.GITHUB_API_URL,
  headers: {
    Accept: "application/vnd.github+json",
  },
});

module.exports = { githubApi };
