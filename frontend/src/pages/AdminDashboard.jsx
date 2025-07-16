import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllUsers, deleteUser, getAllReminders, deleteReminder } from "../services/adminService";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      getAllUsers(token).then(setUsers).catch(() => setError("Failed to load users"));
      getAllReminders(token).then(setReminders).catch(() => setError("Failed to load reminders"));
    }
  }, [token]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user and all their reminders?")) {
      await deleteUser(id, token);
      setUsers(users.filter(u => u._id !== id));
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm("Delete this reminder?")) {
      await deleteReminder(id, token);
      setReminders(reminders.filter(r => r._id !== id));
    }
  };

  return (
    <div className="container mx-auto py-8 px-2 md:px-8">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">All Users</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Admin</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u, idx) => (
                <tr key={u._id} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{u.isAdmin ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">All Reminders</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">To</th>
                <th className="px-4 py-3 text-left font-semibold">Subject</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reminders.map((r, idx) => (
                <tr key={r._id} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-2 whitespace-nowrap">{r.recipient}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.subject}</td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">{r.status}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.user?.email || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteReminder(r._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {reminders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-400">No reminders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard; 