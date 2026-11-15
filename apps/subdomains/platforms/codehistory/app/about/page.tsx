import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Metodología Editorial — Code History Daily',
  description: 'Conoce el equipo editorial, las fuentes documentales primarias y los estándares de verificación de Code History Daily (codehistory.atpdev.dev), proyecto de ATP DEV.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div>
          <a href="/" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </div>
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Sobre Nosotros — Code History Daily</h1>
          <p className="text-slate-400 text-sm">
            Publicación divulgativa y archivo cronológico operado por Percy Acha Taipe (ATP DEV)
          </p>
        </header>
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">1. Propósito Editorial</h2>
            <p>
              <strong>Code History Daily</strong> es una plataforma digital dedicada a documentar y contextualizar hitos históricos de la ingeniería de software, sistemas operativos, estándares RFC/W3C y pioneros de la computación. Nuestro objetivo es ofrecer crónicas rigurosas, libres de sensacionalismo y verificadas contra archivos históricos, publicaciones académicas y repositorios oficiales.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">2. Proceso de Verificación Documental</h2>
            <p>
              Cada entrada cronológica y cada dossier de nuestro <a href="/archivo" className="text-emerald-400 underline">Archivo Computacional Anual</a> atraviesa tres filtros técnicos de validación antes de incorporarse al catálogo permanente:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 mt-2">
              <li>
                <strong>Fuentes primarias de ingeniería:</strong> Cotejo de fechas exactas contra memorandos RFC del IETF, anuncios originales en grupos históricos de Usenet (<code>comp.os.minix</code>, <code>alt.sources</code>, <code>alt.hypertext</code>), notas de lanzamiento oficiales y documentación de laboratorios pioneros.
              </li>
              <li>
                <strong>Rigor en decisiones de arquitectura:</strong> Explicación clara de por qué surgió cada lenguaje, compilador, protocolo o sistema operativo, describiendo las limitaciones técnicas previas que resolvieron.
              </li>
              <li>
                <strong>Curación humana continua:</strong> Revisión técnica por ingenieros de software para evitar atribuciones erróneas, mitos repetidos en blogs genéricos o imprecisiones entre versiones alfa y lanzamientos estables.
              </li>
            </ul>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">3. Alcance del Archivo Tecnológico</h2>
            <p>
              Documentamos doce grandes etapas anuales en nuestro índice de <a href="/archivo" className="text-emerald-400 underline">hitos de computación por mes</a>, abarcando pioneros de la computabilidad como Ada Lovelace y Alan Turing, el nacimiento de Unix y TCP/IP, la apertura de la World Wide Web, el auge del software libre, navegadores, lenguajes modernos (Python, Java, JavaScript, Ruby, Go, TypeScript) y estándares abiertos del W3C.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white">4. Autoría y Transparencia (E-E-A-T)</h2>
            <p>
              Este sitio forma parte del ecosistema de proyectos de ingeniería y divulgación de <strong>ATP DEV</strong> (<a href="https://www.atpdev.dev" className="text-emerald-400 underline">www.atpdev.dev</a>), dirigido por el Ing. <strong>Percy Acha Taipe</strong> desde Lima, Perú. Cada crónica técnica reconstruye lanzamientos de compiladores, protocolos web, arquitectura hardware y decisiones históricas de diseño de software útiles para desarrolladores, estudiantes de informática e investigadores.
            </p>
            <p className="mt-2">
              El acceso al archivo diario y mensual es totalmente abierto y se financia mediante publicidad responsable transparente bajo Google Consent Mode v2. Para proponer efemérides documentadas, reportar erratas o realizar consultas legales puedes escribir a{' '}
              <a href="mailto:contacto@atpdev.dev" className="text-emerald-400 underline">contacto@atpdev.dev</a>{' '}
              o visitar <a href="/contact" className="text-emerald-400 underline">Contacto</a>, nuestra <a href="/privacy" className="text-emerald-400 underline">Política de Privacidad</a> y los <a href="/terms" className="text-emerald-400 underline">Términos de Servicio</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
