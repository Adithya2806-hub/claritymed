const { pool } = require("../config/db");

const UserModel = {
  async create(data) {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, age, weight, height, gender, food_preference, goal, allergies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [data.name, data.email, data.password, data.age||null, data.weight||null, data.height||null, data.gender||null, data.food_preference||null, data.goal||null, data.allergies||null]
    );
    return result.insertId;
  },
  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  },
  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },
  async update(id, data) {
    const fields = Object.keys(data).map(k => k + " = ?").join(", ");
    await pool.execute("UPDATE users SET " + fields + ", updated_at = CURRENT_TIMESTAMP WHERE id = ?", [...Object.values(data), id]);
  },
};

module.exports = UserModel;
