import React, { useEffect, useState, useContext, useImperativeHandle, forwardRef } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs } from '@radix-ui/react-tabs'
import { TabsList, TabsTrigger } from './ui/tabs'
import { getAllReminders } from '@/services/reminderService'
import { toast } from 'sonner'
import ReminderCard from './ReminderCard'
import { Dialog, DialogContent } from './ui/dialog'
import ReminderForm from './ReminderForm'
import { Inbox, Loader2 } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const ReminderList = forwardRef(({ onReminderCreatedOrUpdated }, ref) => {
    const { token } = useContext(AuthContext);
    const [reminders, setReminders] = useState([]);
    const [filteredReminders, setFilteredReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingReminder, setEditingReminder] = useState(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [error, setError] = useState("");

    const loadReminders = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await getAllReminders(token);
            setReminders(data);
            setFilteredReminders(data);
        } catch (error) {
            console.error("Failed to load reminders:", error);
            setError("Failed to load reminders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReminders();
        // eslint-disable-next-line
    }, [token]);

    useImperativeHandle(ref, () => ({
        reloadReminders: loadReminders
    }));

    useEffect(() => {
        let filtered = [...reminders];

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(reminder => reminder.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(reminder =>
                reminder.subject.toLowerCase().includes(term) ||
                reminder.recipient.toLowerCase().includes(term) ||
                reminder.message.toLowerCase().includes(term)
            );
        }

        // Apply tab filter
        if (activeTab === "upcoming") {
            filtered = filtered.filter(reminder =>
                reminder.status === "scheduled" && new Date(reminder.scheduledFor) > new Date()
            );
        } else if (activeTab === "sent") {
            filtered = filtered.filter(reminder => reminder.status === "sent");
        } else if (activeTab === "cancelled") {
            filtered = filtered.filter(reminder =>
                reminder.status === "cancelled" || reminder.status === "failed"
            );
        }

        setFilteredReminders(filtered);
    }, [reminders, searchTerm, statusFilter, activeTab]);

    const handleReminderDelete = (id) => {
        setReminders(prev => prev.filter(reminder => reminder._id !== id));
        toast("Reminder deleted. The reminder has been successfully deleted.");
    };

    const handleReminderEdit = (reminder) => {
        setEditingReminder(reminder);
        setIsDialogOpen(true);
    };

    const handleReminderUpdate = (updatedReminder) => {
        // After update, reload reminders from server for consistency
        loadReminders();
        setIsDialogOpen(false);
        setEditingReminder(undefined);
        if (onReminderCreatedOrUpdated) onReminderCreatedOrUpdated();
    };

    // Sort reminders by date
    const sortedReminders = [...filteredReminders].sort((a, b) => {
        // Sort by status first (scheduled first)
        if (a.status === "scheduled" && b.status !== "scheduled") return -1;
        if (a.status !== "scheduled" && b.status === "scheduled") return 1;

        // Then sort by date
        return new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime();
    });

    if (!token) {
        return <div className="text-center py-8">Please log in to view your reminders.</div>;
    }

    return (
        <div className='w-full space-y-4'>
            <div className='flex flex-col sm:flex-row gap-2 justify-between'>
                <Input placeholder="Search reminders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-md" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
            </Tabs>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading reminders...</p>
                </div>
            ) : sortedReminders.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {sortedReminders.map(reminder => (
                        <ReminderCard
                            key={reminder._id}
                            reminder={reminder}
                            onDelete={handleReminderDelete}
                            onEdit={handleReminderEdit}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Inbox className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-1">No reminders found</h3>
                    <p className="text-muted-foreground max-w-sm">
                        {searchTerm || statusFilter !== "all"
                            ? "Try changing your search terms or filters."
                            : "Create your first reminder to get started."}
                    </p>
                </div>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <ReminderForm
                        initialData={editingReminder}
                        onSuccess={handleReminderUpdate}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
})

export default ReminderList