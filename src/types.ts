export type Frequency = 'Daily' | 'Weekly' | 'One-time';
export type Priority = 'Low' | 'Medium' | 'High';

export interface TaskGroup {
  id: string;
  name: string;
  color: string; // Hex code or Tailwind color class
  icon?: string; 
  createdAt: number;
}

export interface Task {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  frequency: Frequency;
  priority?: Priority;
  estimatedTime?: string;
  active: boolean;
  createdAt: number;
}

export interface DailyTaskStatus {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: number;
}
