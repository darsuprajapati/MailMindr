const Reminder = require('../models/Reminder');

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ scheduledFor: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { recipient, subject, message, scheduledFor } = req.body;
    const reminder = new Reminder({
      user: req.user.id,
      recipient,
      subject,
      message,
      scheduledFor,
      status: 'scheduled'
    });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    if (reminder.status !== 'scheduled') return res.status(400).json({ message: 'Only scheduled reminders can be updated' });
    const { recipient, subject, message, scheduledFor } = req.body;
    reminder.recipient = recipient;
    reminder.subject = subject;
    reminder.message = message;
    reminder.scheduledFor = scheduledFor;
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 