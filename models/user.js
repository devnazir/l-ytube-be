const mongoose = require("mongoose");
const encryptPassword = require("../utils/encrypt-password");

const { Schema } = mongoose;

const User = new Schema({
  _id: String,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: { type: Boolean, default: false },
});

User.methods.verify = function (password) {
  const encrypted = encryptPassword(password);
  return this.password === encrypted;
};

module.exports = mongoose.model("User", User);
