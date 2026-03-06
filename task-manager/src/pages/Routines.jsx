import { useState } from 'react';
import { useRoutines } from '../context/RoutineContext';
import { useTasks } from '../context/TaskContext';
import RoutineModal from '../components/RoutineModal';

const templates = [
  {
    id: 'template-1',
    title: 'Morning Workout',
    category: 'Fitness',
    description: 'Boost your energy levels with a quick 30-min exercise circuit.',
    icon: 'fitness_center',
    color: '#22c55e',
    tasks: [
      { title: '5 min stretching', time: '07:30' },
      { title: '20 min cardio', time: '07:35' },
      { title: '5 min cool down', time: '07:55' },
    ],
  },
  {
    id: 'template-2',
    title: 'Evening Wind Down',
    category: 'Health',
    description: 'Prepare your mind for deep sleep with a consistent shut-down ritual.',
    icon: 'bedtime',
    color: '#8b5cf6',
    tasks: [
      { title: 'Review accomplishments', time: '21:00' },
      { title: 'Plan tomorrow', time: '21:20' },
      { title: 'Read for 15 min', time: '21:40' },
      { title: 'Meditation', time: '21:55' },
    ],
  },
  {
    id: 'template-3',
    title: 'Deep Work Prep',
    category: 'Productivity',
    description: 'Eliminate distractions and set up your workspace for peak focus.',
    icon: 'terminal',
    color: '#3b82f6',
    tasks: [
      { title: 'Clear workspace', time: '09:00' },
      { title: 'Check emails', time: '09:10' },
      { title: 'Set priorities', time: '09:20' },
      { title: 'Start focus session', time: '09:30' },
    ],
  },
];

export default function Routines() {
  const { routines, addRoutine, deleteRoutine } = useRoutines();
  const { addTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [showTemplates, setShowTemplates] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredRoutines = routines.filter(r => r.days.includes(selectedDay));

  const handleAdd = () => {
    setEditingRoutine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const handleDelete = async (routine) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      await deleteRoutine(routine.id);
    }
  };

  const handleUseTemplate = (template) => {
    const routineData = {
      title: template.title,
      startTime: template.tasks[0].time,
      color: template.color,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      tasks: template.tasks,
    };
    addRoutine(routineData);
    setShowTemplates(false);
  };

  const handleGenerateTasks = (routine) => {
    const today = new Date();
    const dayIndex = days.indexOf(selectedDay);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));

    routine.tasks.forEach((task) => {
      addTask({
        title: task.title,
        description: '',
        date: targetDate.toISOString().split('T')[0],
        time: task.time,
        priority: 'medium',
        category: 'Routine',
      });
    });

    alert(`Generated ${routine.tasks.length} tasks for ${selectedDay}`);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Routines</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Automate your recurring workflow and save time.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Templates
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="hidden sm:inline">Create Routine</span>
          </button>
        </div>
      </div>

      {/* Templates Section - Collapsible */}
      {showTemplates && (
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Start Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleUseTemplate(template)}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${template.color}20`, color: template.color }}
                  >
                    <span className="material-symbols-outlined">{template.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{template.title}</h4>
                    <p className="text-xs text-slate-500">{template.category}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{template.description}</p>
                <button className="mt-3 text-sm text-primary font-medium group-hover:underline">
                  Use Template →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Days Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-fit">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors ${
              selectedDay === day
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Active Routine Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
        {filteredRoutines.map((routine) => (
          <div key={routine.id} className="xl:col-span-2 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="flex gap-3 md:gap-4 items-center">
                <div
                  className="w-10 md:w-12 h-10 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${routine.color}20`, color: routine.color }}
                >
                  <span className="material-symbols-outlined text-xl md:text-3xl">light_mode</span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{routine.title}</h3>
                  <p className="text-slate-500 text-sm">Starts at {formatTime(routine.startTime)} • {routine.tasks.length} tasks</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(routine)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(routine)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-3 flex-1">
              {routine.tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30"
                >
                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex-shrink-0"></div>
                  <span className="flex-1 text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium truncate">{task.title}</span>
                  <span className="text-xs font-bold text-slate-400 flex-shrink-0">{formatTime(task.time)}</span>
                </div>
              ))}
            </div>
            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex -space-x-2 order-2 sm:order-1">
                {days.map((day) => (
                  <div
                    key={day}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold ${
                      routine.days.includes(day)
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {day.charAt(0)}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleGenerateTasks(routine)}
                className="bg-primary text-white px-4 md:px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all order-1 sm:order-2"
              >
                Generate Tasks
              </button>
            </div>
          </div>
        ))}

        {filteredRoutines.length === 0 && (
          <div className="xl:col-span-2 text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">sync</span>
            <p className="text-slate-500 mt-4">No routines scheduled for {selectedDay}</p>
            <button
              onClick={handleAdd}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              Create Routine
            </button>
          </div>
        )}
      </div>

      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoutine(null);
        }}
        routine={editingRoutine}
      />
    </div>
  );
}
