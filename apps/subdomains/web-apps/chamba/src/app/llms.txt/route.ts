import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/siteConfig';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# chamba pro — Convocatorias y Empleos Oficiales de Perú

> chamba pro ([${SITE_URL}](${SITE_URL})) es un agregador oficial y verificador de convocatorias laborales en Perú (CAS 1057, D.L. 728, D.L. 276, Locación y Sector Privado).

## Herramientas y Guías Principales
- [Bolsa de Empleos y Convocatorias Vigentes](${SITE_URL}/empleos)
- [Guías y Manuales Laborales CAS](${SITE_URL}/guias)
- [Calculadora de Sueldo Neto CAS](${SITE_URL}/calculadora-sueldo)
- [Comparador de Regímenes Laborales CAS vs 728 vs 276](${SITE_URL}/comparador-regimenes)
- [Generador de CV Formato SERVIR](${SITE_URL}/crear-cv-cas)
- [Simulador de Entrevistas Asistido por IA](${SITE_URL}/simulador-entrevista-ia)
- [Plantillas y Anexos Oficiales SERVIR](${SITE_URL}/plantillas-anexos)
- [Preguntas Frecuentes de Examen y Entrevista CAS](${SITE_URL}/preguntas-entrevista-cas)

## Recursos y Canales
- [Directorio de Organizaciones y Entidades Públicas](${SITE_URL}/organizaciones)
- [Canal de Contacto y Redacción](${SITE_URL}/contacto)
- [Sitemap Oficial XML](${SITE_URL}/sitemap.xml)
- [Feed RSS de Ofertas](${SITE_URL}/rss.xml)
- [Política de Privacidad](${SITE_URL}/politica-de-privacidad)
- [Términos y Condiciones](${SITE_URL}/terminos-y-condiciones)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
