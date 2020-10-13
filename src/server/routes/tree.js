const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const treeCtrl = require("../controllers/tree");

router.get("/", treeCtrl.getAllTrees);
router.get("/:id", auth, treeCtrl.getOneTree);
router.put("/:id", auth, treeCtrl.updateOneThree);
router.get("/lockingPrice/:id", treeCtrl.showLockingPrice);
router.get("/lockTree/:id", treeCtrl.lockTree);

module.exports = router;
