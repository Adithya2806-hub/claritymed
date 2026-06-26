const { pool } = require("../config/db");

const ReportModel = {
  async create(data) {
    const [result] = await pool.execute(
      "INSERT INTO reports (user_id, file_name, file_path, file_type, report_type, raw_text, analysis, health_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [data.user_id, data.file_name, data.file_path, data.file_type, data.report_type, data.raw_text, JSON.stringify(data.analysis), data.health_score]
    );
    return result.insertId;
  },
  async getByUser(user_id) {
    const [rows] = await pool.execute(
      "SELECT id, file_name, report_type, health_score, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
    return rows;
  },
  async getById(id, user_id) {
    const [rows] = await pool.execute("SELECT * FROM reports WHERE id = ? AND user_id = ?", [id, user_id]);
    if (!rows[0]) return null;
    rows[0].analysis = JSON.parse(rows[0].analysis || "{}");
    return rows[0];
  },
  async delete(id, user_id) {
    const [result] = await pool.execute("DELETE FROM reports WHERE id = ? AND user_id = ?", [id, user_id]);
    return result.affectedRows > 0;
  },
};

module.exports = ReportModel;
