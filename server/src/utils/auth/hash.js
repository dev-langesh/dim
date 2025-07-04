const bcrypt = require("bcrypt");
const { config } = require("../../config/constants");

async function generateHash(data) {
  return await bcrypt.hash(data, config.hashing.saltRounds);
}

async function compareHash(data, hash) {
  return await bcrypt.compare(data, hash);
}

module.exports = {
  generateHash,
  compareHash,
};
