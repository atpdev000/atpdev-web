import { translateText, Project, SiteConfig, AIModelData } from "@atpdev/database";

export async function translateProject(p: Project, lang: string): Promise<Project> {
  if (lang === 'es' || !lang) return p;
  const [title, description, category, metrics, status] = await Promise.all([
    translateText(p.title, lang),
    translateText(p.description, lang),
    translateText(p.category, lang),
    translateText(p.metrics, lang),
    translateText(p.status, lang),
  ]);
  return { ...p, title, description, category, metrics, status };
}

export async function translateConfig(c: SiteConfig | null, lang: string): Promise<SiteConfig | null> {
  if (!c || lang === 'es' || !lang) return c;
  const tw = c.hero_typewriter || [];
  const [hero_title, hero_subtitle, bio_short, bio_long, hero_typewriter] = await Promise.all([
    translateText(c.hero_title, lang),
    translateText(c.hero_subtitle, lang),
    translateText(c.bio_short, lang),
    translateText(c.bio_long, lang),
    Promise.all(tw.map((w: string) => translateText(w, lang))),
  ]);
  return { ...c, hero_title, hero_subtitle, bio_short, bio_long, hero_typewriter };
}

export async function translateAiModel(m: AIModelData, lang: string): Promise<AIModelData> {
  if (lang === 'es' || !lang) return m;
  const [description, capabilities] = await Promise.all([
    translateText(m.description, lang),
    Promise.all(m.capabilities.map((c: string) => translateText(c, lang))),
  ]);
  return { ...m, description, capabilities };
}
