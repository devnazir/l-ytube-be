/* eslint-disable no-underscore-dangle */

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../../../models/user");
const encryptPassword = require("../../../utils/encrypt-password");
const CONSTANT = require("../../../constant");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const checkDuplicate = await User.findOne({ username });

  if (!username?.trim() || !password?.trim()) {
    return res.status(409).json({
      message: `${CONSTANT.USERNAME_REQUIRED} & ${CONSTANT.PASSWORD_REQUIRED}`,
    });
  }

  if (username === checkDuplicate?.username ?? false) {
    return res.status(409).json({
      message: `${CONSTANT.USERNAME_EXIST}`,
    });
  }

  const user = new User({
    _id: uuidv4(),
    username: username?.trim(),
    password: encryptPassword(password),
  });

  user
    .save()
    .then(() => {
      res.status(200).json({ message: `${CONSTANT.REGISTER_SUCCESS}` });
    })
    .catch((err) => {
      res.status(409).json(err);
    });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get("jwt-secret");

  try {
    const checkUser = await User.findOne({ username });
    if (!checkUser) {
      throw new Error(`${CONSTANT.LOGIN_FAILED}`);
    } else if (checkUser.verify(password)) {
      const token = jwt.sign(
        {
          _id: checkUser._id,
          username: checkUser.username,
          admin: checkUser.admin,
        },
        secret,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        message: "success",
        token,
      });
    } else {
      throw new Error(`${CONSTANT.LOGIN_FAILED}`);
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decode,
  });
};
