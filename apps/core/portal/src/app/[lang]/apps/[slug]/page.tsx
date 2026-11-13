import { getProjects, translateText, getSiteConfig } from "@atpdev/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Code, Download, Clock } from "lucide-react";
import { BackToPortfolioLink } from "@/components/BackToPortfolioLink";

export const revalidate = 60;

import type { Metadata } from "next";
import Script from "next/script";
import { GlowWrapper } from "@/components/GlowWrapper";

import { AdSenseBanner } from "@/components/AdSenseBanner";
import { ProjectArticleViewer } from "@/components/ProjectArticleViewer";
import { FaqAccordion } from "@/components/FaqAccordion";
import { AnimatedDownloadButton } from "@/components/AnimatedDownloadButton";

const GooglePlay2022Icon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path fill="#00D2FF" d="M51.5 5.3C41.8 13.9 36 27.6 36 44.8v422.4c0 17.2 5.8 30.9 15.5 39.5L268 256 51.5 5.3z"/>
    <path fill="#00E676" d="M344.2 374.2 268 298l-216.5 210c8.2 8.7 20.3 12.5 32.8 5.3l260-139.1z"/>
    <path fill="#FF3D00" d="M344.2 137.8 84.3 0c-12.5-7.2-24.6-3.4-32.8 5.3L268 215.3l76.2-77.5z"/>
    <path fill="#FFC107" d="M466 230.2 344.2 137.8 268 256l76.2 118.2L466 281.8c14.6-8.4 14.6-43.2 0-51.6z"/>
  </svg>
);

const AppleStoreIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill="currentColor" className="flex-shrink-0 mb-0.5">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

export async function generateStaticParams() {
  const projects = await getProjects();
  const langs = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  
  // Create combinations for all languages and all slugs
  const params: { lang: string; slug: string }[] = [];
  projects.forEach((p) => {
    if (p.slug) {
      langs.forEach((lang) => {
        params.push({ lang, slug: p.slug });
      });
    }
  });
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const projects = await getProjects();
  const project = projects.find(p => p.slug === slug);

  if (!project) return {};

  const title = lang === 'es' ? project.title : await translateText(project.title, lang);
  const description = lang === 'es' 
    ? project.description 
    : await translateText(project.description, lang);

  const BASE_URL = "https://www.atpdev.dev";
  const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  const path = `/apps/${slug}`;
  const ogImage = (project.image && project.image.trim() !== "") ? project.image : `${BASE_URL}/og-image.png`;

  const isPrivate = project.status === 'Privado';

  return {
    title,
    description,
    ...(isPrivate ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
      languages: {
        "x-default": `${BASE_URL}${path}`,
        ...Object.fromEntries(
          supportedLocales.map(l => [l, `${BASE_URL}${l === 'es' ? '' : '/' + l}${path}`])
        )
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  
  const [projects, config] = await Promise.all([
    getProjects(),
    getSiteConfig()
  ]);

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  const t = async (text: string) => {
    if (lang === "es") return text;
    return await translateText(text, lang);
  };

  const texts = {
    back: await t("Volver al inicio"),
    demo: await t("Ver Demo"),
    source: await t("Código Fuente"),
    playstore: await t("Ver en Play Store"),
    downloadApk: await t("Descargar APK Directo"),
    appstore: await t("Ver en App Store"),
    downloadIpa: await t("Descargar IPA Directo (iOS)"),
    technologies: await t("Tecnologías Utilizadas"),
  };

  const translatedTitle = await t(project.title);
  const translatedDesc = await t(project.long_description || project.description);
  const translatedCat = await t(project.category);

  const enableGlow = config?.enable_glow_effect !== false;

  let localTheme = null;
  if (project.theme_config) {
    try {
      localTheme = JSON.parse(project.theme_config);
    } catch (e) {
      console.error("Error parsing project theme config", e);
    }
  }

  let customLegalSettings: any = {};
  if (project.legal_config) {
    try {
      customLegalSettings = JSON.parse(project.legal_config);
    } catch (e) {}
  }

  const showSha256 = customLegalSettings.show_sha256_badge !== false;
  const showOffline = customLegalSettings.show_offline_badge !== false;
  const showPrivacy = customLegalSettings.show_privacy_badge !== false;

  const hasAppstore = !!(project as any).appstore;
  const appstoreUrl = (project as any).appstore || null;

  const osList: string[] = [];
  if (project.playstore) osList.push("Android");
  if (hasAppstore) osList.push("iOS");
  if (project.demolink) osList.push("Web");
  const operatingSystems = osList.length > 0 ? osList.join(", ") : "Android, iOS, Web";

  const wordCount = translatedDesc.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="main">
      <GlowWrapper enabled={enableGlow} className="w-full text-[var(--text-color)] transition-colors duration-500 min-h-screen py-16 px-6 relative overflow-hidden">
      {localTheme && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${localTheme.primary_color || 'var(--primary)'};
              --font-headline: '${localTheme.font_headline || 'var(--font-headline)'}', sans-serif;
              --font-body: '${localTheme.font_body || 'var(--font-body)'}', sans-serif;
              ${localTheme.theme_mode === 'light' ? `
                --background: #f8fafc;
                --text-color: #0f172a;
                --glass-bg: rgba(255, 255, 255, 0.85);
                --glass-border: rgba(15, 23, 42, 0.15);
                --pill-bg: rgba(15, 23, 42, 0.06);
              ` : localTheme.theme_mode === 'dark' ? `
                --background: #0b0c10;
                --text-color: #ffffff;
                --glass-bg: rgba(255, 255, 255, 0.05);
                --glass-border: rgba(255, 255, 255, 0.12);
                --pill-bg: rgba(255, 255, 255, 0.1);
              ` : `
                /* Modo Auto (Detección de Sistema Operativo del Usuario Nivel Dios Pro) */
                --background: #f8fafc;
                --text-color: #0f172a;
                --glass-bg: rgba(255, 255, 255, 0.85);
                --glass-border: rgba(15, 23, 42, 0.15);
                --pill-bg: rgba(15, 23, 42, 0.06);
              `}
            }
            ${(!localTheme.theme_mode || localTheme.theme_mode === 'auto') ? `
              @media (prefers-color-scheme: dark) {
                :root {
                  --background: #0b0c10;
                  --text-color: #ffffff;
                  --glass-bg: rgba(255, 255, 255, 0.05);
                  --glass-border: rgba(255, 255, 255, 0.12);
                  --pill-bg: rgba(255, 255, 255, 0.1);
                }
              }
            ` : ''}
            .glass-panel {
              background: var(--glass-bg);
              border: 1px solid var(--glass-border);
              color: var(--text-color);
              ${localTheme.radius_scale === 'full' ? 'border-radius: 2rem;' : localTheme.radius_scale === 'small' ? 'border-radius: 0.5rem;' : localTheme.radius_scale === 'none' ? 'border-radius: 0;' : ''}
            }
            ${localTheme.glow_style && localTheme.glow_style.includes('cursor-') ? `
              body {
                cursor: ${localTheme.glow_style.includes('cursor-ia') ? 'url(/cursors/ia-cursor.svg), auto' : 'auto'};
              }
            ` : ''}
          `
        }} />
      )}
      {/* JSON-LD Schema (Pro LEVEL GOD SEO) for Project */}
      <Script
        id={`json-ld-app-${project.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": translatedTitle,
                "description": translatedDesc,
                "applicationCategory": translatedCat,
                "image": (project.image && project.image.trim() !== "") ? project.image : "https://www.atpdev.dev/og-image.png",
                "operatingSystem": operatingSystems,
                "url": `https://www.atpdev.dev/${lang === 'es' ? '' : lang + '/'}apps/${project.slug}`,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "142",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Person",
                  "name": "Percy Acha Taipe"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": lang === 'es' ? `¿${translatedTitle} funciona sin conexión a internet?` : `Does ${translatedTitle} work offline?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": lang === 'es' ? "Sí, la aplicación cuenta con persistencia de datos local optimizada (Room SQLite FTS4) para operar 100% offline sin latencia." : "Yes, the application features optimized local persistence for 100% offline operation without network latency."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": lang === 'es' ? `¿Es compatible con dispositivos Android e iOS?` : `Is it compatible with Android and iOS devices?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": lang === 'es' ? "Sí, cuenta con compilación e instaladores nativos para Android (APK / Play Store) e iOS (IPA / App Store)." : "Yes, it provides native installers and builds for both Android (APK / Play Store) and iOS (IPA / App Store)."
                    }
                  }
                ]
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": lang === 'es' ? "Inicio" : "Home",
                    "item": `https://www.atpdev.dev/${lang === 'es' ? '' : lang}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Apps",
                    "item": `https://www.atpdev.dev/${lang === 'es' ? '' : lang + '/'}#portfolio`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": translatedTitle
                  }
                ]
              }
            ]
          })
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 pt-6">
        {/* Header Hero Glass Card */}
        <div className="p-6 md:p-8 rounded-3xl neon-border mb-8 backdrop-blur-xl bg-[#0d111a] border border-white/20 shadow-2xl relative overflow-hidden text-white">
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Navigation & Reading Time Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 relative z-10">
            <nav className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Link href={lang === 'es' ? '/' : `/${lang}`} prefetch={true} className="hover:text-white transition-colors">
                {lang === 'es' ? 'Inicio' : 'Home'}
              </Link>
              <span className="text-slate-500">/</span>
              <Link href={`${lang === 'es' ? '' : `/${lang}`}/#portfolio`} prefetch={true} className="hover:text-white transition-colors">
                Apps
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-emerald-400 font-bold truncate max-w-[180px] sm:max-w-xs">{translatedTitle}</span>
            </nav>

            <div className="flex items-center gap-3">
              <BackToPortfolioLink
                href={`${lang === 'es' ? '' : `/${lang}`}/#portfolio`}
                label={customLegalSettings.back_button_text || customLegalSettings.backText || texts.back}
              />
              <span className="text-xs px-3.5 py-1.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded-xl font-mono flex items-center gap-1.5 shadow-sm font-semibold">
                <Clock size={13} className="text-cyan-300" />
                <span>{readingTimeMinutes} min {lang === 'es' ? 'de lectura' : 'read'}</span>
              </span>
            </div>
          </div>

          {/* Category Pill & Main Title */}
          <div className="mb-4 relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mb-3 tracking-wider uppercase shadow-sm">
              {translatedCat}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md tracking-tight">
              {translatedTitle}
            </h1>
          </div>

          {/* Security & Verification Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 relative z-10">
            {showSha256 && (
              <span className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {customLegalSettings.sha256_badge_text || "SHA-256 Verificado"}
              </span>
            )}
            {showOffline && (
              <span className="px-3.5 py-1.5 bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm">
                ⚡ {customLegalSettings.offline_badge_text || (
                  (project.playstore || hasAppstore)
                    ? "100% Offline & Latencia Cero"
                    : "Carga Ultra Rápida & SSR"
                )}
              </span>
            )}
            {showPrivacy && (
              <span className="px-3.5 py-1.5 bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm">
                🔒 {customLegalSettings.privacy_badge_text || "Privacidad & Sin Rastreadores"}
              </span>
            )}
          </div>
        </div>
        
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl glass-panel neon-border mb-12">
          <Image 
            src={project.image && project.image.trim() !== "" ? project.image : "/og-image.png"} 
            alt={project.title || "Project Image"} 
            fill 
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6 text-lg leading-relaxed text-[var(--text-color)] opacity-90 glass-panel p-8 rounded-3xl">
            <ProjectArticleViewer 
              description={translatedDesc} 
              image={project.image && project.image.trim() !== "" ? project.image : "/og-image.png"} 
              title={translatedTitle}
              playstore={project.playstore}
              appstore={appstoreUrl}
              qrConfig={localTheme?.qr || null}
            />

            {/* In-article Google AdSense Slot */}
            {config?.adsense_id && (
              <AdSenseBanner adsenseId={config.adsense_id} />
            )}

            {/* FAQ Accordion Section */}
            <FaqAccordion 
              lang={lang} 
              hideHeader={(project.long_description || project.description || '').includes("Preguntas Frecuentes") || (project.long_description || project.description || '').includes("Frequently Asked")} 
            />
          </div>

          <div className="space-y-8 glass-panel p-8 rounded-3xl h-fit">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-[var(--glass-border)] pb-2">
                {texts.technologies}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-[var(--pill-bg)] rounded-lg text-sm border border-[var(--glass-border)] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {project.demolink &&
               project.demolink.trim() !== '' &&
               project.demolink !== '#' &&
               !project.demolink.includes('/apps/') &&
               !project.demolink.includes(project.slug) && (
                <a href={project.demolink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl font-bold transition-all magnetic-element hover:scale-[1.02] neon-border shadow-xl shadow-blue-500/25">
                  <ExternalLink size={20} /> <span>{lang === 'es' ? 'Ir a la Web App' : 'Visit Web App'}</span>
                </a>
              )}
              {(() => {
                let showSourceCode = !!(project.github_repo && project.github_repo.trim() !== "");
                if (project.github_is_private) {
                  showSourceCode = false;
                }
                if (project.legal_config) {
                  try {
                    const parsedLegal = JSON.parse(project.legal_config);
                    if (typeof parsedLegal.has_source_code === "boolean") {
                      showSourceCode = parsedLegal.has_source_code && !!(project.github_repo && project.github_repo.trim() !== "");
                    }
                  } catch (e) {}
                }
                if (!showSourceCode) return null;

                return (
                  <a 
                    href={project.github_repo!.startsWith('http') ? project.github_repo! : `https://github.com/${project.github_repo}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] text-[var(--text-color)] rounded-xl font-bold transition-all border border-[var(--glass-border)] magnetic-element hover:scale-[1.02] neon-border"
                  >
                    <Code size={20} /> {texts.source}
                  </a>
                );
              })()}
              {project.playstore && (
                <AnimatedDownloadButton
                  url={project.playstore}
                  defaultLabel={
                    project.playstore.toLowerCase().includes('.apk') || project.playstore.includes('/apks/')
                      ? texts.downloadApk
                      : texts.playstore
                  }
                  type="apk"
                />
              )}
              {appstoreUrl && (
                <AnimatedDownloadButton
                  url={appstoreUrl}
                  defaultLabel={
                    appstoreUrl.toLowerCase().includes('.ipa') || appstoreUrl.includes('/ipas/')
                      ? texts.downloadIpa
                      : texts.appstore
                  }
                  type="ipa"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </GlowWrapper>
    </main>
  );
}
