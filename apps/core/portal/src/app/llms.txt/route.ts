import { getProjects, getSiteConfig } from "@atpdev/database";
import { BLOG_POSTS } from "@/data/blog-posts";

export const revalidate = 3600;

const BASE_URL = "https://www.atpdev.dev";

export async function GET() {
  const [config, projects] = await Promise.all([
    getSiteConfig().catch(() => null),
    getProjects().catch(() => []),
  ]);

  const fullName = config?.full_name || "Percy Acha Taipe";
  const bioShort =
    config?.bio_short ||
    "Ingeniero de Sistemas apasionado por la docencia y el desarrollo de software de alto impacto.";
  const publicProjects = (projects || []).filter((p) => p.status !== "Privado");

  const projectLines = publicProjects
    .map((p) => {
      const url = p.slug ? `${BASE_URL}/apps/${p.slug}` : BASE_URL;
      const desc = (p.description || "").replace(/\s+/g, " ").trim();
      return `- [${p.title}](${url}): ${desc || p.category}`;
    })
    .join("\n");

  const blogLines = BLOG_POSTS.map(
    (post) => `- [${post.es.title}](${BASE_URL}/blog/${post.slug}): ${post.es.excerpt}`
  ).join("\n");

  const markdown = `# ${fullName} — ATP Dev

> ${bioShort} Portafolio oficial, aplicaciones móviles Android/iOS, plataformas web Next.js y proyectos con Inteligencia Artificial de ${fullName} (Andahuaylas, Perú).

## Páginas Principales

- [Portafolio Principal (Español)](${BASE_URL}/): Vista general, perfil profesional, experiencia, stack tecnológico y proyectos destacados.
- [Portfolio (English)](${BASE_URL}/en): English version of the developer portfolio and published applications.
- [Sobre Mí — Perfil Técnico](${BASE_URL}/sobre-mi): Formación académica, trayectoria profesional y catálogo técnico.
- [Artículos Técnicos y Guías](${BASE_URL}/blog): Guías de arquitectura Android Offline-First, Edge AI, Next.js Core Web Vitals y WebAssembly.
- [Sitemap XML](${BASE_URL}/sitemap.xml): Índice completo de URLs multidioma y páginas de aplicaciones.

## Artículos Técnicos Publicados

${blogLines}

## Proyectos y Aplicaciones Publicadas

${projectLines || `- [Proyectos ATP Dev](${BASE_URL}/#portfolio): Catálogo de aplicaciones y sistemas web.`}

## Información Legal y Políticas

- [Política de Privacidad](${BASE_URL}/privacy): Detalles sobre privacidad, analítica y tratamiento de datos.
- [Términos y Condiciones](${BASE_URL}/terms): Condiciones de uso de los servicios y aplicaciones de ATP Dev.
`;

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

