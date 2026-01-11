import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, X } from 'lucide-react';
import clsx from 'clsx';


export function TaskGroupManager() {
    const { taskGroups, addTaskGroup, deleteTaskGroup } = useStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedColor, setSelectedColor] = useState('bg-blue-500');
    const [customHex, setCustomHex] = useState('#3b82f6'); // Default blue
    const [colorMode, setColorMode] = useState<'preset' | 'custom'>('preset');

    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500',
        'bg-red-500', 'bg-orange-500', 'bg-teal-500',
        'bg-pink-500', 'bg-indigo-500', 'bg-slate-500'
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;

        const finalColor = colorMode === 'preset' ? selectedColor : customHex;

        addTaskGroup({
            name: newGroupName,
            color: finalColor,
        });
        setNewGroupName('');
        setIsCreating(false);
        // Reset defaults
        setSelectedColor('bg-blue-500');
        setColorMode('preset');
    };

    const isHex = (color: string) => color.startsWith('#');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Task Groups</h1>

            <div className="grid gap-4">
                {taskGroups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div
                                className={clsx("w-4 h-12 rounded-full", !isHex(group.color) && group.color)}
                                style={isHex(group.color) ? { backgroundColor: group.color } : undefined}
                            ></div>
                            <span className="font-semibold text-slate-700 text-lg">{group.name}</span>
                        </div>
                        <button
                            onClick={() => deleteTaskGroup(group.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            aria-label="Delete group"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsCreating(true)}
                className="mt-6 w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-medium flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-500 transition-all"
            >
                <Plus size={20} />
                Create New Group
            </button>

            {/* Modal Overlay */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">New Group</h3>
                            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-500 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="e.g. Personal Growth"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-slate-500 mb-3">Color Tag</label>

                                {/* Tabs for Color Selection */}
                                <div className="flex p-1 mb-4 bg-slate-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setColorMode('preset')}
                                        className={clsx(
                                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                            colorMode === 'preset' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        Presets
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setColorMode('custom')}
                                        className={clsx(
                                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                            colorMode === 'custom' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        Custom Color
                                    </button>
                                </div>

                                {colorMode === 'preset' ? (
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={clsx(
                                                    "w-10 h-10 rounded-full transition-transform",
                                                    color,
                                                    selectedColor === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-110"
                                                )}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative group">
                                                <input
                                                    type="color"
                                                    value={customHex}
                                                    onChange={(e) => setCustomHex(e.target.value)}
                                                    className="w-14 h-14 rounded-xl cursor-pointer border-2 border-slate-200 p-1"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    {/* Optional: Add an icon overlay if desired, but native picker is usually clear */}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Hex Code</label>
                                                <input
                                                    type="text"
                                                    value={customHex}
                                                    onChange={(e) => setCustomHex(e.target.value)}
                                                    className="w-full px-4 py-2 font-mono text-sm rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                                    placeholder="#000000"
                                                    maxLength={7}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!newGroupName.trim()}
                                className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                            >
                                Create Group
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
