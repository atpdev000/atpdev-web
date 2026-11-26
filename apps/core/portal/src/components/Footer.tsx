import Link from "next/link";
import { SiteConfig } from "@atpdev/database";

export default function Footer({
  config,
  ui,
  lang = "es"
}: {
  config: SiteConfig | null;
  ui: Record<string, string>;
  lang?: string;
}) {
  const linkPrefix = lang === "es" ? "" : `/${lang}`;
  const isEn = lang !== "es" && lang !== "pt";

  return (
    <footer className="pt-16 pb-8 border-t transition-colors" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="text-2xl font-black mb-4" style={{ color: 'var(--text-color)' }}>ATP DEV</h3>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>{ui.footerBio}</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-xs" style={{ color: 'var(--text-color)' }}>{ui.footerLinks}</h4>
          <ul className="space-y-3">
            <li><a href={`${linkPrefix}/#about`} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.linkAbout}</a></li>
            <li><Link href={`${linkPrefix}/sobre-mi`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "ATP Dev Profile" : "ATP Dev Perfil"}</Link></li>
            <li><Link href={`${linkPrefix}/blog`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "Technical Articles" : "Artículos Técnicos"}</Link></li>
            <li><a href={`${linkPrefix}/#experience`} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.linkExperience}</a></li>
            <li><a href={`${linkPrefix}/#portfolio`} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.linkProjects}</a></li>
            <li><Link href={`${linkPrefix}/${isEn ? 'contact' : 'contacto'}`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.linkContact || (isEn ? "Contact" : "Contacto")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-xs" style={{ color: 'var(--text-color)' }}>{isEn ? "Web Tools & Ecosystem" : "Herramientas & Ecosistema"}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="https://dni.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "DNI Scanner Online (A4 PDF)" : "DNI Scanner Online (PDF A4)"}</a></li>
            <li><a href="https://lectorqr.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "QR Code Scanner & Generator" : "Lector y Generador QR Pro"}</a></li>
            <li><a href="https://masteratpdf.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "MasterAtPDF — 23 PDF Tools" : "MasterAtPDF — Unir y Convertir PDF"}</a></li>
            <li><a href="https://chamba.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "Chamba Pro — Peru Jobs" : "Chamba Pro — Convocatorias Perú"}</a></li>
            <li><a href="https://sorteos.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "Sorteos Pro — Giveaways" : "Sorteos Pro — Ruleta y Sorteos"}</a></li>
            <li><a href="https://perusabor.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "Perú Sabor — Recipes & Costing" : "Perú Sabor — Recetas Peruanas"}</a></li>
            <li><a href="https://magic.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "InteractivoMagic — 3D Cards" : "InteractivoMagic — Tarjetas 3D"}</a></li>
            <li><a href="https://almaniq.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>Almaniq — Historia Universal</a></li>
            <li><a href="https://codehistory.atpdev.dev" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>CodeHistory — Efemérides Dev</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-xs" style={{ color: 'var(--text-color)' }}>{ui.footerLegal}</h4>
          <ul className="space-y-3">
            <li><Link href={`${linkPrefix}/privacy`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.linkPrivacy}</Link></li>
            <li><Link href={`${linkPrefix}/cookies`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "Cookie Policy" : "Política de Cookies"}</Link></li>
            <li><a href="#cookies-config" className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "Cookie Settings" : "Configurar Cookies"}</a></li>
            <li><Link href={`${linkPrefix}/terms`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.linkTerms}</Link></li>
            <li><Link href={`${linkPrefix}/sobre-mi`} prefetch={false} className="hover:text-[var(--accent-text)] text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{isEn ? "About Author" : "Sobre el Autor"}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 border-t pt-8 flex flex-col md:flex-row items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-sm mb-4 md:mb-0" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} {config?.full_name || "Percy Acha Taipe"} (ATP Dev). {ui.allRights}
        </p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          {[
            { key: 'whatsapp', name: 'WhatsApp' },
            { key: 'telegram', name: 'Telegram' },
            { key: 'github', name: 'GitHub' },
            { key: 'linkedin', name: 'LinkedIn' },
            { key: 'twitter', name: 'Twitter' },
          ].map(social => {
            if (!config) return null;
            const enabledKey = `${social.key}_enabled` as keyof typeof config;
            const urlKey = `${social.key}_url` as keyof typeof config;
            if (!config[enabledKey] || !config[urlKey]) return null;
            return (
              <a key={social.key} href={config[urlKey] as string} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-text)] transition-colors" style={{ color: 'var(--text-muted)' }}>
                {social.name}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
