const router = require("express").Router();
const controller = require("./video.controller");

router.get("/", controller.index_video);
router.get("/user/:username", controller.get_video_by_user);
router.get("/category/:category", controller.get_video_by_category);
router.get("/search/:search", controller.search_video);
router.get("/:id", controller.get_video_by_id);
router.get("/subscription", controller.get_my_subscription);

router.post("/", controller.add_video);
router.post("/subscription", controller.add_my_subscription);
router.put("/:id", controller.edit_video);
router.delete("/:id", controller.delete_video);

module.exports = router;
