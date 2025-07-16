import { ReminderStatus } from "@/types/reminder";

// Mock data for development
const mockReminders = [
  {
    id: "1",
    recipient: "john@example.com",
    subject: "Meeting Follow-up",
    message:
      "Hi John, just following up on our meeting from yesterday. Let me know your thoughts on the proposal.",
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    createdAt: new Date(),
    status: ReminderStatus.SCHEDULED,
  },
  {
    id: "2",
    recipient: "sarah@example.com",
    subject: "Project Deadline Reminder",
    message:
      "Hi Sarah, this is a friendly reminder that the project deadline is approaching next week.",
    scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(),
    status: ReminderStatus.SCHEDULED,
  },
  {
    id: "3",
    recipient: "michael@example.com",
    subject: "Invoice Payment",
    message:
      "Hello Michael, your invoice #12345 is due next Monday. Please let me know if you have any questions.",
    scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: ReminderStatus.SENT,
  },
];

const API_BASE = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`;

// Get all reminders
export async function getAllReminders(token) {
  const res = await fetch(`${API_BASE}/reminders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
}

// Get a reminder by ID
export const getReminderById = async (id) => {
  const reminder = mockReminders.find((reminder) => reminder.id === id);
  return Promise.resolve(reminder);
};

// Create a new reminder
export async function createReminder(data, token) {
  const res = await fetch(`${API_BASE}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create reminder");
  return res.json();
}

// Update a reminder
export async function updateReminder(id, data, token) {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update reminder");
  return res.json();
}

// Delete a reminder
export async function deleteReminder(id, token) {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to delete reminder");
  return res.json();
}

// Cancel a reminder
export async function cancelReminder(id, token) {
  return updateReminder(id, { status: 'cancelled' }, token);
}
