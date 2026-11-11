import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'chamba pro — Buscador de Empleos y Convocatorias Perú';
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
          background: 'linear-gradient(135deg, #0b0f19 0%, #0f172a 50%, #022c22 100%)',
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
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(0,0,0,0) 70%)',
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
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 900,
                color: '#0b0f19',
              }}
            >
              ch
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
              chamba <span style={{ color: '#10b981' }}>PRO</span>
            </div>
          </div>

          <div
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            ● CONVOCATORIAS OFICIALES PERÚ 2026
          </div>
        </div>

        {/* Hero Central Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '950px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            Buscador de Convocatorias CAS 1057, 728 y Sector Privado
          </div>
          <div style={{ fontSize: '24px', color: '#94a3b8', lineHeight: 1.4 }}>
            Derivación directa a fuentes oficiales del Estado con verificación RUC. Herramientas gratuitas: Calculadora de Sueldo Neto CAS, Generador CV SERVIR y Simulador de Entrevista Técnica.
          </div>
        </div>

        {/* Bottom Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '18px',
              color: '#e2e8f0',
              fontWeight: 600,
            }}
          >
            🏛️ Convocatorias CAS & 728
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '18px',
              color: '#e2e8f0',
              fontWeight: 600,
            }}
          >
            🧮 Calculadora de Sueldo Neto
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '18px',
              color: '#e2e8f0',
              fontWeight: 600,
            }}
          >
            🎯 Simulador de Entrevista CAS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
