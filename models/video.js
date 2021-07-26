const mongoose = require("mongoose");

const { Schema } = mongoose;

const Video = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publisher: { type: String, required: true },
  comments: { type: Array },
  viewers: { type: Number },
  link: { type: String, require: true },
  date: { type: Date, default: Date.now() },
  video_id: String,
});

module.exports = mongoose.model("Video", Video);
