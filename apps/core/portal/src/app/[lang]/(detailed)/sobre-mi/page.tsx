import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getSiteConfig, getProjects, getExperiences, getSkills, translateText, Project } from "@atpdev/database";
import { Code2, GraduationCap, Layers, Mail, MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "es" ? "Sobre Mí" : await translateText("Sobre Mí", lang);
  const description =
    lang === "es"
      ? "Perfil profesional, formación académica, arquitectura tecnológica y proyectos publicados por Percy Acha Taipe (ATP Dev)."
      : await translateText("Perfil profesional, formación académica, arquitectura tecnológica y proyectos publicados por Percy Acha Taipe (ATP Dev).", lang);

  const BASE_URL = "https://www.atpdev.dev";
  const path = "/sobre-mi";
  const supportedLocales = ["es", "en", "ru", "hi", "zh", "fr", "de", "pt", "ja"];

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${lang === "es" ? "" : "/" + lang}${path}`,
      languages: {
        "x-default": `${BASE_URL}${path}`,
        ...Object.fromEntries(supportedLocales.map((l) => [l, `${BASE_URL}${l === "es" ? "" : "/" + l}${path}`])),
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${lang === "es" ? "" : "/" + lang}${path}`,
    },
  };
}

export default async function SobreMiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang = "es" } = await params;
  const [config, allProjects, experiences, skills] = await Promise.all([
    getSiteConfig(),
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  const t = async (text: string) => (lang === "es" ? text : await translateText(text, lang));
  const publicProjects = allProjects.filter((p: Project) => p.status !== "Privado");
  const fullName = config?.full_name || "Percy Acha Taipe";
  const avatarSrc = config?.avatar_url && !config.avatar_url.startsWith("data:") ? config.avatar_url : "/og-image.png";
  const bioShort = await t(config?.bio_short || "Ingeniero de Sistemas especializado en desarrollo Android nativo, plataformas web Next.js e integración de IA aplicada.");
  const bioLong = await t(config?.bio_long || "Ingeniero de Sistemas de la Universidad Nacional José María Arguedas (UNAJMA).");
  const contactEmail = config?.email || "contacto@atpdev.dev";
  const prefix = lang === "es" ? "" : `/${lang}`;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Cabecera de Perfil Editorial */}
      <section
        className="rounded-3xl border p-8 md:p-10 shadow-xl"
        style={{ backgroundColor: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--glass-border)" }}>
            <Image src={avatarSrc} alt={fullName} fill sizes="112px" className="object-cover" priority />
          </div>
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: "var(--glass-border)", color: "var(--accent-text)" }}>
              <ShieldCheck size={14} /> {await t("Perfil Técnico Oficial • ATP Dev")}
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{fullName}</h1>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {bioShort}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} /> Perú
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={15} /> {bioLong}
              </span>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "var(--accent-text)" }}>
                <Mail size={15} /> {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enfoque de Ingeniería y Especialidades */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Code2 size={20} />,
            title: await t("Desarrollo Móvil Nativo (Android)"),
            desc: await t("Construcción de aplicaciones con Kotlin, Jetpack Compose, CameraX, Room Database (SQLite FTS4) y Clean Architecture orientadas a funcionar offline con baja latencia."),
          },
          {
            icon: <Layers size={20} />,
            title: await t("Plataformas Web & SaaS (Full Stack)"),
            desc: await t("Diseño e implementación de aplicaciones con Next.js App Router, TypeScript, Tailwind CSS y PostgreSQL/Supabase priorizando SEO técnico, SSR y Core Web Vitals."),
          },
          {
            icon: <ShieldCheck size={20} />,
            title: await t("IA Aplicada y Procesamiento Local"),
            desc: await t("Integración de modelos TensorFlow Lite (Edge AI), análisis documental en el navegador con WebAssembly y pipelines automatizados con verificación de fuentes reales."),
          },
        ].map((item, i) => (
          <article
            key={i}
            className="rounded-2xl border p-6 space-y-3"
            style={{ backgroundColor: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
          >
            <div className="inline-flex p-2.5 rounded-xl border" style={{ borderColor: "var(--glass-border)", color: "var(--accent-text)" }}>
              {item.icon}
            </div>
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {item.desc}
            </p>
          </article>
        ))}
      </section>

      {/* Stack Técnico Real */}
      {skills.length > 0 && (
        <section
          className="rounded-3xl border p-8 space-y-6"
          style={{ backgroundColor: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
        >
          <div>
            <h2 className="text-2xl font-bold">{await t("Stack Tecnológico")}</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {await t("Herramientas y frameworks utilizados en los proyectos y plataformas en producción de ATP Dev.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((group) => (
              <div key={group.id} className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--accent-text)" }}>
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-medium border"
                      style={{ backgroundColor: "var(--pill-bg)", borderColor: "var(--glass-border)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trayectoria */}
      {experiences.length > 0 && (
        <section
          className="rounded-3xl border p-8 space-y-6"
          style={{ backgroundColor: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
        >
          <h2 className="text-2xl font-bold">{await t("Experiencia y Trayectoria")}</h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 pl-5 space-y-1" style={{ borderColor: "var(--glass-border)" }}>
                <span className="text-xs font-mono" style={{ color: "var(--accent-text)" }}>{exp.date_range}</span>
                <h3 className="text-lg font-bold">{exp.role} — {exp.company}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catálogo de Documentación Técnica */}
      {publicProjects.length > 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">{await t("Documentación Técnica de Proyectos")}</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {await t("Accede a la arquitectura, casos de uso y guías detalladas de cada aplicación desarrollada.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicProjects.map((p) => (
              <Link
                key={p.id}
                href={`${prefix}/apps/${p.slug}`}
                className="rounded-2xl border p-5 flex items-start justify-between gap-4 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono" style={{ color: "var(--accent-text)" }}>{p.category}</span>
                  <h3 className="font-bold text-base">{p.title}</h3>
                  <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>{p.description}</p>
                </div>
                <ArrowUpRight size={18} className="flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
