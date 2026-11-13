import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, Server, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad • Lector QR Pro',
  description: 'Conoce cómo protegemos tu privacidad, el procesamiento local de imágenes de cámara y el uso de cookies y publicidad de Google AdSense.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Cumplimiento Legal RGPD • CCPA • Google Publisher</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Política de Privacidad
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Última actualización: 9 de noviembre de 2026. Operado por ATP DEV Perú.
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            1. Compromiso de Privacidad y Procesamiento Local en el Dispositivo
          </h2>
          <p>
            En <strong>Lector QR Pro</strong> (accesible desde <code>lectorqr.atpdev.dev</code> y su red de subdominios), la privacidad de nuestros usuarios es nuestra máxima prioridad técnica. A diferencia de otros lectores en línea tradicionales, nuestro motor de visión computacional (basado en la API nativa <code>BarcodeDetector</code> y la librería de código abierto <code>jsQR</code>) procesa las capturas de cámara y las imágenes cargadas <strong>100% en la memoria RAM de tu propio navegador web</strong>.
          </p>
          <p className="font-semibold text-emerald-400">
            Ninguna imagen, fotografía, captura de pantalla o transmisión de vídeo se sube ni se almacena jamás en nuestros servidores.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            2. Permisos del Dispositivo (Cámara Web)
          </h2>
          <p>
            Para utilizar la función de escaneo en vivo, el navegador solicitará tu consentimiento explícito para acceder a la cámara mediante <code>navigator.mediaDevices.getUserMedia</code>. Este acceso se utiliza exclusivamente para proyectar los fotogramas en el visor del dispositivo en tiempo real. Puedes revocar este permiso en cualquier momento desde los ajustes de seguridad de tu navegador.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            3. Publicidad de Terceros y Cookies de Google AdSense
          </h2>
          <p>
            Este sitio web utiliza <strong>Google AdSense</strong> para mostrar anuncios relevantes a los visitantes. Google, como proveedor asociado, utiliza cookies (incluyendo la cookie de DoubleClick) para publicar anuncios basados en las visitas previas de los usuarios a este u otros sitios web de Internet.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              Los usuarios pueden inhabilitar la publicidad personalizada visitando la{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                Configuración de anuncios de Google
              </a>.
            </li>
            <li>
              También pueden inhabilitar el uso de cookies para publicidad personalizada de otros proveedores a través de{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                AboutAds.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            4. Almacenamiento Local (Local Storage)
          </h2>
          <p>
            Lector QR Pro guarda tu historial de escaneos y preferencias (sonido, vibración y colores favoritos) en el <code>localStorage</code> exclusivo de tu navegador. Estos datos no son accesibles para terceros y puedes borrarlos en cualquier momento desde la sección de Ajustes o vaciando el caché de tu navegador.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            5. Contacto sobre Privacidad
          </h2>
          <p>
            Si tienes dudas o inquietudes sobre esta Política de Privacidad o requieres ejercer tus derechos de acceso, rectificación o supresión bajo el RGPD o leyes locales, puedes contactarnos a través de:
          </p>
          <p className="font-mono text-cyan-400">
            Email: contacto@atpdev.dev<br />
            Entidad: ATP DEV Perú • Lima, Perú
          </p>
        </section>

      </div>

    </div>
  );
}

