const crypto = require("crypto");
const config = require("../config");

function encryptPassword(password) {
  return crypto
    .createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");
}

module.exports = encryptPassword;
