import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="main min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)]">
      {/* Glitch Effect Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .glitch-wrapper {
            position: relative;
          }
          .glitch {
            position: relative;
            color: var(--text-color);
            font-size: 8rem;
            font-weight: 900;
            line-height: 1;
            z-index: 1;
          }
          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background);
          }
          .glitch::before {
            left: 3px;
            text-shadow: -2px 0 var(--primary);
            animation: glitch-anim-1 2s infinite linear alternate-reverse;
          }
          .glitch::after {
            left: -3px;
            text-shadow: -2px 0 var(--secondary, #ff00ea);
            animation: glitch-anim-2 3s infinite linear alternate-reverse;
          }
          @keyframes glitch-anim-1 {
            0% { clip-path: inset(20% 0 80% 0); }
            20% { clip-path: inset(60% 0 10% 0); }
            40% { clip-path: inset(40% 0 50% 0); }
            60% { clip-path: inset(80% 0 5% 0); }
            80% { clip-path: inset(10% 0 70% 0); }
            100% { clip-path: inset(30% 0 40% 0); }
          }
          @keyframes glitch-anim-2 {
            0% { clip-path: inset(10% 0 60% 0); }
            20% { clip-path: inset(80% 0 5% 0); }
            40% { clip-path: inset(30% 0 20% 0); }
            60% { clip-path: inset(70% 0 15% 0); }
            80% { clip-path: inset(40% 0 50% 0); }
            100% { clip-path: inset(20% 0 30% 0); }
          }
        `
      }} />

      <div className="absolute inset-0 bg-[var(--bg1)] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center">
        <div data-page-type="not-found" className="mb-8 p-4 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 animate-pulse">
          <ShieldAlert size={48} className="text-[var(--primary)]" />
        </div>
        
        <div data-page-type="not-found" className="glitch-wrapper mb-4">
          <h1 className="glitch font-heading" data-text="404">404</h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-6">
          Brecha en la Matrix Detectada
        </h2>
        
        <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto font-body">
          La ruta que intentas acceder ha sido cifrada, movida o nunca existió en este servidor.
        </p>

        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold text-lg transition-all magnetic-element hover:scale-105 shadow-[0_0_20px_var(--primary)] neon-border font-label">
          <ArrowLeft size={20} />
          Restablecer Conexión (Inicio)
        </Link>
      </div>
    </main>
  );
}
