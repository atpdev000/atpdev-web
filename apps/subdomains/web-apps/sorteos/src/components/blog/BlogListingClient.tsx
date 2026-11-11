"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog-data';
import { AdBanner } from '@/components/AdBanner';
import { 
  BookOpen, Calendar, Clock, ArrowRight, Sparkles, 
  Search, ShieldCheck, Filter, ArrowLeft 
} from 'lucide-react';

interface BlogListingClientProps {
  initialPosts: BlogPost[];
}

export function BlogListingClient({ initialPosts }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Todos', ...Array.from(set)];
  }, [initialPosts]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: initialPosts.length };
    initialPosts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialPosts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'Todos' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return initialPosts.find((p) => p.featured) || initialPosts[0];
  }, [initialPosts]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-400">
          {initialPosts.length} guías publicadas
        </span>
      </div>

      {/* Main Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 text-xs font-mono font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Blog & Recursos Técnicos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Guías y Mejores Prácticas para Sorteos
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
          Aprende a crear promociones efectivas, legales y transparentes que hagan crecer tu comunidad de forma orgánica y con certificación inmutable.
        </p>

        {/* Live Search Input */}
        <div className="pt-4 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tema: Instagram, SHA-256, CSPRNG, Bases Legales, Reels..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 cursor-pointer"
            >
              LIMPIAR
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/10 hover:border-pink-300 dark:hover:border-purple-500/40'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Article Box (when no active filter or when it matches) */}
      {!searchQuery && selectedCategory === 'Todos' && featuredPost && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 sm:p-12 border-2 border-pink-500/30 dark:border-purple-500/40 relative overflow-hidden shadow-lg space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-purple-500/20 text-pink-700 dark:text-purple-300 border border-pink-200 dark:border-purple-500/30 text-xs font-mono font-bold">
              ⭐ Guía Destacada
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 text-xs font-mono">
              {featuredPost.category}
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {featuredPost.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
              </span>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <Link href={`/blog/${featuredPost.slug}`}>
              <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-purple-300 transition-colors cursor-pointer leading-tight">
                {featuredPost.title}
              </h2>
            </Link>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
              {featuredPost.excerpt}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 btn-pro-primary py-3.5 px-6 rounded-xl font-bold font-display text-xs cursor-pointer shadow-md hover:scale-105 transition-all"
            >
              <span>Leer Guía Completa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {featuredPost.toolLink && (
              <Link
                href={featuredPost.toolLink.href}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold font-display text-slate-800 dark:text-zinc-200 transition-colors"
              >
                <span>{featuredPost.toolLink.text}</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 max-w-md mx-auto p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            No se encontraron guías
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            No hay publicaciones que coincidan con &quot;{searchQuery}&quot; en la categoría seleccionada.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
            className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/10 hover:border-pink-500/40 dark:hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md"
            >
              <div className="space-y-3.5">
                {/* Category & Read Time */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-500">
                  <span className="text-pink-600 dark:text-purple-400 font-bold px-2.5 py-0.5 rounded-md bg-pink-50 dark:bg-pink-500/10 border border-pink-200/60 dark:border-pink-500/20 text-[11px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-purple-400 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 text-xs font-mono">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-pink-600 dark:text-purple-400 group-hover:translate-x-1 font-bold flex items-center gap-1 transition-all"
                >
                  <span>Leer guía</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Interactive Tool Banner */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-white/10 text-center space-y-4 max-w-3xl mx-auto shadow-sm">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
          ¿Listo para crear tu próximo sorteo con certificado inmutable?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto">
          Prueba nuestras herramientas gratuitas de Ruleta, Dados, Moneda o inicia tu sorteo en Instagram o Facebook con motor CSPRNG y firma SHA-256.
        </p>
        <div className="pt-2">
          <Link
            href="/sorteos/nuevo"
            className="inline-flex items-center gap-2 btn-pro-primary py-4 px-8 rounded-2xl text-sm font-bold font-display shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <span>Crear Sorteo Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* AdSense Placement Policy Compliant */}
      <div className="pt-4">
        <AdBanner format="horizontal" />
      </div>

    </div>
  );
}

export default BlogListingClient;

