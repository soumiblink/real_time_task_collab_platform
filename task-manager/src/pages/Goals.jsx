import { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import { useTasks } from '../context/TaskContext';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';

export default function Goals() {
  const { goals, deleteGoal } = useGoals();
  const { getTasksByGoal } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAdd = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDelete = async (goal, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goal.id);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return goal.progress < 100;
    if (filter === 'completed') return goal.progress === 100;
    return true;
  });

  // Calculate overall stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const activeGoals = goals.filter(g => g.progress < 100).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Goals</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalGoals}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-semibold">Active</p>
          <p className="text-2xl font-bold text-primary">{activeGoals}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-semibold">Completed</p>
          <p className="text-2xl font-bold text-green-500">{completedGoals}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Your Goals</h2>
        <div className="flex gap-2 ml-auto">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-slate-500 dark:text-slate-400 mb-6">Track and manage your long-term objectives and vision.</p>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const linkedTasks = getTasksByGoal(goal.id);
          return (
            <div key={goal.id} className="relative group">
              <GoalCard 
                goal={goal} 
                onClick={() => handleEdit(goal)} 
                linkedTasksCount={linkedTasks.length}
              />
              {/* Quick action buttons on hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(goal);
                  }}
                  className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                  onClick={(e) => handleDelete(goal, e)}
                  className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Create New Goal Card */}
        <button
          onClick={handleAdd}
          className="bg-white dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-[320px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all mb-4">
            <span className="material-symbols-outlined text-3xl font-bold">add</span>
          </div>
          <p className="text-slate-900 dark:text-white font-bold text-lg">Create New Goal</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Define your next milestone</p>
        </button>
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">flag</span>
          <p className="text-slate-500 dark:text-slate-400 mt-4">No goals found</p>
        </div>
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
      />
    </div>
  );
}
