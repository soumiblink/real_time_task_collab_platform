import ProgressBar from './ProgressBar';

export default function GoalCard({ goal, onClick }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-slate-200/50 transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-40 bg-cover bg-center relative"
        style={{ backgroundImage: goal.imageUrl ? `url(${goal.imageUrl})` : undefined }}
      >
        {!goal.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">
            {goal.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {goal.title}
          </h3>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-6">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          <span>{formatDate(goal.deadline)}</span>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Progress
            </span>
            <span className="text-sm font-bold text-primary">{goal.progress}%</span>
          </div>
          <ProgressBar progress={goal.progress} />
        </div>
      </div>
    </div>
  );
}
