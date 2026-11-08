'use client';

import React, { useState, useEffect, useRef } from 'react';
import orgLogos from './org-logos.json';

interface EntityLogoProps {
  entityName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'banner';
}

// Map entity name keywords to locally downloaded official logo files in /public/logos/
const LOCAL_LOGO_MAP: { keywords: string[]; file: string }[] = [
  // Organismos Constitucionales y Electorales
  { keywords: ['ONPE', 'PROCESOS ELECTORALES'], file: '/logos/onpe.jpg' },
  { keywords: ['JNE', 'JURADO NACIONAL'], file: '/logos/jne.jpg' },
  { keywords: ['RENIEC', 'IDENTIFICACIÓN Y ESTADO CIVIL', 'IDENTIFICACION Y ESTADO CIVIL'], file: '/logos/reniec.jpg' },
  { keywords: ['MINISTERIO PÚBLICO', 'MINISTERIO PUBLICO', 'FISCALÍA', 'FISCALIA', 'MPFN'], file: '/logos/ministerio-publico.jpg' },
  { keywords: ['PODER JUDICIAL', 'CORTE SUPERIOR'], file: '/logos/poder-judicial.jpg' },
  { keywords: ['DEFENSORIA DEL PUEBLO', 'DEFENSORÍA DEL PUEBLO', 'DEFENSORIA'], file: '/logos/orgs/th-imagen-DEFENSORIA-DEL-PUEBLO.jpg' },

  // Superintendencias y Reguladores
  { keywords: ['SUNAT', 'TRIBUTARIA', 'ADUANAS'], file: '/logos/sunat.jpg' },
  { keywords: ['SUNAFIL', 'FISCALIZACIÓN LABORAL', 'FISCALIZACION LABORAL'], file: '/logos/sunafil.jpg' },
  { keywords: ['SUSALUD', 'SUPERINTENDENCIA NACIONAL DE SALUD'], file: '/logos/orgs/th-imagen-SUPERINTENDENCIA-NACIONAL-DE-SALUD.jpg' },
  { keywords: ['SMV', 'SUPERINTENDENCIA MERCADO VALORES', 'MERCADO DE VALORES'], file: '/logos/orgs/th-imagen-SUPERINTENDENCIA-DEL-MERCADO-DE-VALORES.jpg' },
  { keywords: ['OSIPTEL', 'TELECOMUNICACIONES'], file: '/logos/osiptel.jpg' },
  { keywords: ['OSINERGMIN', 'ENERGÍA Y MINERÍA', 'ENERGIA Y MINERIA'], file: '/logos/osinergmin.jpg' },
  { keywords: ['OSITRAN', 'INFRAESTRUCTURA DE TRANSPORTE'], file: '/logos/ositran.jpg' },
  { keywords: ['SUNARP', 'REGISTROS PÚBLICOS', 'REGISTROS PUBLICOS'], file: '/logos/sunarp.jpg' },
  { keywords: ['SBS', 'SUPERINTENDENCIA DE BANCA'], file: '/logos/sbs.jpg' },
  { keywords: ['INDECOPI', 'COMPETENCIA Y DE LA PROTECCION'], file: '/logos/indecopi.jpg' },
  { keywords: ['ANIN', 'AUTORIDAD NACIONAL DE INFRAESTRUCTURA', 'INFRAESTRUCTURA'], file: '/logos/anin.jpg' },
  { keywords: ['SENASA', 'SANIDAD AGRARIA'], file: '/logos/senasa.jpg' },
  { keywords: ['SUNASS', 'SANEAMIENTO'], file: '/logos/vivienda.jpg' },

  // Banca, Finanzas y Desarrollo
  { keywords: ['BCRP', 'BANCO CENTRAL DE RESERVA', 'RESERVA DEL PERÚ'], file: '/logos/bcrp.jpg' },
  { keywords: ['BANCO DE LA NACIÓN', 'BANCO DE LA NACION'], file: '/logos/banco-de-la-nacion.svg' },
  { keywords: ['AGROBANCO', 'BANCO AGROPECUARIO'], file: '/logos/agrobanco.jpg' },
  { keywords: ['COFIDE', 'FINANCIERA DE DESARROLLO'], file: '/logos/cofide.jpg' },
  { keywords: ['INTERBANK', 'BANCO INTERNACIONAL DEL PERÚ'], file: '/logos/interbank.svg' },
  { keywords: ['ALICORP'], file: '/logos/alicorp.svg' },
  { keywords: ['SAT LIMA', 'ADMINISTRACIÓN TRIBUTARIA DE LIMA', 'ADMINISTRACION TRIBUTARIA DE LIMA', 'SAT CHICLAYO', 'SAT SULLANA', 'SAT HUANCAYO', 'SAT TRUJILLO', 'SAT'], file: '/logos/sat-lima.jpg' },
  { keywords: ['ELECTROPERU', 'ELECTROPERÚ', 'HIDRANDINA', 'ELECTROSUR', 'SEAL', 'ELECTRO'], file: '/logos/electroperu.jpg' },

  // Salud y Seguridad Social
  { keywords: ['RED DE SALUD VALLE DEL MANTARO', 'MANTARO'], file: '/logos/red-salud-mantaro.jpg' },
  { keywords: ['ESSALUD', 'SEGURO SOCIAL DE SALUD'], file: '/logos/essalud.jpg' },
  { keywords: ['MINSA', 'MINISTERIO DE SALUD', 'DIRESA', 'SALUD', 'HOSPITAL', 'RED DE SALUD', 'DIRIS'], file: '/logos/minsa.jpg' },

  // Ministerios y Programas del Estado
  { keywords: ['PRONIED', 'INFRAESTRUCTURA EDUCATIVA'], file: '/logos/orgs/th-imagen-PROGRAMA-NACIONAL-DE-INFRAESTRUCTURA-EDUCATIVA.jpg' },
  { keywords: ['MINEDU', 'MINISTERIO DE EDUCACIÓN', 'MINISTERIO DE EDUCACION', 'UGEL', 'DRE'], file: '/logos/minedu.jpg' },
  { keywords: ['AGROMERCADO'], file: '/logos/orgs/th-imagen-AGROMERCADO.jpg' },
  { keywords: ['MEF', 'MINISTERIO DE ECONOMÍA', 'MINISTERIO DE ECONOMIA'], file: '/logos/mef.jpg' },
  { keywords: ['PROGRAMA NACIONAL PAIS', 'PROGRAMA PAIS', 'PLATAFORMAS DE ACCIÓN PARA LA INCLUSIÓN SOCIAL', 'PAIS'], file: '/logos/programa-pais.jpg' },
  { keywords: ['PROGRAMA NACIONAL DE APOYO DIRECTO A LOS MAS POBRES', 'PROGRAMA JUNTOS', 'JUNTOS', 'PNADP'], file: '/logos/programa-juntos.jpg' },
  { keywords: ['CUNA MÁS', 'CUNAMAS', 'PROGRAMA NACIONAL CUNA MAS', 'PNCM'], file: '/logos/cunamas.jpg' },
  { keywords: ['CONTIGO', 'PROGRAMA NACIONAL CONTIGO'], file: '/logos/orgs/th-imagen-PROGRAMA-NACIONAL-CONTIGO.jpg' },
  { keywords: ['MIDIS', 'DESARROLLO E INCLUSIÓN SOCIAL', 'DESARROLLO E INCLUSION SOCIAL', 'PENSION 65', 'QALI WARMA'], file: '/logos/midis.jpg' },
  { keywords: ['JOVENES PRODUCTIVOS', 'JÓVENES PRODUCTIVOS', 'EMPLEO JUVENIL'], file: '/logos/orgs/th-imagen-PROGRAMA-NACIONAL-DE-EMPLEO-JUVENIL-JOVENES-PRODUCTIVOS.jpg' },
  { keywords: ['IIAP', 'INVESTIGACIONES AMAZONIA', 'AMAZONÍA', 'AMAZONIA', 'MINAM', 'MINISTERIO DEL AMBIENTE', 'OEFA', 'SERNANP'], file: '/logos/minam.jpg' },
  { keywords: ['MINEM', 'MINISTERIO DE ENERGÍA Y MINAS', 'MINISTERIO DE ENERGIA Y MINAS', 'MINAS'], file: '/logos/minem.jpg' },
  { keywords: ['MINDEF', 'MINISTERIO DE DEFENSA', 'EJÉRCITO', 'EJERCITO', 'FUERZA AÉREA'], file: '/logos/mindef.jpg' },
  { keywords: ['MINCETUR', 'COMERCIO EXTERIOR Y TURISMO', 'TURISMO'], file: '/logos/mincetur.jpg' },
  { keywords: ['PRODUCE', 'MINISTERIO DE LA PRODUCCIÓN', 'MINISTERIO DE LA PRODUCCION', 'SANIPES'], file: '/logos/produce.jpg' },
  { keywords: ['RREE', 'RELACIONES EXTERIORES', 'CANCILLERÍA', 'CANCILLERIA'], file: '/logos/rree.jpg' },
  { keywords: ['MTPE', 'TRABAJO Y PROMOCIÓN DEL EMPLEO', 'TRABAJO Y PROMOCION DEL EMPLEO'], file: '/logos/mtpe.jpg' },
  { keywords: ['VIVIENDA', 'MINISTERIO DE VIVIENDA', 'CONSTRUCCIÓN Y SANEAMIENTO', 'VIVIENDA RURAL', 'AGUA TUMBES', 'SEDAPAL', 'OTASS'], file: '/logos/vivienda.jpg' },
  { keywords: ['MININTER', 'MINISTERIO DEL INTERIOR', 'POLICÍA NACIONAL', 'POLICIA NACIONAL', 'BOMBEROS', 'INTENDENCIA NACIONAL DE BOMBEROS', 'MIGRACIONES', 'SUCAMEC'], file: '/logos/mininter.jpg' },
  { keywords: ['CUNA MÁS', 'CUNAMAS', 'PROGRAMA NACIONAL CUNA MAS'], file: '/logos/cunamas.jpg' },
  { keywords: ['PROVIAS', 'PROVÍAS', 'IVP', 'VIAL PROVINCIAL', 'SUTRAN', 'ATU'], file: '/logos/provias.jpg' },
  { keywords: ['INDECI', 'DEFENSA CIVIL', 'CENEPRED'], file: '/logos/indeci.jpg' },
  { keywords: ['DEVIDA', 'VIDA SIN DROGAS'], file: '/logos/devida.jpg' },
  { keywords: ['IPD', 'INSTITUTO PERUANO DEL DEPORTE'], file: '/logos/ipd.jpg' },
  { keywords: ['INABIF', 'BIENESTAR FAMILIAR'], file: '/logos/inabif.jpg' },
  { keywords: ['INEI', 'ESTADÍSTICA E INFORMÁTICA', 'ESTADISTICA'], file: '/logos/inei.jpg' },
  { keywords: ['PRONABEC', 'BECAS Y CRÉDITO', 'BECAS Y CREDITO'], file: '/logos/pronabec.jpg' },
  { keywords: ['SENCICO', 'INDUSTRIA DE LA CONSTRUCCIÓN'], file: '/logos/sencico.jpg' },
  { keywords: ['SINEACE'], file: '/logos/sineace.jpg' },
  { keywords: ['IGP', 'INSTITUTO GEOFÍSICO', 'INSTITUTO GEOFISICO'], file: '/logos/igp.jpg' },
  { keywords: ['INGEMMET'], file: '/logos/ingemmet.jpg' },
  { keywords: ['MARINA DE GUERRA', 'MARINA'], file: '/logos/marina.jpg' },
  { keywords: ['ZOFRATACNA'], file: '/logos/zofratacna.jpg' },
  { keywords: ['CENTRO VACACIONAL HUAMPANI', 'HUAMPANI', 'HUAMPANÍ'], file: '/logos/orgs/th-CENTRO-VACACIONAL-HUAMPANI.jpg' },
  { keywords: ['IMA CUSCO', 'MANEJO DE AGUA Y MEDIO AMBIENTE', 'INSTITUTO DE MANEJO DE AGUA'], file: '/logos/orgs/th-imagen-INSTITUTO-DE-MANEJO-DE-AGUA-Y-MEDIO-AMBIENTE-IMA-CUSCO.jpg' },

  // Organismos Especiales de Conservación y Recursos Forestales
  { keywords: ['SERFOR', 'SERVICIO NACIONAL FORESTAL', 'FORESTAL Y DE FAUNA SILVESTRE'], file: '/logos/orgs/th-imagen-SERVICIO-NACIONAL-FORESTAL-Y-DE-FAUNA-SILVESTRE.jpg' },
  { keywords: ['OSINFOR', 'ORGANISMO DE SUPERVISION DE LOS RECURSOS FORESTALES', 'ORGANISMO DE SUPERVISIÓN DE LOS RECURSOS FORESTALES', 'SUPERVISION DE LOS RECURSOS FORESTALES', 'SUPERVISIÓN DE LOS RECURSOS FORESTALES'], file: '/logos/orgs/th-imagen-ORGANISMO-SUPERVISOR-DE-INVERSION-DE-LOS-RECURSOS-FORESTALES-Y-DE-FAUNA-SILVESTRE.jpg' },

  // Universidades Públicas Oficiales del Perú
  { keywords: ['UNAJMA', 'JOSE MARIA ARGUEDAS', 'JOSÉ MARÍA ARGUEDAS'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-JOSE-MARIA-ARGUEDAS.jpg' },
  { keywords: ['UNJFSC', 'JOSE FAUSTINO', 'JOSÉ FAUSTINO', 'SANCHEZ CARRION', 'SÁNCHEZ CARRIÓN'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-JOSE-FAUSTINO-SANCHEZ-CARRION.jpg' },
  { keywords: ['UNDAC', 'DANIEL ALCIDES CARRION', 'DANIEL ALCIDES CARRIÓN'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DANIEL-ALCIDES-CARRION-UNDAC.jpg' },
  { keywords: ['UNIQ', 'QUILLABAMBA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-INTERCULTURAL-DE-QUILLABAMBA.jpg' },
  { keywords: ['UNAS', 'AGRARIA DE LA SELVA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-AGRARIA-DE-LA-SELVA.jpg' },
  { keywords: ['UNCAR', 'CARABAYA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-CARABAYA-UNCAR.jpg' },
  { keywords: ['UNH', 'UNIVERSIDAD DE HUANCAVELICA', 'UNIVERSIDAD NACIONAL DE HUANCAVELICA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-HUANCAVELICA.jpg' },
  { keywords: ['UNAM', 'UNIVERSIDAD DE MOQUEGUA', 'UNIVERSIDAD NACIONAL DE MOQUEGUA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-MOQUEGUA.jpg' },
  { keywords: ['UNM', 'UNIVERSIDAD NACIONAL DE MUSICA', 'UNIVERSIDAD NACIONAL DE MÚSICA', 'UNIVERSIDAD DE MUSICA', 'UNIVERSIDAD DE MÚSICA', 'CONSERVATORIO NACIONAL DE MUSICA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-MUSICA.jpg' },
  { keywords: ['UNT', 'UNIVERSIDAD DE TRUJILLO', 'UNIVERSIDAD NACIONAL DE TRUJILLO'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-TRUJILLO.jpg' },
  { keywords: ['UNFV', 'FEDERICO VILLARREAL'], file: '/logos/unfv.jpg' },
  { keywords: ['UNSCH', 'SAN CRISTOBAL DE HUAMANGA', 'SAN CRISTÓBAL DE HUAMANGA', 'HUAMANGA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-SAN-CRISTOBAL-DE-HUAMANGA.jpg' },
  { keywords: ['UNICA', 'SAN LUIS GONZAGA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-SAN-LUIS-GONZAGA.jpg' },
  { keywords: ['UNAMBA', 'MICAELA BASTIDAS'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-MICAELA-BASTIDAS-DE-APURIMAC.jpg' },
  { keywords: ['UNSM', 'SAN MARTIN TARAPOTO', 'UNIVERSIDAD DE SAN MARTIN', 'UNIVERSIDAD DE SAN MARTÍN', 'UNIVERSIDAD NACIONAL DE SAN MARTIN'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-SAN-MARTIN-TARAPOTO.jpg' },
  { keywords: ['UNMSM', 'SAN MARCOS', 'MAYOR DE SAN MARCOS'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-MAYOR-DE-SAN-MARCOS.jpg' },
  { keywords: ['UNI', 'NACIONAL DE INGENIERIA', 'NACIONAL DE INGENIERÍA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-INGENIERIA.jpg' },
  { keywords: ['UNALM', 'AGRARIA LA MOLINA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-AGRARIA-LA-MOLINA.jpg' },
  { keywords: ['UNSA', 'SAN AGUSTIN DE AREQUIPA', 'SAN AGUSTÍN DE AREQUIPA', 'SAN AGUSTIN', 'SAN AGUSTÍN'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-SAN-AGUSTIN-DE-AREQUIPA.jpg' },
  { keywords: ['UNCP', 'CENTRO DEL PERU', 'CENTRO DEL PERÚ'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DEL-CENTRO-DEL-PERU.jpg' },
  { keywords: ['UNP', 'UNIVERSIDAD NACIONAL DE PIURA', 'UNIVERSIDAD DE PIURA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-PIURA.jpg' },
  { keywords: ['UNHEVAL', 'HERMILIO VALDIZAN', 'HERMILIO VALDIZÁN'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-HERMILIO-VALDIZAN.jpg' },
  { keywords: ['UNJBG', 'JORGE BASADRE'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-JORGE-BASADRE-GROHMANN.jpg' },
  { keywords: ['UNPRG', 'PEDRO RUIZ GALLO'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-PEDRO-RUIZ-GALLO.jpg' },
  { keywords: ['UNAC', 'UNIVERSIDAD DEL CALLAO', 'UNIVERSIDAD NACIONAL DEL CALLAO'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DEL-CALLAO.jpg' },
  { keywords: ['UNACH', 'AUTONOMA DE CHOTA', 'AUTÓNOMA DE CHOTA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-AUTONOMA-DE-CHOTA.jpg' },
  { keywords: ['UNAH', 'AUTONOMA DE HUANTA', 'AUTÓNOMA DE HUANTA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-AUTONOMA-DE-HUANTA.jpg' },
  { keywords: ['UNCIRO', 'CIRO ALEGRIA', 'CIRO ALEGRÍA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-CIRO-ALEGRIA.jpg' },
  { keywords: ['UNDAR', 'DANIEL ALOMIA ROBLES', 'DANIEL ALOMÍA ROBLES'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DANIEL-ALOMIA-ROBLES.jpg' },
  { keywords: ['UNBA', 'UNIVERSIDAD DE BARRANCA', 'UNIVERSIDAD NACIONAL DE BARRANCA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-BARRANCA.jpg' },
  { keywords: ['UNJ', 'UNIVERSIDAD DE JAEN', 'UNIVERSIDAD NACIONAL DE JAEN', 'UNIVERSIDAD DE JAÉN'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-JAEN.jpg' },
  { keywords: ['UNC', 'UNIVERSIDAD DE CAJAMARCA', 'UNIVERSIDAD NACIONAL DE CAJAMARCA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-DE-CAJAMARCA.jpg' },
  { keywords: ['UNTRM', 'TORIBIO RODRIGUEZ DE MENDOZA', 'TORIBIO RODRÍGUEZ DE MENDOZA'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-TORIBIO-RODRIGUEZ-DE-MENDOZA-DE-AMAZONAS.jpg' },
  { keywords: ['ALTO AMAZONAS', 'AUTONOMA DE ALTO AMAZONAS', 'AUTÓNOMA DE ALTO AMAZONAS'], file: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-AUTONOMA-DE-ALTO-AMAZONAS.jpg' },

  // Municipalidades Principales y Distritales
  { keywords: ['TAMBURCO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-TAMBURCO.jpg' },
  { keywords: ['YANATILE'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-DE-YANATILE.jpg' },
  { keywords: ['OLLANTAYTAMBO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-DE-OLLANTAYTAMBO.jpg' },
  { keywords: ['UCHUMAYO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-DE-UCHUMAYO.jpg' },
  { keywords: ['CHACLACAYO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DE-CHACLACAYO.jpg' },
  { keywords: ['SAN MARTÍN DE PORRES', 'SAN MARTIN DE PORRES'], file: '/logos/san-martin-de-porres.png' },
  { keywords: ['MUNICIPALIDAD PROVINCIAL DEL CUSCO', 'MUNICIPALIDAD DEL CUSCO'], file: '/logos/cusco.jpg' },
  { keywords: ['MUNICIPALIDAD METROPOLITANA DE LIMA', 'MUNICIPALIDAD DE LIMA', 'MUNILIMA'], file: '/logos/lima.jpg' },
  { keywords: ['MUNICIPALIDAD DE SANTIAGO DE SURCO', 'MUNICIPALIDAD DE SURCO'], file: '/logos/surco.jpg' },
  { keywords: ['MUNICIPALIDAD DE JESÚS MARÍA', 'MUNICIPALIDAD DE JESUS MARIA'], file: '/logos/jesus-maria.jpg' },
  { keywords: ['MUNICIPALIDAD DE LA VICTORIA'], file: '/logos/la-victoria.jpg' },
  { keywords: ['MUNICIPALIDAD DE SURQUILLO'], file: '/logos/surquillo.jpg' },
  { keywords: ['MUNICIPALIDAD DE LA MOLINA'], file: '/logos/la-molina.jpg' },
  { keywords: ['MUNICIPALIDAD DE SAN MIGUEL'], file: '/logos/san-miguel.jpg' },

  // Gobiernos Regionales Específicos
  { keywords: ['GOBIERNO REGIONAL CUSCO', 'GOBIERNO REGIONAL DEL CUSCO', 'GORE CUSCO'], file: '/logos/gore-cusco.jpg' },
  { keywords: ['GOBIERNO REGIONAL DE AREQUIPA', 'GORE AREQUIPA'], file: '/logos/gore-arequipa.jpg' },
  { keywords: ['GOBIERNO REGIONAL DEL CALLAO', 'GORE CALLAO'], file: '/logos/callao.jpg' },
  { keywords: ['GOBIERNO REGIONAL DE AYACUCHO', 'GORE AYACUCHO'], file: '/logos/ayacucho.jpg' },
  { keywords: ['GOBIERNO REGIONAL MOQUEGUA', 'GOBIERNO REGIONAL DE MOQUEGUA', 'GORE MOQUEGUA'], file: '/logos/moquegua.jpg' },
];

function normalize(str: string): string {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchKeyword(upper: string, tokens: string[], k: string): boolean {
  const normK = normalize(k);
  if (!normK) return false;

  if (upper === normK) return true;

  if (normK.includes(' ')) {
    return upper.includes(normK);
  }

  return tokens.includes(normK);
}

function findLocalLogo(entityName: string): string | null {
  const upper = normalize(entityName);
  const tokens = upper.split(' ');

  // 1. Direct and curated logos from LOCAL_LOGO_MAP (Universities, Forestry, Regulators, Ministries)
  for (const entry of LOCAL_LOGO_MAP) {
    if (entry.keywords.some(k => matchKeyword(upper, tokens, k))) {
      return entry.file;
    }
  }

  // 2. Exact or distinctive fuzzy match against all 336 downloaded institutional logos
  for (const org of orgLogos) {
    const orgNorm = normalize(org.name);
    if (upper === orgNorm || upper.includes(orgNorm) || orgNorm.includes(upper)) {
      return org.file;
    }

    if (org.keywords && org.keywords.some((k: string) => matchKeyword(upper, tokens, k))) {
      return org.file;
    }

    // Match distinctive entity name tokens (excluding generic administrative words)
    const words = orgNorm.split(' ').filter(w => w.length >= 4 && !['MUNICIPALIDAD', 'DISTRITAL', 'PROVINCIAL', 'GOBIERNO', 'REGIONAL', 'UNIVERSIDAD', 'NACIONAL', 'PARA', 'LIMA', 'PERU', 'SEDE'].includes(w));
    if (words.length >= 2 && words.every(w => tokens.includes(w) || upper.includes(w))) {
      return org.file;
    }
  }

  // 3. Sector matching for regional directorates and public networks
  if (tokens.includes('HOSPITAL') || tokens.includes('DIRESA') || tokens.includes('DIRIS')) {
    return '/logos/minsa.jpg';
  }
  if (tokens.includes('UGEL') || tokens.includes('DRE') || upper.includes('INSTITUTO PEDAGOGICO')) {
    return '/logos/minedu.jpg';
  }
  if (upper.includes('MINISTERIO PUBLICO') || tokens.includes('FISCALIA')) {
    return '/logos/ministerio-publico.jpg';
  }
  if (upper.includes('PODER JUDICIAL') || upper.includes('CORTE SUPERIOR') || tokens.includes('JUZGADO')) {
    return '/logos/poder-judicial.jpg';
  }
  if (upper.includes('POLICIA NACIONAL') || tokens.includes('MIGRACIONES')) {
    return '/logos/mininter.jpg';
  }

  return null;
}

export function EntityLogo({ entityName, logoUrl, size = 'banner' }: EntityLogoProps) {
  const [imgErr, setImgErr] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset error if entity or logoUrl props change
  useEffect(() => {
    setImgErr(false);
  }, [entityName, logoUrl]);

  const handleImgError = () => {
    if (isMountedRef.current) {
      setImgErr(true);
    } else {
      setTimeout(() => {
        if (isMountedRef.current) {
          setImgErr(true);
        }
      }, 50);
    }
  };

  // Priority 1: Locally downloaded curated logo from /public/logos/
  const localLogo = findLocalLogo(entityName);
  
  // Priority 2: Clean custom logoUrl (allow Base64 data URLs, domain favicons, or direct image links)
  const safeScrapedLogo = (
    logoUrl && 
    !logoUrl.includes('convocatoriasdetrabajo.com') && 
    !logoUrl.includes('portaltrabajos.pe') && 
    !logoUrl.includes('blogspot.com')
  ) ? logoUrl : null;

  // Prioritize explicitly uploaded or captured logo if available
  const hasCustomUpload = Boolean(
    safeScrapedLogo && (
      safeScrapedLogo.startsWith('data:image/') ||
      safeScrapedLogo.startsWith('blob:') ||
      safeScrapedLogo.includes('favicons') ||
      safeScrapedLogo.includes('google.com/s2') ||
      !localLogo
    )
  );

  const imageSrc = !imgErr
    ? (hasCustomUpload ? safeScrapedLogo : (localLogo || safeScrapedLogo))
    : null;

  const isBanner = size === 'banner';
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-lg p-1 shrink-0',
    md: 'w-16 h-16 rounded-xl p-1.5 shrink-0',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-2.5 shrink-0',
    banner: 'w-full h-28 sm:h-32 rounded-xl p-3 sm:p-4',
  }[size];

  if (imageSrc) {
    return (
      <div className={`${sizeClasses} bg-white flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
        <img
          src={imageSrc}
          alt={entityName}
          width={isBanner ? 200 : 96}
          height={isBanner ? 80 : 96}
          loading="lazy"
          className={`${isBanner ? 'max-h-20 sm:max-h-24 max-w-[88%]' : 'w-full h-full'} object-contain drop-shadow`}
          onError={handleImgError}
        />
      </div>
    );
  }

  // Fallback Institucional de Alta Distinción con Escudo Nacional Oficial del Perú (Vector 220KB)
  const isMuni = /MUNICIPALIDAD/i.test(entityName);
  const isGore = /GOBIERNO REGIONAL|GORE/i.test(entityName);
  const isUniv = /UNIVERSIDAD/i.test(entityName);
  const entityBadge = isMuni ? 'GOBIERNO LOCAL' : isGore ? 'GOBIERNO REGIONAL' : isUniv ? 'UNIVERSIDAD PÚBLICA' : 'ESTADO PERUANO';

  if (!isBanner) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-b from-white to-slate-100 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden shrink-0`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
        <img
          src="/logos/escudo-nacional-peru.svg"
          alt="Escudo Nacional del Perú"
          width={96}
          height={96}
          loading="lazy"
          className="w-full h-full object-contain p-1 drop-shadow"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-b from-white via-slate-50 to-slate-100 p-3 sm:p-4 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600 shadow-sm" />
      <div className="absolute top-2 left-3 bg-red-700 text-white font-extrabold font-mono text-[9px] px-2 py-0.5 rounded shadow">
        {entityBadge}
      </div>
      
      <div className="flex items-center gap-3 max-w-full px-1 mt-1.5">
        {/* Escudo Nacional del Perú Oficial en Alta Definición */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-white border border-slate-200/90 p-1 shadow-sm flex items-center justify-center">
          <img
            src="/logos/escudo-nacional-peru.svg"
            alt="Escudo Nacional del Perú"
            className="w-full h-full object-contain drop-shadow"
          />
        </div>

        <div className="min-w-0">
          <span className="text-xs font-black font-display text-slate-900 block leading-snug uppercase line-clamp-2 tracking-tight">
            {entityName}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[9.5px] font-mono font-bold text-emerald-800 uppercase tracking-tight block">
              CONVOCATORIA OFICIAL VERIFICADA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
