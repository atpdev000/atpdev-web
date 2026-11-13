import type { Metadata } from "next";
import {
  getSiteConfig,
  getExperiences,
  getSkills,
  getProjects,
  Project,
} from "@atpdev/database";
import {
  translateConfig,
  translateExperience,
  translateSkill,
  translateProject,
} from "@/utils/translate-server";
import CvToolbar from "@/components/CvToolbar";
import { Mail, MapPin, Phone, Globe, Award } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang = "es" } = await params;
  const isEn = lang !== "es" && lang !== "pt";
  return {
    title: isEn ? "Resume (CV) — Percy Acha Taipe" : "Currículum Vitae (CV) — Percy Acha Taipe",
    robots: { index: false, follow: true },
  };
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = "es" } = await params;
  const isEn = lang !== "es" && lang !== "pt";
  const prefix = lang === "es" ? "" : `/${lang}`;

  const [config, experiences, skills, projects] = await Promise.all([
    getSiteConfig(),
    getExperiences(),
    getSkills(),
    getProjects(),
  ]);

  const activeExperiences = experiences
    .filter((e) => e.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));

  const publicProjects = projects.filter((p: Project) => p.status !== "Privado");

  const [tConfig, tExperiences, tSkills, tProjects] = await Promise.all([
    translateConfig(config, lang),
    Promise.all(activeExperiences.map((e) => translateExperience(e, lang))),
    Promise.all(skills.filter((s) => s.is_active !== false).map((s) => translateSkill(s, lang))),
    Promise.all(publicProjects.map((p) => translateProject(p, lang))),
  ]);

  const fullName = tConfig?.full_name || "Percy Acha Taipe";
  const subtitle = tConfig?.bio_short || (isEn ? "Systems Engineer | Fullstack & Android Developer" : "Ingeniero de Sistemas | Desarrollador Fullstack & Mobile");
  const email = tConfig?.email || "contacto@atpdev.dev";
  const phone = tConfig?.phone;
  const location = tConfig?.location || "Andahuaylas, Apurímac, Perú";
  const bioLong = tConfig?.bio_long;
  const credlyUrl = tConfig?.credly_url;

  return (
    <div className="min-h-screen pb-16 print:pb-0">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page { size: A4; margin: 12mm 14mm; }
            html, body {
              background: #ffffff !important;
              color: #0f172a !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `,
      }} />

      <CvToolbar
        backHref={`${prefix}/`}
        backLabel={isEn ? "Back to Portfolio" : "Volver al Portafolio"}
        printLabel={isEn ? "Download / Print PDF" : "Descargar / Imprimir PDF"}
        otherLangHref={isEn ? "/cv" : "/en/cv"}
        otherLangLabel={isEn ? "ES" : "EN"}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 print:p-0 print:max-w-none">
        <article className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-8 sm:p-12 print:shadow-none print:border-0 print:p-0 print:rounded-none">
          {/* Header */}
          <header className="border-b-2 border-slate-900 pb-6 mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              {fullName}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-indigo-700 mt-1.5">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs sm:text-sm text-slate-600">
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-indigo-700">
                <Mail size={14} className="text-indigo-600 shrink-0" />
                <span>{email}</span>
              </a>
              {phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} className="text-indigo-600 shrink-0" />
                  <span>{phone}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-indigo-600 shrink-0" />
                <span>{location}</span>
              </span>
              <a href="https://www.atpdev.dev" className="inline-flex items-center gap-1.5 hover:text-indigo-700">
                <Globe size={14} className="text-indigo-600 shrink-0" />
                <span>www.atpdev.dev</span>
              </a>
            </div>
          </header>

          {/* Profile / Education */}
          {bioLong && (
            <section className="mb-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 border-b border-slate-200 pb-1.5 mb-3">
                {isEn ? "Profile & Education" : "Perfil y Formación"}
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {bioLong}
              </p>
              {credlyUrl && (
                <p className="text-xs text-slate-600 mt-2 inline-flex items-center gap-1.5">
                  <Award size={13} className="text-indigo-600 shrink-0" />
                  <span>{isEn ? "Verified digital badge:" : "Insignia digital verificada:"}</span>
                  <a href={credlyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline break-all">
                    {credlyUrl}
                  </a>
                </p>
              )}
            </section>
          )}

          {/* Work Experience */}
          {tExperiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 border-b border-slate-200 pb-1.5 mb-3">
                {isEn ? "Professional Experience" : "Experiencia Profesional"}
              </h2>
              <div className="space-y-4">
                {tExperiences.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {exp.role} <span className="font-semibold text-indigo-700">— {exp.company}</span>
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 shrink-0">
                        {exp.date_range}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Production Projects */}
          {tProjects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 border-b border-slate-200 pb-1.5 mb-3">
                {isEn ? "Projects in Production" : "Proyectos en Producción"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {tProjects.map((project) => {
                  const hasDemo =
                    project.demolink &&
                    project.demolink.trim() !== "" &&
                    project.demolink !== "#" &&
                    !project.demolink.includes("/apps/");
                  const projectHref = hasDemo
                    ? project.demolink
                    : project.slug
                      ? `https://www.atpdev.dev${prefix}/apps/${project.slug}`
                      : "";
                  return (
                    <div key={project.id} className="break-inside-avoid">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{project.title}</h3>
                        <span className="text-[11px] font-medium text-slate-500 shrink-0">{project.category}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        {project.description}
                      </p>
                      {projectHref && (
                        <a
                          href={projectHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-[11px] text-indigo-700 underline mt-1 break-all"
                        >
                          {projectHref.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Skills */}
          {tSkills.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 border-b border-slate-200 pb-1.5 mb-3">
                {isEn ? "Technical Stack" : "Competencias Técnicas"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                {tSkills.map((group) => (
                  <div key={group.id} className="break-inside-avoid">
                    <span className="font-bold text-slate-900">{group.category}: </span>
                    <span className="text-slate-700">{group.items.join(" · ")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}

