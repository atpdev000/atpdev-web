"use client";

import React, { useMemo } from 'react';
import { ListFilter } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => {
    const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g;
    const items: { id: string; text: string }[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Strip any inner HTML tags
      const cleanText = match[2].replace(/<\/?[^>]+(>|$)/g, '');
      items.push({
        id: match[1],
        text: cleanText,
      });
    }

    return items;
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav 
      aria-label="Tabla de Contenidos" 
      className="my-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10"
    >
      <div className="flex items-center gap-2 mb-4 text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300">
        <ListFilter className="w-4 h-4 text-pink-600 dark:text-pink-400" />
        <span>Índice del Contenido</span>
      </div>
      <ol className="space-y-2.5 text-xs sm:text-sm">
        {headings.map((item, idx) => (
          <li key={item.id} className="flex items-baseline gap-2">
            <span className="font-mono text-pink-600 dark:text-purple-400 font-bold shrink-0">
              {idx + 1}.
            </span>
            <a
              href={`#${item.id}`}
              className="text-slate-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors leading-snug hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;

