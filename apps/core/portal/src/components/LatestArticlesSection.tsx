import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { BLOG_POSTS, getLocalizedBlogPost } from "@/data/blog-posts";

export default function LatestArticlesSection({ lang }: { lang: string }) {
  const isEn = lang !== "es" && lang !== "pt";
  const prefix = lang === "es" ? "" : `/${lang}`;

  const latestPosts = [...BLOG_POSTS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map((post) => getLocalizedBlogPost(post, lang));

  return (
    <section id="articles" className="py-20 scroll-mt-20 relative border-t border-[var(--glass-border)] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-4"
              style={{
                backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
                borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)",
                color: "var(--accent-text)",
              }}
            >
              <BookOpen size={14} />
              <span>{isEn ? "Engineering Blog" : "Blog de Ingeniería"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold transition-colors" style={{ color: "var(--text-color)" }}>
              {isEn ? "Latest Technical " : "Últimos Artículos "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, var(--primary), var(--tertiary))" }}
              >
                {isEn ? "Articles" : "Técnicos"}
              </span>
            </h2>
            <p className="max-w-2xl mt-3 text-base" style={{ color: "var(--text-muted)" }}>
              {isEn
                ? "Architecture notes, Android Offline-First patterns, Core Web Vitals optimization, and real production case studies."
                : "Guías prácticas sobre arquitectura Android Offline-First, Edge AI, optimización Core Web Vitals y casos reales en producción."}
            </p>
          </div>

          <Link
            href={`${prefix}/blog`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-[1.03] shrink-0 self-start md:self-auto"
            style={{
              backgroundColor: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
              color: "var(--accent-text)",
            }}
          >
            <span>{isEn ? "View all articles" : "Ver todos los artículos"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`${prefix}/blog/${post.slug}`}
              className="group rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_32px_rgba(0,0,0,0.08)] interactive-card"
              style={{
                backgroundColor: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
                backdropFilter: "blur(12px)",
                "--glow-bg": "var(--glass-bg)",
              } as React.CSSProperties}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: "var(--pill-bg)",
                      borderColor: "var(--glass-border)",
                      color: "var(--accent-text)",
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={12} />
                    {post.readingTimeMinutes} min
                  </span>
                </div>

                <h3
                  className="text-lg font-bold mb-3 leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2"
                  style={{ color: "var(--text-color)" }}
                >
                  {post.title}
                </h3>

                <p className="text-sm leading-relaxed line-clamp-3 mb-5" style={{ color: "var(--text-muted)" }}>
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-xs font-semibold" style={{ borderColor: "var(--glass-border)" }}>
                <span style={{ color: "var(--text-muted)" }}>{post.updatedAt}</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: "var(--accent-text)" }}>
                  {isEn ? "Read guide" : "Leer guía"} <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
