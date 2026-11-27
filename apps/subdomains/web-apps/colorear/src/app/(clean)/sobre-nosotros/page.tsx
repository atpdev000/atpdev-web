import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce al equipo detrás de Colorear Pro y el ecosistema de herramientas web ATP Dev.',
  alternates: { canonical: 'https://colorear.atpdev.dev/sobre-nosotros' },
};

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
      <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
        Sobre Colorear Pro
      </h1>
      <p>
        <strong>Colorear Pro</strong> nace dentro del laboratorio de ingeniería web{' '}
        <strong>ATP Dev Perú</strong> (<code>atpdev.dev</code>) con dos propósitos concretos: ofrecer
        a familias y docentes láminas educativas limpias para imprimir gratis a 300 DPI, y dar a los
        autores independientes de Amazon KDP un estudio técnico que automatice la limpieza blanco y
        negro, los reversos anti-traspaso y el cálculo exacto de portadas.
      </p>
      <p>
        A diferencia de plataformas pesadas que cobran suscripciones cerradas o incrustan marcas de
        agua en tus archivos, todo nuestro procesamiento PDF se ejecuta directamente en tu navegador
        respetando tu privacidad y velocidad de trabajo.
      </p>
      <p>
        ¿Tienes sugerencias de nuevas categorías o funciones para el Estudio KDP? Escríbenos desde{' '}
        <Link href="/contacto" className="text-blue-600 dark:text-blue-400 font-bold underline">
          Contacto
        </Link>
        .
      </p>
    </div>
  );
}

