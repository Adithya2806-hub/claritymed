const express = require("express");
const router = express.Router();
const { getDietPlan } = require("../controllers/diet.controller");
const auth = require("../middleware/auth");

router.get("/", auth, getDietPlan);

module.exports = router;
