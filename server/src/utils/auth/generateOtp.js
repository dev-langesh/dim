const { config } = require("../../config/constants");

function generateOtp() {
  const length = config.otp.length;
  const otp = Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
  return otp;
}

module.exports = {
  generateOtp,
};
