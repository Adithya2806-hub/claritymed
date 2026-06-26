const FamilyModel = require("../models/family.model");

const addMember = async (req, res) => {
  try {
    const { name, relation, age, gender, blood_group } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const id = await FamilyModel.create({ user_id: req.user.id, name, relation, age, gender, blood_group });
    res.status(201).json({ success: true, message: "Family member added", data: { id } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await FamilyModel.getByUser(req.user.id);
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const deleted = await FamilyModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Member not found" });
    res.json({ success: true, message: "Member removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addMember, getMembers, deleteMember };
