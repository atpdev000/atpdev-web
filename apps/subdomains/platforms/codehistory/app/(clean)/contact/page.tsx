import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto Editorial y Soporte — Code History Daily',
  description: 'Canales de contacto oficial con el equipo editorial y técnico de Code History Daily (codehistory.atpdev.dev — ATP DEV).',
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
          <h1 className="text-3xl sm:text-4xl font-bold">Contacto — Code History Daily</h1>
          <p className="text-slate-400 text-sm">
            Atención directa para consultas editoriales, aportes documentales, privacidad y soporte técnico.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 text-sm text-slate-300 leading-relaxed">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <h2 className="text-lg font-semibold text-white">Correo Electrónico Oficial</h2>
            <p>Escríbenos directamente para sugerencias técnicas, aportes de RFC/fuentes, correcciones o consultas legales:</p>
            <p>
              <a href="mailto:contacto@atpdev.dev" className="text-emerald-400 font-semibold underline">
                contacto@atpdev.dev
              </a>
            </p>
            <p className="text-xs text-slate-400">
              Para correcciones históricas sobre compiladores, estándares RFC o fechas de lanzamiento, adjunta el enlace al anuncio primario o documentación oficial.
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
            <strong>Code History Daily</strong> mantiene un canal abierto para la comunidad de ingeniería, docencia universitaria e historia de la computación. Atendemos cuatro categorías principales de mensajes:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300">
            <li><strong>Rectificación documental:</strong> Revisión de fechas de publicación (diferenciando versiones alpha/0.x de lanzamientos 1.0), autores de algoritmos o números de RFC en el <a href="/archivo" className="text-emerald-400 underline">Archivo Anual</a>.</li>
            <li><strong>Sugerencias de hitos de software:</strong> Propuestas de estándares web, sistemas operativos, bases de datos y pioneros poco difundidos con referencias verificables.</li>
            <li><strong>Privacidad y Consent Mode:</strong> Consultas sobre tratamiento de datos, preferencias publicitarias o derechos de acceso descritos en nuestra <a href="/privacy" className="text-emerald-400 underline">Política de Privacidad</a>.</li>
            <li><strong>Uso docente y citas técnicas:</strong> Autorizaciones de reproducción parcial para syllabus universitarios o material didáctico según nuestros <a href="/terms" className="text-emerald-400 underline">Términos de Servicio</a>.</li>
          </ul>
          <h3 className="text-base font-semibold text-white pt-2">Proceso de Revisión Técnica y Citas Bibliográficas</h3>
          <p>
            Cada reporte recibido pasa por una revisión documental frente a memorandos RFC del IETF, actas académicas de la ACM e IEEE y anuncios originales de lanzamiento publicados por universidades o laboratorios de ingeniería. Diferenciamos explícitamente entre borradores internos de laboratorio, versiones públicas iniciales y especificaciones estándar definitivas para preservar el rigor histórico.
          </p>
          <p>
            Si utilizas las fichas mensuales en cursos introductorios de ciencias de la computación o bootcamps técnicos, te invitamos a citar la ruta del mes específico y escribirnos ante cualquier duda de licenciamiento o accesibilidad. Nuestro equipo editorial en Lima, Perú responde en un plazo de 24 a 48 horas hábiles bajo estricto cumplimiento de la Ley N° 29733 de Protección de Datos Personales y estándares internacionales RGPD.
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
