import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useGoals } from '../context/GoalContext';
import { categories } from '../data/initialData';

export default function TaskModal({ isOpen, onClose, task, initialDate }) {
  const { addTask, updateTask, addReminder, removeReminder, getReminderForTask, requestNotificationPermission } = useTasks();
  const { goals } = useGoals();
  
  const getDefaultDate = () => {
    if (initialDate) return initialDate;
    return new Date().toISOString().split('T')[0];
  };

  const get12Hour = (time) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours) || 9;
    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;
    return hour;
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: getDefaultDate(),
    time: '09:00',
    priority: 'medium',
    category: 'Work',
    goalId: '',
    customColor: '',
  });

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    const getDefaultDate = () => {
      if (initialDate) return initialDate;
      return new Date().toISOString().split('T')[0];
    };

    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        date: task.date || new Date().toISOString().split('T')[0],
        time: task.time || '09:00',
        priority: task.priority || 'medium',
        category: task.category || 'Work',
        goalId: task.goalId || '',
        customColor: task.customColor || '',
      });
      
      // Check for existing reminder
      const existingReminder = getReminderForTask(task.id);
      if (existingReminder) {
        setReminderEnabled(true);
        // Convert ISO time to datetime-local format
        const reminderDate = new Date(existingReminder.reminderTime);
        reminderDate.setMinutes(reminderDate.getMinutes() - reminderDate.getTimezoneOffset());
        setReminderTime(reminderDate.toISOString().slice(0, 16));
      } else {
        setReminderEnabled(false);
        setReminderTime('');
      }
    } else {
      setFormData({
        title: '',
        description: '',
        date: getDefaultDate(),
        time: '09:00',
        priority: 'medium',
        category: 'Work',
        goalId: '',
        customColor: '',
      });
      setReminderEnabled(false);
      setReminderTime('');
    }
  }, [task, isOpen, getReminderForTask, initialDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Request notification permission if reminder is enabled
    if (reminderEnabled && reminderTime) {
      await requestNotificationPermission();
    }

    if (task) {
      updateTask(task.id, formData);
      
      // Handle reminder
      if (reminderEnabled && reminderTime) {
        const reminderDateTime = new Date(reminderTime);
        const taskDateTime = new Date(`${formData.date}T${formData.time}`);
        
        // Only add reminder if it's before the task time
        if (reminderDateTime < taskDateTime) {
          addReminder(task.id, formData.title, reminderTime, formData.date);
        }
      } else {
        removeReminder(task.id);
      }
    } else {
      const newTask = addTask(formData);
      
      // Handle reminder for new task
      if (reminderEnabled && reminderTime) {
        const reminderDateTime = new Date(reminderTime);
        const taskDateTime = new Date(`${formData.date}T${formData.time}`);
        
        if (reminderDateTime < taskDateTime) {
          addReminder(newTask.id, formData.title, reminderTime, formData.date);
        }
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-white' },
    { value: 'medium', label: 'Medium', color: 'orange', bg: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-white' },
    { value: 'high', label: 'High', color: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-white' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-slate-400 resize-none"
              rows="3"
              placeholder="Add a description..."
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Date
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-base">calendar_month</span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white text-sm font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Time
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={get12Hour(formData.time)}
                  onChange={(e) => {
                    const [hours, minutes] = formData.time.split(':');
                    const isPM = formData.time.includes('PM') || (parseInt(hours) >= 12);
                    let newHour = parseInt(e.target.value);
                    if (isPM && newHour !== 12) newHour += 12;
                    if (!isPM && newHour === 12) newHour = 0;
                    setFormData({ ...formData, time: `${String(newHour).padStart(2, '0')}:${minutes || '00'}` });
                  }}
                  className="flex-1 py-2 px-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-semibold text-sm text-center"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <span className="text-slate-600 dark:text-slate-400 font-bold text-sm">:</span>
                <select
                  value={formData.time.split(':')[1] || '00'}
                  onChange={(e) => setFormData({ ...formData, time: `${formData.time.split(':')[0] || '09'}:${e.target.value}` })}
                  className="w-14 py-2 px-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-semibold text-sm text-center"
                >
                  {['00', '15', '30', '45'].map((min) => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
                <select
                  value={parseInt(formData.time.split(':')[0] || '9') >= 12 ? 'PM' : 'AM'}
                  onChange={(e) => {
                    const [hours, minutes] = formData.time.split(':');
                    let hour = parseInt(hours) || 9;
                    if (e.target.value === 'PM' && hour < 12) hour += 12;
                    if (e.target.value === 'AM' && hour >= 12) hour -= 12;
                    setFormData({ ...formData, time: `${String(hour).padStart(2, '0')}:${minutes || '00'}` });
                  }}
                  className="w-16 py-2 px-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold text-sm text-center"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reminder</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-slate-300 peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all dark:after:bg-slate-300 peer-checked:bg-primary"></div>
              </label>
            </div>
            {reminderEnabled && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Remind me at
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
                    <input
                      type="date"
                      value={reminderTime ? reminderTime.split('T')[0] : ''}
                      onChange={(e) => setReminderTime(`${e.target.value}T${reminderTime ? reminderTime.split('T')[1] : '09:00'}`)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                    <select
                      value={reminderTime ? reminderTime.split('T')[1]?.slice(0, 5)?.split(':')[0] || '09' : '09'}
                      onChange={(e) => {
                        const datePart = reminderTime ? reminderTime.split('T')[0] : new Date().toISOString().split('T')[0];
                        const currentTime = reminderTime ? reminderTime.split('T')[1]?.slice(0, 5) || '09:00' : '09:00';
                        const currentMin = currentTime.split(':')[1] || '00';
                        setReminderTime(`${datePart}T${e.target.value}:${currentMin}`);
                      }}
                      className="px-2 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-semibold text-sm text-center min-w-[55px]"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
                      ))}
                    </select>
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">:</span>
                    <select
                      value={reminderTime ? reminderTime.split('T')[1]?.slice(3, 5) || '00' : '00'}
                      onChange={(e) => {
                        const datePart = reminderTime ? reminderTime.split('T')[0] : new Date().toISOString().split('T')[0];
                        const currentHour = reminderTime ? reminderTime.split('T')[1]?.slice(0, 2) || '09' : '09';
                        setReminderTime(`${datePart}T${currentHour}:${e.target.value}`);
                      }}
                      className="px-2 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-semibold text-sm text-center min-w-[50px]"
                    >
                      {['00', '15', '30', '45'].map((min) => (
                        <option key={min} value={min}>{min}</option>
                      ))}
                    </select>
                    <select
                      value={reminderTime && parseInt(reminderTime.split('T')[1]?.slice(0, 2) || '9') >= 12 ? 'PM' : 'AM'}
                      onChange={(e) => {
                        const datePart = reminderTime ? reminderTime.split('T')[0] : new Date().toISOString().split('T')[0];
                        const currentHour = parseInt(reminderTime ? reminderTime.split('T')[1]?.slice(0, 2) || '9' : '9');
                        let hour = currentHour;
                        if (e.target.value === 'PM' && hour < 12) hour += 12;
                        if (e.target.value === 'AM' && hour >= 12) hour -= 12;
                        const currentMin = reminderTime ? reminderTime.split('T')[1]?.slice(3, 5) || '00' : '00';
                        setReminderTime(`${datePart}T${String(hour).padStart(2, '0')}:${currentMin}`);
                      }}
                      className="px-2 py-2 bg-primary text-white border border-primary rounded-lg font-semibold text-sm text-center min-w-[55px]"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  You'll be notified before the task time
                </p>
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: option.value })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                    formData.priority === option.value
                      ? `${option.bg} ${option.text} shadow-lg`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formData.category === cat.name
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Link to Goal (Optional)
            </label>
            <select
              value={formData.goalId}
              onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
            >
              <option value="">No goal linked</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </div>

          {/* Custom Color */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Custom Color (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.customColor || '#4848e5'}
                onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                className="w-14 h-12 rounded-xl cursor-pointer border-2 border-slate-200 dark:border-slate-700"
              />
              <input
                type="text"
                value={formData.customColor || '#4848e5'}
                onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white font-mono text-sm"
                placeholder="#4848e5"
              />
              {formData.customColor && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, customColor: '' })}
                  className="p-3 text-slate-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium"
            >
              {task ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
