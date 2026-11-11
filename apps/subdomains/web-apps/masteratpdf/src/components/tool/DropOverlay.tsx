'use client';

import React from 'react';
import { Upload } from 'lucide-react';

/** Full-window overlay shown while files are dragged over the page. */
export function DropOverlay({ show, label }: { show: boolean; label: string }) {
    if (!show) return null;
    return (
        <div className="animate-fadeIn fixed inset-0 z-[60] bg-brand/10 backdrop-blur-[2px] p-6 pointer-events-none">
            <div className="h-full w-full rounded-3xl border-[3px] border-dashed border-brand flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center shadow-cta">
                    <Upload className="w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-ink">{label}</p>
            </div>
        </div>
    );
}
