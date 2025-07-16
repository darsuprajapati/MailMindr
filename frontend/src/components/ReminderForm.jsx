import { useState, useEffect, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createReminder, updateReminder } from "@/services/reminderService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { AuthContext } from '../context/AuthContext';

const reminderSchema = z.object({
  recipient: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  date: z.date({ required_error: "Please select a date" }),
  hour: z.string(),
  minute: z.string(),
  amPm: z.enum(["AM", "PM"]),
});

const ReminderForm = ({ onSuccess, initialData, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;
  const firstInputRef = useRef(null);
  const { token } = useContext(AuthContext);

  const getInitialData = () => {
    if (!initialData) {
      return {
        recipient: "",
        subject: "",
        message: "",
        date: new Date(),
        hour: "09",
        minute: "00",
        amPm: "AM",
      };
    }

    const date = new Date(initialData.scheduledFor);
    let hours = date.getHours();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
      recipient: initialData.recipient,
      subject: initialData.subject,
      message: initialData.message,
      date: date,
      hour: hours.toString().padStart(2, "0"),
      minute: date.getMinutes().toString().padStart(2, "0"),
      amPm: amPm,
    };
  };

  const form = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: getInitialData(),
  });

  useEffect(() => {
    form.reset(getInitialData());
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [initialData]);

  const onSubmit = async (data) => {
    if (!token) {
      alert('You must be logged in to create or update reminders.');
      return;
    }
    try {
      setIsSubmitting(true);

      const { date, hour, minute, amPm, recipient, subject, message } = data;
      const scheduledDate = new Date(date);

      let hours = parseInt(hour);
      if (amPm === "PM" && hours < 12) hours += 12;
      if (amPm === "AM" && hours === 12) hours = 0;

      scheduledDate.setHours(hours, parseInt(minute), 0, 0);

      const reminderData = {
        recipient,
        subject,
        message,
        scheduledFor: scheduledDate.toISOString(),
      };

      let reminder;

      if (isEditing && initialData) {
        const updated = await updateReminder(initialData._id, reminderData, token);
        if (!updated) throw new Error("Failed to update reminder");
        reminder = updated;
        toast("Reminder updated. Your reminder has been successfully updated.");
      } else {
        reminder = await createReminder(reminderData, token);
        toast("Reminder created. Your reminder has been successfully scheduled.");
      }

      onSuccess(reminder);
      form.reset();
    } catch (error) {
      console.error("Failed to save reminder:", error);
      // Show a specific error if backend returns 'Only scheduled reminders can be updated'
      if (error instanceof Error && error.message && error.message.includes('Only scheduled reminders can be updated')) {
        toast("Only scheduled reminders can be edited. You cannot edit sent, cancelled, or failed reminders.");
      } else {
        toast("Failed to save the reminder. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 max-h-[80vh] flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{isEditing ? "Edit Reminder" : "Create New Reminder"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <CardContent className="space-y-4 flex-1 overflow-y-auto">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input ref={firstInputRef} autoFocus placeholder="email@example.com" {...field} className="dark:bg-gray-700 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reminder subject" {...field} className="dark:bg-gray-700 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your reminder message here..."
                      className="h-32 dark:bg-gray-700 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1">
                <FormLabel className="block mb-2">Time</FormLabel>
                <div className="flex space-x-2 items-center">
                  <div className="flex-1 flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="hour"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = (i + 1).toString().padStart(2, "0");
                                return (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span className="text-center">:</span>
                    <FormField
                      control={form.control}
                      name="minute"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const minute = (i * 5).toString().padStart(2, "0");
                                return (
                                  <SelectItem key={minute} value={minute}>
                                    {minute}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amPm"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-1 mt-5 bg-white dark:bg-gray-800">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-400 hover:bg-blue-600" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {isEditing ? "Save Changes" : "Create Reminder"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default ReminderForm