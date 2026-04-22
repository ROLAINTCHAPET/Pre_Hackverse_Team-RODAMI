export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Badge {
  id: string | number;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface User {
  id: string | number;
  username: string;
  email: string;
  totalPoints: number;
  level: number;
  levelTitle: string;
  badges: Badge[];
}

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  plannedPomodoros: number;
  deadline: string; // ISO String
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SessionSaveRequest {
  taskId: string | number | null;
  startTime: string; // ISO String
  plannedDuration: number; // minutes
  actualDuration: number;  // minutes
}

export interface SessionSaveResult {
  pointsEarned: number;
  leveledUp: boolean;
  newLevel: number;
  newLevelTitle: string;
  newTotalPoints?: number;
}

export interface UserStats {
  level: number;
  totalPoints: number;
  totalFocusTime: number; // minutes
  sessionsCompleted: number;
  tasksCompleted: number;
  streak: number;
  completionRate?: number;
  nextLevelXp?: number;
}

export interface LeaderboardEntry {
  username: string;
  totalPoints: number;
  level: number;
  levelTitle: string;
}

export interface FocusSession {
  id: string | number;
  startTime: string;
  duration: number; // minutes
  type: 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK';
  xpEarned: number;
  task?: Task;
}
