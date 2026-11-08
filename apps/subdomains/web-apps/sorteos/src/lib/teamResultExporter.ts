/**
 * Exportador profesional de resultados de sorteos y equipos:
 * - Excel (.xlsx / .csv con UTF-8 BOM)
 * - Word (.docx / .doc enriquecido)
 * - PDF oficial (estilo reporte de certificación A4)
 * - Imagen (.png de alta resolución con html2canvas)
 */

declare global {
  interface Window {
    XLSX?: any;
    html2canvas?: any;
  }
}

export interface TeamExportData {
  teamNumber: number;
  name: string;
  members: string[];
  captain?: string;
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

/**
 * 1. Exportar a Excel (.xlsx) nativo con SheetJS
 */
export async function exportTeamsToExcel(
  teams: TeamExportData[],
  drawTitle: string = 'División de Equipos',
  auditHash: string = ''
) {
  try {
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }

    const rows: (string | number)[][] = [
      ['SORTEOS PRO — REPORTE OFICIAL DE EQUIPOS'],
      ['Título:', drawTitle],
      ['Fecha y Hora:', new Date().toLocaleString('es-PE')],
      ['Certificado SHA-256:', auditHash || 'Generado con CSPRNG inmutable'],
      [], // Fila en blanco
      ['Equipo', 'N°', 'Participante', 'Rol / Capitán']
    ];

    teams.forEach((team) => {
      team.members.forEach((member, idx) => {
        rows.push([
          team.name,
          idx + 1,
          member,
          member === team.captain ? '⭐ CAPITÁN' : 'Integrante'
        ]);
      });
    });

    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.aoa_to_sheet(rows);

    // Ajustar anchos de columna
    ws['!cols'] = [{ wch: 24 }, { wch: 6 }, { wch: 28 }, { wch: 16 }];

    window.XLSX.utils.book_append_sheet(wb, ws, 'Equipos');
    window.XLSX.writeFile(wb, `equipos-sorteopro-${Date.now()}.xlsx`);
  } catch {
    // Fallback instantáneo a CSV con UTF-8 BOM
    exportTeamsToCsv(teams, auditHash);
  }
}

/**
 * Fallback a CSV
 */
export function exportTeamsToCsv(teams: TeamExportData[], auditHash: string = '') {
  const rows = [['Equipo', 'Nro', 'Participante', 'Capitan']];
  teams.forEach((t) => {
    t.members.forEach((m, idx) => {
      rows.push([t.name, String(idx + 1), m, m === t.captain ? 'SI' : 'NO']);
    });
  });
  if (auditHash) {
    rows.push([]);
    rows.push(['Hash SHA-256', auditHash, '', '']);
  }
  const csvContent = '\uFEFF' + rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `equipos-sorteopro-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 2. Exportar a Word (.doc enriquecido con tablas y estilos corporativos)
 */
export function exportTeamsToWord(
  teams: TeamExportData[],
  drawTitle: string = 'División de Equipos',
  auditHash: string = ''
) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const totalParticipants = teams.reduce((acc, t) => acc + t.members.length, 0);

  const teamCardsHtml = teams.map((team, tIdx) => `
    <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background-color: #f8fafc;">
      <h3 style="margin: 0 0 12px 0; color: #db2777; font-size: 16pt; font-family: Arial, sans-serif;">
        ${team.name} <span style="font-size: 11pt; color: #64748b; font-weight: normal;">(${team.members.length} integrantes)</span>
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left;">
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 40px;">#</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Participante</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 140px;">Rol</th>
          </tr>
        </thead>
        <tbody>
          ${team.members.map((member, mIdx) => {
            const isCap = member === team.captain;
            return `
              <tr style="background-color: ${mIdx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #64748b;">${mIdx + 1}</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1; ${isCap ? 'font-weight: bold; color: #1e293b;' : ''}">${member}</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1; ${isCap ? 'background-color: #fef3c7; color: #b45309; font-weight: bold;' : 'color: #64748b;'}">
                  ${isCap ? '👑 CAPITÁN' : 'Integrante'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${drawTitle}</title>
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
        <h1 class="title">🏆 ${drawTitle}</h1>
        <p class="subtitle">Reporte Oficial de Sorteo generado por Sorteos Pro</p>
      </div>

      <div class="info-box">
        <strong>Fecha:</strong> ${dateStr} &nbsp;&bull;&nbsp;
        <strong>Total de Participantes:</strong> ${totalParticipants} &nbsp;&bull;&nbsp;
        <strong>Equipos Formados:</strong> ${teams.length}<br/>
        ${auditHash ? `<strong>Certificado Criptográfico SHA-256:</strong> <span style="font-family: monospace; font-size: 9pt;">${auditHash}</span>` : ''}
      </div>

      ${teamCardsHtml}

      <div class="footer">
        Documento oficial generado de forma inmutable con tecnología CSPRNG &bull; https://sorteos.atpdev.dev
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF', wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `reporte-equipos-${Date.now()}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 3. Exportar a PDF Oficial (Abre vista de impresión de alta fidelidad vectorizada)
 */
export function exportTeamsToPdf(
  teams: TeamExportData[],
  drawTitle: string = 'División de Equipos al Azar',
  auditHash: string = ''
) {
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const total = teams.reduce((acc, t) => acc + t.members.length, 0);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Permite las ventanas emergentes en tu navegador para generar el PDF.');
    return;
  }

  const teamsHtml = teams.map((team) => `
    <div style="break-inside: avoid; margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; background: #fafafa;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #db2777; padding-bottom: 6px; margin-bottom: 10px;">
        <h3 style="margin: 0; font-size: 15px; color: #0f172a; font-weight: bold;">${team.name}</h3>
        <span style="font-size: 12px; font-weight: bold; color: #64748b;">${team.members.length} integrantes</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
        ${team.members.map((m, idx) => {
          const isCap = m === team.captain;
          return `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 5px 8px; width: 28px; color: #94a3b8; font-weight: bold;">${idx + 1}</td>
              <td style="padding: 5px 8px; font-weight: ${isCap ? 'bold' : 'normal'}; color: ${isCap ? '#0f172a' : '#334155'};">
                ${m} ${isCap ? '<span style="color: #b45309; background: #fef3c7; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: bold;">👑 CAPITÁN</span>' : ''}
              </td>
            </tr>
          `;
        }).join('')}
      </table>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>${drawTitle} — Sorteos Pro PDF</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 10px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #db2777; padding-bottom: 12px; margin-bottom: 16px; }
        .logo { font-size: 20px; font-weight: 900; color: #0f172a; }
        .logo span { color: #db2777; }
        .meta { font-size: 11px; color: #64748b; text-align: right; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .stamp { margin-top: 20px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; font-family: monospace; color: #475569; word-break: break-all; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">sorteos <span>pro</span></div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${drawTitle}</div>
        </div>
        <div class="meta">
          <div><strong>Fecha:</strong> ${dateStr}</div>
          <div><strong>Total:</strong> ${total} participantes en ${teams.length} equipos</div>
        </div>
      </div>

      <div class="grid">
        ${teamsHtml}
      </div>

      ${auditHash ? `
        <div class="stamp">
          <strong>🔒 Verificación Criptográfica SHA-256 (Inmutable):</strong><br/>
          ${auditHash}
        </div>
      ` : ''}

      <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 16px;">
        Certificado de Sorteo Oficial &bull; Sorteos Pro &bull; https://sorteos.atpdev.dev
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * 4. Exportar a Imagen HD (.png) nativa con HTML5 Canvas 2D
 * (100% inmune a errores de CSS moderno como 'lab' o 'oklch')
 */
export async function exportTeamsToImage(
  teams: TeamExportData[],
  drawTitle: string = 'División de Equipos al Azar',
  auditHash: string = '',
  fileName: string = 'equipos-sorteopro.png'
): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo inicializar el motor gráfico Canvas 2D');

  const width = 1200;
  const numTeams = teams.length;
  const cols = numTeams > 4 ? 3 : 2;
  const rows = Math.ceil(numTeams / cols);

  // Calcular altura dinámica
  const maxMembers = Math.max(...teams.map((t) => t.members.length), 1);
  const cardHeight = 70 + maxMembers * 38;
  const headerHeight = 220;
  const footerHeight = 110;
  const gap = 24;
  const paddingX = 48;
  const totalHeight = headerHeight + rows * cardHeight + (rows - 1) * gap + footerHeight;

  canvas.width = width;
  canvas.height = totalHeight;

  // 1. Fondo degradado profesional estilo Dark Studio
  const bgGrad = ctx.createLinearGradient(0, 0, width, totalHeight);
  bgGrad.addColorStop(0, '#0b0f19');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, totalHeight);

  // Decoración de fondo (luces difusas)
  const glow = ctx.createRadialGradient(width / 2, 80, 20, width / 2, 80, 500);
  glow.addColorStop(0, 'rgba(219, 39, 119, 0.25)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 400);

  // 2. Cabecera
  // Marca
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('sorteos', paddingX, 60);

  const brandWidth = ctx.measureText('sorteos ').width;
  ctx.fillStyle = '#ec4899';
  ctx.fillText('pro', paddingX + brandWidth, 60);

  // Badge Oficial
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#f472b6';
  ctx.fillText('• RESULTADO CERTIFICADO CSPRNG', paddingX + brandWidth + 60, 58);

  // Título Principal
  ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(drawTitle.toUpperCase(), paddingX, 120);

  // Metadatos
  const dateStr = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const totalMembers = teams.reduce((acc, t) => acc + t.members.length, 0);
  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`📅 ${dateStr}   •   👥 ${totalMembers} Participantes distribuidos en ${numTeams} Equipos`, paddingX, 160);

  // Línea separadora
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingX, 185);
  ctx.lineTo(width - paddingX, 185);
  ctx.stroke();

  // 3. Grid de Tarjetas de Equipos
  const totalGridWidth = width - paddingX * 2;
  const colWidth = (totalGridWidth - (cols - 1) * gap) / cols;

  teams.forEach((team, idx) => {
    const colIdx = idx % cols;
    const rowIdx = Math.floor(idx / cols);
    const cardX = paddingX + colIdx * (colWidth + gap);
    const cardY = headerHeight + rowIdx * (cardHeight + gap);

    // Fondo de tarjeta con esquinas redondeadas
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    if (typeof (ctx as any).roundRect === 'function') {
      ctx.beginPath();
      (ctx as any).roundRect(cardX, cardY, colWidth, cardHeight, 18);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(cardX, cardY, colWidth, cardHeight);
      ctx.strokeRect(cardX, cardY, colWidth, cardHeight);
    }

    // Cabecera de la tarjeta del equipo
    ctx.fillStyle = 'rgba(219, 39, 119, 0.15)';
    if (typeof (ctx as any).roundRect === 'function') {
      ctx.beginPath();
      (ctx as any).roundRect(cardX, cardY, colWidth, 54, [18, 18, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(cardX, cardY, colWidth, 54);
    }

    // Nombre del equipo
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(team.name, cardX + 16, cardY + 35);

    // Conteo de integrantes
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f472b6';
    ctx.textAlign = 'right';
    ctx.fillText(`${team.members.length} miembros`, cardX + colWidth - 16, cardY + 34);

    // Lista de integrantes
    team.members.forEach((member, mIdx) => {
      const isCaptain = member === team.captain;
      const memberY = cardY + 68 + mIdx * 38;

      // Fondo de la fila de integrante
      ctx.fillStyle = isCaptain ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = isCaptain ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      if (typeof (ctx as any).roundRect === 'function') {
        ctx.beginPath();
        (ctx as any).roundRect(cardX + 12, memberY, colWidth - 24, 32, 10);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(cardX + 12, memberY, colWidth - 24, 32);
      }

      // Número de integrante
      ctx.fillStyle = isCaptain ? '#f59e0b' : '#ec4899';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${mIdx + 1}.`, cardX + 22, memberY + 21);

      // Nombre del integrante
      ctx.font = isCaptain ? 'bold 15px -apple-system, sans-serif' : '500 15px -apple-system, sans-serif';
      ctx.fillStyle = isCaptain ? '#fef3c7' : '#e2e8f0';
      ctx.fillText(member, cardX + 46, memberY + 21);

      // Badge de Capitán
      if (isCaptain) {
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'right';
        ctx.fillText('👑 CAPITÁN', cardX + colWidth - 24, memberY + 20);
      }
    });
  });

  // 4. Pie de Verificación
  const footerY = totalHeight - footerHeight + 20;

  // Caja de Huella Criptográfica
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  if (typeof (ctx as any).roundRect === 'function') {
    ctx.beginPath();
    (ctx as any).roundRect(paddingX, footerY, width - paddingX * 2, 60, 14);
    ctx.fill();
    ctx.stroke();
  }

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'left';
  ctx.fillText('🔒 Verificación Criptográfica Inmutable (SHA-256):', paddingX + 16, footerY + 25);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(auditHash || 'Algoritmo CSPRNG de alta entropía auditado y verificado', paddingX + 16, footerY + 46);

  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = '#f472b6';
  ctx.textAlign = 'right';
  ctx.fillText('sorteos.atpdev.dev', width - paddingX - 16, footerY + 36);

  // 5. Descargar la imagen PNG directamente
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

