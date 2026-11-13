import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# Sorteos Pro — Plataforma SaaS de Sorteos Verificables en Redes Sociales

> [Sorteos Pro](https://sorteos.atpdev.dev) es la plataforma SaaS líder para la creación, gestión y certificación de sorteos en Instagram, Facebook y YouTube, con generador criptográfico seguro (CSPRNG) y herramientas interactivas gratuitas.

## Resumen del Servicio
- **Misión:** Transparencia criptográfica absoluta, cero manipulaciones, certificados públicos inmutables con hash SHA-256.
- **Cumplimiento Legal:** Directrices oficiales de Promociones de Meta Platforms y YouTube Community Guidelines.
- **Herramientas Gratuitas:**
  - [Sorteo por Lista de Nombres](https://sorteos.atpdev.dev/herramientas/lista)
  - [Ruleta Aleatoria Personalizable](https://sorteos.atpdev.dev/herramientas/ruleta)
  - [Tirador de Dados 3D](https://sorteos.atpdev.dev/herramientas/dados)
  - [Volado de Moneda (Cara o Cruz)](https://sorteos.atpdev.dev/herramientas/moneda)
  - [Generador de Números Aleatorios](https://sorteos.atpdev.dev/herramientas/numeros)
  - [Generador de Equipos Balanceados](https://sorteos.atpdev.dev/herramientas/equipos)
  - [Amigo Invisible](https://sorteos.atpdev.dev/herramientas/amigo-invisible)
  - [Raspa y Gana Digital](https://sorteos.atpdev.dev/herramientas/raspa-gana)
  - [Trivia Multijugador](https://sorteos.atpdev.dev/herramientas/trivia)
  - [Generador de Bases Legales](https://sorteos.atpdev.dev/herramientas/bases-legales)

## Sorteos Multi-Red Social
- [Asistente de Sorteos](https://sorteos.atpdev.dev/sorteos/nuevo)
- [Sorteos Instagram](https://sorteos.atpdev.dev/apps/sorteo-instagram)
- [Verificador Público de Certificados](https://sorteos.atpdev.dev/verificar)
- [Planes y Precios](https://sorteos.atpdev.dev/planes)
- [Blog & Guías](https://sorteos.atpdev.dev/blog)

## Enlaces Estructurados
- [Sitemap XML](https://sorteos.atpdev.dev/sitemap.xml)
- [Robots.txt](https://sorteos.atpdev.dev/robots.txt)
- [Términos y Condiciones](https://sorteos.atpdev.dev/terminos-y-condiciones)
- [Política de Privacidad](https://sorteos.atpdev.dev/politica-de-privacidad)
- [Quiénes Somos](https://sorteos.atpdev.dev/quienes-somos)
- [Contacto Técnico](https://sorteos.atpdev.dev/contacto)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
