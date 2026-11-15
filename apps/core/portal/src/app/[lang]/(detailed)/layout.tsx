import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function DetailedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang = 'es' } = await params;
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const isEn = lang !== 'es' && lang !== 'pt';

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--background)', color: 'var(--text-color)' }}>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href={`${prefix}/`} className="font-black text-lg tracking-tight flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
            <span className="font-mono text-[var(--accent-text)]">&gt;_</span> ATP DEV
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            <Link href={`${prefix}/blog`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Articles' : 'Artículos'}
            </Link>
            <Link href={`${prefix}/#portfolio`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Projects' : 'Proyectos'}
            </Link>
            <Link href={`${prefix}/#contact`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Contact' : 'Contacto'}
            </Link>
            <Link href={`${prefix}/privacy`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Privacy' : 'Privacidad'}
            </Link>
            <Link href={`${prefix}/terms`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Terms' : 'Términos'}
            </Link>
            <Link
              href={`${prefix}/`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors"
              style={{ borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
            >
              <ArrowLeft size={14} /> {isEn ? 'Home' : 'Inicio'}
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
          <div className="flex flex-wrap items-center gap-5">
            <Link href={`${prefix}/`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Home' : 'Inicio'}
            </Link>
            <Link href={`${prefix}/blog`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Articles' : 'Artículos'}
            </Link>
            <Link href={`${prefix}/#contact`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Contact' : 'Contacto'}
            </Link>
            <Link href={`${prefix}/privacy`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
            </Link>
            <Link href={`${prefix}/terms`} className="hover:text-[var(--text-color)] transition-colors">
              {isEn ? 'Terms of Service' : 'Términos de Servicio'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
