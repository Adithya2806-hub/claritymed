const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/chat.controller");
const auth = require("../middleware/auth");

router.post("/", auth, chat);

module.exports = router;
