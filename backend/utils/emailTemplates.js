exports.reminderEmail = (reminder) => `
  <div style="font-family:sans-serif;">
    <h2>Reminder: ${reminder.subject}</h2>
    <p>${reminder.message}</p>
    <p><strong>Scheduled for:</strong> ${new Date(reminder.scheduledFor).toLocaleString()}</p>
  </div>
`;

exports.resetPasswordEmail = (resetUrl) => `
  <div style="font-family:sans-serif;">
    <h2>Password Reset Request</h2>
    <p>You requested a password reset.</p>
    <p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>
    <p>If you did not request this, you can ignore this email.</p>
  </div>
`; 