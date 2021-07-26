const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");

const PORT = 3004;
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.set("jwt-secret", config.secret);

app.get("/", ({ res }) => {
  res.json({
    status: res.statusCode,
  });
});

app.use("/api", require("./routes/api"));

app.listen(process.env.PORT || PORT, () => {
  console.log(`server is running at port ${PORT || process.env.PORT}`);
});

mongoose
  .connect(config.mongodb.Uri, config.mongodb.options)
  .then(() => console.log("Database connected :D"))
  .catch((err) => console.log("DON'T BE SAD :(", err));
