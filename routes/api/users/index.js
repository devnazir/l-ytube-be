const router = require("express").Router();
const controller = require("./users.controller");

router.get("/", controller.index_user);
router.delete("/:id", controller.delete_user);

module.exports = router;
