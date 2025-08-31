const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  github: {
    accessToken: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  bitbucket: {
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  gitlab: {
    accessToken: String,
    refreshToken: String,
    username: String,
  },
});

const Repo = mongoose.model("Repo", repoSchema);

module.exports = { Repo };
