const MedicineModel = require("../models/medicine.model");

const addMedicine = async (req, res) => {
  try {
    const { name, purpose, dosage, times } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Medicine name is required" });
    const id = await MedicineModel.create({ user_id: req.user.id, name, purpose, dosage, times });
    res.status(201).json({ success: true, message: "Medicine added", data: { id } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await MedicineModel.getByUser(req.user.id);
    res.json({ success: true, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleMedicine = async (req, res) => {
  try {
    const { is_active } = req.body;
    await MedicineModel.toggle(req.params.id, req.user.id, is_active);
    res.json({ success: true, message: `Medicine ${is_active ? "activated" : "deactivated"}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const deleted = await MedicineModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Medicine not found" });
    res.json({ success: true, message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addMedicine, getMedicines, toggleMedicine, deleteMedicine };
