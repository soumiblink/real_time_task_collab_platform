import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { routineService, taskService } from '../firebase/services';
import { useAuth } from './AuthContext';

const RoutineContext = createContext();

export function RoutineProvider({ children }) {
  const { user } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time routine updates
  useEffect(() => {
    if (!user?.id) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    const unsubscribe = routineService.subscribeToRoutines(user.id, (routineList) => {
      setRoutines(routineList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const addRoutine = useCallback(async (routine) => {
    if (!user?.id) return null;
    return await routineService.addRoutine(user.id, routine);
  }, [user?.id]);

  const updateRoutine = useCallback(async (id, updates) => {
    if (!user?.id) return;
    await routineService.updateRoutine(user.id, id, updates);
  }, [user?.id]);

  const deleteRoutine = useCallback(async (id) => {
    if (!user?.id) return;
    await routineService.deleteRoutine(user.id, id);
  }, [user?.id]);

  const getRoutinesByDay = useCallback((day) => {
    return routines.filter(r => r.days && r.days.includes(day));
  }, [routines]);

  // Generate tasks from routine for a specific day
  const generateTasksFromRoutine = useCallback(async (routineId, date) => {
    if (!user?.id) return;
    
    const routine = routines.find(r => r.id === routineId);
    if (!routine || !routine.tasks) return;

    const dateStr = new Date(date).toISOString().split('T')[0];
    
    // Check if tasks already exist for this date from this routine
    // (You might want to add a routineId field to tasks to track this)
    
    // Generate tasks
    for (const task of routine.tasks) {
      await taskService.addTask(user.id, {
        title: task.title,
        description: `Generated from routine: ${routine.title}`,
        date: dateStr,
        time: task.time,
        priority: 'medium',
        category: 'Routine',
        routineId: routine.id
      });
    }
  }, [user?.id, routines]);

  return (
    <RoutineContext.Provider value={{
      routines,
      loading,
      addRoutine,
      updateRoutine,
      deleteRoutine,
      getRoutinesByDay,
      generateTasksFromRoutine,
    }}>
      {children}
    </RoutineContext.Provider>
  );
}

export const useRoutines = () => useContext(RoutineContext);
