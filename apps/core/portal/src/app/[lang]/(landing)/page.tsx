// SERVER COMPONENT – fetches all data at build/request time, fully visible to Google
import type { Metadata } from "next";
import { getProjects, getSiteConfig, getSkills, getExperiences, getAIModels, Project } from "@atpdev/database";
import { translateProject, translateConfig, translateAiModel } from "@/utils/translate-server";
import { getUiDictionary } from "@/utils/i18n-ui";
import { getTechStackData } from "@/utils/tech-stack";

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import AIModelsSection from "@/components/AIModelsSection";
import Portfolio from "@/components/Portfolio";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { GlowWrapper } from "@/components/GlowWrapper";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const BASE_URL = "https://www.atpdev.dev";
  const path = lang === 'es' ? '' : `/${lang}`;
  const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  
  return {
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        "x-default": `${BASE_URL}`,
        ...Object.fromEntries(
          supportedLocales.map(l => [l, `${BASE_URL}${l === 'es' ? '' : '/' + l}`])
        )
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params);

  const [projects, config, skills, experiences, aiModels] = await Promise.all([
    getProjects(),
    getSiteConfig(),
    getSkills(),
    getExperiences(),
    getAIModels(),
  ]);

  const publicProjects = projects.filter((p: Project) => p.status !== 'Privado');

  const [tProjectsRaw, tConfig, tAiModels] = await Promise.all([
    Promise.all(publicProjects.map(p => translateProject(p, lang))),
    translateConfig(config, lang),
    Promise.all(aiModels.map(m => translateAiModel(m, lang))),
  ]);

  // En el landing solo se muestran tarjetas y modal resumen; evitamos duplicar artículos completos en el payload RSC.
  const tProjects = tProjectsRaw.map(({ long_description: _ld, screenshots: _sc, ...rest }) => ({
    ...rest,
    long_description: "",
    screenshots: [],
  }));

  const ui = getUiDictionary(lang);
  const { displayTechStack, augmentedSkills } = getTechStackData(tProjects, skills);

  const enableGlow = tConfig?.enable_glow_effect !== false;
  const glowStyle = tConfig?.glow_style || 'border';

  return (
    <main>
      <GlowWrapper enabled={enableGlow} className="w-full text-[var(--text-color)] transition-colors duration-500">
        <HeroSection config={tConfig} ui={ui} displayTechStack={displayTechStack} />
        <AboutSection initialSkills={augmentedSkills} initialCredlyUrl={tConfig?.credly_url || ""} lang={lang} enableGlow={enableGlow} glowStyle={glowStyle} />
        <ExperienceTimeline initialExperiences={experiences} lang={lang} enableGlow={enableGlow} glowStyle={glowStyle} />
        <AIModelsSection projects={tProjects} ui={ui} aiModels={tAiModels} enableGlow={enableGlow} glowStyle={glowStyle} />
        <Portfolio projects={tProjects} ui={ui} aiModels={tAiModels} enableGlow={enableGlow} glowStyle={glowStyle} />
        <ContactForm config={tConfig} />
        <Footer config={tConfig} ui={ui} />
      </GlowWrapper>
    </main>
  );
}
