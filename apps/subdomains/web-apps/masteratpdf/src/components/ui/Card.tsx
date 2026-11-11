import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    category?: string;
    isNew?: boolean;
    badge?: string;
    accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';
}

export const Card: React.FC<CardProps> = ({
    icon,
    title,
    description,
    href,
    category,
    isNew = false,
    badge,
    accentColor = 'indigo',
}) => {
    // Tonal icon styling by category/color
    const iconThemes = {
        indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60',
        cyan: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-800/60',
        emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
        amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
        rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60',
        violet: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/60',
    };

    const isUpcoming = badge === 'Próximamente';

    return (
        <Link 
            href={href} 
            className={`group block h-full ${isUpcoming ? 'cursor-default pointer-events-none opacity-75' : ''}`}
            aria-disabled={isUpcoming}
        >
            <div className="relative h-full p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/70 hover:bg-slate-50/50 dark:hover:bg-slate-900/90 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex flex-col">
                
                {/* Badges bar */}
                <div className="flex items-center justify-between mb-5">
                    {/* Icon container */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-105 ${iconThemes[accentColor]}`}>
                        {icon}
                    </div>

                    <div className="flex items-center gap-1.5">
                        {category && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {category}
                            </span>
                        )}
                        {badge && (
                            <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                                isUpcoming
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                    : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60'
                            }`}>
                                {badge}
                            </span>
                        )}
                        {isNew && (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white bg-indigo-600 rounded-full shadow-xs">
                                Nuevo
                            </span>
                        )}
                    </div>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 tracking-tight">
                    {title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow font-normal">
                    {description}
                </p>

                {/* Action Link Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <span>{isUpcoming ? 'En preparación' : 'Abrir herramienta'}</span>
                    {!isUpcoming && (
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                </div>
            </div>
        </Link>
    );
};
