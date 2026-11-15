import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Cookie, ExternalLink } from 'lucide-react';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/siteConfig';

export const metadata = {
  alternates: { canonical: '/politica-de-privacidad' },
  title: `Política de Privacidad | ${SITE_NAME}`,
  description: `Política de privacidad y protección de datos personales de ${SITE_NAME} conforme a la Ley 29733, RGPD y directrices de Google AdSense.`,
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al inicio</span>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protección de Datos, Ley 29733 & RGPD</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          Política de Privacidad & Protección de Datos
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Última actualización: Octubre de 2026. Compromiso de transparencia, privacidad y apego irrestricto a las directrices de publicación de Google AdSense.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 text-sm text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-pink-500" />
            <span>1. Responsable del Tratamiento de Datos</span>
          </h2>
          <p>
            El responsable del tratamiento de los datos recabados en este sitio web es <strong>ATP DEV</strong>. Puedes comunicarte con nuestro equipo de privacidad y soporte técnico a través del correo electrónico <span className="text-pink-400 font-mono font-bold">{CONTACT_EMAIL}</span>.
          </p>
        </section>

        <section className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-pink-500" />
            <span>2. Uso de Cookies y Publicidad de Terceros (Google AdSense)</span>
          </h2>
          <p>
            Este sitio web utiliza cookies y tecnologías de seguimiento de terceros para ofrecer una experiencia fluida y financiar el acceso 100% gratuito a nuestras herramientas de sorteos mediante anuncios digitales relevantes.
          </p>
          <div className="space-y-2.5 bg-black/40 p-4 rounded-xl text-xs text-zinc-300 border border-white/5">
            <p className="font-bold text-white uppercase font-mono tracking-wide">
              Información obligatoria sobre la publicidad de Google:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>
                <strong>Proveedores externos:</strong> Proveedores externos, incluido Google, utilizan cookies para publicar anuncios basados en las visitas anteriores del usuario a este sitio web o a otros sitios de Internet.
              </li>
              <li>
                <strong>Cookie de publicidad DART / DoubleClick:</strong> El uso de cookies publicitarias permite a Google y a sus socios comerciales mostrar anuncios a los usuarios en función de sus visitas a Sorteos Pro y a otros sitios web en la red.
              </li>
              <li>
                <strong>Inhabilitación de publicidad personalizada:</strong> Los usuarios pueden inhabilitar voluntariamente los anuncios personalizados en la configuración de anuncios de Google visitando{' '}
                <a 
                  href="https://adssettings.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-mono inline-flex items-center gap-1 font-bold"
                >
                  adssettings.google.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                o a través del portal de la Digital Advertising Alliance en{' '}
                <a 
                  href="https://www.aboutads.info/choices/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-mono inline-flex items-center gap-1 font-bold"
                >
                  aboutads.info/choices <ExternalLink className="w-3 h-3" />
                </a>. Asimismo, puedes revisar cómo utiliza Google los datos cuando visitas sitios o aplicaciones de socios en{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-mono inline-flex items-center gap-1 font-bold"
                >
                  policies.google.com/technologies/partner-sites <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">3. Tratamiento de Datos de Redes Sociales</h2>
          <p>
            Al utilizar nuestras herramientas de sorteo para Instagram, TikTok, YouTube o Facebook:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Únicamente procesamos datos de dominio público: nombres de usuario visibles (@handles), fecha y contenido de los comentarios en la publicación objeto de la promoción.</li>
            <li>No solicitamos ni almacenamos contraseñas, números de teléfono ni datos financieros.</li>
            <li>Los datos de los comentarios se procesan efímeramente para extraer ganadores y nunca son vendidos ni compartidos con fines comerciales.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">4. Almacenamiento Local (Local Storage)</h2>
          <p>
            Sorteos Pro utiliza almacenamiento local seguro (`localStorage`) del navegador para conservar tus preferencias (modo de tema oscuro/claro, idioma seleccionado, historial local de tiradas de ruleta y dados) sin requerir autenticación obligatoria.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">5. Ejercicio de Derechos ARCO</h2>
          <p>
            Conforme a la Ley N° 29733 (Ley de Protección de Datos Personales de Perú) y normativas internacionales (RGPD), puedes ejercer en cualquier momento tus derechos de Acceso, Rectificación, Cancelación y Oposición contactando a nuestro canal oficial:{' '}
            <Link href="/contacto" className="text-pink-400 hover:underline font-bold">
              Formulario de Contacto
            </Link>{' '}
            o enviando un correo a <span className="text-pink-400 font-mono font-bold">{CONTACT_EMAIL}</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
