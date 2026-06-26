const { pool } = require("../config/db");

const MedicineModel = {
  async create(data) {
    const [result] = await pool.execute(
      "INSERT INTO medicines (user_id, name, purpose, dosage, times, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [data.user_id, data.name, data.purpose||null, data.dosage||null, JSON.stringify(data.times||[]), data.is_active??1]
    );
    return result.insertId;
  },
  async getByUser(user_id) {
    const [rows] = await pool.execute("SELECT * FROM medicines WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    return rows.map(r => ({ ...r, times: JSON.parse(r.times || "[]") }));
  },
  async toggle(id, user_id, is_active) {
    await pool.execute("UPDATE medicines SET is_active = ? WHERE id = ? AND user_id = ?", [is_active, id, user_id]);
  },
  async delete(id, user_id) {
    const [result] = await pool.execute("DELETE FROM medicines WHERE id = ? AND user_id = ?", [id, user_id]);
    return result.affectedRows > 0;
  },
};

module.exports = MedicineModel;
