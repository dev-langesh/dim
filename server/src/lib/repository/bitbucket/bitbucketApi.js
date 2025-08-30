const axios = require("axios");
const { env } = require("../../../config/env");

const bitbucketApi = axios.create({
  baseURL: env.BITBUCKET_API_URL,
});

module.exports = { bitbucketApi };
