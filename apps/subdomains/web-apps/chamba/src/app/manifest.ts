import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'chamba pro — Agregador de Convocatorias y Empleos Perú',
    short_name: 'chamba PRO',
    description: 'Buscador profesional de convocatorias laborales CAS 1057, 728, 276 y Sector Privado en Perú con verificación oficial RUC.',
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0b0f19',
    theme_color: '#10b981',
    lang: 'es-PE',
    categories: ['business', 'productivity', 'education'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Buscar Convocatorias',
        short_name: 'Convocatorias',
        description: 'Buscar convocatorias CAS y empleos vigentes',
        url: '/empleos',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
      {
        name: 'Calculadora de Sueldo CAS',
        short_name: 'Calculadora',
        description: 'Calcular sueldo neto y retenciones AFP/ONP',
        url: '/calculadora-sueldo',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
      {
        name: 'Simulador Entrevista Técnica CAS',
        short_name: 'Simulador CAS',
        description: 'Simular entrevista técnica y examen oral ante jurados de selección',
        url: '/simulador-entrevista-ia',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
      {
        name: 'Generador de CV Profesional PDF',
        short_name: 'Generador CV',
        description: 'Crear currículum vitae en formato SERVIR y plantillas privadas con exportación PDF',
        url: '/crear-cv-cas',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
    ],
  };
}
