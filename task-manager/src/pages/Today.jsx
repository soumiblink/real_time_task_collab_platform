import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

export default function Today() {
  const { openEditModal } = useOutletContext();
  const { getTodayTasks, toggleComplete } = useTasks();

  const today = new Date();
  const tasks = getTodayTasks().sort((a, b) => a.time.localeCompare(b.time));

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (task) => {
    if (task.customColor) return task.customColor;
    const colors = { low: 'green', medium: 'orange', high: 'red' };
    return colors[task.priority] || 'primary';
  };

  const getPriorityBgClass = (task) => {
    const color = getPriorityColor(task);
    if (color === 'green') return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (color === 'orange') return 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    if (color === 'red') return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-primary/10 text-primary';
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Today's Schedule</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{formatDate(today)} • {remainingTasks} tasks remaining</p>
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-5 md:left-20 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800"></div>

        {tasks.map((task) => {
          const color = getPriorityColor(task);
          const isCompleted = task.completed;
          const bgClass = getPriorityBgClass(task);

          return (
            <div key={task.id} className="flex gap-3 md:gap-8 mb-8 md:mb-12 relative group">
              <div className="w-8 md:w-12 text-right flex-shrink-0">
                <span className="text-xs md:text-sm font-bold text-slate-400">{formatTime(task.time)}</span>
              </div>
              <div className={`absolute left-5 md:left-20 top-2 w-3 h-3 rounded-full border-2 -translate-x-1/2 z-10 ${
                isCompleted ? 'bg-primary border-white dark:border-slate-900' : `bg-${color}-500 border-white dark:border-slate-900`
              }`}></div>
              <div className="flex-1">
                <div
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    isCompleted
                      ? 'border-slate-200 dark:border-slate-800 opacity-70'
                      : `border-slate-200 dark:border-slate-800`
                  }`}
                  onClick={() => openEditModal && openEditModal(task)}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleComplete(task.id);
                      }}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${bgClass}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{formatTime(task.time)}</span>
                      </div>
                      <h4 className={`text-sm md:text-lg font-bold text-slate-900 dark:text-white ${isCompleted ? 'line-through' : ''}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{task.description}</p>
                      )}
                      {task.category && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                            #{task.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">event_available</span>
            <p className="text-slate-500 dark:text-slate-400 mt-4">No tasks scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
}
