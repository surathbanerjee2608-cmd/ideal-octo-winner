import { useStore } from '../store/useStore';
import { format, subDays } from 'date-fns';
import clsx from 'clsx';

export function ProgressView() {
    const { dailyStatuses } = useStore();

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date,
            dateStr: format(date, 'yyyy-MM-dd'),
            label: format(date, 'EEE'), // Mon, Tue...
        };
    });

    // Calculate stats per day
    const history = last7Days.map(day => {
        // This is imperfect because we don't know number of active tasks on past dates exactly
        // unless we track history of tasks.
        // For specific requirement "Review progress over time", showing completion status is key.
        // We will use current active tasks count as a baseline approximation or just raw completed count.

        // Better metric: Raw count of completed tasks.
        const completedCount = dailyStatuses.filter(s => s.date === day.dateStr && s.completed).length;

        // Determine "success" level
        // Simple heatmap style: 0, 1-2, 3-5, 5+
        let level = 0;
        if (completedCount > 0) level = 1;
        if (completedCount > 2) level = 2;
        if (completedCount > 4) level = 3;

        return { ...day, completedCount, level };
    });



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Your Progress</h1>

            <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-xl shadow-slate-900/20">
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Completed</div>
                <div className="text-5xl font-bold">{dailyStatuses.filter(s => s.completed).length}</div>
                <div className="text-slate-500 text-sm mt-2">tasks crushed so far</div>
            </div>

            <h2 className="text-lg font-bold text-slate-700 mb-4">Last 7 Days</h2>
            <div className="grid grid-cols-7 gap-2 mb-8">
                {history.map((day) => (
                    <div key={day.dateStr} className="flex flex-col items-center gap-2">
                        <div
                            className={clsx(
                                "w-full aspect-[4/5] rounded-lg transition-all",
                                day.level === 0 && "bg-slate-100",
                                day.level === 1 && "bg-blue-200",
                                day.level === 2 && "bg-blue-400",
                                day.level === 3 && "bg-blue-600",
                            )}
                        ></div>
                        <span className="text-xs text-slate-400 font-medium">{day.label}</span>
                    </div>
                ))}
            </div>

            {/* Detailed Log could go here in future */}
            <div className="text-center py-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">Keep building your streak!</p>
            </div>
        </div>
    );
}
