const { v4: uuidv4 } = require("uuid");
const Video = require("../../../models/video");

exports.index_video = async ({ res }) => {
  res.json(await Video.find({}));
};

exports.add_video = (req, res) => {
  const { title, description, link, category } = req.body;

  const video = new Video({
    video_id: uuidv4(),
    title: title?.trim(),
    description: description?.trim(),
    publisher: req.decode.username,
    comments: [],
    viewers: 0,
    link: link?.trim(),
    category: category?.trim(),
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

exports.delete_video = (req, res) => {
  const videoId = req.query.id;

  if (req.decode.admin) {
    return Video.findOneAndDelete({ video_id: videoId })
      .then((video) => {
        if (!video) {
          throw new Error("video is not found");
        }

        return res.json({ message: "success" });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }

  res.status(403).json({ error: "you are not admin" });
};

exports.delete_all_video = (req, res) => {
  if (req.decode.admin) {
    return Video.deleteMany({})
      .then((video) => {
        if (!video) {
          throw new Error("video is not found");
        }

        return res.json({ message: "success" });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }

  res.status(403).json({ error: "you are not admin" });
};

exports.search_video = (req, res) => {
  const { q: searchValue } = req.query;
  if (!searchValue) {
    return res.json({ error: "must have q parameter" });
  }

  Video.find({ title: searchValue })
    .then((video) => {
      if (!video) {
        throw new Error("video is not found");
      }

      res.json({ data: video });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

exports.get_video_by_category = (req, res) => {
  const { q: categoryValue } = req.query;
  if (!categoryValue) {
    return res.json({ error: "must have q parameter" });
  }

  Video.find({ category: categoryValue })
    .then((video) => {
      if (!video) {
        throw new Error("video is not found");
      }

      res.json({ data: video });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

exports.get_video_by_id = (req, res) => {
  const { id } = req.params;

  Video.findOne({ video_id: id })
    .then((video) => {
      res.json({ data: video });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

exports.edit_video = (req, res) => {
  const { id } = req.params;
  const { title, description, link, category } = req.body;

  Video.findOneAndUpdate(
    { video_id: id },
    {
      title: title?.trim(),
      description: description?.trim(),
      link: link?.trim(),
      category: category?.trim() ?? "entertaiment",
    }
  )
    .then((video) => {
      if (!video) {
        throw new Error("video is not found");
      }
      res.json({ data: video });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};
