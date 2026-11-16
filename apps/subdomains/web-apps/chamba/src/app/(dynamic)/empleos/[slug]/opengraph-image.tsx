import { ImageResponse } from 'next/og';
import { getJobPostingBySlug } from '@atpdev/database';

export const runtime = 'nodejs';
export const alt = 'Convocatoria Laboral en Perú — chamba pro';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobPostingBySlug(slug);

  const title = job?.title || 'Convocatoria Laboral Oficial Perú 2026';
  const entityName = job?.entity_name || 'Entidad Pública Verificada';
  const salary = job?.salary_text || 'Sueldo según bases oficiales';
  const sector = job?.sector_type || 'CAS 1057';
  const region = job?.region || 'Perú';
  const vacancies = job?.vacancies_count ? `${job.vacancies_count} Vacante(s)` : 'Vacantes según bases';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0b0f19 0%, #0f172a 45%, #022c22 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '55px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Glow decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            right: '-50px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 900,
                color: '#0b0f19',
              }}
            >
              ch
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              chamba <span style={{ color: '#10b981' }}>PRO</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              {sector}
            </div>
            <div
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              ● VIGENTE 2026
            </div>
          </div>
        </div>

        {/* Main Job Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1050px' }}>
          <div
            style={{
              fontSize: '22px',
              color: '#34d399',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🏛️ {entityName}
          </div>

          <div
            style={{
              fontSize: '44px',
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: '-1px',
              color: '#ffffff',
            }}
          >
            {title.length > 90 ? title.slice(0, 90) + '...' : title}
          </div>
        </div>

        {/* Job Attributes Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Remuneración Estimada
            </span>
            <span style={{ fontSize: '24px', color: '#34d399', fontWeight: 900 }}>
              {salary}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Plazas Disponibles
            </span>
            <span style={{ fontSize: '22px', color: '#fbbf24', fontWeight: 800 }}>
              {vacancies}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Región / Cobertura
            </span>
            <span style={{ fontSize: '22px', color: '#ffffff', fontWeight: 800 }}>
              📍 {region}
            </span>
          </div>

          <div
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: '#10b981',
              color: '#0b0f19',
              fontSize: '16px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Ver Bases & Postular →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
