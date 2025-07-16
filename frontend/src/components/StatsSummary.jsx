import { getAllReminders } from '@/services/reminderService'
import { AlertTriangle, Ban, Check, Clock } from 'lucide-react'
import React, { useEffect, useState, useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AuthContext } from '../context/AuthContext'

const StatsSummary = () => {
    const { token } = useContext(AuthContext)
    const [stats, setStats] = useState({
        scheduled: 0,
        sent: 0,
        cancelled: 0,
        failed: 0,
        total: 0
    })
    const [error, setError] = useState("")
    useEffect(() => {
        if (!token) return
        const loadStats = async () => {
            try {
                const reminders = await getAllReminders(token)
                const counts = reminders.reduce((acc, reminder) => {
                    acc[reminder.status]++
                    acc.total++
                    return acc
                }, {
                    scheduled: 0,
                    sent: 0,
                    cancelled: 0,
                    failed: 0,
                    total: 0
                })
                setStats(counts)
            }
            catch (error) {
                console.error("Failed to load stats:", error)
                setError("Failed to load stats")
            }
        }
        loadStats()
    }, [token])
    if (!token) {
        return <div className="text-center py-8">Please log in to view your stats.</div>
    }

    const cards = [
        {
            title: "Scheduled",
            value: stats.scheduled,
            description: "Upcoming reminders",
            icon: <Clock className="h-4 w-4 text-blue-500 dark:text-blue-300" />,
            color: "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        },
        {
            title: "Sent",
            value: stats.sent,
            description: "Delivered reminders",
            icon: <Check className="h-4 w-4 text-green-500 dark:text-green-300" />,
            color: "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300"
        },
        {
            title: "Cancelled",
            value: stats.cancelled,
            description: "Cancelled reminders",
            icon: <Ban className="h-4 w-4 text-gray-500 dark:text-gray-300" />,
            color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        },
        {
            title: "Failed",
            value: stats.failed,
            description: "Failed reminders",
            icon: <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-300" />,
            color: "bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300"
        }
    ]

    return (
        <div className='grid gap-4 md:grid-cols-4'>
            {cards.map((card,index)=>(
                <Card key={index} className="relative overflow-hidden bg-white dark:bg-gray-800">
                    <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 bg-current rounded-bl-full`} style={{ backgroundColor: card.color.split(" ")[0] }}></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">{card.title}</CardTitle>
                        <div className={`p-2 rounded-full ${card.color}`}>
                            {card.icon}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-gray-900 dark:text-white'>{card.value}</div>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default StatsSummary