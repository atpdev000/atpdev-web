import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# Sorteos Pro — Plataforma SaaS de Sorteos Verificables en Redes Sociales

> [Sorteos Pro](https://sorteos.atpdev.pe) es la plataforma SaaS líder para la creación, gestión y certificación de sorteos en Instagram, Facebook y YouTube, con generador criptográfico seguro (CSPRNG) y herramientas interactivas gratuitas.

## Resumen del Servicio
- **Misión:** Transparencia criptográfica absoluta, cero manipulaciones, certificados públicos inmutables con hash SHA-256.
- **Cumplimiento Legal:** Directrices oficiales de Promociones de Meta Platforms y YouTube Community Guidelines.
- **Herramientas Gratuitas:**
  - [Sorteo por Lista de Nombres](https://sorteos.atpdev.pe/herramientas/lista)
  - [Ruleta Aleatoria Personalizable](https://sorteos.atpdev.pe/herramientas/ruleta)
  - [Tirador de Dados 3D](https://sorteos.atpdev.pe/herramientas/dados)
  - [Volado de Moneda (Cara o Cruz)](https://sorteos.atpdev.pe/herramientas/moneda)
  - [Generador de Números Aleatorios](https://sorteos.atpdev.pe/herramientas/numeros)
  - [Generador de Equipos Balanceados](https://sorteos.atpdev.pe/herramientas/equipos)
  - [Amigo Invisible](https://sorteos.atpdev.pe/herramientas/amigo-invisible)
  - [Raspa y Gana Digital](https://sorteos.atpdev.pe/herramientas/raspa-gana)
  - [Trivia Multijugador](https://sorteos.atpdev.pe/herramientas/trivia)
  - [Generador de Bases Legales](https://sorteos.atpdev.pe/herramientas/bases-legales)

## Sorteos Multi-Red Social
- [Asistente de Sorteos](https://sorteos.atpdev.pe/sorteos/nuevo)
- [Sorteos Instagram](https://sorteos.atpdev.pe/apps/sorteo-instagram)
- [Verificador Público de Certificados](https://sorteos.atpdev.pe/verificar)
- [Planes y Precios](https://sorteos.atpdev.pe/planes)
- [Blog & Guías](https://sorteos.atpdev.pe/blog)

## Enlaces Estructurados
- [Sitemap XML](https://sorteos.atpdev.pe/sitemap.xml)
- [Robots.txt](https://sorteos.atpdev.pe/robots.txt)
- [Términos y Condiciones](https://sorteos.atpdev.pe/terminos-y-condiciones)
- [Política de Privacidad](https://sorteos.atpdev.pe/politica-de-privacidad)
- [Quiénes Somos](https://sorteos.atpdev.pe/quienes-somos)
- [Contacto Técnico](https://sorteos.atpdev.pe/contacto)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
