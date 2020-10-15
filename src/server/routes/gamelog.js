const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const gamelogCtrl = require("../controllers/gamelog");

router.get("/", auth, gamelogCtrl.getGamelog);

module.exports = router;
