const express = require("express");
const router = express.Router();
const { addReminder, getReminders, toggleReminder, deleteReminder } = require("../controllers/reminder.controller");
const auth = require("../middleware/auth");

router.post("/", auth, addReminder);
router.get("/", auth, getReminders);
router.patch("/:id/toggle", auth, toggleReminder);
router.delete("/:id", auth, deleteReminder);

module.exports = router;
