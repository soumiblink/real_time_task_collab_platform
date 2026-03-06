import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useGoals } from '../context/GoalContext';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import { useState, useMemo } from 'react';

export default function Dashboard() {
  const { openEditModal } = useOutletContext();
  const navigate = useNavigate();
  const { stats, getTodayTasks, tasks } = useTasks();
  const { goals } = useGoals();
  const [weekFilter, setWeekFilter] = useState('this'); // 'this' or 'next'

  const todayTasks = getTodayTasks();
  const activeGoals = goals.filter(g => g.progress < 100);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - currentDay);
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);
    endOfThisWeek.setHours(23, 59, 59, 999);
    
    const startOfNextWeek = new Date(endOfThisWeek);
    startOfNextWeek.setDate(endOfThisWeek.getDate() + 1);
    startOfNextWeek.setHours(0, 0, 0, 0);
    
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      if (weekFilter === 'this') {
        return taskDate >= startOfThisWeek && taskDate <= endOfThisWeek;
      } else {
        return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
      }
    }).slice(0, 4);
  }, [tasks, weekFilter]);

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-slate-500 text-sm font-medium">Total Tasks</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.total}</span>
            <span className="text-green-500 text-xs font-bold">+{todayTasks.length} today</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-slate-500 text-sm font-medium">Completed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.completed}</span>
            <span className="text-slate-400 text-xs font-medium">{completionPercentage}% rate</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-slate-500 text-sm font-medium">Pending</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.pending}</span>
            <span className="text-amber-500 text-xs font-bold">{stats.highPriority} high priority</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-slate-500 text-sm font-medium">Goals in Progress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{activeGoals.length}</span>
            <span className="text-primary text-xs font-bold">2 on track</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Section */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Daily Completion */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold mb-6">Daily Completion</h3>
            <div className="relative size-40">
              <svg className="size-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800 stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                />
                <path
                  className="text-primary stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{completionPercentage}%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Done</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              Great job! You've finished {stats.completed} tasks today. Just {stats.pending} more to reach your goal.
            </p>
          </div>

          {/* Goal Progress Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Goal Progress</h3>
              <button 
                onClick={() => navigate('/goals')}
                className="text-primary text-sm font-bold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {activeGoals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="font-bold">{goal.progress}%</span>
                  </div>
                  <ProgressBar progress={goal.progress} />
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Upcoming Tasks Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Upcoming Tasks</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setWeekFilter('this')}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                  weekFilter === 'this' 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                This Week
              </button>
              <button 
                onClick={() => setWeekFilter('next')}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                  weekFilter === 'next' 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Next Week
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={openEditModal} />
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No tasks for this period</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
