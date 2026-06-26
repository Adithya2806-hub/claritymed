const express = require("express");
const router = express.Router();
const { uploadAndAnalyze, getAllReports, getReport, deleteReport } = require("../controllers/report.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/analyze", auth, upload.single("report"), uploadAndAnalyze);
router.get("/", auth, getAllReports);
router.get("/:id", auth, getReport);
router.delete("/:id", auth, deleteReport);

module.exports = router;
