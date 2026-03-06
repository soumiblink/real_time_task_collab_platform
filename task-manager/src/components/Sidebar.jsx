import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/today', icon: 'today', label: 'Today' },
  { path: '/upcoming', icon: 'upcoming', label: 'Upcoming' },
  { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { path: '/goals', icon: 'track_changes', label: 'Goals' },
  { path: '/routines', icon: 'autorenew', label: 'Routines' },
];

export default function Sidebar({ onNavigate }) {
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { stats } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="w-64 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center text-white flex-shrink-0">
          <span className="material-symbols-outlined"> task_alt</span>
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">EaseMyTask</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Task Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 md:px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-medium truncate">{item.label}</span>
            {item.path === '/' && stats.pending > 0 && (
              <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                {stats.pending}
              </span>
            )}
          </NavLink>
        ))}

        <NavLink
          to="/profile"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg mt-4 transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined flex-shrink-0">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
      </nav>

      <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl"
        >
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-xl flex-shrink-0">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0 overflow-hidden">
            {(user?.avatar || profile?.avatar) ? (
              <img src={user?.avatar || profile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-slate-900 dark:text-white">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            handleLogout();
            if (onNavigate) onNavigate();
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined flex-shrink-0">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
