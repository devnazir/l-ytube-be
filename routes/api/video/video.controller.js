const { v4: uuidv4 } = require("uuid");
const Video = require("../../../models/video");
const CONSTANT = require("../../../constant");

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
    likes: [],
    dislikes: [],
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
  const videoId = req.query.id ?? req.params.id;

  if (req.decode.admin) {
    return Video.findOneAndDelete({ video_id: videoId })
      .then((video) => {
        if (!video) {
          throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
        }

        return res.json({ message: `${CONSTANT.SUCCESS}` });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }

  Video.findOneAndDelete({ video_id: videoId, publisher: req.decode.username })
    .then((video) => {
      if (!video) {
        throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
      }

      return res.json({ message: `${CONSTANT.SUCCESS}` });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

exports.delete_all_video = (req, res) => {
  if (req.decode.admin) {
    return Video.deleteMany({})
      .then((video) => {
        if (!video) {
          throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
        }

        return res.json({ message: `${CONSTANT.SUCCESS}` });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }

  res.status(403).json({ error: `${CONSTANT.NOT_ADMIN}` });
};

exports.search_video = (req, res) => {
  const { q: searchValue } = req.query;
  if (!searchValue) {
    return res.json({ error: `${CONSTANT.REQUIRED_Q_PARAMS}` });
  }

  Video.find({ title: searchValue })
    .then((video) => {
      if (!video) {
        throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
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
    return res.json({ data: Video.getCategories() });
  }

  Video.find({ category: categoryValue })
    .then((video) => {
      if (!video) {
        throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
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

exports.get_videos_user = (req, res) => {
  const { username } = req.decode;
  const { q } = req.query;

  if (q) {
    return Video.find({ publisher: q })
      .then((video) => {
        if (!video || video.length === 0) {
          throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
        }
        res.json({ data: video });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }

  Video.find({ publisher: username })
    .then((video) => {
      res.json({ data: video });
    })
    .catch((err) => {
      res.json(err);
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
        throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
      }
      res.json({ data: video });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

exports.likes_video = async (req, res) => {
  const { id } = req.params;
  const { username } = req.decode;

  try {
    const video = await Video.findOne({ video_id: id });

    if (!video) {
      throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
    }

    const userHasLikedVideo = video.likes.some((like) => like === username);

    if (userHasLikedVideo) {
      const indexOfUser = video.likes.indexOf(username);
      return Video.findOneAndUpdate(
        { video_id: id },
        {
          likes: video.likes.slice(indexOfUser, 0),
        }
      )
        .then((currentVideo) => {
          if (!currentVideo) {
            throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
          }
          res.json({ message: `${CONSTANT.SUCCESS_UN_LIKE}` });
        })
        .catch((err) => {
          res.json({ error: err.message });
        });
    }

    Video.findOneAndUpdate(
      { video_id: id },
      {
        likes: [...video.likes, username],
      }
    )
      .then((currentVideo) => {
        if (!currentVideo) {
          throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
        }
        res.json({ message: `${CONSTANT.SUCCESS_LIKE}` });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.dislikes_video = async (req, res) => {
  const { id } = req.params;
  const { username } = req.decode;

  try {
    const video = await Video.findOne({ video_id: id });

    if (!video) {
      throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
    }

    const userHasLikedVideo = video.likes.some((like) => like === username);
    const userHasDislikedVideo = video.dislikes.some(
      (dislike) => dislike === username
    );
    const indexOfUser = video.likes.indexOf(username);

    if (userHasLikedVideo) {
      return Video.findOneAndUpdate(
        { video_id: id },
        {
          likes: video.likes.slice(indexOfUser, 0),
          dislikes: [...video.dislikes, username],
        }
      )
        .then((currentVideo) => {
          if (!currentVideo) {
            throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
          }
          res.json({ message: `${CONSTANT.SUCCESS_DISLIKE}` });
        })
        .catch((err) => {
          res.json({ error: err.message });
        });
    }

    if (userHasDislikedVideo) {
      return Video.findOneAndUpdate(
        { video_id: id },
        {
          dislikes: video.dislikes.slice(indexOfUser, 0),
        }
      )
        .then((currentVideo) => {
          if (!currentVideo) {
            throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
          }
          res.json({ message: `${CONSTANT.SUCCESS_UN_DISLIKE}` });
        })
        .catch((err) => {
          res.json({ error: err.message });
        });
    }

    Video.findOneAndUpdate(
      { video_id: id },
      {
        dislikes: [...video.dislikes, username],
      }
    )
      .then((currentVideo) => {
        if (!currentVideo) {
          throw new Error(`${CONSTANT.VIDEO_IS_NOT_FOUND}`);
        }
        res.json({ message: `${CONSTANT.SUCCESS_DISLIKE}` });
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  } catch (error) {
    res.json({ error: error.message });
  }
};
