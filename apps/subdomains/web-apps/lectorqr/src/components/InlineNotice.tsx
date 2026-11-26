'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type InlineNoticeTone = 'warning' | 'error' | 'info' | 'success';

interface InlineNoticeProps {
  tone?: InlineNoticeTone;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const TONE_STYLES: Record<
  InlineNoticeTone,
  { container: string; iconColor: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  warning: {
    container:
      'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-100',
    iconColor: 'text-amber-600 dark:text-amber-400',
    Icon: AlertTriangle,
  },
  error: {
    container:
      'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/70 text-rose-950 dark:text-rose-100',
    iconColor: 'text-rose-600 dark:text-rose-400',
    Icon: AlertCircle,
  },
  success: {
    container:
      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/70 text-emerald-950 dark:text-emerald-100',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    Icon: CheckCircle2,
  },
  info: {
    container:
      'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/70 text-blue-950 dark:text-blue-100',
    iconColor: 'text-blue-600 dark:text-blue-400',
    Icon: Info,
  },
};

export default function InlineNotice({
  tone = 'info',
  title,
  message,
  onClose,
  className = '',
}: InlineNoticeProps) {
  const { container, iconColor, Icon } = TONE_STYLES[tone];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3.5 shadow-sm flex items-start gap-3 animate-fadeIn ${container} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0 text-left space-y-0.5">
        {title && <p className="text-xs sm:text-sm font-extrabold leading-tight">{title}</p>}
        <p className="text-xs font-medium opacity-90 leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
