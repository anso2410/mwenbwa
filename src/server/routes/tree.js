const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const treeCtrl = require("../controllers/tree");

router.get("/", auth, treeCtrl.getAllTrees);
router.get("/:id", auth, treeCtrl.getOneTree);
router.put("/:id", auth, treeCtrl.updateOneThree);

module.exports = router;
