import { AlarmPlus, Mail, Moon, Sun, LogOut } from 'lucide-react'
import React, { useState, useContext } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent } from './ui/dialog'
import ReminderForm from './ReminderForm'
import { ThemeContext } from '../context/ThemeContext'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const NavBar = ({ onReminderCreated }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { darkMode, toggleDarkMode } = useContext(ThemeContext)
    const { user, logout } = useContext(AuthContext)

    const handleReminderCreated = (reminder) => {
        onReminderCreated(reminder)
        setIsDialogOpen(false)
    }

    return (
        <div className={`border-b bg-white dark:bg-gray-900`}>
            <div className='flex h-16 items-center px-4 md:px-6 max-w-7xl mx-auto justify-between'>
                <div className='flex items-center gap-2 text-xl font-semibold'>
                    <Mail className="h-5 w-5 text-blue-400" />
                    <h1 className="hidden md:inline-flex">MailMindr</h1>
                    <h1 className="md:hidden">Reminders</h1>
                </div>
                <div className='ml-auto flex items-center gap-2'>
                    <Button onClick={toggleDarkMode} variant="ghost" className="mr-2">
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    {user?.isAdmin && (
                      <Button asChild variant="ghost" className="mr-2">
                        <Link to="/admin">Admin</Link>
                      </Button>
                    )}
                    {user && (
                      <Button onClick={logout} variant="outline" className="mr-2 flex items-center">
                        <LogOut className="h-4 w-4 mr-1" /> Logout
                      </Button>
                    )}
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-400 hover:bg-blue-600">
                        <AlarmPlus className="mr-2 h-4 w-4" />
                        New Reminder
                    </Button>
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className="sm:max-w-[600px]">
                    <ReminderForm onSuccess={handleReminderCreated}
                        onCancel={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NavBar