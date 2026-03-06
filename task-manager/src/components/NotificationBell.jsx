import { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';

export default function NotificationBell() {
  const { tasks, reminders } = useTasks();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get upcoming reminders
  const upcomingReminders = reminders
    .filter(r => !r.triggered && !r.dismissed)
    .sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime))
    .slice(0, 5);

  // Get today's pending high priority tasks
  const today = new Date().toDateString();
  const todayHighPriority = tasks.filter(
    t => !t.completed && t.priority === 'high' && new Date(t.date).toDateString() === today
  );

  const notificationCount = upcomingReminders.length + todayHighPriority.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatReminderTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diff = date - now;
    
    if (diff < 0) return 'Now';
    if (diff < 60000) return 'In less than a minute';
    if (diff < 3600000) return `In ${Math.floor(diff / 60000)} minutes`;
    if (diff < 86400000) return `In ${Math.floor(diff / 3600000)} hours`;
    return date.toLocaleDateString();
  };

  const formatTaskTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative"
      >
        <span className="material-symbols-outlined">notifications</span>
        {notificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {notificationCount > 0 ? `${notificationCount} items` : 'No new notifications'}
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Upcoming Reminders */}
            {upcomingReminders.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Upcoming Reminders
                </p>
                {upcomingReminders.map(reminder => (
                  <div 
                    key={reminder.id}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">alarm</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {reminder.taskTitle}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {formatReminderTime(reminder.reminderTime)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Today's High Priority Tasks */}
            {todayHighPriority.length > 0 && (
              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <p className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  High Priority Today
                </p>
                {todayHighPriority.map(task => (
                  <div 
                    key={task.id}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-red-500 text-sm">priority_high</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-red-500 font-medium">
                        {formatTaskTime(task.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {notificationCount === 0 && (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">notifications_off</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">You're all caught up!</p>
              </div>
            )}
          </div>

          {notificationCount > 0 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button className="w-full text-center text-sm text-primary font-medium hover:underline">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
