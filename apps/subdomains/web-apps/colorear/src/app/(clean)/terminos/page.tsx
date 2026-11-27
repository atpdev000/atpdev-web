import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso',
  description: 'Condiciones de uso de la biblioteca gratuita y del Estudio KDP en Colorear Pro.',
  alternates: { canonical: 'https://colorear.atpdev.dev/terminos' },
};

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
      <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
        Términos y Condiciones de Uso
      </h1>
      <p>
        Al acceder a <strong>Colorear Pro</strong> (<code>colorear.atpdev.dev</code>), aceptas los
        presentes términos de servicio establecidos por <strong>ATP Dev Perú</strong>.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        1. Uso permitido de la biblioteca gratuita
      </h2>
      <p>
        Las láminas de la biblioteca pública pueden imprimirse y colorearse libremente con fines
        personales, familiares y educativos en aulas o talleres. No está permitido redistribuirlas en
        masa como otro banco de descargas clonado.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        2. Responsabilidad sobre publicaciones en Amazon KDP
      </h2>
      <p>
        El Estudio KDP ofrece herramientas técnicas (limpieza line-art, cálculo de lomo y compilación
        PDF a 300 DPI). Cada creador es responsable de verificar que el contenido, títulos e imágenes
        que publique cumplan con los derechos de autor, marcas registradas y políticas vigentes de
        Amazon Kindle Direct Publishing, incluida la declaración de contenido generado con IA.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        3. Independencia de marca
      </h2>
      <p>
        Colorear Pro y ATP Dev Perú son servicios independientes y no tienen afiliación ni patrocinio
        oficial con Amazon.com, Inc. ni con Kindle Direct Publishing (KDP).
      </p>
    </div>
  );
}

