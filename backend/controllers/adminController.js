const User = require('../models/User');
const Reminder = require('../models/Reminder');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Reminder.deleteMany({ user: user._id });
    res.json({ message: 'User and their reminders deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().populate('user', 'email');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 