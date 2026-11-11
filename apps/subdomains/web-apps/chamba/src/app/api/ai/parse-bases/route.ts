import { NextResponse } from 'next/server';
import { resolveRealServirAndEntityBases, resolveEntityCanonicalPortal } from '@atpdev/database';

export const dynamic = 'force-dynamic';

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: Request) {
  try {
    const { rawText, applyUrl, pdfUrl } = await req.json();

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
      return NextResponse.json({ error: 'Texto de bases insuficiente para parsear' }, { status: 400 });
    }

    const text = rawText.trim();

    // 1. Extraer Entidad
    let entityName = "ENTIDAD PÚBLICA DE PERÚ";
    const entityMatch = text.match(/(?:GOBIERNO REGIONAL|MINISTERIO|MUNICIPALIDAD|RED DE SALUD|UNIVERSIDAD|AUTORIDAD|SUPERINTENDENCIA|INSTITUTO|UGEL|IREN|HOSPITAL|PROINVERSIÓN|SUNAT|ONPE|RENIEC|BCRP|ESSALUD|SERFOR|SENASA|ATU|INIA)[^\n:,.]{3,60}/i);
    if (entityMatch) {
      entityName = entityMatch[0].trim().toUpperCase();
    }

    // 2. Extraer Título o Puesto
    let title = "Convocatoria Pública de Selección de Personal";
    const titleMatch = text.match(/(?:CONVOCATORIA|PROCESO|CAS|REQUERIMIENTO)[^\n]{5,100}/i) || text.match(/(?:SE BUSCA|REQUIERE|SOLICITA)[^\n]{5,100}/i);
    if (titleMatch) {
      title = titleMatch[0].trim();
    } else {
      const firstLine = text.split('\n')[0].trim();
      if (firstLine.length > 5) title = firstLine.slice(0, 90);
    }

    // 3. Extraer Vacantes
    let vacanciesCount = 1;
    const vacMatch = text.match(/(?:(\d+)\s*(?:VACANTES|PLAZAS|PUESTOS|POSICIONES))|(?:(?:VACANTES|PLAZAS|PUESTOS)\s*[:=]?\s*(\d+))/i);
    if (vacMatch) {
      const count = parseInt(vacMatch[1] || vacMatch[2], 10);
      if (!isNaN(count) && count > 0) vacanciesCount = count;
    }

    // 4. Extraer Remuneración (Soles)
    let salaryText = "S/. 2,500.00 Soles mensual";
    let salaryMin = 2500;
    let salaryMax = 2500;
    const salMatch = text.match(/(?:S\/\.?|SOLES)\s*([\d,.]+)/i) || text.match(/(?:REMUNERACIÓN|HONORARIOS|SUELDO)\s*[:=]?\s*(?:S\/\.?)?\s*([\d,.]+)/i);
    if (salMatch) {
      const parsedSal = parseFloat(salMatch[1].replace(/,/g, ''));
      if (!isNaN(parsedSal) && parsedSal > 500) {
        salaryMin = parsedSal;
        salaryMax = parsedSal;
        salaryText = `S/. ${parsedSal.toLocaleString('es-PE')}.00 Soles mensual`;
      }
    }

    // 5. Extraer Régimen Laboral
    let sectorType: 'CAS 1057' | 'D.L. 728' | 'D.L. 276' | 'Locación / FAG' | 'Privado' | 'Prácticas' = 'CAS 1057';
    if (/728/i.test(text)) sectorType = 'D.L. 728';
    else if (/276/i.test(text)) sectorType = 'D.L. 276';
    else if (/LOCACI|HONORARIO|FAG/i.test(text)) sectorType = 'Locación / FAG';
    else if (/PR[ÁA]CTICA/i.test(text)) sectorType = 'Prácticas';
    else if (/PRIVAD/i.test(text)) sectorType = 'Privado';

    // 6. Extraer Región
    let region = "Lima";
    const regionsList = [
      "Amazonas", "Ancash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao",
      "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque",
      "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín",
      "Tacna", "Tumbes", "Ucayali", "Nacional"
    ];
    for (const reg of regionsList) {
      if (new RegExp(`\\b${reg}\\b`, 'i').test(text)) {
        region = reg;
        break;
      }
    }

    // 7. Extraer Nivel Educativo
    let educationLevel: 'Secundaria' | 'Técnico' | 'Egresado' | 'Bachiller' | 'Titulado' | 'Maestría / Doctorado' = 'Titulado';
    if (/SECUNDARIA/i.test(text)) educationLevel = 'Secundaria';
    else if (/T[ÉE]CNICO/i.test(text)) educationLevel = 'Técnico';
    else if (/EGRESADO/i.test(text)) educationLevel = 'Egresado';
    else if (/BACHILLER/i.test(text)) educationLevel = 'Bachiller';
    else if (/MAESTR[ÍI]A|DOCTORADO/i.test(text)) educationLevel = 'Maestría / Doctorado';

    // 8. Extraer Fechas
    const today = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
    let endDate = defaultEnd;

    const dateMatch = text.match(/(?:HASTA EL|CIERRE|FECHA L[ÍI]MITE|FINALIZACI[ÓO]N)\s*[:=]?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i);
    if (dateMatch) {
      const parts = dateMatch[1].split(/[\/\.-]/);
      if (parts.length === 3) {
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        let y = parts[2];
        if (y.length === 2) y = '20' + y;
        endDate = `${y}-${m}-${d}`;
      }
    }

    // 9. Extraer Requisitos (bulleteados o por párrafos)
    const requirements: string[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 10);
    lines.forEach(l => {
      if (/^(?:[-*•]|REQUISITO|FORMACI[ÓO]N|EXPERIENCIA|CONOCIMIENTO)/i.test(l) && requirements.length < 5) {
        requirements.push(l.replace(/^[-*•]\s*/, ''));
      }
    });

    if (requirements.length === 0) {
      requirements.push(`Formación profesional acorde a los requerimientos de ${entityName}.`);
      requirements.push("Experiencia laboral comprobada en el sector público o privado.");
      requirements.push("Presentación de Ficha de Postulante y Declaraciones Juradas según bases.");
    }

    const slug = makeSlug(`${entityName}-${title}`);
    const canonical = resolveEntityCanonicalPortal(entityName);
    const realResolved = await resolveRealServirAndEntityBases({
      slug,
      title,
      entityName,
      region,
      applyUrl,
      basesPdfUrl: pdfUrl
    }).catch(() => null);

    const finalApplyUrl = applyUrl || realResolved?.primaryOfficialPageUrl || canonical.url;
    const finalBasesUrl = pdfUrl || realResolved?.directBasesPdfUrl || finalApplyUrl;

    const extractedJob = {
      title,
      slug,
      entity_name: entityName,
      entity_ruc: "20100000000",
      entity_verified: true,
      sector_type: sectorType,
      region,
      category: "Administración y Contabilidad",
      education_level: educationLevel,
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_text: salaryText,
      vacancies_count: vacanciesCount,
      description: `Convocatoria pública oficial publicada por ${entityName}: ${title}. Cobertura en la región de ${region} con ${vacanciesCount} plaza(s) disponibles.`,
      requirements,
      benefits: [
        "Ingreso directo a planilla oficial según régimen laboral especificado.",
        "Aportes a ESSALUD, SCTR y régimen pensionario (AFP/ONP)."
      ],
      apply_url: finalApplyUrl,
      bases_pdf_url: finalBasesUrl,
      official_documents: realResolved?.officialDocuments,
      official_portal_name: realResolved?.primaryOfficialPageName || canonical.portalName,
      start_date: today,
      end_date: endDate,
      featured: true,
      views_count: 100,
      clicks_count: 25,
      status: "Vigente",
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      extractedJob
    });
  } catch (err: any) {
    console.error('Error parsing bases with AI:', err);
    return NextResponse.json({ error: err?.message || 'Error al procesar bases' }, { status: 500 });
  }
}
