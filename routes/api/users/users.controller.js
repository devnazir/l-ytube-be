const User = require("../../../models/user");
const CONSTANT = require("../../../constant");

exports.index_user = async (req, res) => {
  const users = await User.find({}, { _id: 0, userid: 1, username: 1 });

  if (req.decode.admin) {
    return res.json(users);
  }

  res.status(403).json({ error: `${CONSTANT.NOT_ADMIN}` });
};

exports.delete_user = (req, res) => {
  const userId = req.params.id;

  if (req.decode.admin) {
    return User.findOneAndDelete({ userid: userId })
      .then((user) => {
        if (!user) {
          throw new Error(`${CONSTANT.USER_NOT_FOUND}`);
        }
        res.json({ message: `${CONSTANT.SUCCESS}` });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }

  res.status(403).json({ error: `${CONSTANT.VIDEO_IS_NOT_FOUND}` });
};
