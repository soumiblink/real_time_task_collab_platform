import { useTasks } from '../context/TaskContext';

export default function TaskCard({ task, onEdit }) {
  const { toggleComplete, deleteTask } = useTasks();

  const getPriorityColor = () => {
    if (task.customColor) return task.customColor;
    const colorMap = {
      low: '#22c55e',
      medium: '#f97316',
      high: '#ef4444',
    };
    return colorMap[task.priority] || '#4848e5';
  };

  const priorityColor = getPriorityColor();
  
  // Check if using custom color
  const isCustomColor = !!task.customColor;
  
  // Get text color for badges (darker version)
  const getBadgeBgColor = () => {
    if (isCustomColor) return `${priorityColor}20`;
    if (task.priority === 'low') return '#dcfce7';
    if (task.priority === 'medium') return '#ffedd5';
    if (task.priority === 'high') return '#fee2e2';
    return '#e0e7ff';
  };
  
  const getBadgeTextColor = () => {
    if (isCustomColor) return priorityColor;
    if (task.priority === 'low') return '#16a34a';
    if (task.priority === 'medium') return '#ea580c';
    if (task.priority === 'high') return '#dc2626';
    return '#4848e5';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
        task.completed
          ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
          : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5'
      }`}
      style={!task.completed && isCustomColor ? { borderLeftColor: priorityColor, borderLeftWidth: '4px' } : {}}
      onClick={() => onEdit && onEdit(task)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleComplete(task.id);
        }}
        className="flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: task.completed ? priorityColor : 'transparent',
          borderColor: task.completed ? priorityColor : priorityColor,
        }}
      >
        {task.completed && (
          <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-bold text-slate-900 dark:text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            {formatDate(task.date)}, {formatTime(task.time)}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: getBadgeBgColor(),
              color: getBadgeTextColor(),
            }}
          >
            {task.priority}
          </span>
          {task.category && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              {task.category}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
}
