import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { goalService } from '../firebase/services';
import { useAuth } from './AuthContext';
import { useTasks } from './TaskContext';

const GoalContext = createContext();

export function GoalProvider({ children }) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time goal updates
  useEffect(() => {
    if (!user?.id) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const unsubscribe = goalService.subscribeToGoals(user.id, (goalList) => {
      setGoals(goalList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const addGoal = useCallback(async (goal) => {
    if (!user?.id) return null;
    return await goalService.addGoal(user.id, goal);
  }, [user?.id]);

  const updateGoal = useCallback(async (id, updates) => {
    if (!user?.id) return;
    await goalService.updateGoal(user.id, id, updates);
  }, [user?.id]);

  const deleteGoal = useCallback(async (id) => {
    if (!user?.id) return;
    await goalService.deleteGoal(user.id, id);
  }, [user?.id]);

  const updateProgress = useCallback(async (id, progress) => {
    if (!user?.id) return;
    await goalService.updateGoal(user.id, id, { 
      progress: Math.min(100, Math.max(0, progress)) 
    });
  }, [user?.id]);

  // Auto-calculate goal progress based on linked tasks
  const calculateGoalProgress = useCallback(async (goalId) => {
    if (!user?.id) return;
    
    const linkedTasks = tasks.filter(t => t.goalId === goalId);
    if (linkedTasks.length === 0) return;
    
    const completedTasks = linkedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedTasks / linkedTasks.length) * 100);
    
    await goalService.updateGoal(user.id, goalId, { progress });
  }, [user?.id, tasks]);

  const activeGoals = goals.filter(g => g.progress < 100);

  return (
    <GoalContext.Provider value={{
      goals,
      loading,
      addGoal,
      updateGoal,
      deleteGoal,
      updateProgress,
      calculateGoalProgress,
      activeGoals,
    }}>
      {children}
    </GoalContext.Provider>
  );
}

export const useGoals = () => useContext(GoalContext);
