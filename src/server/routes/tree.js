const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const treeCtrl = require("../controllers/tree");

router.get("/", treeCtrl.getAllTrees);
router.get("/:id", auth, treeCtrl.getOneTree);
router.put("/:id", auth, treeCtrl.updateOneThree);
router.post("/buyTree", auth, treeCtrl.buyTree);
router.post("/treePrice", treeCtrl.treePrice);
router.get("/lockingPrice/:id", auth, treeCtrl.showLockingPrice);
router.get("/lockTree/:id", auth, treeCtrl.lockTree);
router.get("/getComments", treeCtrl.showAllComment);
router.post("/addComment", auth, treeCtrl.addComment);

module.exports = router;
