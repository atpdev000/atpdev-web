import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y tratamiento de datos en Colorear Pro (colorear.atpdev.dev).',
  alternates: { canonical: 'https://colorear.atpdev.dev/privacidad' },
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-sm text-zinc-700 dark:text-slate-300 leading-relaxed">
      <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
        Política de Privacidad
      </h1>
      <p>
        En <strong>Colorear Pro</strong> (<code>https://colorear.atpdev.dev</code>), operado por{' '}
        <strong>ATP Dev Perú</strong>, protegemos tu privacidad conforme a la Ley N.° 29733 de
        Protección de Datos Personales del Perú y al Reglamento General de Protección de Datos (RGPD).
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        1. Procesamiento local de archivos y PDFs
      </h2>
      <p>
        Las ilustraciones que subes al Estudio KDP, la limpieza a blanco y negro puro, el re-escalado a
        300 DPI y la compilación de archivos PDF se ejecutan directamente en tu navegador web. Tus
        imágenes personales y manuscritos no se almacenan de forma permanente en nuestros servidores.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        2. Generación asistida por IA y cuotas de uso
      </h2>
      <p>
        Cuando solicitas generar una lámina o plan de libro mediante inteligencia artificial, el texto
        descriptivo (prompt) se envía de forma segura a nuestros proveedores de generación de texto e
        imagen únicamente para devolverte el resultado solicitado. Utilizamos un contador temporal de
        solicitudes para prevenir abuso automatizado.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        3. Publicidad y Consent Mode v2
      </h2>
      <p>
        Mostramos anuncios mediante Google AdSense en las páginas públicas de contenido. Implementamos
        Google Consent Mode v2 con almacenamiento publicitario y analítico denegado por defecto hasta
        que otorgues tu consentimiento expreso. Puedes modificar o revocar tu decisión en cualquier
        momento desde el enlace <strong>Configurar Cookies</strong> del pie de página.
      </p>
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        4. Contacto sobre privacidad
      </h2>
      <p>
        Para consultas o solicitudes sobre datos personales, escríbenos a{' '}
        <a href="mailto:contacto@atpdev.dev" className="text-blue-600 dark:text-blue-400 underline">
          contacto@atpdev.dev
        </a>
        .
      </p>
    </div>
  );
}

