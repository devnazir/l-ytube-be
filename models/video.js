const mongoose = require("mongoose");

const { Schema } = mongoose;

const Video = new Schema({
  video_id: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  publisher: { type: String, required: true },
  comments: { type: Array },
  viewers: { type: Number },
  link: { type: String, required: true },
  category: {
    type: String,
    default: "entertaiment",
    enum: {
      values: [
        "music",
        "game",
        "education",
        "football",
        "cartoon",
        "entertaiment",
        "tips",
      ],
      message: "{VALUE} is not supported",
    },
  },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Video", Video);
