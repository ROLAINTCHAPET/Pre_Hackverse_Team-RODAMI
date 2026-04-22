"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Task, UserStats, FocusSession, TaskStatus } from "@/types";
import { apiFetch } from "@/lib/api";

interface AppContextType {
  tasks: Task[];
  stats: UserStats;
  sessions: FocusSession[];
  isLoading: boolean;
  addTask: (task: { title: string; description?: string; priority: string; deadline: string; plannedPomodoros?: number }) => Promise<void>;
  updateTaskStatus: (id: string | number, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string | number) => Promise<void>;
  completeSession: (duration: number, type: FocusSession['type'], taskId?: number | string) => Promise<void>;
  getSortedTasks: () => Task[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    totalFocusTime: 0,
    sessionsCompleted: 0,
    tasksCompleted: 0,
    streak: 0,
  });
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/tasks/prioritized');
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiFetch('/stats/me');
      setStats({
        level: data.level,
        xp: data.totalPoints || 0,
        totalFocusTime: data.totalFocusTime || 0,
        sessionsCompleted: data.sessionsCompleted || 0,
        tasksCompleted: data.tasksCompleted || 0,
        streak: data.streak || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchSessions = async () => {
    try {
      // Le guide ne mentionne pas explicitement cet endpoint mais on garde la logique paginée standard
      const data = await apiFetch('/sessions/history?size=50');
      setSessions(Array.isArray(data) ? data : (data.content || []));
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchTasks(), fetchStats(), fetchSessions()]);
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      Promise.resolve().then(() => refreshData());
    } else {
      Promise.resolve().then(() => setIsLoading(false));
    }
  }, [refreshData]);

  const addTask = async (taskData: { title: string; description?: string; priority: string; deadline: string; plannedPomodoros?: number }) => {
    try {
      // Formatage de la date pour correspondre à "2026-05-20T18:00:00"
      const formattedDeadline = taskData.deadline.includes('T') 
        ? taskData.deadline.split('.')[0] 
        : `${taskData.deadline}T23:59:59`;

      const response = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          ...taskData,
          deadline: formattedDeadline,
          plannedPomodoros: taskData.plannedPomodoros || 1
        }),
      });
      setTasks(prev => [response, ...prev]);
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const updateTaskStatus = async (id: string | number, status: TaskStatus) => {
    try {
      // Le backend attend une mise à jour complète ou spécifique
      // Si le backend n'a pas d'endpoint /status, on utilise le PUT global
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const response = await apiFetch(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...task,
          status
        }),
      });

      setTasks(prev => prev.map(t => t.id === id ? response : t));
      
      if (status === 'DONE') {
        fetchStats(); // Update XP/Level
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id: string | number) => {
    try {
      await apiFetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const completeSession = async (duration: number, type: FocusSession['type'], taskId?: number | string) => {
    try {
      // Formatage de la date ISO sans les millisecondes pour le backend
      const startTime = new Date().toISOString().split('.')[0];

      const response = await apiFetch('/sessions/save', {
        method: 'POST',
        body: JSON.stringify({
          taskId: taskId || null,
          startTime: startTime,
          plannedDuration: duration,
          actualDuration: duration
        }),
      });

      // Mise à jour immédiate des stats depuis la réponse (Guide ligne 92)
      setStats(prev => ({
        ...prev,
        xp: response.totalPoints || response.newTotalPoints || prev.xp + response.pointsEarned,
        level: response.newLevel || prev.level,
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalFocusTime: prev.totalFocusTime + duration
      }));

      if (response.leveledUp) {
        alert(`Félicitations ! Vous avez atteint le niveau ${response.newLevel} : ${response.newLevelTitle}`);
      }
      
      // On rafraîchit quand même pour être sûr
      fetchStats();
      fetchSessions();
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  const calculateScore = (task: Task) => {
    if (task.status === 'DONE') return -1;
    const priorityScore = { HIGH: 3, MEDIUM: 2, LOW: 1 }[task.priority as 'HIGH' | 'MEDIUM' | 'LOW'] || 1;
    const deadline = new Date(task.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let urgencyScore = 0;
    if (diffDays <= 1) urgencyScore = 5;
    else if (diffDays <= 3) urgencyScore = 3;
    else if (diffDays <= 7) urgencyScore = 1;

    const investmentScore = task.status === 'IN_PROGRESS' ? 1 : 0;
    return (priorityScore * 3) + urgencyScore + investmentScore;
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => calculateScore(b) - calculateScore(a));
  };

  return (
    <AppContext.Provider value={{
      tasks,
      stats,
      sessions,
      isLoading,
      addTask,
      updateTaskStatus,
      deleteTask,
      completeSession,
      getSortedTasks,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
