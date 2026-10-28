import Link from 'next/link';
import { 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  HelpCircle,
  Bot,
  Building2,
  Lock,
  FileCheck2,
  Gavel
} from 'lucide-react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso Oficiales',
  description: 'Términos y condiciones de uso de Chamba Pro. Descargo de responsabilidad, naturaleza informativa no gubernamental, descargo de IA, protección de datos y política de uso 100% gratuito.',
  alternates: {
    canonical: `${SITE_URL}/terminos-y-condiciones`,
  },
  openGraph: {
    title: 'Términos y Condiciones de Uso — Chamba Pro',
    description: 'Términos y condiciones de uso y descargo legal de la plataforma Chamba Pro.',
    url: `${SITE_URL}/terminos-y-condiciones`,
    type: 'website',
  },
};

export default function TerminosCondicionesPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Términos y Condiciones',
        item: `${SITE_URL}/terminos-y-condiciones`,
      },
    ],
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al inicio de Chamba Pro</span>
        </Link>

        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono font-semibold">
            <Scale size={14} />
            <span>Condiciones de Servicio & Marco Regulatorio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Bienvenido a <strong>Chamba Pro</strong>. Al acceder, navegar y utilizar los servicios, herramientas y simuladores provistos en este sitio web (incluidos <code>atpdev.dev</code> y <code>chamba.atpdev.dev</code>), aceptas los siguientes términos y condiciones de forma íntegra, consciente y sin reservas. Si no estás de acuerdo con alguna cláusula, debes abstenerte de utilizar la plataforma.
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Última actualización: 28 de Octubre de 2026 | Versión 2.4 Oficial
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          {/* Section 1: Descargo de no afiliación oficial */}
          <section className="bg-amber-50/60 dark:bg-amber-950/20 p-6 sm:p-8 rounded-2xl space-y-4 border border-amber-200 dark:border-amber-800/40 shadow-sm">
            <h2 className="text-lg font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 font-display">
              <AlertTriangle size={20} />
              <span>1. Descargo Expreso de No Afiliación Gubernamental (Disclaimer)</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Chamba Pro es una iniciativa privada, independiente y estrictamente informativa.</strong> Este sitio web NO es un portal oficial del Estado Peruano, no representa a la Autoridad Nacional del Servicio Civil (SERVIR), ni a ningún ministerio, entidad pública o empresa privada.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Toda la información sobre convocatorias CAS (D.L. 1057), régimen 728, 276 o locación de servicios es recopilada de fuentes de acceso público oficial del Estado (portales de transparencia, diarios oficiales y páginas institucionales de convocatorias). La decisión final, evaluación, cronograma, publicación de bases y selección de personal corresponde con exclusividad e independencia a las entidades convocantes.
            </p>
          </section>

          {/* Section 2: Gratuidad total y prevención de fraudes */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>2. Política de Gratuidad Total y Alerta Anti-Estafas</span>
            </h2>
            <p>
              El acceso a Chamba Pro, la consulta de puestos laborales, la descarga de bases oficiales y el uso de nuestras herramientas (Calculadora de Sueldo, Generador de CV, Simulador IA, Matcher de Perfiles) es <strong>100% gratuito</strong> para el postulante.
            </p>
            <p>
              <strong>Advertencia al postulante:</strong> Ninguna institución pública del Estado Peruano cobra dinero por postular a un puesto de trabajo ni por &quot;asegurar una vacante&quot;. Si alguien te solicita pagos para tramitar tu postulación, estás frente a un intento de estafa. Chamba Pro promueve activamente la meritocracia, la transparencia y la honestidad en el empleo público y privado.
            </p>
          </section>

          {/* Section 3: Uso de Inteligencia Artificial y Descargo Tecnológico */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Bot className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>3. Descargo sobre el Uso de Inteligencia Artificial (AI Disclaimer)</span>
            </h2>
            <p>
              Chamba Pro integra modelos de Inteligencia Artificial para enriquecer la experiencia de usuario a través de funcionalidades como:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li>
                <strong>Resolutor y Localizador de Bases Oficiales (AI Bases Resolver):</strong> Rastrea y sugiere enlaces directos a documentos PDF y portales de transparencia institucional. Los resultados son generados mediante algoritmos probabilísticos. <em>El postulante tiene la obligación inexcusable de verificar que las bases correspondan a la convocatoria vigente y a la entidad convocante antes de presentar su expediente</em>.
              </li>
              <li>
                <strong>Matcher y Diagnóstico de CV CAS:</strong> Analiza compatibilidades semánticas entre el currículum del postulante y el perfil del puesto publicado. Dicha evaluación es puramente referencial, pedagógica y no influye en las comisiones evaluadoras oficiales.
              </li>
              <li>
                <strong>Simulador de Entrevistas con IA:</strong> Entrena al postulante frente a posibles preguntas de conocimiento, ética y función pública. No garantiza la aprobación del examen ni representa preguntas exactas del concurso.
              </li>
            </ul>
            <p className="text-xs text-slate-500 italic">
              Chamba Pro no asume responsabilidad civil, contractual o extracontractual por decisiones de postulación basadas exclusivamente en recomendaciones o clasificaciones generadas por IA.
            </p>
          </section>

          {/* Section 4: Publicación de Ofertas por Reclutadores y Oficinas de RRHH */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Building2 className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>4. Condiciones para Publicar Ofertas (Reclutadores y OGRH)</span>
            </h2>
            <p>
              Las instituciones del Estado, empresas y consultoras de selección que utilicen el módulo de <strong>Publicar Empleo</strong> se comprometen a:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li>Consignar información veraz, verificable y con respaldo documental oficial.</li>
              <li>No cobrar bajo ninguna circunstancia sumas de dinero por conceptos de postulación, exámenes o trámites de selección.</li>
              <li>Respetar la legislación laboral peruana, la Ley N° 26772 (prohibición de discriminación laboral) y las disposiciones de SERVIR.</li>
              <li>Proporcionar enlaces directos a sus portales de transparencia o correos institucionales oficiales.</li>
            </ul>
            <p>
              Chamba Pro se reserva el derecho irrestricto de rechazar, moderar o dar de baja de forma inmediata cualquier publicación que infrinja estas directrices o que sea denunciada por la comunidad de postulantes.
            </p>
          </section>

          {/* Section 5: Protección de Datos Personales (Ley N° 29733) */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Lock className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>5. Tratamiento de Datos Personales y Currículums (Ley N° 29733)</span>
            </h2>
            <p>
              En estricto cumplimiento de la Ley de Protección de Datos Personales (Ley N° 29733) de la República del Perú:
            </p>
            <p>
              La información ingresada en el Generador de CV o en el analizador de documentos es procesada de forma privada en el navegador o en entornos seguros de inferencia temporal. Chamba Pro <strong>no vende, arrienda, comercializa ni cede bases de datos de hojas de vida</strong> a agencias de marketing ni a terceros con fines lucrativos.
            </p>
            <p>
              Para conocer en detalle nuestros mecanismos de almacenamiento, cookies y derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), revisa nuestra{' '}
              <Link href="/politica-de-privacidad" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </section>

          {/* Section 6: Uso de Herramientas y Calculadoras */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>6. Uso de Herramientas Interactivas y Calculadoras</span>
            </h2>
            <p>
              Las herramientas interactivas disponibles en el sitio:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li>
                <strong>Calculadora de Sueldo Neto CAS:</strong> Proporciona estimaciones ilustrativas basadas en las tasas vigentes de retención de ONP (13%), AFP (fondo + comisión aproximada) e impuesto a la renta de 4ta/5ta categoría según la UIT del año en curso. No sustituye a una liquidación de nómina ni boleta de pago emitida por la Oficina de Recursos Humanos de tu empleador.
              </li>
              <li>
                <strong>Generador de CV y Formatos de Anexos:</strong> Son herramientas formativas de preparación personal. El usuario es el único responsable de la veracidad y autenticidad de la información y declaraciones juradas que presente formalmente ante la entidad.
              </li>
            </ul>
          </section>

          {/* Section 7: Publicidad y Enlaces Externos */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <ExternalLink className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>7. Red de Publicidad (Google AdSense) y Enlaces a Terceros</span>
            </h2>
            <p>
              Para financiar los costos de servidores, indexación y desarrollo continuo, el sitio exhibe publicidad suministrada por Google AdSense y redes asociadas, claramente identificadas como espacios patrocinados.
            </p>
            <p>
              Chamba Pro no ejerce control editorial sobre los productos o servicios ofrecidos por anunciantes terceros ni sobre los portales externos a los que se redirige al postulante. El usuario asume su propia responsabilidad al navegar en plataformas de terceros.
            </p>
          </section>

          {/* Section 8: Propiedad Intelectual */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <FileCheck2 className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>8. Propiedad Intelectual y Restricciones de Uso</span>
            </h2>
            <p>
              El código fuente, arquitectura, diseño gráfico, logotipos, compilaciones de datos e interfaces de usuario de Chamba Pro son propiedad exclusiva de ATP DEV y se encuentran protegidos por la legislación sobre derechos de autor y propiedad industrial.
            </p>
            <p>
              Queda estrictamente prohibida la ingeniería inversa, extracción masiva abusiva mediante bots o scraping no autorizado que degrade la disponibilidad del servicio, así como la reproducción comercial no autorizada de la plataforma.
            </p>
          </section>

          {/* Section 9: Ley Aplicable y Jurisdicción */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Gavel className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>9. Ley Aplicable, Resolución de Conflictos y Jurisdicción</span>
            </h2>
            <p>
              Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes vigentes de la <strong>República del Perú</strong>.
            </p>
            <p>
              Cualquier controversia, discrepancia o reclamación que surja del uso del sitio web será sometida a la competencia y jurisdicción territorial de los Juzgados y Tribunales del Distrito Judicial de <strong>Lima, Perú</strong>, con renuncia expresa de las partes a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.
            </p>
          </section>

          {/* Section 10: Modificaciones y Canal de Contacto */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <HelpCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>10. Modificaciones del Servicio y Canal de Contacto</span>
            </h2>
            <p>
              Nos reservamos el derecho de modificar o actualizar estos términos en cualquier momento para adaptarlos a novedades legislativas o mejoras del servicio. Las modificaciones entrarán en vigencia a partir de su publicación en el sitio web.
            </p>
            <p>
              Si tienes preguntas, sugerencias o deseas reportar una convocatoria desactualizada o irregular, comunícate con nosotros a través de nuestro{' '}
              <Link href="/contacto" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Canal Oficial de Contacto y Soporte
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

