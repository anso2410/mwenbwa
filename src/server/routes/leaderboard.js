const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const leaderboardCtrl = require("../controllers/leaderboard");

router.get("/leaves", leaderboardCtrl.leaderboardLeaves);
router.get("/trees", leaderboardCtrl.leaderboardTrees);

module.exports = router;
