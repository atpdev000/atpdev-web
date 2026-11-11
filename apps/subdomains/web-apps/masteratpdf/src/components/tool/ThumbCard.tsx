'use client';

import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, FileText, ZoomIn, type LucideIcon } from 'lucide-react';

export interface ThumbAction {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    tone?: 'default' | 'danger';
}

export interface ThumbCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    thumbnail?: string | null;
    title: string;
    subtitle?: string;
    /** 1-based position shown in the corner. */
    index?: number;
    rotation?: number;
    selected?: boolean;
    /** Visual highlight color (e.g. split ranges) without the check mark. */
    accent?: string;
    accentLabel?: string;
    badge?: { label: string; tone: 'green' | 'blue' };
    actions?: ThumbAction[];
    onZoom?: () => void;
    dragging?: boolean;
    size?: 'md' | 'lg';
}

/**
 * The white file/page card used on every tool canvas.
 * Hover reveals small round actions above the card, as in iLovePDF.
 */
export const ThumbCard = forwardRef<HTMLDivElement, ThumbCardProps>(function ThumbCard(
    {
        thumbnail,
        title,
        subtitle,
        index,
        rotation = 0,
        selected,
        accent,
        accentLabel,
        badge,
        actions,
        onZoom,
        dragging,
        size = 'md',
        className = '',
        style,
        ...rest
    },
    ref
) {
    // Sanitize rest props to ensure no custom handlers leak to DOM
    const { onZoom: _unused, ...domProps } = rest as Record<string, unknown>;
    const ringColor = selected ? 'var(--brand)' : accent;
    const dims = size === 'lg' ? 'w-[200px]' : 'w-[168px]';
    const imgBox = size === 'lg' ? 'h-[230px]' : 'h-[196px]';

    return (
        <div
            ref={ref}
            style={{
                ...style,
                ...(ringColor ? { boxShadow: `0 0 0 2px ${ringColor}, var(--shadow-lift)` } : {}),
            }}
            className={`group relative ${dims} rounded-xl bg-surface p-3 select-none transition-[box-shadow,transform,opacity] duration-150 ${
                dragging ? 'opacity-70 scale-[1.03] shadow-lift z-50' : ringColor ? '' : 'shadow-card hover:shadow-lift'
            } ${className}`}
            {...domProps}
        >
            {/* Hover actions */}
            {actions && actions.length > 0 && (
                <div className="absolute -top-3 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    {actions.map((a) => {
                        const Icon = a.icon;
                        return (
                            <button
                                key={a.label}
                                type="button"
                                title={a.label}
                                aria-label={a.label}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    a.onClick();
                                }}
                                className={`w-8 h-8 rounded-full bg-surface border border-line shadow-lift flex items-center justify-center transition-colors cursor-pointer ${
                                    a.tone === 'danger' ? 'text-ink-2 hover:text-white hover:bg-danger hover:border-danger' : 'text-ink-2 hover:text-white hover:bg-ink hover:border-ink'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Thumbnail */}
            <div className={`relative ${imgBox} rounded-lg bg-surface-2 flex items-center justify-center overflow-hidden`}>
                {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={thumbnail}
                        alt={title}
                        draggable={false}
                        className="max-w-[92%] max-h-[92%] object-contain shadow-card transition-transform duration-200"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted">
                        <FileText className="w-10 h-10" />
                        <span className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {typeof index === 'number' && (
                    <span className="absolute bottom-2 left-2 min-w-[24px] h-6 px-1.5 rounded-md bg-ink/80 text-surface text-[11px] font-bold flex items-center justify-center tabular-nums">
                        {index}
                    </span>
                )}

                {accentLabel && !selected && (
                    <span
                        className="absolute top-2 left-2 px-1.5 h-5 rounded text-[10px] font-bold text-white flex items-center"
                        style={{ backgroundColor: accent }}
                    >
                        {accentLabel}
                    </span>
                )}

                {badge && (
                    <span
                        className={`absolute top-2 right-2 px-1.5 h-5 rounded text-[10px] font-bold flex items-center ${
                            badge.tone === 'green' ? 'bg-ok text-white' : 'bg-[#2b6cd9] text-white'
                        }`}
                    >
                        {badge.label}
                    </span>
                )}

                {onZoom && (
                    <button
                        type="button"
                        title="Ampliar vista previa"
                        aria-label="Ampliar vista previa"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onZoom();
                        }}
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-surface/90 hover:bg-surface border border-line text-ink-2 hover:text-ink shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                )}

                {selected && (
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-cta">
                        <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                )}

                {rotation !== 0 && (
                    <span className="absolute bottom-2 right-2 px-1.5 h-6 rounded-md bg-surface text-ink text-[11px] font-bold flex items-center shadow-card tabular-nums">
                        {rotation}°
                    </span>
                )}
            </div>

            {/* Caption */}
            <div className="pt-2.5 px-0.5">
                <p className="text-xs font-semibold text-ink truncate" title={title}>
                    {title}
                </p>
                {subtitle && <p className="text-[11px] text-muted truncate">{subtitle}</p>}
            </div>
        </div>
    );
});

/** ThumbCard wired to dnd-kit sorting. */
export function SortableThumb({ id, onZoom, ...props }: ThumbCardProps & { id: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (
        <ThumbCard
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            dragging={isDragging}
            className="cursor-grab active:cursor-grabbing"
            onZoom={onZoom}
            {...attributes}
            {...listeners}
            {...props}
        />
    );
}

/** Responsive, centered wrapping grid for cards. */
export function ThumbGrid({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">{children}</div>;
}
