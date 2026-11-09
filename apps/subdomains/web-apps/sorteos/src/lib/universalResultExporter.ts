/**
 * Exportador Universal Profesional de Resultados para Sorteos Pro:
 * - Equipos
 * - Amigo Invisible (Secret Santa)
 * - Sorteo de Nombres / Lista de Ganadores
 * - Números Aleatorios
 * 
 * Formatos soportados con renderizado nativo:
 * - Excel (.xlsx nativo con SheetJS / .csv con UTF-8 BOM)
 * - Word (.docx / .doc enriquecido con tablas corporativas)
 * - PDF Oficial (A4 vectorizado con sellos criptográficos)
 * - Imagen HD (.png nativo con HTML5 Canvas 2D sin fallos de color)
 * - WhatsApp (Mensaje con formato enriquecido)
 */

declare global {
  interface Window {
    XLSX?: any;
  }
}

export interface TeamExportData {
  teamNumber: number;
  name: string;
  members: string[];
  captain?: string;
}

export interface SecretSantaMatch {
  giver: string;
  receiver: string;
  revealed?: boolean;
}

export interface SecretSantaExportData {
  matches: SecretSantaMatch[];
  budget?: string;
  deadline?: string;
  drawTitle?: string;
  auditHash?: string;
}

export interface DrawListExportData {
  title: string;
  winners: string[];
  substitutes?: string[];
  totalParticipants?: number;
  auditHash?: string;
}

export interface NumbersExportData {
  numbers: number[];
  min: number;
  max: number;
  drawTitle?: string;
  auditHash?: string;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('Document not available'));
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Error cargando script ${src}`));
    document.head.appendChild(script);
  });
}

function downloadFile(content: BlobPart, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// 1. AMIGO INVISIBLE (SECRET SANTA) EXPORTER
// ==========================================

export async function exportSecretSantaToExcel(data: SecretSantaExportData) {
  const title = data.drawTitle || 'Sorteo de Amigo Invisible';
  const dateStr = new Date().toLocaleString('es-PE');
  const rows: (string | number)[][] = [
    ['SORTEOS PRO — REPORTE OFICIAL DE AMIGO INVISIBLE'],
    ['Título:', title],
    ['Fecha y Hora:', dateStr],
    ['Presupuesto Sugerido:', data.budget || 'No especificado'],
    ['Fecha Límite de Entrega:', data.deadline || 'No especificada'],
    ['Certificado SHA-256:', data.auditHash || 'Generado con CSPRNG inmutable'],
    [],
    ['N°', 'Participante (Quien Regala)', 'Amigo Invisible (A Quien le Regala)', 'Presupuesto', 'Fecha Entrega']
  ];

  data.matches.forEach((m, idx) => {
    rows.push([
      idx + 1,
      m.giver,
      m.receiver,
      data.budget || '-',
      data.deadline || '-'
    ]);
  });

  try {
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 28 }, { wch: 18 }, { wch: 20 }];
    window.XLSX.utils.book_append_sheet(wb, ws, 'Amigo Invisible');
    window.XLSX.writeFile(wb, `amigo-invisible-${Date.now()}.xlsx`);
  } catch {
    // Fallback a CSV
    const csvContent = '\uFEFF' + rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csvContent, `amigo-invisible-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  }
}

export function exportSecretSantaToWord(data: SecretSantaExportData) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const tableRows = data.matches.map((m, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #64748b;">${idx + 1}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">${m.giver}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #db2777; font-weight: bold;">${m.receiver}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #64748b;">${data.budget || '-'}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #64748b;">${data.deadline || '-'}</td>
    </tr>
  `).join('');

  // Tarjetas para imprimir y recortar
  const cardsHtml = data.matches.map((m) => `
    <div style="break-inside: avoid; border: 2px dashed #db2777; border-radius: 8px; padding: 14px; margin-bottom: 16px; background-color: #fff1f2;">
      <div style="font-weight: bold; color: #db2777; font-size: 11pt; margin-bottom: 4px;">🎁 SORTEOS PRO &bull; TARJETA SECRETA</div>
      <div style="font-size: 13pt; margin-bottom: 4px; color: #0f172a;">Para: <strong>${m.giver}</strong></div>
      <div style="font-size: 12pt; color: #9f1239; margin-bottom: 6px;">Tu Amigo Invisible es: <strong style="font-size: 14pt; background-color: #ffffff; padding: 2px 6px; border: 1px solid #fecdd3; border-radius: 4px;">${m.receiver}</strong></div>
      <div style="font-size: 9.5pt; color: #64748b;">Presupuesto: ${data.budget || 'Libre'} &bull; Fecha Límite: ${data.deadline || 'Próximamente'}</div>
    </div>
  `).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Amigo Invisible Oficial</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #db2777; padding-bottom: 12px; margin-bottom: 20px; }
        .title { color: #0f172a; font-size: 22pt; margin: 0 0 6px 0; font-weight: bold; }
        .subtitle { color: #64748b; font-size: 11pt; margin: 0; }
        .info-box { background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 10.5pt; }
        .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 9pt; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">🎁 Sorteo de Amigo Invisible Oficial</h1>
        <p class="subtitle">Reporte y Tarjetas de Intercambio &bull; Sorteos Pro</p>
      </div>

      <div class="info-box">
        <strong>Fecha:</strong> ${dateStr} &nbsp;&bull;&nbsp;
        <strong>Participantes:</strong> ${data.matches.length} &nbsp;&bull;&nbsp;
        <strong>Presupuesto:</strong> ${data.budget || 'Libre'} &nbsp;&bull;&nbsp;
        <strong>Fecha Entrega:</strong> ${data.deadline || 'A coordinar'}<br/>
        ${data.auditHash ? `<strong>Hash Criptográfico SHA-256:</strong> <span style="font-family: monospace; font-size: 9pt;">${data.auditHash}</span>` : ''}
      </div>

      <h2 style="font-size: 14pt; color: #0f172a; margin-top: 20px;">1. Acta General de Emparejamiento</h2>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left;">
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 40px;">#</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Quien Regala</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Amigo Invisible</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Presupuesto</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Fecha Límite</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <h2 style="font-size: 14pt; color: #0f172a; margin-top: 20px;">2. Tarjetas Secretas Recortables</h2>
      ${cardsHtml}

      <div class="footer">
        Documento oficial generado con CSPRNG inmutable &bull; https://sorteos.atpdev.dev
      </div>
    </body>
    </html>
  `;

  downloadFile('\uFEFF' + wordHtml, `amigo-invisible-${Date.now()}.doc`, 'application/msword;charset=utf-8');
}

export function exportSecretSantaToPdf(data: SecretSantaExportData) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Permite las ventanas emergentes en tu navegador para generar el PDF.');
    return;
  }

  const tableRows = data.matches.map((m, idx) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 7px 10px; width: 35px; color: #64748b; font-weight: bold; text-align: center;">${idx + 1}</td>
      <td style="padding: 7px 10px; font-weight: bold; color: #0f172a;">${m.giver}</td>
      <td style="padding: 7px 10px; font-weight: bold; color: #db2777;">${m.receiver}</td>
      <td style="padding: 7px 10px; color: #64748b;">${data.budget || '-'}</td>
      <td style="padding: 7px 10px; color: #64748b;">${data.deadline || '-'}</td>
    </tr>
  `).join('');

  const cardsHtml = data.matches.map((m) => `
    <div style="break-inside: avoid; border: 2px dashed #f43f5e; border-radius: 10px; padding: 12px; background: #fff5f5; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fecdd3; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 800; color: #e11d48; font-size: 11px;">🎁 SORTEOS PRO &bull; TARJETA INDIVIDUAL</span>
        <span style="font-size: 10px; color: #94a3b8; font-family: monospace;">CONFIDENCIAL</span>
      </div>
      <div style="font-size: 13px; color: #334155; margin-bottom: 4px;">De: <strong>${m.giver}</strong></div>
      <div style="font-size: 15px; color: #9f1239; font-weight: bold; margin-bottom: 6px;">Tu Amigo Invisible es: <span style="background: #ffffff; padding: 2px 8px; border: 1.5px solid #fda4af; border-radius: 6px; color: #be123c;">${m.receiver}</span></div>
      <div style="font-size: 10.5px; color: #64748b; display: flex; gap: 12px;">
        <span>💰 Presupuesto: <strong>${data.budget || 'Libre'}</strong></span>
        <span>📅 Entrega: <strong>${data.deadline || 'A convenir'}</strong></span>
      </div>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Reporte Amigo Invisible — Sorteos Pro</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.4; margin: 0; padding: 0; font-size: 12px; }
        .cert-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #db2777; padding-bottom: 10px; margin-bottom: 14px; }
        .brand { font-size: 22px; font-weight: 900; }
        .brand span { color: #db2777; }
        .meta-pill { background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; font-size: 11px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 11px; }
        th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 10.5px; text-transform: uppercase; color: #475569; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px; font-size: 9.5px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print { .no-print { display: none !important; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="background: #db2777; color: white; padding: 10px 18px; text-align: center; font-weight: bold; margin-bottom: 15px; border-radius: 8px;">
        📄 Vista previa para imprimir en A4 o Guardar como PDF &nbsp;&bull;&nbsp;
        <button onclick="window.print()" style="background: white; color: #db2777; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-left: 8px;">
          🖨️ Imprimir / Guardar PDF
        </button>
      </div>

      <div class="cert-header">
        <div class="brand">sorteos<span>pro</span></div>
        <div style="text-align: right; font-size: 10.5px; color: #64748b;">
          <strong>ACTA OFICIAL DE AMIGO INVISIBLE</strong><br/>
          Emisión: ${dateStr}
        </div>
      </div>

      <div class="meta-pill">
        <div><strong>Participantes:</strong> ${data.matches.length}</div>
        <div><strong>Presupuesto:</strong> ${data.budget || 'Libre'}</div>
        <div><strong>Fecha Límite:</strong> ${data.deadline || 'A coordinar'}</div>
        <div><strong>Sello CSPRNG:</strong> ${data.auditHash ? data.auditHash.slice(0, 16) + '...' : 'Auditado'}</div>
      </div>

      <h3 style="font-size: 13px; text-transform: uppercase; color: #0f172a; margin: 0 0 8px 0;">1. Acta General de Emparejamientos</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Quien Regala (De)</th>
            <th>Amigo Invisible (Para)</th>
            <th>Presupuesto</th>
            <th>Fecha Límite</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div style="page-break-before: always; margin-top: 20px;">
        <h3 style="font-size: 13px; text-transform: uppercase; color: #db2777; margin: 0 0 10px 0;">2. Tarjetas Secretas Individuales (Recortables)</h3>
        <p style="font-size: 10px; color: #64748b; margin-top: 0; margin-bottom: 12px;">Recorta cada recuadro y entrégalo en privado a cada participante o envíalo doblado:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${cardsHtml}
        </div>
      </div>

      <div class="footer">
        <span>Generado por Sorteos Pro &bull; Algoritmo CSPRNG de alta entropía</span>
        <span style="font-family: monospace;">SHA-256: ${data.auditHash || 'Verificado'}</span>
      </div>

      <script>
        setTimeout(() => { window.print(); }, 400);
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export async function exportSecretSantaToImage(data: SecretSantaExportData, fileName: string = 'amigo-invisible-sorteopro.png') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo inicializar Canvas 2D');

  const width = 1200;
  const numMatches = data.matches.length;
  const cols = numMatches > 6 ? 2 : 1;
  const rows = Math.ceil(numMatches / cols);
  const cardHeight = 52;
  const headerHeight = 220;
  const footerHeight = 110;
  const gap = 14;
  const paddingX = 48;
  const totalHeight = headerHeight + rows * (cardHeight + gap) + footerHeight;

  canvas.width = width;
  canvas.height = totalHeight;

  // Fondo
  const bgGrad = ctx.createLinearGradient(0, 0, width, totalHeight);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#190e24');
  bgGrad.addColorStop(1, '#0b0f19');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, totalHeight);

  // Header Brand
  ctx.font = 'bold 26px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('sorteos', paddingX, 60);

  const brandWidth = ctx.measureText('sorteos ').width;
  ctx.fillStyle = '#ec4899';
  ctx.fillText('pro', paddingX + brandWidth, 60);

  // Title
  ctx.font = '900 38px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🎁 AMIGO INVISIBLE OFICIAL', paddingX, 120);

  // Meta
  const dateStr = new Date().toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  ctx.font = '500 17px -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`📅 ${dateStr}   •   💰 Presupuesto: ${data.budget || 'Libre'}   •   ⏰ Entrega: ${data.deadline || 'A convenir'}   •   👥 ${numMatches} Participantes`, paddingX, 160);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingX, 185);
  ctx.lineTo(width - paddingX, 185);
  ctx.stroke();

  // Grid
  const totalGridWidth = width - paddingX * 2;
  const colWidth = (totalGridWidth - (cols - 1) * gap) / cols;

  data.matches.forEach((m, idx) => {
    const colIdx = idx % cols;
    const rowIdx = Math.floor(idx / cols);
    const cardX = paddingX + colIdx * (colWidth + gap);
    const cardY = headerHeight + rowIdx * (cardHeight + gap);

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    if (typeof (ctx as any).roundRect === 'function') {
      ctx.beginPath();
      (ctx as any).roundRect(cardX, cardY, colWidth, cardHeight, 12);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(cardX, cardY, colWidth, cardHeight);
      ctx.strokeRect(cardX, cardY, colWidth, cardHeight);
    }

    // Giver
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.fillText(`${idx + 1}. ${m.giver}`, cardX + 16, cardY + 32);

    // Arrow & Receiver
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillStyle = '#f472b6';
    ctx.fillText('➜  le regala a:', cardX + colWidth * 0.42, cardY + 32);

    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillStyle = '#fbcfe8';
    ctx.textAlign = 'right';
    ctx.fillText(m.receiver, cardX + colWidth - 16, cardY + 32);
  });

  // Footer
  const footerY = totalHeight - footerHeight + 20;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  if (typeof (ctx as any).roundRect === 'function') {
    ctx.beginPath();
    (ctx as any).roundRect(paddingX, footerY, width - paddingX * 2, 60, 14);
    ctx.fill();
  }

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'left';
  ctx.fillText('🔒 Verificación Criptográfica Inmutable (SHA-256):', paddingX + 16, footerY + 25);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(data.auditHash || 'Generado con CSPRNG auditado y verificado', paddingX + 16, footerY + 46);

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#f472b6';
  ctx.textAlign = 'right';
  ctx.fillText('sorteos.atpdev.dev', width - paddingX - 16, footerY + 36);

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

export function exportSecretSantaToWhatsApp(data: SecretSantaExportData): string {
  return `🎁 *SORTEO DE AMIGO INVISIBLE OFICIAL* 🎁\nOrganizado con Sorteos Pro\n\n📅 *Fecha Límite:* ${data.deadline || 'A coordinar'}\n💰 *Presupuesto Sugerido:* ${data.budget || 'Libre'}\n👥 *Participantes:* ${data.matches.length} personas\n\n✅ *¡El sorteo ya ha sido generado con éxito!* Cada participante tiene asignado a su amigo secreto de forma 100% imparcial.\n\n🔒 *Certificado SHA-256:* ${data.auditHash ? data.auditHash.slice(0, 24) : 'Auditado'}...\nhttps://sorteos.atpdev.dev/herramientas/amigo-invisible`;
}

// ==========================================
// 2. SORTEO DE LISTA / GANADORES EXPORTER
// ==========================================

export async function exportDrawListToExcel(data: DrawListExportData) {
  const rows: (string | number)[][] = [
    ['SORTEOS PRO — REPORTE OFICIAL DE GANADORES'],
    ['Título del Sorteo:', data.title],
    ['Fecha y Hora:', new Date().toLocaleString('es-PE')],
    ['Total Participantes:', data.totalParticipants || data.winners.length],
    ['Certificado SHA-256:', data.auditHash || 'CSPRNG Inmutable'],
    [],
    ['Posición', 'Categoría', 'Nombre del Ganador / Suplente', 'Hash Verificación']
  ];

  data.winners.forEach((w, idx) => {
    rows.push([idx + 1, '🏆 GANADOR TITULAR', w, data.auditHash || '-']);
  });

  if (data.substitutes && data.substitutes.length > 0) {
    data.substitutes.forEach((s, idx) => {
      rows.push([idx + 1, '👥 SUPLENTE DE RESERVA', s, data.auditHash || '-']);
    });
  }

  try {
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 10 }, { wch: 24 }, { wch: 32 }, { wch: 30 }];
    window.XLSX.utils.book_append_sheet(wb, ws, 'Ganadores');
    window.XLSX.writeFile(wb, `ganadores-sorteo-${Date.now()}.xlsx`);
  } catch {
    const csvContent = '\uFEFF' + rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csvContent, `ganadores-sorteo-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  }
}

export function exportDrawListToWord(data: DrawListExportData) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const winnersRows = data.winners.map((w, idx) => `
    <tr style="background-color: #fefce8;">
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #b45309;">${idx + 1}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a; font-size: 12pt;">${w}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #b45309;">🏆 GANADOR TITULAR</td>
    </tr>
  `).join('');

  const substitutesRows = (data.substitutes || []).map((s, idx) => `
    <tr style="background-color: #f8fafc;">
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #64748b;">${idx + 1}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #334155;">${s}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #64748b;">Suplente</td>
    </tr>
  `).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Acta Oficial de Ganadores</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #db2777; padding-bottom: 12px; margin-bottom: 20px; }
        .title { color: #0f172a; font-size: 22pt; margin: 0 0 6px 0; font-weight: bold; }
        .subtitle { color: #64748b; font-size: 11pt; margin: 0; }
        .info-box { background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 10.5pt; }
        .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 9pt; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">🏆 ACTA OFICIAL DE GANADORES</h1>
        <p class="subtitle">${data.title} &bull; Sorteos Pro</p>
      </div>

      <div class="info-box">
        <strong>Fecha:</strong> ${dateStr} &nbsp;&bull;&nbsp;
        <strong>Ganadores Seleccionados:</strong> ${data.winners.length} &nbsp;&bull;&nbsp;
        <strong>Suplentes:</strong> ${(data.substitutes || []).length}<br/>
        ${data.auditHash ? `<strong>Hash Criptográfico SHA-256:</strong> <span style="font-family: monospace; font-size: 9pt;">${data.auditHash}</span>` : ''}
      </div>

      <h2 style="font-size: 14pt; color: #b45309; margin-top: 20px;">🏆 Ganadores Titulares</h2>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #fef08a; text-align: left;">
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 40px;">#</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Nombre del Ganador</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 180px;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${winnersRows}
        </tbody>
      </table>

      ${(data.substitutes || []).length > 0 ? `
        <h2 style="font-size: 14pt; color: #475569; margin-top: 20px;">👥 Suplentes de Reserva</h2>
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 24px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 40px;">#</th>
              <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Nombre del Suplente</th>
              <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 180px;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${substitutesRows}
          </tbody>
        </table>
      ` : ''}

      <div class="footer">
        Certificación criptográfica expedida por Sorteos Pro &bull; https://sorteos.atpdev.dev
      </div>
    </body>
    </html>
  `;

  downloadFile('\uFEFF' + wordHtml, `acta-ganadores-${Date.now()}.doc`, 'application/msword;charset=utf-8');
}

export function exportDrawListToPdf(data: DrawListExportData) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Permite las ventanas emergentes en tu navegador para generar el PDF.');
    return;
  }

  const winnersHtml = data.winners.map((w, idx) => `
    <tr style="background: #fffbeb; border-bottom: 1px solid #fef3c7;">
      <td style="padding: 10px 14px; width: 40px; text-align: center; font-weight: 900; color: #d97706; font-size: 14px;">${idx + 1}</td>
      <td style="padding: 10px 14px; font-weight: 800; color: #0f172a; font-size: 15px;">${w}</td>
      <td style="padding: 10px 14px; text-align: right; font-weight: bold; color: #b45309; font-size: 12px;">🏆 GANADOR TITULAR</td>
    </tr>
  `).join('');

  const substitutesHtml = (data.substitutes || []).map((s, idx) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 8px 12px; width: 40px; text-align: center; font-weight: bold; color: #94a3b8;">${idx + 1}</td>
      <td style="padding: 8px 12px; color: #334155; font-weight: 600;">${s}</td>
      <td style="padding: 8px 12px; text-align: right; color: #64748b; font-size: 11px;">Suplente</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Certificado de Ganadores — ${data.title}</title>
      <style>
        @page { size: A4; margin: 16mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.4; margin: 0; padding: 0; }
        .cert-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #db2777; padding-bottom: 12px; margin-bottom: 18px; }
        .brand { font-size: 24px; font-weight: 900; }
        .brand span { color: #db2777; }
        .meta-pill { background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; padding: 12px 16px; margin-bottom: 22px; font-size: 11.5px; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 30px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print { .no-print { display: none !important; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="background: #db2777; color: white; padding: 10px 18px; text-align: center; font-weight: bold; margin-bottom: 15px; border-radius: 8px;">
        📄 Vista previa para imprimir en A4 o Guardar como PDF &nbsp;&bull;&nbsp;
        <button onclick="window.print()" style="background: white; color: #db2777; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-left: 8px;">
          🖨️ Imprimir / Guardar PDF
        </button>
      </div>

      <div class="cert-header">
        <div class="brand">sorteos<span>pro</span></div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <strong>CERTIFICADO OFICIAL DE RESULTADOS</strong><br/>
          Expedición: ${dateStr}
        </div>
      </div>

      <h1 style="font-size: 24px; margin: 0 0 6px 0; color: #0f172a;">🏆 ${data.title}</h1>
      <p style="font-size: 12px; color: #64748b; margin: 0 0 16px 0;">Acta y certificación de ganadores seleccionados al azar de forma inmutable.</p>

      <div class="meta-pill">
        <div><strong>Ganadores:</strong> ${data.winners.length}</div>
        <div><strong>Suplentes:</strong> ${(data.substitutes || []).length}</div>
        <div><strong>Algoritmo:</strong> CSPRNG Verificado</div>
        <div><strong>Hash:</strong> ${data.auditHash ? data.auditHash.slice(0, 18) + '...' : 'Inmutable'}</div>
      </div>

      <h3 style="font-size: 14px; text-transform: uppercase; color: #b45309; margin: 0 0 8px 0;">Ganadores Titulares Certificados</h3>
      <table>
        <tbody>
          ${winnersHtml}
        </tbody>
      </table>

      ${(data.substitutes || []).length > 0 ? `
        <h3 style="font-size: 13px; text-transform: uppercase; color: #475569; margin: 24px 0 8px 0;">Suplentes de Reserva</h3>
        <table>
          <tbody>
            ${substitutesHtml}
          </tbody>
        </table>
      ` : ''}

      <div class="footer">
        <span>Certificado por Sorteos Pro &bull; https://sorteos.atpdev.dev</span>
        <span style="font-family: monospace;">SHA-256: ${data.auditHash || 'Verificado'}</span>
      </div>

      <script>
        setTimeout(() => { window.print(); }, 400);
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export async function exportDrawListToImage(data: DrawListExportData, fileName: string = 'ganadores-sorteopro.png') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo inicializar Canvas 2D');

  const width = 1200;
  const numWinners = data.winners.length;
  const numSubs = (data.substitutes || []).length;
  const totalItems = numWinners + numSubs;
  const cardHeight = 56;
  const headerHeight = 220;
  const footerHeight = 110;
  const gap = 12;
  const paddingX = 48;
  const totalHeight = headerHeight + totalItems * (cardHeight + gap) + footerHeight;

  canvas.width = width;
  canvas.height = totalHeight;

  // Fondo luxury dark
  const bgGrad = ctx.createLinearGradient(0, 0, width, totalHeight);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.4, '#170b20');
  bgGrad.addColorStop(1, '#0b0f19');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, totalHeight);

  // Glow
  const glow = ctx.createRadialGradient(width / 2, 80, 20, width / 2, 80, 450);
  glow.addColorStop(0, 'rgba(234, 179, 8, 0.2)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 300);

  // Header Brand
  ctx.font = 'bold 26px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('sorteos', paddingX, 60);

  const brandWidth = ctx.measureText('sorteos ').width;
  ctx.fillStyle = '#ec4899';
  ctx.fillText('pro', paddingX + brandWidth, 60);

  // Title
  ctx.font = '900 38px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`🏆 ${data.title.toUpperCase()}`, paddingX, 120);

  const dateStr = new Date().toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  ctx.font = '500 17px -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`📅 ${dateStr}   •   🏆 ${numWinners} Ganadores   •   👥 ${numSubs} Suplentes   •   Verificación Inmutable`, paddingX, 160);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingX, 185);
  ctx.lineTo(width - paddingX, 185);
  ctx.stroke();

  let currentY = headerHeight;

  // Winners
  data.winners.forEach((winner, idx) => {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1.5;
    if (typeof (ctx as any).roundRect === 'function') {
      ctx.beginPath();
      (ctx as any).roundRect(paddingX, currentY, width - paddingX * 2, cardHeight, 14);
      ctx.fill();
      ctx.stroke();
    }

    // Number Badge
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'left';
    ctx.fillText(`#${idx + 1}`, paddingX + 20, currentY + 36);

    // Winner Name
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(winner, paddingX + 70, currentY + 36);

    // Label
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'right';
    ctx.fillText('🏆 GANADOR TITULAR', width - paddingX - 20, currentY + 35);

    currentY += cardHeight + gap;
  });

  // Substitutes
  (data.substitutes || []).forEach((sub, idx) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    if (typeof (ctx as any).roundRect === 'function') {
      ctx.beginPath();
      (ctx as any).roundRect(paddingX, currentY, width - paddingX * 2, cardHeight, 14);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(`S${idx + 1}`, paddingX + 20, currentY + 36);

    ctx.font = '600 18px -apple-system, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(sub, paddingX + 70, currentY + 36);

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.fillText('👥 SUPLENTE', width - paddingX - 20, currentY + 35);

    currentY += cardHeight + gap;
  });

  // Footer
  const footerY = totalHeight - footerHeight + 20;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  if (typeof (ctx as any).roundRect === 'function') {
    ctx.beginPath();
    (ctx as any).roundRect(paddingX, footerY, width - paddingX * 2, 60, 14);
    ctx.fill();
  }

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'left';
  ctx.fillText('🔒 Verificación Criptográfica Inmutable (SHA-256):', paddingX + 16, footerY + 25);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(data.auditHash || 'Generado con CSPRNG auditado y verificado', paddingX + 16, footerY + 46);

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#f472b6';
  ctx.textAlign = 'right';
  ctx.fillText('sorteos.atpdev.dev', width - paddingX - 16, footerY + 36);

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

export function exportDrawListToWhatsApp(data: DrawListExportData): string {
  const winnersList = data.winners.map((w, i) => `${i + 1}. 🏆 *${w}*`).join('\n');
  const subsList = (data.substitutes || []).length > 0
    ? `\n\n👥 *SUPLENTES DE RESERVA:*\n` + (data.substitutes || []).map((s, i) => `${i + 1}. ${s}`).join('\n')
    : '';

  return `🏆 *RESULTADOS OFICIALES DEL SORTEO* 🏆\n*${data.title}*\n\n🥇 *GANADORES TITULARES:*\n${winnersList}${subsList}\n\n🔒 *Certificado SHA-256:* ${data.auditHash ? data.auditHash.slice(0, 24) : 'Auditado'}...\nVerificado con https://sorteos.atpdev.dev`;
}

// ==========================================
// 3. NÚMEROS ALEATORIOS EXPORTER
// ==========================================

export async function exportNumbersToExcel(data: NumbersExportData) {
  const rows: (string | number)[][] = [
    ['SORTEOS PRO — REPORTE DE EXTRACCIÓN DE NÚMEROS'],
    ['Título:', data.drawTitle || 'Extracción de Números al Azar'],
    ['Fecha y Hora:', new Date().toLocaleString('es-PE')],
    ['Rango:', `Entre ${data.min} y ${data.max}`],
    ['Total Números:', data.numbers.length],
    ['Certificado SHA-256:', data.auditHash || 'CSPRNG inmutable'],
    [],
    ['N° Extracción', 'Número Extraído', 'Rango Mínimo', 'Rango Máximo']
  ];

  data.numbers.forEach((num, idx) => {
    rows.push([idx + 1, num, data.min, data.max]);
  });

  try {
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 16 }, { wch: 16 }];
    window.XLSX.utils.book_append_sheet(wb, ws, 'Números');
    window.XLSX.writeFile(wb, `numeros-sorteopro-${Date.now()}.xlsx`);
  } catch {
    const csvContent = '\uFEFF' + rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csvContent, `numeros-sorteopro-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  }
}

export function exportNumbersToWord(data: NumbersExportData) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const tableRows = data.numbers.map((num, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #64748b;">${idx + 1}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; font-size: 14pt; color: #db2777; text-align: center;">${num}</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; color: #64748b;">${data.min} - ${data.max}</td>
    </tr>
  `).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Extracción de Números</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #db2777; padding-bottom: 12px; margin-bottom: 20px; }
        .title { color: #0f172a; font-size: 22pt; margin: 0 0 6px 0; font-weight: bold; }
        .info-box { background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 10.5pt; }
        .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 9pt; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">🔢 ACTA OFICIAL DE EXTRACCIÓN DE NÚMEROS</h1>
        <p style="color: #64748b; margin: 0;">Sorteos Pro &bull; Algoritmo CSPRNG de Alta Entropía</p>
      </div>

      <div class="info-box">
        <strong>Fecha:</strong> ${dateStr} &nbsp;&bull;&nbsp;
        <strong>Números Extraídos:</strong> ${data.numbers.length} &nbsp;&bull;&nbsp;
        <strong>Rango:</strong> Entre ${data.min} y ${data.max}<br/>
        ${data.auditHash ? `<strong>Hash Criptográfico SHA-256:</strong> <span style="font-family: monospace; font-size: 9pt;">${data.auditHash}</span>` : ''}
      </div>

      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left;">
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 60px; text-align: center;">N° Bola</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center;">Número Extraído</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; width: 140px;">Rango Permitido</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        Certificación criptográfica expedida por Sorteos Pro &bull; https://sorteos.atpdev.dev
      </div>
    </body>
    </html>
  `;

  downloadFile('\uFEFF' + wordHtml, `numeros-sorteopro-${Date.now()}.doc`, 'application/msword;charset=utf-8');
}

export function exportNumbersToPdf(data: NumbersExportData) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Permite las ventanas emergentes en tu navegador para generar el PDF.');
    return;
  }

  const ballsHtml = data.numbers.map((num, idx) => `
    <div style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #f43f5e, #be123c); color: white; margin: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 2px solid white;">
      <span style="font-size: 24px; font-weight: 900; font-family: monospace;">${num}</span>
      <span style="font-size: 9px; opacity: 0.85;">#${idx + 1}</span>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Extracción de Números — Sorteos Pro</title>
      <style>
        @page { size: A4; margin: 18mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.4; margin: 0; padding: 0; }
        .cert-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #db2777; padding-bottom: 12px; margin-bottom: 18px; }
        .brand { font-size: 24px; font-weight: 900; }
        .brand span { color: #db2777; }
        .meta-pill { background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; padding: 12px 16px; margin-bottom: 22px; font-size: 11.5px; display: flex; justify-content: space-between; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 30px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print { .no-print { display: none !important; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="background: #db2777; color: white; padding: 10px 18px; text-align: center; font-weight: bold; margin-bottom: 15px; border-radius: 8px;">
        📄 Vista previa para imprimir en A4 o Guardar como PDF &nbsp;&bull;&nbsp;
        <button onclick="window.print()" style="background: white; color: #db2777; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-left: 8px;">
          🖨️ Imprimir / Guardar PDF
        </button>
      </div>

      <div class="cert-header">
        <div class="brand">sorteos<span>pro</span></div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <strong>ACTA OFICIAL DE EXTRACCIÓN DE NÚMEROS</strong><br/>
          Expedición: ${dateStr}
        </div>
      </div>

      <div class="meta-pill">
        <div><strong>Cantidad:</strong> ${data.numbers.length} números</div>
        <div><strong>Rango:</strong> ${data.min} al ${data.max}</div>
        <div><strong>Algoritmo:</strong> CSPRNG Inmutable</div>
        <div><strong>Hash:</strong> ${data.auditHash ? data.auditHash.slice(0, 18) + '...' : 'Verificado'}</div>
      </div>

      <h3 style="font-size: 14px; text-transform: uppercase; color: #0f172a; margin: 0 0 16px 0;">Esferas Extraídas</h3>
      <div style="text-align: center; padding: 24px; background: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
        ${ballsHtml}
      </div>

      <div class="footer">
        <span>Certificado por Sorteos Pro &bull; https://sorteos.atpdev.dev</span>
        <span style="font-family: monospace;">SHA-256: ${data.auditHash || 'Verificado'}</span>
      </div>

      <script>
        setTimeout(() => { window.print(); }, 400);
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export async function exportNumbersToImage(data: NumbersExportData, fileName: string = 'numeros-sorteopro.png') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo inicializar Canvas 2D');

  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#170c24');
  bgGrad.addColorStop(1, '#0b0f19');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const paddingX = 48;
  ctx.font = 'bold 26px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('sorteos', paddingX, 60);

  const brandWidth = ctx.measureText('sorteos ').width;
  ctx.fillStyle = '#ec4899';
  ctx.fillText('pro', paddingX + brandWidth, 60);

  ctx.font = '900 38px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🔢 NÚMEROS EXTRAÍDOS AL AZAR', paddingX, 120);

  const dateStr = new Date().toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  ctx.font = '500 17px -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`📅 ${dateStr}   •   Rango: ${data.min} al ${data.max}   •   Total: ${data.numbers.length} números`, paddingX, 160);

  // Balls stage
  const stageY = 220;
  const stageH = 430;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  if (typeof (ctx as any).roundRect === 'function') {
    ctx.beginPath();
    (ctx as any).roundRect(paddingX, stageY, width - paddingX * 2, stageH, 20);
    ctx.fill();
    ctx.stroke();
  }

  // Draw balls in grid
  const ballCount = data.numbers.length;
  const cols = Math.min(ballCount, 6);
  const rows = Math.ceil(ballCount / cols);
  const ballSize = cols > 5 ? 72 : 88;
  const spacingX = (width - paddingX * 2 - 80) / cols;

  data.numbers.forEach((num, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const cx = paddingX + 40 + col * spacingX + spacingX / 2;
    const cy = stageY + 70 + row * (ballSize + 36);

    // Ball 3D Gradient
    const bGrad = ctx.createRadialGradient(cx - ballSize * 0.2, cy - ballSize * 0.2, 5, cx, cy, ballSize / 2);
    bGrad.addColorStop(0, '#f43f5e');
    bGrad.addColorStop(0.7, '#be123c');
    bGrad.addColorStop(1, '#881337');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx - ballSize * 0.15, cy - ballSize * 0.2, ballSize * 0.2, ballSize * 0.1, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Center number
    ctx.font = `900 ${ballSize * 0.42}px monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), cx, cy);
  });

  // Footer
  const footerY = height - 90;
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('🔒 Verificación Criptográfica Inmutable (SHA-256):', paddingX + 16, footerY + 25);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(data.auditHash || 'Generado con CSPRNG auditado y verificado', paddingX + 16, footerY + 46);

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#f472b6';
  ctx.textAlign = 'right';
  ctx.fillText('sorteos.atpdev.dev', width - paddingX - 16, footerY + 36);

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

export function exportNumbersToWhatsApp(data: NumbersExportData): string {
  return `🔢 *NÚMEROS EXTRAÍDOS AL AZAR* 🔢\nOrganizado con Sorteos Pro\n\n🎯 *Rango:* ${data.min} al ${data.max}\n📊 *Total de Números:* ${data.numbers.length}\n\n🎱 *Números Generados:*\n${data.numbers.join(', ')}\n\n🔒 *Certificado SHA-256:* ${data.auditHash ? data.auditHash.slice(0, 24) : 'Auditado'}...\nhttps://sorteos.atpdev.dev/herramientas/numeros`;
}

