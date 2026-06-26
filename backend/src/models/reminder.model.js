const { pool } = require("../config/db");

const ReminderModel = {
  async create(data) {
    const [result] = await pool.execute(
      "INSERT INTO reminders (user_id, type, title, description, reminder_date, frequency, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.user_id, data.type, data.title, data.description||null, data.reminder_date, data.frequency||"once", data.is_active??1]
    );
    return result.insertId;
  },
  async getByUser(user_id) {
    const [rows] = await pool.execute("SELECT * FROM reminders WHERE user_id = ? ORDER BY reminder_date ASC", [user_id]);
    return rows;
  },
  async toggle(id, user_id, is_active) {
    await pool.execute("UPDATE reminders SET is_active = ? WHERE id = ? AND user_id = ?", [is_active, id, user_id]);
  },
  async delete(id, user_id) {
    const [result] = await pool.execute("DELETE FROM reminders WHERE id = ? AND user_id = ?", [id, user_id]);
    return result.affectedRows > 0;
  },
};

module.exports = ReminderModel;
