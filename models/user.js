const mongoose = require("mongoose");
const encryptPassword = require("../utils/encrypt-password");

const { Schema } = mongoose;

const User = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userid: String,
  admin: { type: Boolean, default: false },
});

User.methods.verify = function (password) {
  const encrypted = encryptPassword(password);
  return this.password === encrypted;
};

User.methods.assignAdmin = function () {
  this.admin = true;
  this.save();
};

module.exports = mongoose.model("User", User);
