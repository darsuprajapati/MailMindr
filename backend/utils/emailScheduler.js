const Reminder = require('../models/Reminder');
const nodemailer = require('nodemailer');
const { reminderEmail } = require('./emailTemplates');

// Delay utility to throttle emails
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send email using a fresh transporter
async function sendReminderEmail(reminder) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,  // 10s
    greetingTimeout: 5000,     // 5s
    socketTimeout: 10000       // 10s
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: reminder.recipient,
    subject: reminder.subject,
    text: reminder.message,
    html: reminderEmail(reminder)
  };

  return transporter.sendMail(mailOptions);
}

// Scheduled task runs every 1 minute
setInterval(async () => {
  try {
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

        console.log(`✅ Sent reminder to ${reminder.recipient}`);
      } catch (err) {
        reminder.status = 'failed';
        reminder.error = err.message;
        await reminder.save();

        console.error(`❌ Failed to send reminder to ${reminder.recipient}:`, err.message);
      }

      // Throttle email sending to avoid Gmail rate limit
      await delay(2000); // 2 seconds between emails
    }
  } catch (err) {
    console.error('❗ Error in reminder scheduler:', err.message);
  }
}, 60 * 1000); // every 60 seconds

module.exports = {};
