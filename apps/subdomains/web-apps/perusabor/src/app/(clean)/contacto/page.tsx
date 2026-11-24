import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, ShieldCheck, ArrowLeft, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto y Soporte Gastronómico — Perú Sabor Inteligente',
  description:
    'Canales oficiales de contacto, soporte técnico y consultas editoriales de Perú Sabor Inteligente (ATP DEV).',
  alternates: { canonical: '/contacto' },
  robots: { index: true, follow: true },
};

export default function ContactoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c22929] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Perú Sabor Inteligente
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          Contacto y Soporte Técnico
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Atención directa para chefs, emprendedores gastronómicos, estudiantes y usuarios de Perú Sabor.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-700 dark:text-stone-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Mail className="w-4 h-4 text-[#c22929]" />
            <h2>Correo Electrónico Institucional</h2>
          </div>
          <p className="leading-relaxed">
            Para soporte sobre las calculadoras de Food Cost, escalador de recetas, reporte de errores o consultas sobre privacidad y publicidad:
          </p>
          <a
            href="mailto:contacto@atpdev.dev"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c22929]/10 text-[#c22929] font-bold text-xs hover:bg-[#c22929]/20 transition-colors"
          >
            contacto@atpdev.dev
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Clock className="w-4 h-4 text-[#c22929]" />
            <h2>Horario y Responsable Legal</h2>
          </div>
          <ul className="space-y-2 text-xs leading-relaxed">
            <li><strong>Titular del sitio:</strong> Percy Acha Taipe — Ecosistema ATP DEV</li>
            <li><strong>Ubicación operativa:</strong> Lima, Perú (GMT-5)</li>
            <li><strong>Tiempo de respuesta habitual:</strong> 24 a 48 horas hábiles</li>
            <li><strong>Portal corporativo:</strong> <a href="https://www.atpdev.dev/contacto" className="text-[#c22929] underline font-semibold">www.atpdev.dev/contacto</a></li>
          </ul>
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
          <ShieldCheck className="w-4 h-4 text-[#c22929]" />
          <h2>Motivos Frecuentes de Contacto y Guías Disponibles</h2>
        </div>
        <p>
          Antes de enviar tu consulta, puedes explorar nuestras herramientas y documentación técnica especializada en gastronomía peruana para resolver dudas inmediatas de rendimiento, gramajes y costos:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
            <h3 className="font-bold text-stone-900 dark:text-stone-100">Correcciones de recetas regionales o mermas</h3>
            <p>
              Si detectas un ajuste necesario en factores de merma bruta/neta, temperaturas de cocción o fichas técnicas de nuestro{' '}
              <Link href="/recetas" className="text-[#c22929] font-semibold underline">Recetario Oficial</Link>, indícanos el plato exacto y tu referencia culinaria.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
            <h3 className="font-bold text-stone-900 dark:text-stone-100">Uso de calculadoras y transparencia legal</h3>
            <p>
              Para soporte del <Link href="/escalador" className="text-[#c22929] font-semibold underline">Escalador de Porciones</Link>, la calculadora de <Link href="/costeo" className="text-[#c22929] font-semibold underline">Food Cost</Link> o consultas sobre cookies y datos personales, revisa también nuestra <Link href="/privacidad" className="text-[#c22929] font-semibold underline">Política de Privacidad</Link> y <Link href="/terminos" className="text-[#c22929] font-semibold underline">Términos de Uso</Link>.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Protocolo de Revisión Gastronómica, Estandarización de Recetas y Colaboraciones</h3>
          <p>
            En Perú Sabor Inteligente trabajamos de manera continua en la verificación de pesos brutos, rendimientos netos tras deshidratación térmica, equivalencias de insumos regionales (ají amarillo, ají panca, ají limo, rocoto, huacatay, chicha de jora y variedades de papa nativa) y costos referenciales en mercados mayoristas y minoristas del Perú.
          </p>
          <p>
            Si eres docente de gastronomía, jefe de cocina, propietario de restaurante o investigador culinario y deseas proponer la inclusión de una receta regional documentada o reportar una variación técnica en nuestros factores de merma, envíanos tu ficha técnica a contacto@atpdev.dev indicando la región de origen, el número de raciones base y el procedimiento térmico detallado. Todas las solicitudes son evaluadas por el equipo editorial de ATP DEV en Lima, Perú en un plazo máximo de 24 a 48 horas hábiles.
          </p>
          <p>
            De igual manera, atendemos consultas sobre el ejercicio de derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) conforme a la Ley N° 29733 de Protección de Datos Personales y configuraciones de preferencias de Google Consent Mode v2 detalladas en nuestra <Link href="/politica-de-cookies" className="text-[#c22929] font-semibold underline">Política de Cookies</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
