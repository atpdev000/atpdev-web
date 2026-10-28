import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 4,
  },
  turbopack: {
    root: path.resolve(__dirname, '../../../..'),
    resolveAlias: {
      '@atpdev/database': './packages/database/src/index.ts',
    },
  },
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@atpdev/database'] = path.resolve(__dirname, '../../../../packages/database/src/index.ts');
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'yeeupdgjfrkkaurytyrs.supabase.co' }
    ],
  },
  transpilePackages: ['@atpdev/database'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3001 https://admin.atpdev.dev https://admin.atpdev.pe http://localhost:3005;",
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/privacy', destination: '/politica-de-privacidad', permanent: true },
      { source: '/privacy-policy', destination: '/politica-de-privacidad', permanent: true },
      { source: '/politica-privacidad', destination: '/politica-de-privacidad', permanent: true },
      { source: '/terms', destination: '/terminos-y-condiciones', permanent: true },
      { source: '/terms-of-service', destination: '/terminos-y-condiciones', permanent: true },
      { source: '/about', destination: '/quienes-somos', permanent: true },
      { source: '/about-us', destination: '/quienes-somos', permanent: true },
      { source: '/contact', destination: '/contacto', permanent: true },
      { source: '/calculadora-sueldo-cas', destination: '/calculadora-sueldo', permanent: true },
      { source: '/comparador-cas', destination: '/comparador-regimenes', permanent: true },
      { source: '/entrevista-ia', destination: '/simulador-entrevista-ia', permanent: true },
      { source: '/generar-cv', destination: '/crear-cv-cas', permanent: true },
      { source: '/cv', destination: '/crear-cv-cas', permanent: true },
      { source: '/convocatorias', destination: '/empleos', permanent: true },
      { source: '/instituciones', destination: '/organizaciones', permanent: true },
      { source: '/entidades', destination: '/organizaciones', permanent: true },
      { source: '/publicar-oferta', destination: '/publicar-empleo', permanent: true },
      { source: '/publicar', destination: '/publicar-empleo', permanent: true },
      { source: '/buscador', destination: '/empleos', permanent: true }
    ];
  }
};

export default nextConfig;
