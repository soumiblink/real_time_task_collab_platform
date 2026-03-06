import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';

export default function Upcoming() {
  const { openEditModal } = useOutletContext();
  const { getUpcomingTasks } = useTasks();

  const tasks = getUpcomingTasks();

  const groupTasksByDate = () => {
    const groups = {};
    
    tasks.forEach((task) => {
      const date = new Date(task.date);
      const key = date.toDateString();
      
      if (!groups[key]) {
        groups[key] = {
          date,
          tasks: [],
        };
      }
      groups[key].tasks.push(task);
    });
    
    return Object.values(groups).sort((a, b) => a.date - b.date);
  };

  const groupedTasks = groupTasksByDate();

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {groupedTasks.length > 0 ? (
        groupedTasks.map((group) => (
          <section key={group.date.toDateString()} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {formatDate(group.date)}
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {group.tasks.length} Tasks
                </span>
              </h3>
            </div>
            <div className="space-y-3">
              {group.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={openEditModal} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">event_available</span>
          <p className="text-slate-500 mt-4">No upcoming tasks</p>
        </div>
      )}
    </div>
  );
}
