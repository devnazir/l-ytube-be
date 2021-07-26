const router = require("express").Router();
const video = require("./video");
const auth = require("./auth");
const authMiddleware = require("../../middlewares/auth");
const users = require("./users");

router.get("/", ({ res }) => {
  res.redirect("/");
});

router.use("/auth", auth);

router.use("/video", authMiddleware);
router.use("/video", video);

router.use("/users", authMiddleware);
router.use("/users", users);

module.exports = router;
