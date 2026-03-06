import { useState, useEffect } from 'react';
import { useRoutines } from '../context/RoutineContext';

export default function RoutineModal({ isOpen, onClose, routine }) {
  const { addRoutine, updateRoutine } = useRoutines();

  const [formData, setFormData] = useState({
    title: '',
    startTime: '07:30',
    color: '#4848e5',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    tasks: [{ title: '', time: '' }],
  });

  useEffect(() => {
    if (routine) {
      setFormData({
        title: routine.title || '',
        startTime: routine.startTime || '07:30',
        color: routine.color || '#4848e5',
        days: routine.days || [],
        tasks: routine.tasks || [{ title: '', time: '' }],
      });
    } else {
      setFormData({
        title: '',
        startTime: '07:30',
        color: '#4848e5',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        tasks: [{ title: '', time: '' }],
      });
    }
  }, [routine, isOpen]);

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setFormData({ ...formData, tasks: newTasks });
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: '', time: '' }],
    }));
  };

  const removeTask = (index) => {
    const newTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.days.length === 0) return;

    const filteredTasks = formData.tasks.filter(t => t.title.trim());
    const routineData = { ...formData, tasks: filteredTasks };

    if (routine) {
      updateRoutine(routine.id, routineData);
    } else {
      addRoutine(routineData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {routine ? 'Edit Routine' : 'Create Routine'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Routine Name
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="e.g., Morning Routine"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Repeat Days
            </label>
            <div className="flex gap-2">
              {allDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                    formData.days.includes(day)
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tasks
            </label>
            <div className="space-y-2">
              {formData.tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Task title"
                  />
                  <input
                    type="time"
                    value={task.time}
                    onChange={(e) => handleTaskChange(index, 'time', e.target.value)}
                    className="w-32 px-2 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTask}
                className="flex items-center gap-2 text-sm text-primary font-semibold"
              >
                <span className="material-symbols-outlined">add</span>
                Add Task
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {routine ? 'Save Changes' : 'Create Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
