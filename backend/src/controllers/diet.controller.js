const UserModel = require("../models/user.model");
const ReportModel = require("../models/report.model");
const { generateDietPlan } = require("../utils/analyzeReport");

const getDietPlan = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user?.weight || !user?.height) {
      return res.status(400).json({ success: false, message: "Please update your weight, height, and age in profile settings first" });
    }
    const reports = await ReportModel.getByUser(req.user.id);
    const conditions = reports.slice(0, 5).map(r => r.report_type);
    const dietPlan = await generateDietPlan(user, conditions);
    res.json({ success: true, data: dietPlan });
  } catch (err) {
    console.error("Diet error:", err.message);
    res.status(500).json({ success: false, message: "Failed to generate diet plan: " + err.message });
  }
};

module.exports = { getDietPlan };
