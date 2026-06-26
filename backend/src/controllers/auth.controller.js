const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const register = async (req, res) => {
  try {
    const { name, email, password, age, weight, height, gender, food_preference, goal, allergies } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });

    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const id = await UserModel.create({ name, email, password: hashed, age, weight, height, gender, food_preference, goal, allergies });

    const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    res.status(201).json({ success: true, message: "Account created successfully", token, user: { id, name, email } });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, message: "Login successful", token, user: userWithoutPass });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, data: userWithoutPass });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "age", "weight", "height", "gender", "food_preference", "goal", "allergies"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    await UserModel.update(req.user.id, updates);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, getProfile, updateProfile };
