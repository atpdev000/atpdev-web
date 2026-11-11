import { NextResponse } from 'next/server';
import {
  getJobPostingBySlug,
  decodeHtmlEntities,
  cleanEntityDisplayName,
  resolveRealServirAndEntityBases,
  downloadServirOfficialWordDocx,
  fetchGovBuffer,
  isCompetitorUrl
} from '@atpdev/database';

export const dynamic = 'force-dynamic';

function escapeHtml(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isAllowedOfficialFileHost(targetUrl: string): boolean {
  try {
    const u = new URL(targetUrl);
    const host = u.hostname.toLowerCase();
    if (isCompetitorUrl(targetUrl)) return false;
    return (
      host.endsWith('.gob.pe') ||
      host.endsWith('.edu.pe') ||
      host.endsWith('.mil.pe') ||
      host.endsWith('.org.pe') ||
      host.endsWith('.pe')
    );
  } catch {
    return false;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const urlObj = new URL(req.url);
    const format = urlObj.searchParams.get('format');
    const isRawPdf = urlObj.searchParams.get('raw_pdf') === '1';
    const fileUrlParam = urlObj.searchParams.get('file_url');
    const isEmbed = urlObj.searchParams.get('embed') === '1';
    const autoPrint = urlObj.searchParams.get('print') === '1';

    // 0. Vía rápida: Proxy directo de PDF oficial real cuando se proporciona file_url verificado (.gob.pe / .edu.pe)
    if (isRawPdf && fileUrlParam && fileUrlParam.startsWith('http') && isAllowedOfficialFileHost(fileUrlParam)) {
      const pdfRes = await fetchGovBuffer(fileUrlParam, { timeoutMs: 10000 });
      const contentType = String(pdfRes?.headers?.['content-type'] || '').toLowerCase();
      if (pdfRes && pdfRes.status === 200 && pdfRes.body.length > 200 && (contentType.includes('pdf') || pdfRes.body.subarray(0, 4).toString() === '%PDF')) {
        return new NextResponse(new Uint8Array(pdfRes.body), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="Bases_Oficiales_${slug.replace(/[^a-z0-9-_]/gi, '_').slice(0, 50)}.pdf"`,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
      return NextResponse.redirect(fileUrlParam);
    }

    const decodedSlug = decodeURIComponent(slug);

    // 0b. Consultar primero la caché en disco de bases reales verificadas (0ms)
    const cachedReal = await resolveRealServirAndEntityBases({
      slug: decodedSlug,
      title: '',
      entityName: ''
    });

    if (format === 'docx' && cachedReal?.servirDetail?.puesto) {
      const fastWordBuf = await downloadServirOfficialWordDocx({
        title: cachedReal.servirDetail.puesto,
        entityName: cachedReal.servirDetail.entidad || '',
        region: cachedReal.servirDetail.ubicacion
      });
      if (fastWordBuf && fastWordBuf.length > 500) {
        const safeFileName = `detalle_ofertas_laborales_${slug.replace(/[^a-z0-9-_]/gi, '_').slice(0, 60)}.docx`;
        return new NextResponse(new Uint8Array(fastWordBuf), {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${safeFileName}"`,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }

    const jobFromCatalog =
      cachedReal?.servirDetail?.puesto
        ? null
        : (await getJobPostingBySlug(decodedSlug, { skipRemoteEnrichment: true })) ||
          (await getJobPostingBySlug(slug, { skipRemoteEnrichment: true }));

    const job = jobFromCatalog || (cachedReal?.servirDetail?.puesto
      ? {
          id: decodedSlug,
          slug: decodedSlug,
          title: cachedReal.servirDetail.puesto,
          entity_name: cleanEntityDisplayName(cachedReal.servirDetail.entidad) || cachedReal.servirDetail.entidad || 'Entidad del Estado',
          sector_type: 'CAS 1057' as const,
          region: cachedReal.servirDetail.ubicacion || 'Perú',
          category: 'Sector Público',
          education_level: 'Universitario' as const,
          salary_text: cachedReal.servirDetail.remuneracion || 'Según bases oficiales',
          vacancies_count: parseInt(cachedReal.servirDetail.vacantes || '1', 10) || 1,
          description: '',
          requirements: [],
          benefits: [],
          apply_url: cachedReal.primaryOfficialPageUrl || cachedReal.servirDetail.detalleUrl || '',
          fuente_url: cachedReal.primaryOfficialPageUrl || cachedReal.servirDetail.detalleUrl || '',
          bases_pdf_url: cachedReal.directBasesPdfUrl,
          official_documents: cachedReal.officialDocuments,
          start_date: cachedReal.servirDetail.fechaInicio || '',
          end_date: cachedReal.servirDetail.fechaFin || '',
          status: 'Vigente' as const,
          featured: false,
          views_count: 0,
          clicks_count: 0,
          created_at: new Date().toISOString()
        }
      : null);

    if (!job) {
      return new NextResponse('Convocatoria no encontrada', { status: 404 });
    }

    const cleanEntity = cleanEntityDisplayName(job.entity_name) || decodeHtmlEntities(job.entity_name) || job.entity_name;
    const cleanTitle = decodeHtmlEntities(job.title) || job.title;

    // 1. Descarga 100% REAL del documento Word oficial (.docx) emitido por el servidor de SERVIR (app.servir.gob.pe)
    if (format === 'docx') {
      const wordBuf = await downloadServirOfficialWordDocx({
        title: cleanTitle,
        entityName: cleanEntity,
        region: job.region
      });

      if (wordBuf && wordBuf.length > 500) {
        const safeFileName = `detalle_ofertas_laborales_${slug.replace(/[^a-z0-9-_]/gi, '_').slice(0, 60)}.docx`;
        return new NextResponse(new Uint8Array(wordBuf), {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${safeFileName}"`,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }

    // 2. Resolver bases 100% reales (SERVIR DETALLE + PDFs institucionales reales + páginas oficiales reales)
    const realData = await resolveRealServirAndEntityBases({
      slug: job.slug,
      title: cleanTitle,
      entityName: cleanEntity,
      region: job.region,
      applyUrl: job.apply_url,
      fuenteUrl: job.fuente_url,
      basesPdfUrl: job.bases_pdf_url,
      existingDocs: job.official_documents as any
    });

    // 3. Proxy de PDF oficial real (para visualizar o descargar PDFs de portales .gob.pe con cadenas SSL incompletas como archivos.mpfn.gob.pe)
    const targetPdfUrl = fileUrlParam || realData.directBasesPdfUrl || job.bases_pdf_url;
    if (isRawPdf && targetPdfUrl && targetPdfUrl.startsWith('http') && isAllowedOfficialFileHost(targetPdfUrl)) {
      const pdfRes = await fetchGovBuffer(targetPdfUrl, { timeoutMs: 10000 });
      const contentType = String(pdfRes?.headers?.['content-type'] || '').toLowerCase();
      if (pdfRes && pdfRes.status === 200 && pdfRes.body.length > 200 && (contentType.includes('pdf') || pdfRes.body.subarray(0, 4).toString() === '%PDF')) {
        return new NextResponse(new Uint8Array(pdfRes.body), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="Bases_Oficiales_${slug.replace(/[^a-z0-9-_]/gi, '_').slice(0, 50)}.pdf"`,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
      return NextResponse.redirect(targetPdfUrl);
    }

    const sd = realData.servirDetail;
    const realExternalFiles = realData.officialDocuments.filter(d => !d.url.startsWith('/api/'));
    const realOfficialPages = realData.officialPages;
    const primaryPdfUrl = realData.directBasesPdfUrl;
    const proxiedPrimaryPdfUrl = primaryPdfUrl && isAllowedOfficialFileHost(primaryPdfUrl)
      ? `/api/bases-doc/${encodeURIComponent(job.slug)}?raw_pdf=1&file_url=${encodeURIComponent(primaryPdfUrl)}`
      : primaryPdfUrl;

    // Vista 100% REAL: Solo muestra los archivos oficiales reales, las páginas oficiales donde están las bases y el Aviso Oficial literal de SERVIR
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bases Oficiales y Página Oficial de la Convocatoria - ${escapeHtml(cleanTitle)} | ${escapeHtml(cleanEntity)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
      color: #0f172a;
      background: ${isEmbed ? '#f8fafc' : '#e2e8f0'};
      line-height: 1.5;
      font-size: 13.5px;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #0f172a;
      color: #fff;
      padding: 10px 18px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-bottom: 2px solid #10b981;
    }
    .toolbar-title {
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge-official {
      background: #10b981;
      color: #022c22;
      font-weight: 800;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 999px;
      text-transform: uppercase;
    }
    .toolbar-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #10b981;
      color: #022c22;
    }
    .btn-word {
      background: #38bdf8;
      color: #082f49;
    }
    .btn-portal {
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
    }
    .container {
      max-width: 960px;
      margin: ${isEmbed ? '12px auto' : '20px auto'};
      padding: 0 12px 28px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 22px 26px;
      margin-bottom: 16px;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
    }
    .section-header {
      background: #024487;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
      padding: 8px 14px;
      border-radius: 6px;
      margin: 0 0 14px 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .doc-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .doc-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }
    .doc-tag {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      background: #d1fae5;
      color: #065f46;
      margin-right: 8px;
    }
    .servir-box {
      border: 2px solid #024487;
      border-radius: 10px;
      padding: 18px 20px;
      background: #ffffff;
    }
    .servir-title {
      text-align: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .servir-title h1 {
      font-size: 18px;
      color: #024487;
      margin: 0 0 4px 0;
    }
    .servir-title h2 {
      font-size: 14px;
      color: #334155;
      margin: 0;
    }
    .kv-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .kv-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .kv-label {
      font-weight: 800;
      color: #024487;
      display: block;
      font-size: 12px;
      text-transform: uppercase;
    }
    .kv-val {
      color: #0f172a;
      font-size: 13.5px;
    }
    .pdf-frame {
      width: 100%;
      height: 680px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      background: #0f172a;
    }
    @media print {
      body { background: #fff; }
      .toolbar, .no-print { display: none !important; }
      .card { box-shadow: none; border: 1px solid #94a3b8; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-title">
      <span class="badge-official">100% Oficial</span>
      <span>${escapeHtml(cleanEntity)} — ${escapeHtml(cleanTitle)}</span>
    </div>
    <div class="toolbar-actions">
      ${primaryPdfUrl ? `
      <a class="btn btn-primary" href="${escapeHtml(primaryPdfUrl)}" target="_blank" rel="noopener noreferrer">
        📄 Abrir PDF Oficial de las Bases ↗
      </a>` : ''}
      ${realData.hasServirWordDoc ? `
      <a class="btn btn-word" href="/api/bases-doc/${encodeURIComponent(job.slug)}?format=docx">
        📝 Descargar Convocatoria en Word Oficial (SERVIR .docx)
      </a>` : ''}
      <a class="btn btn-portal" href="${escapeHtml(realData.primaryOfficialPageUrl)}" target="_blank" rel="noopener noreferrer">
        🔗 Abrir Página Oficial donde están las Bases ↗
      </a>
    </div>
  </div>

  <div class="container">
    <!-- 1. PÁGINAS OFICIALES REALES Y ARCHIVOS OFICIALES REALES DE LAS BASES -->
    <div class="card">
      <div class="section-header">1. Archivos Oficiales de las Bases y Página Oficial de la Convocatoria</div>
      <div class="doc-grid">
        ${realExternalFiles.map(doc => `
        <div class="doc-item">
          <div>
            <span class="doc-tag">${escapeHtml(doc.category)}</span>
            <strong>${escapeHtml(doc.title)}</strong>
          </div>
          <a class="btn btn-primary" href="${escapeHtml(doc.url)}" target="_blank" rel="noopener noreferrer">
            📥 Abrir / Descargar Archivo Oficial ↗
          </a>
        </div>`).join('')}

        ${realData.hasServirWordDoc ? `
        <div class="doc-item">
          <div>
            <span class="doc-tag" style="background:#e0f2fe;color:#0369a1;">WORD OFICIAL SERVIR (.DOCX)</span>
            <strong>Detalle Oficial de la Oferta Laboral en Word emitido por SERVIR Talento Perú${sd?.codigoAviso ? ` (Aviso N° ${escapeHtml(sd.codigoAviso)})` : ''}</strong>
          </div>
          <a class="btn btn-word" href="/api/bases-doc/${encodeURIComponent(job.slug)}?format=docx">
            📥 Descargar Word Oficial (.docx)
          </a>
        </div>` : ''}

        ${realOfficialPages.map(pg => `
        <div class="doc-item">
          <div>
            <span class="doc-tag" style="background:#fef3c7;color:#92400e;">${escapeHtml(pg.category)}</span>
            <strong>${escapeHtml(pg.title)}</strong>
            <div style="font-size:11.5px;color:#475569;word-break:break-all;margin-top:2px;">${escapeHtml(pg.url)}</div>
          </div>
          <a class="btn btn-portal" href="${escapeHtml(pg.url)}" target="_blank" rel="noopener noreferrer">
            🔗 Ir a la Página Oficial de las Bases ↗
          </a>
        </div>`).join('')}
      </div>
    </div>

    ${proxiedPrimaryPdfUrl ? `
    <!-- 2. VISOR DIRECTO DEL PDF OFICIAL DE LA ENTIDAD -->
    <div class="card no-print">
      <div class="section-header">2. Documento PDF Oficial de las Bases (${escapeHtml(cleanEntity)})</div>
      <iframe class="pdf-frame" src="${escapeHtml(proxiedPrimaryPdfUrl)}" title="PDF Oficial de las Bases"></iframe>
    </div>` : ''}

    <!-- 3. AVISO OFICIAL LITERAL REGISTRADO EN SERVIR TALENTO PERÚ -->
    <div class="card">
      <div class="section-header">${proxiedPrimaryPdfUrl ? '3.' : '2.'} Aviso Oficial Registrado por la Entidad en SERVIR Talento Perú</div>
      <div class="servir-box" id="idDatosConvocatoria">
        <div class="servir-title">
          <h1>${escapeHtml(sd?.puesto || cleanTitle)}</h1>
          <h2>${escapeHtml(sd?.entidad || cleanEntity)}</h2>
          ${sd?.codigoAviso ? `<div style="margin-top:6px;font-weight:800;color:#065f46;">CÓDIGO DE AVISO OFICIAL SERVIR: N° ${escapeHtml(sd.codigoAviso)}</div>` : ''}
        </div>
        <ul class="kv-list">
          ${sd?.numeroConvocatoria ? `
          <li>
            <span class="kv-label">NÚMERO DE CONVOCATORIA OFICIAL:</span>
            <span class="kv-val">${escapeHtml(sd.numeroConvocatoria)}</span>
          </li>` : ''}
          <li>
            <span class="kv-label">DETALLE (PÁGINA OFICIAL DONDE SE ENCUENTRAN LAS BASES):</span>
            <span class="kv-val">
              <a href="${escapeHtml(sd?.detalleUrl || realData.primaryOfficialPageUrl)}" target="_blank" rel="noopener noreferrer" style="color:#024487;font-weight:700;">
                ${escapeHtml(sd?.detalleUrl || realData.primaryOfficialPageUrl)}
              </a>
            </span>
          </li>
          ${sd?.formacionAcademica ? `
          <li>
            <span class="kv-label">FORMACIÓN ACADÉMICA - PERFIL:</span>
            <span class="kv-val">${escapeHtml(sd.formacionAcademica)}</span>
          </li>` : ''}
          ${sd?.experiencia ? `
          <li>
            <span class="kv-label">EXPERIENCIA:</span>
            <span class="kv-val">${escapeHtml(sd.experiencia)}</span>
          </li>` : ''}
          ${sd?.especializacion ? `
          <li>
            <span class="kv-label">ESPECIALIZACIÓN:</span>
            <span class="kv-val">${escapeHtml(sd.especializacion)}</span>
          </li>` : ''}
          ${sd?.conocimiento ? `
          <li>
            <span class="kv-label">CONOCIMIENTO:</span>
            <span class="kv-val">${escapeHtml(sd.conocimiento)}</span>
          </li>` : ''}
          ${sd?.competencias ? `
          <li>
            <span class="kv-label">COMPETENCIAS:</span>
            <span class="kv-val">${escapeHtml(sd.competencias)}</span>
          </li>` : ''}
          ${!sd && job.requirements && job.requirements.length > 0 ? `
          <li>
            <span class="kv-label">REQUISITOS REGISTRADOS EN LA CONVOCATORIA:</span>
            <span class="kv-val">${job.requirements.map(r => escapeHtml(decodeHtmlEntities(r))).join(' | ')}</span>
          </li>` : ''}
          <li>
            <span class="kv-label">CANTIDAD DE VACANTES:</span>
            <span class="kv-val">${escapeHtml(sd?.vacantes || String(job.vacancies_count || 1))}</span>
          </li>
          <li>
            <span class="kv-label">REMUNERACIÓN:</span>
            <span class="kv-val" style="font-weight:800;color:#047857;">${escapeHtml(sd?.remuneracion || job.salary_text)}</span>
          </li>
          <li>
            <span class="kv-label">UBICACIÓN / SEDE:</span>
            <span class="kv-val">${escapeHtml(job.region)}</span>
          </li>
          <li>
            <span class="kv-label">FECHA INICIO / FIN DE PUBLICACIÓN:</span>
            <span class="kv-val">${escapeHtml(sd?.fechaInicio || job.start_date)} — ${escapeHtml(sd?.fechaFin || job.end_date)}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  ${autoPrint ? `<script>window.addEventListener('load', () => { setTimeout(() => window.print(), 400); });</script>` : ''}
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
      }
    });
  } catch (err: any) {
    console.error('Error serving official bases:', err);
    return new NextResponse('Error interno al obtener las bases oficiales', { status: 500 });
  }
}
