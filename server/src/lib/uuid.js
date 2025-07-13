const crypto = require("crypto");

function uuid(chars = 6) {
  return crypto.randomBytes(chars).toString("hex").slice(0, chars);
}

module.exports = { uuid };
