import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useContext } from "react";
import { formatDistanceToNow, format, isPast } from "date-fns";
import ReminderStatusBadge from "./ReminderStatusBadge";
import { deleteReminder, cancelReminder } from "@/services/reminderService";
import { Trash, Edit, AlarmClock } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from '../context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const ReminderCard = ({ reminder, onDelete, onEdit }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { token } = useContext(AuthContext);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteReminder(reminder._id, token);
            setIsDeleteDialogOpen(false);
            onDelete(reminder._id);
            toast("Reminder deleted. Your reminder has been successfully deleted.");
        } catch (error) {
            console.error("Failed to delete reminder:", error);
            toast("Failed to delete the reminder. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = async () => {
        try {
            const updated = await cancelReminder(reminder._id, token);
            if (updated) {
                toast("Reminder cancelled. Your reminder has been successfully cancelled.");
                onEdit(updated);
            }
        } catch (error) {
            console.error("Failed to cancel reminder:", error);
            toast("Failed to cancel the reminder. Please try again.");
        }
    };

    const canCancel = reminder.status === 'scheduled' && !isPast(new Date(reminder.scheduledFor));
    const canEdit = reminder.status === 'scheduled';

    return (
        <Card className="w-full border-l-4 border-l-reminder hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-medium line-clamp-1 text-gray-900 dark:text-white">{reminder.subject}</CardTitle>
                        <CardDescription className="line-clamp-1 text-gray-500 dark:text-gray-400">To: {reminder.recipient}</CardDescription>
                    </div>
                    <ReminderStatusBadge status={reminder.status} />
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                <div className="text-sm  line-clamp-2 mb-2 text-gray-900 dark:text-gray-100">{reminder.message}</div>
                <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                    <AlarmClock className="h-3.5 w-3.5" />
                    <span>
                        {isPast(new Date(reminder.scheduledFor))
                            ? `Scheduled for ${format(new Date(reminder.scheduledFor), "MMM d, yyyy 'at' h:mm a")}`
                            : `Scheduled ${formatDistanceToNow(new Date(reminder.scheduledFor), { addSuffix: true })}`}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="pt-1 flex justify-end space-x-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button variant="outline" size="sm" onClick={() => onEdit(reminder)} disabled={!canEdit}>
                                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                                    Edit
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {!canEdit && (
                            <TooltipContent>
                                Only scheduled reminders can be edited
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>

                {canCancel && reminder.status !== 'cancelled' && (
                    <Button variant="secondary" size="sm" onClick={handleCancel}>
                        Cancel
                    </Button>
                )}

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash className="h-3.5 w-3.5 mr-1.5" />
                            Delete
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Reminder</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this reminder? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

export default ReminderCard