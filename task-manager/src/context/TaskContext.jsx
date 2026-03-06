import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService, reminderService } from '../firebase/services';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time task updates
  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setReminders([]);
      setLoading(false);
      return;
    }

    const unsubscribeTasks = taskService.subscribeToTasks(user.id, (taskList) => {
      setTasks(taskList);
      setLoading(false);
    });

    const unsubscribeReminders = reminderService.subscribeToReminders(user.id, (reminderList) => {
      setReminders(reminderList);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeReminders();
    };
  }, [user?.id]);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.triggered && !reminder.dismissed) {
          const reminderTime = new Date(reminder.reminderTime);
          if (now >= reminderTime) {
            // Show notification
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: reminder.taskTitle,
                icon: '/icon.svg'
              });
            }
            
            // Mark as triggered
            reminderService.updateReminder(user.id, reminder.id, { triggered: true });
          }
        }
      });
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders();

    return () => clearInterval(interval);
  }, [reminders, user?.id]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const addTask = useCallback(async (task) => {
    if (!user?.id) return null;
    return await taskService.addTask(user.id, task);
  }, [user?.id]);

  const updateTask = useCallback(async (id, updates) => {
    if (!user?.id) return;
    await taskService.updateTask(user.id, id, updates);
  }, [user?.id]);

  const deleteTask = useCallback(async (id) => {
    if (!user?.id) return;
    await taskService.deleteTask(user.id, id);
    // Also remove any reminders for this task
    await reminderService.deleteRemindersByTask(user.id, id);
  }, [user?.id]);

  const toggleComplete = useCallback(async (id) => {
    if (!user?.id) return;
    const task = tasks.find(t => t.id === id);
    if (task) {
      await taskService.toggleComplete(user.id, id, task.completed);
    }
  }, [user?.id, tasks]);

  // Reminder functions
  const addReminder = useCallback(async (taskId, taskTitle, reminderTime, taskDate) => {
    if (!user?.id) return null;
    const reminder = {
      taskId,
      taskTitle,
      reminderTime: new Date(reminderTime).toISOString(),
      taskDate
    };
    return await reminderService.addReminder(user.id, reminder);
  }, [user?.id]);

  const removeReminder = useCallback(async (taskId) => {
    if (!user?.id) return;
    const taskReminders = reminders.filter(r => r.taskId === taskId);
    for (const reminder of taskReminders) {
      await reminderService.deleteReminder(user.id, reminder.id);
    }
  }, [user?.id, reminders]);

  const getReminderForTask = useCallback((taskId) => {
    return reminders.find(r => r.taskId === taskId && !r.triggered);
  }, [reminders]);

  const dismissReminder = useCallback(async (taskId) => {
    if (!user?.id) return;
    const reminder = reminders.find(r => r.taskId === taskId);
    if (reminder) {
      await reminderService.updateReminder(user.id, reminder.id, { dismissed: true });
    }
  }, [user?.id, reminders]);

  const getTasksByDate = useCallback((date) => {
    const targetDate = new Date(date).toDateString();
    return tasks.filter(task => new Date(task.date).toDateString() === targetDate);
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    return getTasksByDate(new Date());
  }, [getTasksByDate]);

  const getUpcomingTasks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks
      .filter(task => new Date(task.date) >= today && !task.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time));
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter(task => task.completed);
  }, [tasks]);

  const getTasksByGoal = useCallback((goalId) => {
    return tasks.filter(task => task.goalId === goalId);
  }, [tasks]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      reminders,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      addReminder,
      removeReminder,
      getReminderForTask,
      dismissReminder,
      requestNotificationPermission,
      getTasksByDate,
      getTodayTasks,
      getUpcomingTasks,
      getCompletedTasks,
      getTasksByGoal,
      stats,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
