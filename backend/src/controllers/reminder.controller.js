const ReminderModel = require("../models/reminder.model");

const addReminder = async (req, res) => {
  try {
    const { type, title, description, reminder_date, frequency } = req.body;
    if (!title || !reminder_date) return res.status(400).json({ success: false, message: "Title and date required" });
    const id = await ReminderModel.create({ user_id: req.user.id, type: type || "general", title, description, reminder_date, frequency });
    res.status(201).json({ success: true, message: "Reminder added", data: { id } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getReminders = async (req, res) => {
  try {
    const reminders = await ReminderModel.getByUser(req.user.id);
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleReminder = async (req, res) => {
  try {
    await ReminderModel.toggle(req.params.id, req.user.id, req.body.is_active);
    res.json({ success: true, message: "Reminder updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const deleted = await ReminderModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Reminder not found" });
    res.json({ success: true, message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addReminder, getReminders, toggleReminder, deleteReminder };
