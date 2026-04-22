"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Task, UserStats, FocusSession, TaskStatus, User } from "@/types";
import { tasksApi, sessionsApi, statsApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AppContextType {
  user: User | null;
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
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    totalPoints: 0,
    totalFocusTime: 0,
    sessionsCompleted: 0,
    tasksCompleted: 0,
    streak: 0,
    xp: 0
  });
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.listPrioritized();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await statsApi.getMe();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await sessionsApi.history(50);
      setSessions(Array.isArray(data) ? data : (data.content || []));
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchTasks(), fetchStats(), fetchSessions()]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setTasks([]);
    router.push("/auth/login");
  }, [router]);

  // Initial load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        refreshData();
      } catch (e) {
        logout();
      }
    } else {
      setIsLoading(false);
    }
  }, [refreshData, logout]);

  const addTask = async (taskData: { title: string; description?: string; priority: string; deadline: string; plannedPomodoros?: number }) => {
    try {
      const formattedDeadline = taskData.deadline.includes('T')
        ? taskData.deadline.split('.')[0]
        : `${taskData.deadline}T23:59:59`;

      const response = await tasksApi.create({
        ...taskData,
        deadline: formattedDeadline,
        plannedPomodoros: taskData.plannedPomodoros || 1
      } as any);

      setTasks(prev => [response, ...prev]);
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const updateTaskStatus = async (id: string | number, status: TaskStatus) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const response = await tasksApi.update(id, {
        ...task,
        status
      });

      setTasks(prev => prev.map(t => t.id === id ? response : t));

      if (status === 'DONE') {
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id: string | number) => {
    try {
      await tasksApi.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const completeSession = async (duration: number, type: FocusSession['type'], taskId?: number | string) => {
    try {
      const startTime = new Date().toISOString().split('.')[0];

      const response = await sessionsApi.save({
        taskId: taskId || null,
        startTime: startTime,
        plannedDuration: duration,
        actualDuration: duration
      });

      // Update local stats from response
      setStats(prev => ({
        ...prev,
        totalPoints: response.newTotalPoints || prev.totalPoints + response.pointsEarned,
        level: response.newLevel || prev.level,
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalFocusTime: prev.totalFocusTime + duration
      }));

      if (response.leveledUp) {
        // Optionnel : Déclencher un effet visuel ici au lieu d'un alert
        console.log(`Level Up! ${response.newLevelTitle}`);
      }

      refreshData();
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
      user,
      tasks,
      stats,
      sessions,
      isLoading,
      addTask,
      updateTaskStatus,
      deleteTask,
      completeSession,
      getSortedTasks,
      refreshData,
      logout,
      setUser
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
