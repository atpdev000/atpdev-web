'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface ToolGuideInfo {
  slug: string;
  title: string;
  summary: string;
  steps: string[];
  useCases: string[];
  faqs: { q: string; a: string }[];
}

const TOOL_GUIDES: ToolGuideInfo[] = [
  {
    slug: '/herramientas/dados',
    title: 'Cómo funciona el simulador de dados 3D con aleatoriedad criptográfica',
    summary:
      'Nuestro lanzador de dados virtuales utiliza la API criptográfica del navegador (crypto.getRandomValues) para garantizar que cada cara del 1 al 6 tenga exactamente la misma probabilidad estadística (1/6 = 16,67 %) en cada lanzamiento, evitando sesgos típicos de generadores pseudoaleatorios convencionales.',
    steps: [
      'Elige cuántos dados quieres lanzar simultáneamente (de 1 a 6 dados) según la mecánica de tu juego o dinámica.',
      'Pulsa el botón Lanzar Dados para iniciar la animación en tiempo real acompañada de efecto sonoro opcional.',
      'Consulta la suma automática del tiro y revisa el historial reciente para auditar rondas consecutivas.',
      'Exporta la captura o proyecta la pantalla completa si estás realizando una transmisión en vivo.'
    ],
    useCases: [
      'Juegos de mesa en grupo, partidas de rol de mesa o dinámicas rápidas en clases virtuales.',
      'Desempates transparentes en sorteos presenciales o transmisiones de Twitch, Kick y TikTok Live.',
      'Prácticas educativas de probabilidad, frecuencia relativa y suma de variables aleatorias.'
    ],
    faqs: [
      {
        q: '¿Los resultados de los dados son verdaderamente imparciales?',
        a: 'Sí. Cada dado se calcula de manera independiente en el navegador mediante entropía criptográfica del sistema operativo con muestreo por rechazo para evitar sesgo de módulo.'
      },
      {
        q: '¿Puedo mostrar el lanzamiento en un directo o proyector?',
        a: 'Sí. Activa el modo de escenario en vivo desde el botón superior para presentar la suma y las caras con tipografía legible a pantalla completa.'
      }
    ]
  },
  {
    slug: '/herramientas/moneda',
    title: 'Lanzamiento de moneda virtual (Cara o Sello / Cara o Cruz) verificable',
    summary:
      'El simulador de moneda de Sorteos Pro aplica selección binaria equiprobable mediante generación criptográfica del lado del cliente. Es ideal para decisiones rápidas, sorteos de dos finalistas y desempates en eventos deportivos o comunidades digitales con historial de tiradas y estadísticas acumuladas.',
    steps: [
      'Haz clic en Lanzar Moneda para ejecutar un giro aleatorio imparcial con física visual 3D.',
      'Observa el resultado inmediato (Cara o Sello) junto con el contador porcentual acumulado de la sesión.',
      'Usa el panel de historial para verificar que ninguna ronda haya sido repetida ni editada manualmente.'
    ],
    useCases: [
      'Elegir entre dos finalistas en un sorteo rápido o definir el orden de participación en un torneo.',
      'Demostraciones en aula sobre la ley de los grandes números observando cómo convergen los porcentajes al 50 %.',
      'Desempates transparentes en dinámicas de pareja, equipo o transmisiones en directo.'
    ],
    faqs: [
      {
        q: '¿Cuál es la probabilidad exacta de obtener Cara o Sello?',
        a: 'Exactamente 50 % para cada resultado en cada lanzamiento independiente, sin memoria de tiradas anteriores.'
      },
      {
        q: '¿Se almacenan mis lanzamientos en algún servidor externo?',
        a: 'No. Todo el cálculo e historial de la sesión permanecen únicamente en tu navegador local.'
      }
    ]
  },
  {
    slug: '/herramientas/numeros',
    title: 'Generador criptográfico de números aleatorios para rifas y bingos',
    summary:
      'Pensado para rifas solidarias, bingos comunitarios, selección de turnos escolares y sorteos por número de ticket. Permite definir un rango mínimo y máximo, extraer varios ganadores de una sola vez y evitar números repetidos automáticamente.',
    steps: [
      'Introduce el límite inferior y superior del rango numérico de tu rifa o listado de boletos.',
      'Configura cuántos números ganadores deseas obtener y marca la opción sin repetidos si cada ticket puede ganar solo una vez.',
      'Pulsa Generar Números para obtener resultados auditables y exportar el resumen certificado.'
    ],
    useCases: [
      'Rifas enumeradas del 001 al 1000 con múltiples premios consecutivos.',
      'Asignación imparcial de orden de exposición en colegios, universidades o equipos de trabajo.',
      'Selección aleatoria de folios, facturas o tickets promocionales en tiendas locales.'
    ],
    faqs: [
      {
        q: '¿Puedo generar varios ganadores sin que salga el mismo número dos veces?',
        a: 'Sí. Con la opción sin repetidos activada el motor garantiza unicidad estricta mientras el rango tenga suficientes valores disponibles.'
      },
      {
        q: '¿Funciona si tengo miles de boletos en una rifa grande?',
        a: 'Sí. El algoritmo opera con enteros seguros en JavaScript y genera rangos amplios en milisegundos directamente en tu equipo.'
      }
    ]
  },
  {
    slug: '/herramientas/ruleta',
    title: 'Ruleta aleatoria personalizada para sorteos, premios y dinámicas en vivo',
    summary:
      'Nuestra ruleta interactiva divide la circunferencia en sectores iguales de forma automática, soporta decenas de participantes o premios y permite activar cuenta regresiva visual, sonidos de giro y eliminación automática de ganadores ya sorteados.',
    steps: [
      'Pega o escribe la lista de nombres, premios o retos (uno por línea) en el editor lateral.',
      'Personaliza si deseas retirar al participante ganador después de cada giro para evitar duplicados.',
      'Haz clic en Girar Ruleta y presenta el resultado en modo pantalla completa o escenario para streaming.'
    ],
    useCases: [
      'Giveaways en vivo por Twitch, YouTube Live, TikTok Live o eventos presenciales con proyector.',
      'Selección participativa de alumnos o temas de clase sin listas impresas.',
      'Ruletas de descuentos o premios instantáneos en ferias y activaciones de marca.'
    ],
    faqs: [
      {
        q: '¿La velocidad de giro favorece a los nombres de arriba o abajo?',
        a: 'No. Antes de animar el ángulo visual, el motor determina criptográficamente el índice ganador con probabilidad idéntica para todos los sectores.'
      },
      {
        q: '¿Puedo usar emojis o duplicar oportunidades para participantes VIP?',
        a: 'Sí. La ruleta admite emojis en cada etiqueta y si ingresas el mismo nombre en dos líneas ocupará dos sectores independientes.'
      }
    ]
  },
  {
    slug: '/herramientas/lista',
    title: 'Sorteo aleatorio de listas de nombres con suplentes y certificado verificable',
    summary:
      'Diseñado para escoger ganadores y suplentes de forma transparente a partir de cualquier lista de participantes exportada desde formularios, hojas de cálculo o chats. Incluye filtrado de duplicados, cuenta regresiva configurable y certificado visual con hash SHA-256.',
    steps: [
      'Pega los nombres o usuarios participantes en el cuadro de texto o importa tu listado limpio.',
      'Configura el número de ganadores titulares, suplentes de respaldo y si deseas depurar nombres repetidos.',
      'Inicia el sorteo para ver la animación de selección y descarga la tarjeta oficial o enlace de verificación.'
    ],
    useCases: [
      'Sorteos de inscripciones registradas en Google Forms, Excel o eventos comunitarios.',
      'Selección de ganadores en comunidades de WhatsApp, Telegram o Discord.',
      'Generación de actas visuales con suplentes listos por si el primer ganador no reclama el premio.'
    ],
    faqs: [
      {
        q: '¿Cuántos participantes puedo pegar en la lista?',
        a: 'Puedes procesar cientos o miles de líneas directamente en tu navegador sin subir bases de datos personales de terceros a la nube.'
      },
      {
        q: '¿Para qué sirven los suplentes en un sorteo?',
        a: 'Permiten designar reemplazos en orden estricto si el ganador titular no cumple las bases o no responde dentro del plazo establecido.'
      }
    ]
  },
  {
    slug: '/herramientas/raspa-gana',
    title: 'Tarjetas Raspa y Gana digitales interactivas para eventos y sorteos',
    summary:
      'Convierte cualquier listado de premios, cupones o nombres en un lienzo interactivo recubierto con textura raspable por mouse o pantalla táctil. Aporta suspenso real a dinámicas en vivo, transmisiones educativas o promociones de marcas.',
    steps: [
      'Define el mensaje ganador, premio o participante oculto debajo de la capa metálica virtual.',
      'Arrastra el dedo o el cursor sobre la tarjeta para descubrir el resultado de manera progresiva.',
      'Reinicia o cambia los premios en segundos para ejecutar múltiples rondas en un mismo evento.'
    ],
    useCases: [
      'Dinámicas sorpresa de aniversario, promociones de comercio electrónico o reveals en redes sociales.',
      'Revelación divertida del nombre ganador frente a cámaras durante un directo.',
      'Gamificación de recompensas o incentivos en equipos de ventas y clases.'
    ],
    faqs: [
      {
        q: '¿Funciona tanto en celulares con pantalla táctil como en PC?',
        a: 'Sí. El lienzo HTML5 Canvas responde tanto a gestos táctiles en Android/iOS como a clics de ratón y trackpad.'
      },
      {
        q: '¿Se descubre automáticamente al raspar suficiente superficie?',
        a: 'Sí. Al superar el umbral de área descubierta se celebra el premio revelado con total claridad.'
      }
    ]
  },
  {
    slug: '/herramientas/amigo-invisible',
    title: 'Organizador de Amigo Secreto / Amigo Invisible con reparto sin autoasignaciones',
    summary:
      'Genera un emparejamiento cíclico seguro para intercambios de regalos navideños, de oficina, familiares o universitarios. El algoritmo garantiza que ninguna persona se toque a sí misma ni quede excluida del circuito de regalos.',
    steps: [
      'Agrega los nombres de todos los participantes del grupo y establece un presupuesto o fecha sugerida si aplica.',
      'Genera el emparejamiento confidencial y comparte cada asignación por enlace o mensaje privado.',
      'Utiliza las restricciones opcionales para evitar cruces obvios cuando sea necesario.'
    ],
    useCases: [
      'Intercambios navideños en empresas remotas y equipos distribuidos.',
      'Celebraciones de cumpleaños, graduaciones o fiestas familiares con enlace directo de consulta.',
      'Organización rápida sin papelitos impresos ni riesgo de que alguien saque su propio nombre.'
    ],
    faqs: [
      {
        q: '¿Qué ocurre si el algoritmo intenta asignar a alguien consigo mismo?',
        a: 'Nuestro generador usa permutaciones sin puntos fijos (derangements), por lo que es matemáticamente imposible que alguien se regale a sí mismo.'
      },
      {
        q: '¿Es necesario que cada participante se registre o descargue una app?',
        a: 'No. Basta un navegador web estándar para abrir el emparejamiento generado.'
      }
    ]
  },
  {
    slug: '/herramientas/engagement',
    title: 'Cómo calcular e interpretar tu Tasa de Engagement en Instagram y TikTok',
    summary:
      'Conocer la tasa de interacción real de una cuenta permite dimensionar cuántos comentarios válidos recibirás al lanzar un sorteo y detectar audiencias infladas artificialmente antes de invertir en colaboraciones con creadores.',
    steps: [
      'Introduce tu número total de seguidores junto al promedio reciente de me gusta y comentarios por publicación.',
      'Observa el porcentaje de engagement calculado automáticamente frente a estándares de tu tamaño de cuenta.',
      'Revisa la estimación orientativa de participación para planificar la duración y premios de tu próximo sorteo.'
    ],
    useCases: [
      'Auditoría rápida de cuentas antes de patrocinar un giveaway conjunto con influencers.',
      'Medición de salud orgánica tras aplicar llamados a la acción en Reels y publicaciones.',
      'Comparación mensual de evolución comunitaria más allá de métricas vanidosas de seguidores.'
    ],
    faqs: [
      {
        q: '¿Qué se considera un buen engagement para un sorteo?',
        a: 'En cuentas medianas, superar entre 2 % y 4 % de interacción orgánica suele traducirse en sorteos altamente participativos sin necesidad de premios costosos.'
      },
      {
        q: '¿La fórmula tiene en cuenta comentarios y likes combinados?',
        a: 'Sí, suma las interacciones totales declaradas entre el tamaño total de seguidores multiplicado por cien.'
      }
    ]
  },
  {
    slug: '/herramientas/hashtags',
    title: 'Generador estratégico de hashtags por nicho para sorteos y alcance orgánico',
    summary:
      'Combinar etiquetas amplias con hashtags específicos de nicho y país aumenta la visibilidad de tus publicaciones sin disparar filtros antispam ni atraer únicamente cuentas cazadoras de premios sin afinidad con tu marca.',
    steps: [
      'Selecciona la categoría o temática principal de tu sorteo o publicación.',
      'Copia el bloque equilibrado de hashtags de alto volumen, nicho específico y geolocalización.',
      'Personaliza una o dos etiquetas propias de tu marca para consolidar contenido generado por usuarios.'
    ],
    useCases: [
      'Lanzamientos de sorteos en Instagram Reels, TikTok o Facebook orientados a público local.',
      'Estandarización de etiquetas para recopilar participaciones en un hashtag oficial de campaña.',
      'Evitar listas repetitivas de 30 etiquetas genéricas penalizadas por algoritmos de descubrimiento.'
    ],
    faqs: [
      {
        q: '¿Cuántos hashtags conviene incluir actualmente en Instagram o TikTok?',
        a: 'Suele rendir mejor elegir entre 5 y 12 hashtags bien alineados al contenido real de la publicación que saturar el pie de foto.'
      },
      {
        q: '¿Conviene crear un hashtag propio para el sorteo?',
        a: 'Sí, especialmente si el concurso pide compartir historias o fotografías originales de tu producto.'
      }
    ]
  },
  {
    slug: '/herramientas/equipos',
    title: 'Generador equilibrado de equipos y grupos aleatorios para deportes, clases o torneos',
    summary:
      'Divide un listado de jugadores, alumnos o participantes en la cantidad de equipos deseada distribuyendo sobrantes de manera uniforme para torneos relámpago, hackatones y trabajos grupales.',
    steps: [
      'Ingresa el listado completo de personas disponibles (una por línea).',
      'Indica en cuántos equipos o salas deseas repartir el grupo.',
      'Genera la distribución instantánea usando mezcla criptográfica Fisher-Yates sin sesgos.'
    ],
    useCases: [
      'Armar equipos imparciales de fútbol, gaming, torneos escolares o dinámicas de integración laboral.',
      'Dividir grupos de estudio en aulas universitarias y talleres prácticos.',
      'Exportar rápidamente la lista ordenada de escuadras para compartir por chat grupal.'
    ],
    faqs: [
      {
        q: '¿Cómo garantiza justicia al repartir los grupos?',
        a: 'Utiliza barajado criptográfico Fisher-Yates para que cada combinación de integrantes tenga la misma probabilidad estadística.'
      },
      {
        q: '¿Qué pasa si el total de personas no es divisible exactamente entre los equipos?',
        a: 'La diferencia máxima entre equipos nunca supera un integrante gracias al reparto cíclico automático.'
      }
    ]
  },
  {
    slug: '/herramientas/bases-legales',
    title: 'Generador de bases legales claras y transparentes para sorteos en redes sociales',
    summary:
      'Publicar bases comprensibles desde el primer día previene disputas, cumple las políticas promocionales de plataformas como Instagram y TikTok y protege a tu marca detallando requisitos, fechas límite, ámbito geográfico y entrega de premios.',
    steps: [
      'Completa los datos clave de tu campaña: organizador, premio exacto, fechas de vigencia y país permitido.',
      'Incluye los pasos obligatorios de participación y el deslinde oficial de afiliación exigido por las redes sociales.',
      'Descarga o copia las bases redactadas para enlazarlas desde tu biografía o post de sorteo.'
    ],
    useCases: [
      'Giveaways comerciales, sorteos de aniversario en pymes y campañas con creadores invitados.',
      'Acreditar ante la audiencia cómo y cuándo se elegirá al titular y a los suplentes.',
      'Cumplir políticas que exigen aclarar que Meta o TikTok no patrocinan ni administran la promoción.'
    ],
    faqs: [
      {
        q: '¿Por qué debo indicar que Instagram o TikTok no patrocinan mi sorteo?',
        a: 'Es una cláusula obligatoria en las guías promocionales oficiales de dichas redes para evitar restricciones sobre la publicación.'
      },
      {
        q: '¿Estas plantillas sustituyen asesoría jurídica especializada en promociones reguladas?',
        a: 'No. Son un modelo informativo práctico; para sorteos masivos sujetos a autorización estatal conviene validación legal local.'
      }
    ]
  },
  {
    slug: '/herramientas/trivia',
    title: 'Quiz y trivia aleatoria para seleccionar ganadores por conocimiento en vivo',
    summary:
      'Fomenta una comunidad más activa evaluando conocimientos reales sobre tu marca, temática o clase antes de adjudicar premios, combinando entretenimiento educativo con selección transparente.',
    steps: [
      'Configura preguntas o rondas rápidas para poner a prueba a tu audiencia.',
      'Presenta la pregunta en pantalla y valida la respuesta correcta antes de sumar puntos o revelar el premio.',
      'Utiliza las rondas rápidas como filtro divertido para eventos en vivo o clases participativas.'
    ],
    useCases: [
      'Activaciones en vivo para premiar a seguidores fieles que conocen la historia de tu canal o producto.',
      'Repasos interactivos en colegios, academias y capacitaciones corporativas.',
      'Dinámicas en celebraciones familiares o reuniones de amigos.'
    ],
    faqs: [
      {
        q: '¿Se requiere instalar software adicional para jugar en grupo?',
        a: 'No. Funciona directamente desde cualquier navegador moderno en computador, proyector o tablet.'
      },
      {
        q: '¿Puedo combinar una trivia con la ruleta aleatoria?',
        a: 'Sí, muchos organizadores usan la trivia para preseleccionar finalistas y luego giran la ruleta para elegir al ganador definitivo.'
      }
    ]
  }
];

export function HerramientasGuide() {
  const pathname = usePathname() || '';
  const guide = TOOL_GUIDES.find((item) => pathname.startsWith(item.slug));

  if (!guide) return null;

  return (
    <section
      aria-label="Guía práctica y preguntas frecuentes de la herramienta"
      className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 pt-4"
    >
      <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-2 border-b border-slate-100 dark:border-white/10 pb-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Guía Técnica y Transparencia Sorteos Pro</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {guide.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {guide.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Cómo usarla paso a paso</span>
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 list-decimal list-inside">
              {guide.steps.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Usos recomendados y buenas prácticas</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 list-disc list-inside">
              {guide.useCases.map((useCase, i) => (
                <li key={i} className="leading-relaxed">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <span>Preguntas frecuentes</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.faqs.map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 space-y-1.5"
              >
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {faq.q}
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/10 text-xs text-slate-500 dark:text-zinc-400">
          <span>
            ¿Necesitas verificar un resultado previo o generar un certificado con sello SHA-256?
          </span>
          <div className="flex flex-wrap gap-3 font-semibold">
            <Link href="/verificar" className="text-pink-600 dark:text-pink-400 hover:underline">
              Verificar certificado
            </Link>
            <Link href="/blog" className="text-pink-600 dark:text-pink-400 hover:underline">
              Guías de sorteos
            </Link>
            <Link href="/politica-de-privacidad" className="text-slate-600 dark:text-zinc-300 hover:underline">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

