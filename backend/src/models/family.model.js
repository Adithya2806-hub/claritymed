const { pool } = require("../config/db");

const FamilyModel = {
  async create(data) {
    const [result] = await pool.execute(
      "INSERT INTO family_members (user_id, name, relation, age, gender, blood_group) VALUES (?, ?, ?, ?, ?, ?)",
      [data.user_id, data.name, data.relation || "other", data.age || null, data.gender || null, data.blood_group || null]
    );
    return result.insertId;
  },
  async getByUser(user_id) {
    const [rows] = await pool.execute("SELECT * FROM family_members WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    return rows;
  },
  async delete(id, user_id) {
    const [result] = await pool.execute("DELETE FROM family_members WHERE id = ? AND user_id = ?", [id, user_id]);
    return result.affectedRows > 0;
  },
};

module.exports = FamilyModel;
