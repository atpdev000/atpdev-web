"use client";

import Link from "next/link";
import { Terminal, X, Menu } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUiDictionary } from "@/utils/i18n-ui";
import ThemeToggle from "./ThemeToggle";
import MagneticEffect from "./MagneticEffect";

const SECTION_IDS = ["about", "experience", "portfolio", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

function normalizePath(pathname: string): string {
  const stripped = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
  return stripped || "/";
}

export default function Navbar() {
  const params = useParams();
  const pathname = usePathname() || "/";
  const lang = params?.lang as string || 'es';
  const normalizedPath = normalizePath(pathname);
  const isHome = normalizedPath === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const dict = getUiDictionary(lang);
  const tSobreMi = dict.linkAbout;
  const tExperiencia = dict.linkExperience;
  const tProyectos = dict.linkProjects;
  const tContacto = dict.linkContact;

  const linkPrefix = lang === 'es' ? '' : `/${lang}`;

  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }

    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;
      const probeY = Math.min(220, Math.max(120, window.innerHeight * 0.28));
      let current: SectionId | null = null;

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probeY) {
          current = id;
        }
      }

      const contactEl = document.getElementById("contact");
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (nearBottom && contactEl && contactEl.getBoundingClientRect().top < window.innerHeight * 0.75) {
        current = "contact";
      }

      setActiveSection(current);
    };

    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "") as SectionId;
      if (SECTION_IDS.includes(hash)) {
        setActiveSection(hash);
      }
      updateActiveSection();
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    syncFromHash();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHome, pathname]);

  const links: Array<{
    id: SectionId | "blog";
    href: string;
    label: string;
    routePrefixes: string[];
  }> = [
    { id: "about",      href: `${linkPrefix}/#about`,      label: tSobreMi,     routePrefixes: ["/sobre-mi"] },
    { id: "experience", href: `${linkPrefix}/#experience`, label: tExperiencia, routePrefixes: [] },
    { id: "portfolio",  href: `${linkPrefix}/#portfolio`,  label: tProyectos,   routePrefixes: ["/apps"] },
    { id: "blog",       href: `${linkPrefix}/blog`,       label: dict.linkBlog, routePrefixes: ["/blog"] },
    { id: "contact",    href: `${linkPrefix}/#contact`,    label: tContacto,    routePrefixes: ["/contact"] },
  ];

  const isItemActive = (item: (typeof links)[number]): boolean => {
    if (isHome) {
      return activeSection === item.id;
    }
    return item.routePrefixes.some(
      (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
    );
  };

  const contactActive = isItemActive(links[4]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b transition-colors" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(12px)' }}>
        <MagneticEffect intensity={0.1}>
          <Link href={`${linkPrefix}/`} className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity" style={{ color: 'var(--text-color)' }}>
            <Terminal size={24} style={{ color: 'var(--primary)' }} />
            <span>ATP DEV</span>
          </Link>
        </MagneticEffect>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.slice(0, 4).map(l => {
            const active = isItemActive(l);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => {
                  if (isHome && l.id !== "blog") setActiveSection(l.id);
                }}
                aria-current={active ? (isHome ? "true" : "page") : undefined}
                className="group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.05]"
                style={{ color: active ? 'var(--primary)' : 'var(--text-color)' }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--primary)]">{l.label}</span>
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${active ? 'opacity-10' : 'opacity-0 group-hover:opacity-10'}`}
                  style={{ backgroundColor: 'var(--primary)' }}
                ></div>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: 'var(--primary)' }}
                  />
                )}
              </Link>
            );
          })}
          <div className="flex items-center gap-4 border-l pl-4" style={{ borderColor: 'var(--glass-border)' }}>
            <ThemeToggle />
            <MagneticEffect intensity={0.2}>
              <Link
                href={`${linkPrefix}/#contact`}
                onClick={() => {
                  if (isHome) setActiveSection("contact");
                }}
                aria-current={contactActive ? "true" : undefined}
                className={`text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_20px_var(--primary)] flex ${contactActive ? 'ring-2 ring-[var(--primary)]/50 ring-offset-2 ring-offset-transparent shadow-[0_0_20px_var(--primary)] scale-[1.03]' : ''}`}
                style={{ backgroundColor: 'var(--btn-primary-bg)' }}
              >
                {tContacto}
              </Link>
            </MagneticEffect>
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-color)' }}
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-[73px] left-0 right-0 border-b px-6 py-6 flex flex-col gap-1 shadow-2xl transition-colors"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}
            onClick={e => e.stopPropagation()}
          >
            {links.map(l => {
              const active = isItemActive(l);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => {
                    if (isHome && l.id !== "blog") setActiveSection(l.id);
                    setIsOpen(false);
                  }}
                  aria-current={active ? (isHome ? "true" : "page") : undefined}
                  className="relative overflow-hidden border hover:border-blue-500/30 px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center justify-between"
                  style={{
                    color: active ? 'var(--primary)' : 'var(--text-color)',
                    borderColor: active ? 'var(--primary)' : 'transparent',
                  }}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{ backgroundColor: 'var(--primary)' }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="relative z-10 h-2 w-2 rounded-full"
                      style={{ backgroundColor: 'var(--primary)' }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <Link
                href={`${linkPrefix}/#contact`}
                onClick={() => {
                  if (isHome) setActiveSection("contact");
                  setIsOpen(false);
                }}
                aria-current={contactActive ? "true" : undefined}
                className={`w-full flex items-center justify-center text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg hover:brightness-110 ${contactActive ? 'ring-2 ring-[var(--primary)]/50' : ''}`}
                style={{ backgroundColor: 'var(--btn-primary-bg)' }}
              >
                {tContacto}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
