import type { ReactNode } from 'react';
import { Calendar, Layers, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

type View = 'daily' | 'groups' | 'progress';

interface LayoutProps {
    children: ReactNode;
    currentView: View;
    onViewChange: (view: View) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative">

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around py-4 z-50">
                    <NavButton
                        active={currentView === 'daily'}
                        onClick={() => onViewChange('daily')}
                        icon={<Calendar size={24} />}
                        label="Today"
                    />
                    <NavButton
                        active={currentView === 'groups'}
                        onClick={() => onViewChange('groups')}
                        icon={<Layers size={24} />}
                        label="Groups"
                    />
                    <NavButton
                        active={currentView === 'progress'}
                        onClick={() => onViewChange('progress')}
                        icon={<BarChart2 size={24} />}
                        label="Progress"
                    />
                </nav>
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex flex-col items-center transition-colors duration-200",
                active ? "text-blue-600 scale-105" : "text-slate-400 hover:text-slate-600"
            )}
        >
            {icon}
            <span className="text-[10px] font-medium mt-1">{label}</span>
        </button>
    );
}
