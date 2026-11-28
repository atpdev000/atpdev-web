import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# Sorteos Pro — Plataforma de Sorteos Gratis y Verificables (SHA-256)

> [Sorteos Pro](https://sorteos.atpdev.dev) es una plataforma gratuita y multiidioma (11 idiomas) para realizar sorteos certificados en Instagram, TikTok, YouTube, Facebook, X y Threads, junto con 13 herramientas aleatorias online con algoritmo CSPRNG y soporte para pegar listas de Excel o capturas de pantalla (OCR con Ctrl+V).

## Diferenciadores Técnicos
- **Aleatoriedad Criptográfica (CSPRNG):** Web Crypto API sin sesgos y certificados públicos auditables mediante huella SHA-256.
- **Importación Instantánea:** Pegado directo con \`Ctrl+V\` desde Excel, Word, PDF, CSV o capturas de pantalla (OCR automático con limpieza de tablas).
- **Soporte Multiidioma:** Disponible en Español, English, Português, Français, Deutsch, Italiano, Русский, 简体中文, 日本語, हिन्दी y العربية.

## 13 Herramientas Gratuitas (Sin Registro)
- [Sorteo por Lista de Nombres (Excel / OCR)](https://sorteos.atpdev.dev/herramientas/lista)
- [Ruleta Aleatoria Personalizable](https://sorteos.atpdev.dev/herramientas/ruleta)
- [Amigo Invisible / Amigo Secreto Online](https://sorteos.atpdev.dev/herramientas/amigo-invisible)
- [Generador de Equipos Aleatorios Equilibrados](https://sorteos.atpdev.dev/herramientas/equipos)
- [Generador de Números Aleatorios sin Repetición](https://sorteos.atpdev.dev/herramientas/numeros)
- [Tirador de Dados Virtuales 3D](https://sorteos.atpdev.dev/herramientas/dados)
- [Lanzar Moneda Virtual (Cara o Cruz)](https://sorteos.atpdev.dev/herramientas/moneda)
- [Raspa y Gana Digital Interactivo](https://sorteos.atpdev.dev/herramientas/raspa-gana)
- [Trivia Interactiva en Vivo con PIN](https://sorteos.atpdev.dev/herramientas/trivia)
- [Generador de Bases Legales para Sorteos](https://sorteos.atpdev.dev/herramientas/bases-legales)
- [Calculadora de Engagement para Instagram y TikTok](https://sorteos.atpdev.dev/herramientas/engagement)
- [Generador de Hashtags para Sorteos](https://sorteos.atpdev.dev/herramientas/hashtags)

## Sorteos en Redes Sociales y Verificación
- [Asistente de Sorteos Multi-Red](https://sorteos.atpdev.dev/sorteos/nuevo)
- [Sorteo de Comentarios en Instagram Gratis](https://sorteos.atpdev.dev/apps/sorteo-instagram)
- [Verificador Público de Certificados SHA-256](https://sorteos.atpdev.dev/verificar)
- [Planes y Precios](https://sorteos.atpdev.dev/planes)
- [Blog y Guías Oficiales](https://sorteos.atpdev.dev/blog)

## Enlaces Estructurados
- [Sitemap XML](https://sorteos.atpdev.dev/sitemap.xml)
- [Robots.txt](https://sorteos.atpdev.dev/robots.txt)
- [Quiénes Somos](https://sorteos.atpdev.dev/quienes-somos)
- [Contacto](https://sorteos.atpdev.dev/contacto)
- [Términos y Condiciones](https://sorteos.atpdev.dev/terminos-y-condiciones)
- [Política de Privacidad](https://sorteos.atpdev.dev/politica-de-privacidad)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
