import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Check, Plus, Trash2, Calendar as CalendarIcon, X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';


export function DailyView() {
    const {
        tasks, taskGroups, dailyStatuses,
        toggleTaskCompletion, addTask, deleteTask
    } = useStore();

    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');

    const today = format(new Date(), 'yyyy-MM-dd');
    const displayDate = format(new Date(), 'EEEE, MMMM do');

    // Filter Active Tasks
    const activeTasks = tasks.filter(t => t.active);

    // Calculate Progress
    const todayStatuses = dailyStatuses.filter(s => s.date === today && s.completed);
    const totalTasks = activeTasks.length;
    const completedCount = activeTasks.filter(t =>
        todayStatuses.some(s => s.taskId === t.id)
    ).length;

    const progress = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !selectedGroupId) return;

        addTask({
            title: newTaskTitle,
            groupId: selectedGroupId,
            frequency: 'Daily', // Default for V1
        });
        setNewTaskTitle('');
        setIsAdding(false);
    };

    const isCompleted = (taskId: string) => {
        return todayStatuses.some(s => s.taskId === taskId);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">{displayDate}</h1>
                <div className="flex items-center gap-3 mt-2 text-slate-500 text-sm">
                    <span>{completedCount} / {totalTasks} tasks completed</span>
                    <span className="text-slate-300">•</span>
                    <span>{progress}% done</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-slate-900 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-8">
                {taskGroups.map(group => {
                    const groupTasks = activeTasks.filter(t => t.groupId === group.id);
                    if (groupTasks.length === 0) return null;

                    return (
                        <div key={group.id}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className={clsx("w-3 h-3 rounded-full", group.color)} />
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{group.name}</h2>
                            </div>

                            <div className="space-y-3">
                                {groupTasks.map(task => {
                                    const completed = isCompleted(task.id);
                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => toggleTaskCompletion(task.id, today)}
                                            className={clsx(
                                                "relative group p-4 rounded-xl border-2 transition-all cursor-pointer select-none active:scale-[0.98]",
                                                completed
                                                    ? "bg-slate-50 border-slate-100 opacity-60"
                                                    : "bg-white border-slate-100 hover:border-blue-100 shadow-sm"
                                            )}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={clsx(
                                                    "mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors",
                                                    completed ? "bg-slate-900 border-slate-900 text-white" : "border-slate-300 bg-white"
                                                )}>
                                                    {completed && <Check size={14} strokeWidth={3} />}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className={clsx(
                                                        "font-medium text-lg leading-tight transition-all",
                                                        completed ? "text-slate-400 line-through" : "text-slate-800"
                                                    )}>
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {totalTasks === 0 && (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-400">
                            <CalendarIcon size={24} />
                        </div>
                        <p className="text-slate-500 font-medium">No tasks for today</p>
                        <p className="text-slate-400 text-sm mt-1">Add a task to get started</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsAdding(true)}
                className="fixed right-6 bottom-24 w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-900/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
            >
                <Plus size={24} />
            </button>

            {/* Add Task Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">New Task</h3>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddTask}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-500 mb-2">Review Group</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {taskGroups.map(group => (
                                        <button
                                            key={group.id}
                                            type="button"
                                            onClick={() => setSelectedGroupId(group.id)}
                                            className={clsx(
                                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                                selectedGroupId === group.id
                                                    ? "bg-slate-900 text-white border-slate-900"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                                            )}
                                        >
                                            {group.name}
                                        </button>
                                    ))}
                                    {taskGroups.length === 0 && (
                                        <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 px-3 py-2 rounded-lg w-full">
                                            <AlertCircle size={14} />
                                            Create a group first!
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-500 mb-2">What to do?</label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="e.g. Read 10 pages"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!newTaskTitle.trim() || !selectedGroupId}
                                className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                            >
                                Add Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
