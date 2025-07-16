  const Reminder = require('../models/Reminder');
  const User = require('../models/User');
  const nodemailer = require('nodemailer');
  const { reminderEmail } = require('./emailTemplates');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  async function sendReminderEmail(reminder) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reminder.recipient,
      subject: reminder.subject,
      text: reminder.message,
      html: reminderEmail(reminder)
    };
    return transporter.sendMail(mailOptions);
  }

  // Use setInterval to check for due reminders every minute
  setInterval(async () => {
    const now = new Date();
    const dueReminders = await Reminder.find({
      status: 'scheduled',
      scheduledFor: { $lte: now }
    });
    for (const reminder of dueReminders) {
      try {
        await sendReminderEmail(reminder);
        reminder.status = 'sent';
        reminder.sentAt = new Date();
        await reminder.save();
        console.log(`Sent reminder to ${reminder.recipient}`);
      } catch (err) {
        reminder.status = 'failed';
        reminder.error = err.message;
        await reminder.save();
        console.error(`Failed to send reminder to ${reminder.recipient}:`, err.message);
      }
    }
  }, 60 * 1000); // 60,000 ms = 1 minute

  module.exports = {}; 