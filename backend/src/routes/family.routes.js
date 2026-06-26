const express = require("express");
const router = express.Router();
const { addMember, getMembers, deleteMember } = require("../controllers/family.controller");
const auth = require("../middleware/auth");

router.post("/", auth, addMember);
router.get("/", auth, getMembers);
router.delete("/:id", auth, deleteMember);

module.exports = router;
