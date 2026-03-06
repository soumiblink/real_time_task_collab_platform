import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

export default function Calendar() {
  const { openEditModal, openAddModal } = useOutletContext();
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // Get days in current month view
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Previous month days
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month days to fill grid
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [currentDate]);

  const getTasksForDate = (date) => {
    const targetDate = date.toDateString();
    return tasks.filter(task => new Date(task.date).toDateString() === targetDate);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  const handleAddFromCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    openAddModal && openAddModal(dateStr);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedTasks = getTasksForDate(selectedDate);

  const getTaskColor = (priority) => {
    if (priority === 'high') return '#ef4444';
    if (priority === 'medium') return '#f97316';
    return '#22c55e';
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getHeaderText = () => {
    if (view === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (view === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      if (start.getMonth() === end.getMonth()) {
        return `${monthNames[start.getMonth()]} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}`;
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const navigate = (direction) => {
    if (view === 'month') navigateMonth(direction);
    else if (view === 'week') navigateWeek(direction);
    else navigateDay(direction);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full">
      {/* Calendar Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {getHeaderText()}
            </h1>
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
              <button 
                onClick={() => navigate(-1)} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button 
                onClick={goToToday} 
                className="px-3 py-1 text-xs sm:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                Today
              </button>
              <button 
                onClick={() => navigate(1)} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {['Month', 'Week', 'Day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v.toLowerCase())}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
                  view === v.toLowerCase()
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Month View */}
        {view === 'month' && (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {dayNames.map((day) => (
                <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1">
              {monthDays.map((day, index) => {
                const dayTasks = getTasksForDate(day.date);
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-colors ${
                      !day.isCurrentMonth
                        ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600'
                        : isSelected(day.date)
                        ? 'bg-primary/5'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center text-xs md:text-sm font-semibold ${
                      isToday(day.date) ? 'w-6 h-6 md:w-7 md:h-7 bg-primary text-white rounded-full' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day.date.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="px-1 py-0.5 text-[8px] md:text-[10px] rounded truncate font-medium text-white"
                            style={{ 
                              backgroundColor: task.completed ? '#64748b' : getTaskColor(task.priority),
                              opacity: task.completed ? 0.6 : 1
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-[8px] md:text-[10px] text-primary font-medium">
                            +{dayTasks.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {view === 'week' && (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {/* Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="py-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{dayNames[day.getDay()]}</div>
                  <div className={`text-lg font-bold mt-1 ${isToday(day) ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
            {/* Week Days Grid */}
            <div className="grid grid-cols-7 flex-1 max-h-[400px] overflow-y-auto">
              {weekDays.map((day) => {
                const dayTasks = getTasksForDate(day);
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`min-h-[120px] p-1 border-r border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      isSelected(day) ? 'bg-primary/5' : ''
                    }`}
                  >
                    {dayTasks.length > 0 ? (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal && openEditModal(task);
                          }}
                          className="p-1.5 mb-1 rounded text-[10px] cursor-pointer text-white font-medium truncate"
                          style={{ 
                            backgroundColor: task.completed ? '#64748b' : getTaskColor(task.priority),
                          }}
                        >
                          <div className="truncate">{task.title}</div>
                          <div className="text-[9px] opacity-80">{formatTime(task.time)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-slate-300 dark:text-slate-600 text-xs">-</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourTasks = tasks.filter(task => {
                const taskHour = parseInt(task.time.split(':')[0]);
                return taskHour === hour && new Date(task.date).toDateString() === currentDate.toDateString();
              });
              
              const timeLabel = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
              
              return (
                <div key={hour} className="flex border-b border-slate-200 dark:border-slate-700 min-h-[60px]">
                  <div className="w-16 md:w-20 p-2 text-xs text-slate-400 dark:text-slate-500 font-medium border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
                    {timeLabel}
                  </div>
                  <div className="flex-1 p-1">
                    {hourTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => openEditModal && openEditModal(task)}
                        className="p-2 mb-1 rounded-lg cursor-pointer"
                        style={{ 
                          borderLeft: `4px solid ${getTaskColor(task.priority)}`,
                          backgroundColor: `${getTaskColor(task.priority)}15`
                        }}
                      >
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">
                          {task.title}
                        </div>
                        <div className="text-xs text-slate-500">{task.category} • {formatTime(task.time)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Date Panel */}
      <div className="w-full xl:w-80 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col max-h-[400px] xl:max-h-[calc(100vh-200px)]">
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              <button onClick={goToToday} className="text-xs text-primary font-medium hover:underline">
                Today
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
            {selectedTasks.length > 0 ? (
              selectedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => openEditModal && openEditModal(task)}
                  className="p-3 rounded-xl border-l-4 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                  style={{ borderLeftColor: getTaskColor(task.priority) }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getTaskColor(task.priority) }}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{formatTime(task.time)}</span>
                  </div>
                  <h4 className={`font-semibold text-sm ${task.completed ? 'line-through opacity-60' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">event</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">No tasks for this date</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleAddFromCalendar}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              + Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
