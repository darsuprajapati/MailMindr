import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bell, Calendar, Clock, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Index = () => {
    const { user } = useContext(AuthContext)
    return (
        <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
            {/* Hero Section */}
            <header className="bg-blue-50 dark:bg-gray-800">
                <div className="max-w-[1440px] mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        <Mail className="h-6 w-6 text-blue-400" />
                        <h1>MailMindr</h1>
                    </div>
                    <nav className="flex gap-2">
                        {user ? (
                            <Button asChild variant="ghost">
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild variant="ghost">
                                    <Link to="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>

                <div className="max-w-[1440px] mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            Never Forget with <span className=" text-blue-400">Automated Email Reminders</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-lg">
                            Schedule, manage, and send email reminders automatically. Stay on top of follow-ups,
                            deadlines, and important communications.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {user ? (
                                <Button asChild size="lg" className="bg-blue-400 hover:bg-blue-600">
                                    <Link to="/dashboard">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" className="bg-blue-400 hover:bg-blue-600">
                                        <Link to="/login">Login</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link to="/register">Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-blue-300 rounded-lg"></div>
                            <div className="bg-white dark:bg-gray-900 p-8 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bell className="h-5 w-5 text-blue-400" />
                                    <h3 className="font-medium">New Reminder</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">To: client@example.com</div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">Subject: Project proposal follow-up</div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm h-20">Message: Hi there, just following up on the proposal we discussed...</div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Clock className="h-4 w-4" />
                                        <span>Scheduled for tomorrow at 9:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className='py-16 bg-white dark:bg-gray-900'>
                <div className='max-w-[1440px] mx-auto px-4'>
                    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-6 w-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Schedule Reminders</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Easily schedule email reminders for any date and time. Perfect for follow-ups and deadlines.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                <Bell className="h-6 w-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Automated Delivery</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Set it and forget it. Our system automatically sends your emails at the scheduled time.
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Track Status</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Monitor the status of all your reminders - scheduled, sent, or cancelled - from one dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                        Join thousands of professionals who use our MailMindr to stay organized and never miss important follow-ups.
                    </p>
                    {user ? (
                        <Button asChild size="lg" className="bg-blue-400 hover:bg-blue-600">
                            <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    ) : (
                        <Button asChild size="lg" className="bg-blue-400 hover:bg-blue-600">
                            <Link to="/login">Login to Get Started</Link>
                        </Button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <span className="font-semibold">MailMindr</span>
                    </div>
                    <p>© 2025 MailMindr. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Index