'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type NoticeTone = 'warning' | 'error' | 'info' | 'success';

interface InlineNoticeProps {
  tone?: NoticeTone;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const STYLES: Record<NoticeTone, { box: string; icon: string; Icon: React.ComponentType<{ className?: string }> }> = {
  warning: {
    box: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100',
    icon: 'text-amber-600 dark:text-amber-400',
    Icon: AlertTriangle,
  },
  error: {
    box: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100',
    icon: 'text-rose-600 dark:text-rose-400',
    Icon: AlertCircle,
  },
  success: {
    box: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100',
    icon: 'text-emerald-600 dark:text-emerald-400',
    Icon: CheckCircle2,
  },
  info: {
    box: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-950 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
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
  const { box, icon, Icon } = STYLES[tone];
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 flex items-start gap-3 animate-fadeIn ${box} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${icon}`} />
      <div className="flex-1 min-w-0 text-left space-y-0.5">
        {title && <p className="text-xs sm:text-sm font-bold leading-tight">{title}</p>}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

