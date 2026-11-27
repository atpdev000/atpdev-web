import { ImageResponse } from 'next/og';

export const alt = 'Colorear Pro — Dibujos para Colorear PDF 300 DPI & Estudio Amazon KDP';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: 'linear-gradient(135deg, #0b1120 0%, #172554 58%, #1e3a8a 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative Studio Accents */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            right: '-70px',
            width: '420px',
            height: '420px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(250,204,21,0.28) 0%, rgba(250,204,21,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-90px',
            left: '-50px',
            width: '360px',
            height: '360px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0) 70%)',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: '#2563EB',
                border: '3px solid #FACC15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                fontWeight: 900,
                color: '#FACC15',
              }}
            >
              CP
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-0.8px' }}>
                Colorear Pro
              </span>
              <span style={{ fontSize: '16px', color: '#93c5fd', fontWeight: 600 }}>
                colorear.atpdev.dev • ATP Dev Suite
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FACC15',
              color: '#09090b',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 900,
            }}
          >
            300 DPI REALES • AMAZON KDP READY
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '980px' }}>
          <div
            style={{
              fontSize: '58px',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-1.4px',
              color: '#ffffff',
            }}
          >
            Dibujos para Colorear en PDF Gratis y Estudio Amazon KDP
          </div>
          <div style={{ fontSize: '23px', color: '#dbeafe', lineHeight: 1.4, maxWidth: '900px' }}>
            Imprime láminas originales, pinta online con 1 clic o compila libros completos 8.5×11&quot;
            con limpieza blanco/negro puro, reversos en blanco y portada con lomo exacto.
          </div>
        </div>

        {/* Footer feature chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {[
            'PDF 300 DPI Gratis',
            'Pizarra Interactiva',
            'Generador IA + Line-Art B/N',
            'Calculadora de Lomo KDP',
          ].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.22)',
                fontSize: '16px',
                fontWeight: 700,
                color: '#f8fafc',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

