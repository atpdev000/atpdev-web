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
            <p>Escríbenos directamente para sugerencias, correcciones o consultas legales:</p>
            <p>
              <a href="mailto:contacto@atpdev.dev" className="text-emerald-400 font-semibold underline">
                contacto@atpdev.dev
              </a>
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <h2 className="text-lg font-semibold text-white">Responsable del Sitio</h2>
            <ul className="space-y-1.5 text-xs">
              <li><strong>Editor responsable:</strong> Percy Acha Taipe (ATP DEV)</li>
              <li><strong>Ubicación:</strong> Lima, Perú</li>
              <li><strong>Tiempo de respuesta:</strong> 24 a 48 horas hábiles</li>
              <li><strong>Portal matriz:</strong> <a href="https://www.atpdev.dev/#contact" className="text-emerald-400 underline">www.atpdev.dev/#contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
