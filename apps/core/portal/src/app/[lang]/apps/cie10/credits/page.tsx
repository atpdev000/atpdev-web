import type { Metadata } from "next";
import Link from "next/link";
import { translateText } from "@atpdev/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang = "es" } = await params;
  const BASE_URL = "https://www.atpdev.dev";
  const path = "/apps/cie10/credits";
  const title = lang === "es" ? "Créditos y Fuentes - CIE-10 App" : await translateText("Credits & Sources - CIE-10 App", lang);
  return {
    title,
    description: "Información sobre la Clasificación Internacional de Enfermedades (CIE-10), fuentes oficiales OMS y créditos del desarrollador.",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : `/${lang}`}${path}`,
    },
  };
}

export default async function Cie10CreditsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = "es" } = await params;

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 background-blur-xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
            {lang === "es" ? "Información Oficial" : "Official Information"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            {lang === "es" ? "Créditos y Fuentes Médicas" : "Credits & Medical Sources"}
          </h1>
          <p className="text-neutral-400 mt-2">
            CIE10 - Códigos y Enfermedades (Android App)
          </p>
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {lang === "es" ? "Organización Mundial de la Salud (OMS / WHO)" : "World Health Organization (WHO)"}
            </h2>
            <p>
              La Clasificación Internacional de Enfermedades (CIE-10) es una norma internacional de diagnóstico mantenida y publicada por la <strong>Organización Mundial de la Salud (OMS)</strong>. Esta aplicación utiliza la base de datos oficial codificada para facilitar la búsqueda médica y asistencial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {lang === "es" ? "Desarrollo y Arquitectura" : "Development & Architecture"}
            </h2>
            <p>
              Desarrollado y mantenido de forma independiente por <strong>Percy Acha Taipe (ATP Dev)</strong>. Diseñado en Android Kotlin nativo con Jetpack Compose y sincronización remota OTA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {lang === "es" ? "Descargo de Responsabilidad Médica y Estándares Técnicos" : "Medical Disclaimer & Technical Standards"}
            </h2>
            <p className="text-sm bg-neutral-900/60 p-4 rounded-xl border border-white/5 text-neutral-400 mb-3">
              {lang === "es"
                ? "Esta aplicación está destinada únicamente como una herramienta de referencia rápida y consulta informativa para médicos, residentes, internos, personal de enfermería, auditores clínicos y estudiantes de ciencias de la salud. No reemplaza el juicio clínico profesional ni proporciona diagnósticos médicos vinculantes."
                : "This application is intended solely as a quick reference and informational lookup tool for physicians, residents, nurses, clinical auditors, and health sciences students. It does not replace professional clinical judgment or provide binding medical diagnoses."}
            </p>
            <p>
              {lang === "es"
                ? "La arquitectura técnica emplea bases de datos precompiladas con búsqueda de texto completo (Full-Text Search FTS4), normalización diacrítica en tiempo real y verificación de integridad SHA-256 para operar sin latencia en hospitales, postas médicas rurales y consultorios sin conectividad a internet. Para soporte o sugerencias de actualización normativa MINSA / EsSalud, escríbenos a contacto@atpdev.dev."
                : "The technical architecture utilizes precompiled databases with Full-Text Search (FTS4), real-time diacritic normalization, and SHA-256 integrity verification to operate with zero latency in hospitals, rural health posts, and clinics without internet connectivity. For support or regulatory update suggestions, email contacto@atpdev.dev."}
            </p>
            <p className="mt-3">
              {lang === "es"
                ? "Pila Tecnológica y Licencias de Código Abierto: La aplicación móvil CIE-10 Pro ha sido construida íntegramente con Kotlin, Jetpack Compose Material 3, AndroidX Room Persistence Library, Coroutines / Flow para concurrencia reactiva y Ktor / OkHttp con fijación de certificados TLS para consultas opcionales asistidas por IA. Todos los componentes de software de terceros incluidos cumplen rigurosamente con las licencias Apache License 2.0 y MIT."
                : "Technology Stack & Open-Source Licenses: The CIE-10 Pro mobile application is engineered natively with Kotlin, Jetpack Compose Material 3, AndroidX Room Persistence Library, Coroutines / Flow for reactive concurrency, and Ktor / OkHttp with TLS certificate validation for optional AI-assisted lookups. All bundled third-party software components strictly comply with Apache License 2.0 and MIT licenses."}
            </p>
            <p className="mt-3">
              {lang === "es"
                ? "Fuentes Nosológicas y Validación Editorial: El catálogo estructurado de capítulos, bloques y subcategorías diagnósticas se basa en la Clasificación Estadística Internacional de Enfermedades y Problemas Relacionados con la Salud (Décima Revisión — CIE-10) publicada por la Organización Mundial de la Salud (OMS / OPS) y adoptada en los sistemas de información hospitalaria del Ministerio de Salud (MINSA) y EsSalud. Agradecemos a la comunidad médica y de código abierto por su retroalimentación continua en la optimización del motor de búsqueda clínica."
                : "Nosological Sources & Editorial Validation: The structured catalog of diagnostic chapters, blocks, and subcategories is based on the International Statistical Classification of Diseases and Related Health Problems (Tenth Revision — ICD-10) published by the World Health Organization (WHO / PAHO) and adopted across public and private healthcare information systems. We thank the medical and open-source communities for their continuous feedback in optimizing the clinical search engine."}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <Link
            href={`${lang === "es" ? "" : `/${lang}`}/apps/buscador-clinico-cie-10-pro`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← {lang === "es" ? "Volver a CIE-10 App" : "Back to CIE-10 App"}
          </Link>
          <div className="flex gap-4 text-xs text-neutral-500">
            <Link href={`${lang === "es" ? "" : `/${lang}`}/apps/cie10/privacy`} className="hover:underline">
              {lang === "es" ? "Privacidad" : "Privacy"}
            </Link>
            <span>•</span>
            <Link href={`${lang === "es" ? "" : `/${lang}`}/apps/cie10/terms`} className="hover:underline">
              {lang === "es" ? "Términos" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
