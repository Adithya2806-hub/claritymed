const express = require("express");
const router = express.Router();
const { addMedicine, getMedicines, toggleMedicine, deleteMedicine } = require("../controllers/medicine.controller");
const auth = require("../middleware/auth");

router.post("/", auth, addMedicine);
router.get("/", auth, getMedicines);
router.patch("/:id/toggle", auth, toggleMedicine);
router.delete("/:id", auth, deleteMedicine);

module.exports = router;
