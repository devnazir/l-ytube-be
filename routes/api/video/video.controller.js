const { v4: uuidv4 } = require("uuid");
const Video = require("../../../models/video");

exports.index_video = async ({ res }) => {
  res.json(await Video.find({}));
};

exports.add_video = (req, res) => {
  const { title, description, publisher } = req.body;

  const video = new Video({
    video_id: uuidv4(),
    title: title?.trim(),
    description: description?.trim(),
    publisher: publisher?.trim(),
  });

  video
    .save()
    .then(() => {
      res.json({ status: res.statusCode, data: video ?? null });
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.delete_video = () => {};
exports.edit_video = () => {};
exports.get_video_by_id = () => {};
exports.get_video_by_user = () => {};
exports.get_video_by_category = () => {};
exports.search_video = () => {};
exports.get_my_subscription = () => {};
exports.add_my_subscription = () => {};
