import { Badge } from "@/components/ui/badge";

const statusConfigs = {
    scheduled: {
        label: "Scheduled",
        variant: "default",
        className: "bg-blue-400 hover:bg-blue-500 dark:bg-blue-700 dark:text-blue-100"
    },
    sent: {
        label: "Sent",
        variant: "secondary",
        className: "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:text-green-100"
    },
    failed: {
        label: "Failed",
        variant: "destructive",
        className: "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:text-red-100"
    },
    cancelled: {
        label: "Cancelled",
        variant: "outline",
        className: "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100"
    }
};

const ReminderStatusBadge = ({ status }) => {
    const config = statusConfigs[status];

    return (
        <Badge variant={config.variant} className={config.className}>
            {config.label}
        </Badge>
    );
}

export default ReminderStatusBadge