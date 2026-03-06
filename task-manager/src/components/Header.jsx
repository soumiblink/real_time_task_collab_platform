import { useState, useRef, useEffect } from 'react';
import NotificationBell from './NotificationBell';

export default function Header({ title, onAddTask, onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showMobileSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMobileSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowMobileSearch(false);
  };

  return (
    <header className="h-14 md:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 md:px-6 shrink-0">
      {/* Left Section - Menu & Title */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        {showMobileSearch ? (
          <form onSubmit={handleSearch} className="flex items-center gap-1">
            <button 
              type="button"
              onClick={handleClearSearch}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <input
              ref={searchRef}
              className="w-32 md:w-48 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        ) : (
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">
            {title}
          </h2>
        )}
      </div>
      
      {/* Right Section - Search & Actions */}
      <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:block relative w-56 lg:w-72 flex-shrink-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white placeholder-slate-400"
            placeholder="Search tasks..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search Button */}
        <button 
          onClick={() => setShowMobileSearch(true)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        
        {/* Notification Bell with Dropdown */}
        <NotificationBell />
        
        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="bg-primary hover:bg-primary/90 text-white px-3 md:px-4 py-2 rounded-xl flex items-center gap-1 font-semibold text-sm transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
