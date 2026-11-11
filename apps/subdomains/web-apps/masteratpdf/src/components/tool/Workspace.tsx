'use client';

import React, { useRef } from 'react';
import { ArrowRight, Plus, AlertCircle } from 'lucide-react';
import { useWindowFileDrop } from '@/hooks/useWindowFileDrop';
import { DropOverlay } from './DropOverlay';

interface WorkspaceProps {
    /** Canvas content: file or page cards. */
    children: React.ReactNode;
    /** Optional bar above the canvas (selection controls, counters…). */
    toolbar?: React.ReactNode;

    title: string;
    /** Options rendered inside the right sidebar. */
    options?: React.ReactNode;
    actionLabel: string;
    onAction: () => void;
    actionDisabled?: boolean;
    /** Short note under the action button explaining why it is disabled, etc. */
    actionHint?: string;
    error?: string | null;

    /** Enables the floating "+" button and window drop to add more files. */
    addFiles?: {
        accept: string;
        multiple?: boolean;
        count?: number;
        label: string;
        onFiles: (files: File[]) => void;
    };
}

/**
 * iLovePDF-style working area: files on a gray canvas to the left,
 * a fixed options sidebar to the right with one big action at the bottom.
 */
export function Workspace({
    children,
    toolbar,
    title,
    options,
    actionLabel,
    onAction,
    actionDisabled,
    actionHint,
    error,
    addFiles,
}: WorkspaceProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isDragging = useWindowFileDrop((files) => addFiles?.onFiles(files), !!addFiles);

    return (
        <div className="animate-stage flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            {/* Canvas */}
            <div className="relative flex-1 min-w-0 bg-canvas">
                {toolbar && (
                    <div className="sticky top-16 z-20 border-b border-line bg-canvas/90 backdrop-blur-md px-4 sm:px-8 py-3">
                        {toolbar}
                    </div>
                )}

                <div className="px-4 sm:px-8 py-8 lg:py-10 pb-28">{children}</div>

                {addFiles && (
                    <div className="absolute top-5 right-5 sm:right-8 z-30" style={toolbar ? { top: '4.75rem' } : undefined}>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            title={addFiles.label}
                            aria-label={addFiles.label}
                            className="relative w-12 h-12 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center shadow-cta transition-colors cursor-pointer"
                        >
                            <Plus className="w-6 h-6" strokeWidth={2.5} />
                            {typeof addFiles.count === 'number' && addFiles.count > 0 && (
                                <span className="absolute -top-1 -left-1 min-w-[22px] h-[22px] px-1 rounded-full bg-ink text-surface text-[11px] font-bold flex items-center justify-center ring-2 ring-canvas">
                                    {addFiles.count}
                                </span>
                            )}
                        </button>
                        <input
                            ref={inputRef}
                            type="file"
                            accept={addFiles.accept}
                            multiple={addFiles.multiple}
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.length) addFiles.onFiles(Array.from(e.target.files));
                                e.target.value = '';
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[360px] xl:w-[380px] shrink-0 bg-surface border-t lg:border-t-0 lg:border-l border-line flex flex-col lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
                <div className="px-6 py-5 border-b border-line">
                    <h2 className="text-2xl font-bold text-ink text-center tracking-tight">{title}</h2>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">{options}</div>

                <div className="p-5 border-t border-line space-y-3 bg-surface">
                    {error && (
                        <div role="alert" className="flex gap-2 rounded-xl bg-danger-soft text-danger text-sm px-3.5 py-3">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="whitespace-pre-line">{error}</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={onAction}
                        disabled={actionDisabled}
                        className="w-full py-4 rounded-xl bg-brand hover:bg-brand-hover text-white text-lg font-bold flex items-center justify-center gap-2 shadow-cta transition-colors disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
                    >
                        {actionLabel}
                        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    {actionHint && <p className="text-center text-xs text-muted">{actionHint}</p>}
                </div>
            </aside>

            <DropOverlay show={isDragging} label={addFiles?.label ?? 'Suelta tus archivos aquí'} />
        </div>
    );
}

/* ---------- Sidebar building blocks ---------- */

export function SidebarSection({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            {title && <h3 className="text-sm font-bold text-ink">{title}</h3>}
            {children}
        </section>
    );
}

interface OptionCardProps {
    selected: boolean;
    onSelect?: () => void;
    onClick?: () => void;
    title: string;
    description?: string;
    icon?: any;
    badge?: string;
}

/** Radio-style option used across tool sidebars. */
export function OptionCard({ selected, onSelect, onClick, title, description, icon, badge }: OptionCardProps) {
    const handleClick = onSelect || onClick;
    const IconComponent = typeof icon === 'function' ? icon : null;

    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={handleClick}
            className={`w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 transition-colors cursor-pointer ${
                selected ? 'border-brand bg-brand-soft' : 'border-line hover:border-line-strong bg-surface'
            }`}
        >
            {IconComponent ? (
                <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${selected ? 'text-brand' : 'text-muted'}`} />
            ) : icon ? (
                <span className={`mt-0.5 shrink-0 ${selected ? 'text-brand' : 'text-muted'}`}>{icon}</span>
            ) : null}
            <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${selected ? 'text-brand' : 'text-ink'}`}>{title}</span>
                    {badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-ok-soft text-ok">{badge}</span>
                    )}
                </span>
                {description && <span className="block mt-0.5 text-xs text-ink-2 leading-relaxed">{description}</span>}
            </span>
            <span
                className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    selected ? 'border-brand' : 'border-line-strong'
                }`}
            >
                {selected && <span className="w-2 h-2 rounded-full bg-brand" />}
            </span>
        </button>
    );
}

/** Segmented control for 2–3 short choices (e.g. modes). */
export function Segmented<T extends string>({
    value,
    onChange,
    options,
}: {
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string; icon?: React.ReactNode }[];
}) {
    return (
        <div className="grid gap-1 p-1 rounded-xl bg-surface-2 border border-line" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                        value === o.value ? 'bg-surface text-brand shadow-card' : 'text-ink-2 hover:text-ink'
                    }`}
                >
                    {o.icon}
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'ok'; children: React.ReactNode }) {
    const styles = {
        info: 'bg-surface-2 text-ink-2 border-line',
        warn: 'bg-warn-soft text-warn border-transparent',
        ok: 'bg-ok-soft text-ok border-transparent',
    }[tone];
    return <div className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${styles}`}>{children}</div>;
}

export function StatRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'danger' | 'ok' | 'brand' }) {
    const color = tone === 'danger' ? 'text-danger' : tone === 'ok' ? 'text-ok' : tone === 'brand' ? 'text-brand' : 'text-ink';
    return (
        <div className="flex items-center justify-between text-sm py-2 border-b border-line last:border-0">
            <span className="text-ink-2">{label}</span>
            <span className={`font-bold tabular-nums ${color}`}>{value}</span>
        </div>
    );
}

export function Checkbox({ 
    checked, 
    onChange, 
    label, 
    description 
}: { 
    checked: boolean; 
    onChange: (v: boolean) => void; 
    label: string; 
    description?: string;
}) {
    return (
        <label className="flex items-start gap-3 cursor-pointer select-none text-sm text-ink">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[var(--brand)] cursor-pointer"
            />
            <div className="flex-1 min-w-0">
                <span className="font-semibold block">{label}</span>
                {description && <span className="text-xs text-ink-2 block mt-0.5 leading-relaxed">{description}</span>}
            </div>
        </label>
    );
}
