const axios = require("axios");
const { env } = require("../../../config/env");

const gitlabApi = axios.create({
  baseURL: env.GITLAB_API_URL,
});

module.exports = { gitlabApi };
