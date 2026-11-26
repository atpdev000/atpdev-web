import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Generador de Códigos QR Personalizados (WiFi, vCard, URL) | Lector QR Pro",
  description: "Crea códigos QR de alta resolución en PNG y SVG para enlaces, redes WiFi, tarjetas de contacto vCard, WhatsApp y texto libre 100% en tu navegador.",
  alternates: {
    canonical: "/generar",
  },
};

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 pt-4">
        <div className="rounded-3xl bg-white dark:bg-slate-900/80 shadow-xs dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
              Guía Técnica para Generar Códigos QR Profesionales y Escaneables
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Recomendaciones basadas en el estándar internacional ISO/IEC 18004 para lograr lectura instantánea tanto en pantallas digitales como en material impreso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Corrección de errores (ECC)</h3>
              <p>
                Cuando insertas un logotipo central en tu código QR, el estándar Reed-Solomon compensa los módulos ocultos. Para diseños con logotipo usa nivel <strong>H (30%)</strong> o <strong>Q (25%)</strong>; para URLs cortas limpias sin imagen interior, nivel <strong>M (15%)</strong> genera matrices menos densas y más fáciles de leer a distancia.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">SVG Vectorial vs PNG HD</h3>
              <p>
                Elige <strong>PNG (1024 px o 2048 px)</strong> para publicar rápidamente en redes sociales, WhatsApp o documentos de oficina. Selecciona <strong>SVG vectorial</strong> cuando vayas a enviar el código a imprenta para gigantografías, cartas de restaurante, empaques o tarjetas de presentación sin pérdida de nitidez.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contraste y Zona de Quietud</h3>
              <p>
                Las cámaras móviles necesitan suficiente contraste entre los módulos oscuros y el fondo claro, además de un margen blanco perimetral intacto (zona de quietud). Verifica siempre el resultado final con el{' '}
                <Link href="/" className="text-cyan-700 dark:text-cyan-400 font-semibold underline">Escáner QR de Lector QR Pro</Link>{' '}
                y consulta nuestras{' '}
                <Link href="/guias" className="text-cyan-700 dark:text-cyan-400 font-semibold underline">Guías Técnicas</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
