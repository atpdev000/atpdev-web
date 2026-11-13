import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DetailedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)' }}>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="font-black text-lg tracking-tight flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
            <span className="font-mono text-[var(--accent-text)]">&gt;_</span> ATP DEV
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            <Link href="/blog" className="hover:text-[var(--text-color)] transition-colors">
              Artículos
            </Link>
            <Link href="/#portfolio" className="hover:text-[var(--text-color)] transition-colors">
              Proyectos
            </Link>
            <Link href="/privacy" className="hover:text-[var(--text-color)] transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-color)] transition-colors">
              Términos
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors"
              style={{ borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
            >
              <ArrowLeft size={14} /> Inicio
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer
        className="border-t py-8 mt-12 text-center text-sm"
        style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Percy Acha Taipe — ATP Dev.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[var(--text-color)] transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-color)] transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
