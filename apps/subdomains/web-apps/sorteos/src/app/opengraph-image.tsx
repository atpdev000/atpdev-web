import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sorteos Pro — Plataforma SaaS de Sorteos Verificables';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #070a12 0%, #0f1226 50%, #1e1136 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Glow decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(0,0,0,0) 70%)',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              🎁
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>sorteos</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    color: '#ffffff',
                  }}
                >
                  PRO
                </span>
              </div>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>Plataforma SaaS Multi-Red</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '999px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#34d399',
            }}
          >
            🛡️ Certificación Criptográfica SHA-256
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              maxWidth: '900px',
              background: 'linear-gradient(90deg, #ffffff 0%, #e2e8f0 70%, #f472b6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Sorteos Gratis en Instagram, TikTok, YouTube y Facebook
          </h1>
          <p style={{ fontSize: '22px', color: '#94a3b8', maxWidth: '800px', lineHeight: 1.4 }}>
            Algoritmo CSPRNG con certificado público SHA-256 y 13 herramientas gratis: Ruleta, Lista (Excel/OCR), Amigo Invisible y Equipos.
          </p>
        </div>

        {/* Bottom Footer Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '15px', color: '#cbd5e1' }}>✨ 13 Herramientas Gratis</span>
          <span style={{ fontSize: '15px', color: '#64748b' }}>•</span>
          <span style={{ fontSize: '15px', color: '#cbd5e1' }}>📋 Excel y Capturas Ctrl+V</span>
          <span style={{ fontSize: '15px', color: '#64748b' }}>•</span>
          <span style={{ fontSize: '15px', color: '#fbbf24', fontWeight: 'bold' }}>ATP Dev</span>
        </div>
      </div>
    )
  );
}
