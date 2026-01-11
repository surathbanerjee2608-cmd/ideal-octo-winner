import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskGroup, DailyTaskStatus } from '../types';

interface StoreState {
    taskGroups: TaskGroup[];
    tasks: Task[];
    dailyStatuses: DailyTaskStatus[];

    addTaskGroup: (group: Omit<TaskGroup, 'id' | 'createdAt'>) => void;
    updateTaskGroup: (id: string, group: Partial<TaskGroup>) => void;
    deleteTaskGroup: (id: string) => void;

    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'active'>) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskActive: (id: string) => void;

    toggleTaskCompletion: (taskId: string, date: string) => void;
    getTaskStatus: (taskId: string, date: string) => boolean;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            taskGroups: [
                { id: '1', name: 'Career', color: 'bg-blue-500', createdAt: Date.now() },
                { id: '2', name: 'Fitness', color: 'bg-green-500', createdAt: Date.now() },
            ],
            tasks: [],
            dailyStatuses: [],

            addTaskGroup: (group) => set((state) => ({
                taskGroups: [...state.taskGroups, { ...group, id: uuidv4(), createdAt: Date.now() }]
            })),

            updateTaskGroup: (id, group) => set((state) => ({
                taskGroups: state.taskGroups.map((g) => g.id === id ? { ...g, ...group } : g)
            })),

            deleteTaskGroup: (id) => set((state) => ({
                taskGroups: state.taskGroups.filter((g) => g.id !== id),
                tasks: state.tasks.filter((t) => t.groupId !== id)
            })),

            addTask: (task) => set((state) => ({
                tasks: [...state.tasks, { ...task, id: uuidv4(), createdAt: Date.now(), active: true }]
            })),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                dailyStatuses: state.dailyStatuses.filter(s => s.taskId !== id)
            })),

            toggleTaskActive: (id) => set((state) => ({
                tasks: state.tasks.map((t) => t.id === id ? { ...t, active: !t.active } : t)
            })),

            toggleTaskCompletion: (taskId, date) => set((state) => {
                const existingStatus = state.dailyStatuses.find(s => s.taskId === taskId && s.date === date);
                if (existingStatus) {
                    return {
                        dailyStatuses: state.dailyStatuses.map(s =>
                            s.id === existingStatus.id
                                ? { ...s, completed: !s.completed, completedAt: !s.completed ? Date.now() : undefined }
                                : s
                        )
                    };
                } else {
                    return {
                        dailyStatuses: [...state.dailyStatuses, {
                            id: uuidv4(),
                            taskId,
                            date,
                            completed: true,
                            completedAt: Date.now()
                        }]
                    };
                }
            }),

            getTaskStatus: (taskId, date) => {
                const status = get().dailyStatuses.find(s => s.taskId === taskId && s.date === date);
                return status?.completed ?? false;
            }
        }),
        {
            name: 'daily-planner-storage',
        }
    )
);
