import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  transpilePackages: ['@atpdev/database'],
  async redirects() {
    return [
      { source: '/unir', destination: '/tools/merge', permanent: true },
      { source: '/dividir', destination: '/tools/split', permanent: true },
      { source: '/comprimir', destination: '/tools/compress', permanent: true },
      { source: '/proteger', destination: '/tools/protect', permanent: true },
      { source: '/organizar', destination: '/tools/organize', permanent: true },
      { source: '/rotar', destination: '/tools/rotate', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3001 https://admin.atpdev.dev https://admin.atpdev.pe http://localhost:3011;",
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
