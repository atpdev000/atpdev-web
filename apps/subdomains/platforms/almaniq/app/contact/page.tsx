import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto Editorial y Soporte — Almaniq Web',
  description: 'Canales de contacto oficial con el equipo editorial y técnico de Almaniq Web (almaniq.atpdev.dev — ATP DEV).',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div>
          <a href="/" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </div>
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Contacto — Almaniq Web</h1>
          <p className="text-slate-400 text-sm">
            Atención directa para consultas editoriales, aportes documentales, privacidad y soporte técnico.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 text-sm text-slate-300 leading-relaxed">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <h2 className="text-lg font-semibold text-white">Correo Electrónico Oficial</h2>
            <p>Escríbenos directamente para sugerencias documentales, rectificaciones históricas, consultas legales o soporte técnico:</p>
            <p>
              <a href="mailto:contacto@atpdev.dev" className="text-emerald-400 font-semibold underline">
                contacto@atpdev.dev
              </a>
            </p>
            <p className="text-xs text-slate-400">
              Para reportes de erratas cronológicas, incluye la fecha exacta, el mes del archivo y la referencia histórica o académica que respalda la corrección.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <h2 className="text-lg font-semibold text-white">Responsable del Sitio</h2>
            <ul className="space-y-1.5 text-xs">
              <li><strong>Editor responsable:</strong> Percy Acha Taipe (ATP DEV)</li>
              <li><strong>Ubicación:</strong> Lima, Perú</li>
              <li><strong>Horario de atención:</strong> Lunes a viernes, 09:00–18:00 (PET / UTC-5)</li>
              <li><strong>Tiempo de respuesta (SLA):</strong> 24 a 48 horas hábiles</li>
              <li><strong>Portal matriz:</strong> <a href="https://www.atpdev.dev/contacto" className="text-emerald-400 underline">www.atpdev.dev/contacto</a></li>
            </ul>
          </div>
        </div>

        <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-semibold text-white">Alcance Editorial y Gestión de Consultas</h2>
          <p>
            En <strong>Almaniq Web</strong> valoramos la precisión histórica y la colaboración con docentes, estudiantes y lectores. Atendemos prioritariamente cuatro tipos de solicitudes a través de nuestra mesa editorial:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300">
            <li><strong>Corrección de efemérides y citas:</strong> Revisión documentada de fechas, biografías, contextos científicos o discrepancias entre calendarios históricos en cualquier entrega diaria o del <a href="/archivo" className="text-emerald-400 underline">Archivo Histórico Anual</a>.</li>
            <li><strong>Propuesta de nuevas reseñas:</strong> Sugerencias de hitos científicos, culturales o cívicos iberoamericanos e internacionales con fuentes públicas contrastables.</li>
            <li><strong>Privacidad y derechos del usuario:</strong> Solicitudes sobre tratamiento de datos, preferencias de cookies y publicidad responsable conforme a nuestra <a href="/privacy" className="text-emerald-400 underline">Política de Privacidad</a>.</li>
            <li><strong>Autorizaciones de uso educativo:</strong> Consultas sobre atribución académica en aulas, bibliotecas o boletines institucionales de acuerdo con nuestros <a href="/terms" className="text-emerald-400 underline">Términos de Servicio</a>.</li>
          </ul>
          <h3 className="text-base font-semibold text-white pt-2">Criterios de Verificación y Citación Académica</h3>
          <p>
            Antes de incorporar una corrección o ampliar una efeméride del archivo histórico anual, nuestro equipo editorial contrasta las fechas en al menos dos fuentes documentales independientes, considerando la transición histórica del calendario juliano al calendario gregoriano en registros anteriores al siglo XVIII. Si preparas material escolar o presentaciones culturales usando nuestras fichas, agradecemos incluir el enlace directo al mes correspondiente dentro del archivo público.
          </p>
          <p>
            Las consultas sobre colaboraciones editoriales o derechos de reproducción comercial se derivan al portal principal de ATP Dev tras validar la identidad del remitente por correo electrónico.
          </p>
          <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
            <a href="/archivo" className="text-emerald-400 hover:underline">Explorar Archivo Anual</a>
            <a href="/about" className="text-emerald-400 hover:underline">Sobre Nosotros y Metodología</a>
            <a href="/privacy" className="text-emerald-400 hover:underline">Política de Privacidad</a>
            <a href="/terms" className="text-emerald-400 hover:underline">Términos de Servicio</a>
          </div>
        </section>
      </div>
    </main>
  );
}
