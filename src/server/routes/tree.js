const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const treeCtrl = require("../controllers/tree");

router.get("/", treeCtrl.getAllTrees);
router.get("/:id", auth, treeCtrl.getOneTree);
router.put("/:id", auth, treeCtrl.updateOneThree);
router.get("/buyTree", treeCtrl.buyTree);
router.get("/treePrice", treeCtrl.treePrice);
router.get("/lockingPrice/:id", treeCtrl.showLockingPrice);
router.get("/lockTree/:id", treeCtrl.lockTree);
router.get("/getComments", treeCtrl.showAllComment);
router.post("/addComment", treeCtrl.addComment);

module.exports = router;
