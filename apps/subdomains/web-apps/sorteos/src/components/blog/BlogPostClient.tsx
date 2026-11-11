"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog-data';
import { TableOfContents } from './TableOfContents';
import { RelatedPosts } from './RelatedPosts';
import { AdBanner } from '@/components/AdBanner';
import { 
  ArrowLeft, Calendar, Clock, Share2, Check, 
  Sparkles, Award, ShieldCheck, ArrowRight, ExternalLink 
} from 'lucide-react';

interface BlogPostClientProps {
  post: BlogPost;
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);

  // Inyectar IDs en los encabezados H2 para que el TableOfContents navegue con anclas
  const contentWithIds = post.content.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
    const id = title
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return `<h2 id="${id}" class="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-10 mb-4 pt-4 scroll-mt-24 border-t border-slate-100 dark:border-white/5 first:border-0 first:pt-0">${title}</h2>`;
  });

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-xs font-bold">
          {post.category}
        </span>
      </nav>

      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al listado de guías</span>
        </Link>
      </div>

      {/* Header section */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 text-xs font-mono font-bold">
            {post.category}
          </span>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 dark:text-white leading-[1.15] tracking-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-sans border-l-4 border-pink-500 pl-4 py-1 italic bg-slate-50 dark:bg-white/[0.02] rounded-r-xl">
          {post.excerpt}
        </p>

        {/* Author & Credibility Strip (E-E-A-T) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-slate-200 dark:border-white/10 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{post.author.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md">
                  Verificado
                </span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {post.author.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-mono text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Compartir artículo"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Compartir Guía</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Table of Contents */}
      <TableOfContents content={contentWithIds} />

      {/* Main Content Body with typography */}
      <div 
        className="editorial-body text-slate-800 dark:text-zinc-300 leading-relaxed space-y-5 text-sm sm:text-base font-sans"
        dangerouslySetInnerHTML={{ __html: contentWithIds }}
      />

      {/* Relevant Tool Interactive CTA Box */}
      {post.toolLink && (
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 border-2 border-pink-500/30 dark:border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-mono font-bold uppercase text-pink-600 dark:text-purple-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Herramienta Oficial Recomendada</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white">
              Aplica esta guía ahora con tecnología CSPRNG y Certificado SHA-256
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-lg">
              Prueba la herramienta gratuita vinculada a este artículo y garantiza el cumplimiento del 100% en tus sorteos.
            </p>
          </div>
          <Link
            href={post.toolLink.href}
            className="btn-pro-primary py-3.5 px-6 rounded-xl font-bold font-display text-xs whitespace-nowrap shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{post.toolLink.text}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* AdSense Official Policy-Compliant Placement */}
      <div className="my-10 pt-4">
        <AdBanner format="horizontal" />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold mr-1">Temas:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      <RelatedPosts currentPostId={post.id} category={post.category} />

    </article>
  );
}

export default BlogPostClient;

