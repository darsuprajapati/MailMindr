const API_BASE = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`;

export async function getAllUsers(token) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

export async function getAllReminders(token) {
  const res = await fetch(`${API_BASE}/admin/reminders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
}

export async function deleteReminder(id, token) {
  const res = await fetch(`${API_BASE}/admin/reminders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to delete reminder");
  return res.json();
} 