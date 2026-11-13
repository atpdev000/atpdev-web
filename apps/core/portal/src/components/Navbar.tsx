"use client";

import Link from "next/link";
import { Terminal, X, Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getUiDictionary } from "@/utils/i18n-ui";
import ThemeToggle from "./ThemeToggle";
import MagneticEffect from "./MagneticEffect";

export default function Navbar() {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [isOpen, setIsOpen] = useState(false);
  const dict = getUiDictionary(lang);
  const tSobreMi = dict.linkAbout;
  const tExperiencia = dict.linkExperience;
  const tProyectos = dict.linkProjects;
  const tContacto = dict.linkContact;

  const linkPrefix = lang === 'es' ? '' : `/${lang}`;

  const links = [
    { href: `${linkPrefix}/#about`,     label: tSobreMi },
    { href: `${linkPrefix}/#experience`, label: tExperiencia },
    { href: `${linkPrefix}/#portfolio`, label: tProyectos },
    { href: `${linkPrefix}/#contact`,   label: tContacto },
  ];

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
          {links.slice(0, 3).map(l => (
            <Link key={l.href} href={l.href} className="group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.05]" style={{ color: 'var(--text-color)' }}>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--primary)]">{l.label}</span>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: 'var(--primary)' }}></div>
            </Link>
          ))}
          <div className="flex items-center gap-4 border-l pl-4" style={{ borderColor: 'var(--glass-border)' }}>
            <ThemeToggle />
            <MagneticEffect intensity={0.2}>
              <Link href={`${linkPrefix}/#contact`} className="text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_20px_var(--primary)] flex" style={{ backgroundColor: 'var(--btn-primary-bg)' }}>
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
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="border border-transparent hover:border-blue-500/30 px-4 py-3 rounded-xl text-base font-medium transition-all"
                style={{ color: 'var(--text-color)' }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <Link
                href={`${linkPrefix}/#contact`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg hover:brightness-110"
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
