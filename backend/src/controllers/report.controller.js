const fs = require("fs");
const path = require("path");
const ReportModel = require("../models/report.model");
const UserModel = require("../models/user.model");
const { extractTextFromFile } = require("../utils/extractText");
const { analyzeReport, analyzeXray } = require("../utils/analyzeReport");

const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await UserModel.findById(req.user.id);
    const { report_hint } = req.body;

    let analysisResult;
    let rawText = "";

    if (req.file.mimetype.startsWith("image/") && req.body.is_xray === "true") {
      const base64 = fs.readFileSync(req.file.path).toString("base64");
      analysisResult = await analyzeXray(base64, req.body.body_part || "chest");
    } else {
      const extracted = await extractTextFromFile(req.file.path, req.file.mimetype);
      rawText = extracted.text;
      if (!rawText || rawText.trim().length < 20) {
        if (req.file.mimetype.startsWith("image/")) {
          const base64 = fs.readFileSync(req.file.path).toString("base64");
          analysisResult = await analyzeXray(base64, "medical image");
        } else {
          return res.status(422).json({ success: false, message: "Could not extract text from file. Please ensure the file is readable." });
        }
      } else {
        const userProfile = { age: user?.age, weight: user?.weight, height: user?.height, gender: user?.gender };
        analysisResult = await analyzeReport(rawText, report_hint, userProfile);
      }
    }

    const id = await ReportModel.create({
      user_id: req.user.id,
      file_name: req.file.originalname,
      file_path: req.file.path,
      file_type: req.file.mimetype,
      report_type: analysisResult.report_type || "Medical Report",
      raw_text: rawText,
      analysis: analysisResult,
      health_score: analysisResult.overall_health_score || null,
    });

    res.status(201).json({ success: true, message: "Report analyzed successfully", data: { id, analysis: analysisResult } });
  } catch (err) {
    console.error("Upload error:", err.message);
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Analysis failed: " + err.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await ReportModel.getByUser(req.user.id);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getReport = async (req, res) => {
  try {
    const report = await ReportModel.getById(req.params.id, req.user.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteReport = async (req, res) => {
  try {
    const deleted = await ReportModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { uploadAndAnalyze, getAllReports, getReport, deleteReport };
