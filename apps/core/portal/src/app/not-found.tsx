import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { getSiteConfig } from "@atpdev/database";
import "./globals.css";

export default async function NotFound() {
  const config = await getSiteConfig();
  
  const primary = config?.primary_color || "#2563eb";
  const secondary = config?.secondary_color || "#1e40af";
  const tertiary = config?.tertiary_color || "#3b82f6";
  const neutral = config?.neutral_color || "#9ca3af";
  
  const fontHeadline = config?.font_headline || "Inter";
  const fontBody = config?.font_body || "Inter";
  const fontLabel = config?.font_label || "JetBrains Mono";
  
  const BUILTIN_FONTS = new Set(["Hanken Grotesk", "Inter", "Fira Code", "JetBrains Mono"]);
  const fonts = Array.from(new Set([fontHeadline, fontBody, fontLabel]));
  const customFonts = fonts.filter(f => !BUILTIN_FONTS.has(f));
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;

  return (
    <>
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={googleFontsUrl} rel="stylesheet" />
        </>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --background: #f2f2f2;
            --foreground: #1a1a1a;
            --primary: ${primary};
            --secondary: ${secondary};
            --tertiary: ${tertiary};
            --neutral: ${neutral};
            --font-heading: '${fontHeadline}', sans-serif;
            --font-body: '${fontBody}', sans-serif;
            --font-label: '${fontLabel}', monospace;
            --neon-thickness: ${(config as any)?.neon_thickness || '4px'};
            --bg1: color-mix(in srgb, var(--primary) 15%, #ffffff);
            --text-color: #1a1a1a;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: #0A0A0A;
              --foreground: #EDEDED;
              --bg1: color-mix(in srgb, var(--primary) 12%, #000000);
              --text-color: #ffffff;
            }
          }
          body {
            background-color: var(--background) !important;
            color: var(--text-color) !important;
            font-family: var(--font-body);
            margin: 0;
          }
          .glitch-wrapper { position: relative; }
          .glitch {
            position: relative;
            color: var(--text-color);
            font-size: 8rem;
            font-weight: 900;
            line-height: 1;
            z-index: 1;
            font-family: var(--font-heading);
          }
          .glitch::before, .glitch::after {
            content: attr(data-text);
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--background);
          }
          .glitch::before {
            left: 3px; text-shadow: -2px 0 var(--primary);
            animation: glitch-anim-1 2s infinite linear alternate-reverse;
          }
          .glitch::after {
            left: -3px; text-shadow: -2px 0 var(--secondary);
            animation: glitch-anim-2 3s infinite linear alternate-reverse;
          }
          @keyframes glitch-anim-1 {
            0% { clip-path: inset(20% 0 80% 0); } 20% { clip-path: inset(60% 0 10% 0); }
            40% { clip-path: inset(40% 0 50% 0); } 60% { clip-path: inset(80% 0 5% 0); }
            80% { clip-path: inset(10% 0 70% 0); } 100% { clip-path: inset(30% 0 40% 0); }
          }
          @keyframes glitch-anim-2 {
            0% { clip-path: inset(10% 0 60% 0); } 20% { clip-path: inset(80% 0 5% 0); }
            40% { clip-path: inset(30% 0 20% 0); } 60% { clip-path: inset(70% 0 15% 0); }
            80% { clip-path: inset(40% 0 50% 0); } 100% { clip-path: inset(20% 0 30% 0); }
          }
        `
      }} />

      <main className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--bg1)' }}></div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="mb-8 p-4 rounded-full animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)' }}>
            <ShieldAlert size={48} color="var(--primary)" />
          </div>
          
          <div className="glitch-wrapper mb-4">
            <h1 className="glitch" data-text="404">404</h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-color)' }}>
            Brecha en la Matrix Detectada
          </h2>
          
          <p className="text-lg mb-10 max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: '#9ca3af' }}>
            La ruta que intentas acceder ha sido cifrada, movida o nunca existió en este servidor.
          </p>

          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105" style={{ backgroundColor: 'var(--primary)', fontFamily: 'var(--font-label)', boxShadow: '0 0 20px var(--primary)' }}>
            <ArrowLeft size={20} />
            Restablecer Conexión
          </Link>
        </div>
      </main>
    </>
  );
}
