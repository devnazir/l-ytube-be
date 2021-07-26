const router = require("express").Router();
const controller = require("./video.controller");

router.get("/", controller.index_video);
router.get("/category", controller.get_video_by_category);
router.get("/search", controller.search_video);
router.get("/:id", controller.get_video_by_id);

router.patch("/:id", controller.edit_video);

router.post("/destroy", controller.delete_all_video);
router.post("/", controller.add_video);

router.delete("/:id", controller.delete_video);

module.exports = router;
