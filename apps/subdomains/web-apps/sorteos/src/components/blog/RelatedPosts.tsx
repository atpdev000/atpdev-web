"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost, BLOG_POSTS } from '@/lib/blog-data';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';

interface RelatedPostsProps {
  currentPostId: string;
  category: string;
}

export function RelatedPosts({ currentPostId, category }: RelatedPostsProps) {
  const related = BLOG_POSTS.filter(
    (p) => p.id !== currentPostId
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-600 dark:text-purple-400 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continúa Leyendo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
            Guías Relacionadas
          </h3>
        </div>
        <Link
          href="/blog"
          className="text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400 flex items-center gap-1 transition-colors"
        >
          <span>Ver todo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <div
            key={post.id}
            className="group bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-pink-500/40 dark:hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <span className="text-pink-600 dark:text-purple-400 font-bold">{post.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-slate-400">{post.date}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-bold text-pink-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
              >
                <span>Leer guía</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedPosts;

