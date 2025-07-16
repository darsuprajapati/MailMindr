import React, { useEffect, useState, useRef } from 'react';
import NavBar from '@/components/NavBar';
import ReminderForm from '@/components/ReminderForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import StatsSummary from '@/components/StatsSummary';
import ReminderList from '@/components/ReminderList';
import { getAllReminders } from '@/services/reminderService';

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const reminderListRef = useRef();

  const handleReminderCreated = (reminder) => {
    setReminders((prev) => [reminder, ...prev]);
    setIsCreateDialogOpen(false);
    // Reload reminders in ReminderList
    if (reminderListRef.current && reminderListRef.current.reloadReminders) {
      reminderListRef.current.reloadReminders();
    }
  };

  useEffect(() => {
    const loadReminders = async () => {
      const reminders = await getAllReminders();
      setReminders(reminders);
    };
    loadReminders();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col'>
      <NavBar onReminderCreated={handleReminderCreated} />

      <main className='flex-1 container mx-auto py-6 px-4 md:px-6'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Dashboard</h2>
            <Button
              variant='outline'
              className='hidden md:flex'
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className='mr-2 h-4 w-4' />
              New Reminder
            </Button>
          </div>
          <StatsSummary/>
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Reminders</h3>
            <ReminderList ref={reminderListRef} />
          </div>
        </div>
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogTitle>New Reminder</DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule a new email reminder.
          </DialogDescription>
          <ReminderForm
            onSuccess={handleReminderCreated}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
