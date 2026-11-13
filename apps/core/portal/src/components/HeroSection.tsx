import { SiteConfig } from "@atpdev/database";
import { Download } from "lucide-react";
import Typewriter from "@/components/Typewriter";
import MagneticEffect from "@/components/MagneticEffect";

export default function HeroSection({
  config,
  ui,
  displayTechStack
}: {
  config: SiteConfig | null;
  ui: Record<string, string>;
  displayTechStack: string[];
}) {
  const enableGlow = config?.enable_glow_effect !== false;
  const styleStr = config?.glow_style || 'border';
  const glowClass = "interactive-card";

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-16 text-center overflow-hidden pt-20 pb-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 20%, transparent) 0%, transparent 70%)' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-6 px-4 py-1.5 border rounded-full text-xs font-semibold tracking-widest flex items-center gap-2 transition-colors" style={{ borderColor: 'var(--primary)', backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--accent-text)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse transition-colors" style={{ backgroundColor: 'var(--accent-text)' }}></span>
          {ui.availableForHire}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight transition-colors" style={{ color: 'var(--text-color)' }}>
          {config?.hero_title || "Percy Acha"}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-widest uppercase transition-colors" style={{ color: 'var(--accent-text)' }}>
          {config?.hero_subtitle || "@ATPDEV"}
        </h2>
        <h3 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
          <span className="font-light" style={{ color: 'var(--text-muted)' }}>—</span> <br className="hidden md:block"/>
          <span className="inline-block w-full text-center">
            {config?.hero_typewriter && config.hero_typewriter.length > 0 ? (
              <Typewriter words={config.hero_typewriter} />
            ) : (
              <Typewriter words={["Android Developer", "Web Engineer", "AI Integrator", "Freelancer"]} />
            )}
          </span>
        </h3>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
          {ui.heroDesc}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <MagneticEffect intensity={0.2} className="inline-flex w-full sm:w-auto">
            <a href="#portfolio" className={`w-full sm:w-auto text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${glowClass}`} style={{ backgroundColor: 'var(--btn-primary-bg)', '--glow-bg': 'var(--btn-primary-bg)', '--glow-border': '0px' } as React.CSSProperties}>
              {ui.btnProjects}
            </a>
          </MagneticEffect>
          <MagneticEffect intensity={0.15} className="inline-flex w-full sm:w-auto">
            <a href="#about" className={`w-full sm:w-auto border border-[var(--glass-border)] px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] ${glowClass}`} style={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)', color: 'var(--text-color)', '--glow-bg': 'var(--glass-bg)' } as React.CSSProperties}>
              {ui.btnAbout}
            </a>
          </MagneticEffect>
          <MagneticEffect intensity={0.1} className="inline-flex w-full sm:w-auto justify-center sm:justify-start">
            <a href="/cv.html" target="_blank" rel="noopener noreferrer" className="group hover:text-[var(--accent-text)] underline text-sm ml-0 sm:ml-4 flex items-center gap-1 transition-all duration-300 hover:scale-105" style={{ color: 'var(--text-muted)' }}>
              <Download size={14} className="transition-transform duration-300 group-hover:-translate-y-1" /> {ui.btnPdf}
            </a>
          </MagneticEffect>
        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-bold mb-4" style={{ color: 'var(--text-muted)' }}>{ui.techStack}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {displayTechStack.map(tech => (
              <span key={tech} className={`px-4 py-2 border border-[var(--glass-border)] rounded-full text-xs font-semibold shadow-sm transition-colors ${glowClass}`} style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--text-color)', '--glow-bg': 'var(--pill-bg)' } as React.CSSProperties}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
