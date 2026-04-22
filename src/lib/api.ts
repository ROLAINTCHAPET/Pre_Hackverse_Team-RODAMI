import { AuthResponse, Task, UserStats, SessionSaveRequest, SessionSaveResult, LeaderboardEntry } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pre-hackverse-team-rodami.onrender.com';
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur API: ${response.status}`);
  }

  return response.json();
};

export const authApi = {
  login: (credentials: any): Promise<AuthResponse> =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (userData: any): Promise<AuthResponse> =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

export const tasksApi = {
  list: (page = 0, size = 20): Promise<any> =>
    apiFetch(`/tasks?page=${page}&size=${size}`),

  listPrioritized: (): Promise<Task[]> =>
    apiFetch('/tasks/prioritized'),

  create: (task: Partial<Task>): Promise<Task> =>
    apiFetch('/tasks', { method: 'POST', body: JSON.stringify(task) }),

  update: (id: string | number, task: Partial<Task>): Promise<Task> =>
    apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),

  delete: (id: string | number): Promise<void> =>
    apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
};

export const sessionsApi = {
  save: (session: SessionSaveRequest): Promise<SessionSaveResult> =>
    apiFetch('/sessions/save', { method: 'POST', body: JSON.stringify(session) }),

  history: (size = 50): Promise<any> =>
    apiFetch(`/sessions/history?size=${size}`),
};

export const statsApi = {
  getMe: (): Promise<UserStats> =>
    apiFetch('/stats/me'),

  getLeaderboard: (limit = 10): Promise<LeaderboardEntry[]> =>
    apiFetch(`/stats/leaderboard?limit=${limit}`),
};
