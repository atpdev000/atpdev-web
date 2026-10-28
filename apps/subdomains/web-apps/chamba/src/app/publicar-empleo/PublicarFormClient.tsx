'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Clock,
  Check,
  Plus,
  Minus,
  Search,
  ArrowRight,
  Info,
  X,
  FileCheck2,
  BookmarkCheck,
  ChevronRight,
  Zap,
  Globe,
  Upload,
  Image as ImageIcon,
  Trash2,
  Link2
} from 'lucide-react';

const REGIONES_PERU = [
  'Nacional / Remoto',
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali'
];

const CATEGORIAS_EMPLEO = [
  'Administración y Gestión Pública',
  'Tecnología e Informática',
  'Salud y Medicina',
  'Educación y Docencia',
  'Derecho y Asesoría Legal',
  'Contabilidad y Finanzas',
  'Ingeniería y Construcción',
  'Atención al Ciudadano y Operativo',
  'Logística y Contrataciones del Estado',
  'Seguridad y Vigilancia',
  'Servicios Generales y Mantenimiento',
  'Otro'
];

const REGIMENES = [
  'CAS 1057',
  'D.L. 728',
  'D.L. 276',
  'Locación / FAG',
  'Prácticas',
  'Privado'
];

export function extractLogoFromDomain(urlOrDomain: string): string | null {
  try {
    if (!urlOrDomain) return null;
    const clean = urlOrDomain.trim();
    const withProtocol = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
    const parsed = new URL(withProtocol);
    const domain = parsed.hostname.replace(/^www\./, '');
    if (!domain || !domain.includes('.')) return null;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

const POPULAR_ENTITIES = [
  { name: 'MINSA - MINISTERIO DE SALUD', short: 'MINSA', ruc: '20131373237', portal: 'https://www.gob.pe/minsa', sector: 'CAS 1057', region: 'Lima', category: 'Salud y Medicina' },
  { name: 'MEF - MINISTERIO DE ECONOMÍA Y FINANZAS', short: 'MEF', ruc: '20131370645', portal: 'https://www.mef.gob.pe/convocatorias', sector: 'CAS 1057', region: 'Lima', category: 'Contabilidad y Finanzas' },
  { name: 'SUNAT - SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA', short: 'SUNAT', ruc: '20131312955', portal: 'https://unete.sunat.gob.pe', sector: 'CAS 1057', region: 'Lima', category: 'Administración y Gestión Pública' },
  { name: 'ESSALUD - SEGURO SOCIAL DE SALUD', short: 'ESSALUD', ruc: '20131257750', portal: 'https://convocatorias.essalud.gob.pe', sector: 'D.L. 728', region: 'Lima', category: 'Salud y Medicina' },
  { name: 'PODER JUDICIAL DEL PERÚ', short: 'PJ', ruc: '20154563198', portal: 'https://concursopublico.pj.gob.pe', sector: 'D.L. 728', region: 'Lima', category: 'Derecho y Asesoría Legal' },
  { name: 'MINEDU - MINISTERIO DE EDUCACIÓN', short: 'MINEDU', ruc: '20131310961', portal: 'https://postulacioncas.minedu.gob.pe/PostulacionCas/', sector: 'CAS 1057', region: 'Lima', category: 'Educación y Docencia' },
  { name: 'ONPE - OFICINA NACIONAL DE PROCESOS ELECTORALES', short: 'ONPE', ruc: '20291981870', portal: 'https://reclutamiento.onpe.gob.pe/convocatorias', sector: 'Locación / FAG', region: 'Nacional / Remoto', category: 'Administración y Gestión Pública' },
  { name: 'RENIEC - REGISTRO NACIONAL DE IDENTIFICACIÓN Y ESTADO CIVIL', short: 'RENIEC', ruc: '20295613620', portal: 'https://www.reniec.gob.pe/portal/convocatorias.htm', sector: 'CAS 1057', region: 'Lima', category: 'Atención al Ciudadano y Operativo' },
  { name: 'MTC - MINISTERIO DE TRANSPORTES Y COMUNICACIONES', short: 'MTC', ruc: '20131378387', portal: 'https://portal.mtc.gob.pe/convocatorias', sector: 'CAS 1057', region: 'Lima', category: 'Ingeniería y Construcción' },
  { name: 'MUNICIPALIDAD METROPOLITANA DE LIMA', short: 'MUNI LIMA', ruc: '20131380951', portal: 'https://www.munlima.gob.pe/convocatorias', sector: 'CAS 1057', region: 'Lima', category: 'Administración y Gestión Pública' },
  { name: 'CONTRALORÍA GENERAL DE LA REPÚBLICA', short: 'CONTRALORÍA', ruc: '20131378972', portal: 'https://www.contraloria.gob.pe/convocatorias', sector: 'D.L. 728', region: 'Lima', category: 'Administración y Gestión Pública' },
  { name: 'INEI - INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA', short: 'INEI', ruc: '20131369981', portal: 'https://uneteservicios.inei.gob.pe', sector: 'Locación / FAG', region: 'Nacional / Remoto', category: 'Administración y Gestión Pública' },
  { name: 'INTERBANK - BANCO INTERNACIONAL DEL PERÚ', short: 'INTERBANK', ruc: '20100053455', portal: 'https://interbank.pe/trabaja-con-nosotros', sector: 'Privado', region: 'Lima', category: 'Contabilidad y Finanzas' },
  { name: 'BANCO DE CRÉDITO DEL PERÚ (BCP)', short: 'BCP', ruc: '20100047218', portal: 'https://www.viabcp.com/trabaja-en-el-bcp', sector: 'Privado', region: 'Lima', category: 'Contabilidad y Finanzas' }
];

const QUICK_SALARIES = [
  'S/ 2,500.00 soles',
  'S/ 3,500.00 soles',
  'S/ 4,500.00 soles',
  'S/ 6,000.00 soles',
  'S/ 8,500.00 soles',
  'S/ 12,000.00 soles',
  'A convenir / Según bases'
];

const REQUIREMENTS_TEMPLATES = [
  {
    label: 'Plantilla CAS Profesional',
    badge: 'Profesional',
    content: `- Título Universitario en la carrera requerida, con colegiatura y habilitación profesional vigente.
- Experiencia laboral general mínima de tres (03) años en el sector público o privado.
- Experiencia laboral específica mínima de dos (02) años desempeñando funciones equivalentes en el sector público.
- Conocimientos acreditados en Gestión Pública, Contrataciones del Estado o Sistemas Administrativos.
- Dominio de herramientas ofimáticas (Word, Excel) a nivel intermedio.
- No tener inhabilitación vigente para contratar con el Estado ni antecedentes penales.`
  },
  {
    label: 'Plantilla Técnico / Asistente',
    badge: 'Técnico',
    content: `- Egresado o Titulado Técnico Superior en Administración, Contabilidad, Computación o afines.
- Experiencia laboral general mínima de un (01) año en funciones de soporte administrativo o atención al público.
- Experiencia específica mínima de seis (06) meses en entidades del sector público (deseable).
- Manejo de archivo documentario, redacción oficial y correo institucional.
- Disponibilidad inmediata para trabajo presencial.`
  },
  {
    label: 'Plantilla Especialista / Directivo',
    badge: 'Especialista',
    content: `- Título Profesional Universitario con Grado de Maestría o Especialización acreditada (mínimo 90 horas lectivas).
- Experiencia general mínima de cinco (05) años en el ejercicio de la profesión.
- Experiencia específica mínima de tres (03) años como Especialista, Coordinador o Responsable en el Estado.
- Certificación del OSCE vigente (para puestos de Logística/Abastecimiento).
- Capacidad de liderazgo, toma de decisiones y articulación interinstitucional.`
  },
  {
    label: 'Plantilla Tecnología / TI',
    badge: 'TI / Sistemas',
    content: `- Bachiller o Titulado en Ingeniería de Sistemas, Informática, Software o carreras afines.
- Experiencia profesional mínima de dos (02) años en desarrollo, soporte o infraestructura tecnológica.
- Experiencia en bases de datos relacionales, metodologías ágiles o administración de plataformas web.
- Conocimientos de interoperabilidad y seguridad de la información gubernamental.`
  }
];

const TITLE_PREFIXES = [
  'CAS N° 001-2026: ',
  'Especialista en ',
  'Analista de ',
  'Asistente Administrativo en ',
  'Coordinador de ',
  'Auditor en ',
  'Médico General / '
];

interface FormErrors {
  entity_name?: string;
  entity_ruc?: string;
  title?: string;
  salary_text?: string;
  vacancies_count?: string;
  apply_url?: string;
  end_date?: string;
  contact_email?: string;
  contact_phone?: string;
}

const FIELD_LABELS: Record<keyof FormErrors, string> = {
  entity_name: 'Nombre Oficial de la Entidad',
  entity_ruc: 'RUC de la Entidad (11 dígitos)',
  title: 'Título del Puesto / Código de Proceso',
  salary_text: 'Remuneración Mensual',
  vacancies_count: 'Número de Vacantes',
  apply_url: 'Portal Oficial de Postulación (URL)',
  end_date: 'Fecha Límite de Postulación',
  contact_email: 'Correo Institucional de Contacto',
  contact_phone: 'Teléfono / Central Telefónica'
};

export default function PublicarFormClient() {
  const [formData, setFormData] = useState({
    entity_name: '',
    entity_ruc: '',
    sector_type: 'CAS 1057',
    is_public_entity: true,
    title: '',
    vacancies_count: 1,
    salary_text: '',
    education_level: 'Titulado',
    region: 'Lima',
    category: 'Administración y Gestión Pública',
    bases_pdf_url: '',
    apply_url: '',
    entity_logo: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    requirements: '',
    description: '',
    contact_email: '',
    contact_phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ jobId: string; slug: string } | null>(null);

  // Estados de Logo y Afiche de Convocatoria
  const [logoSourceMode, setLogoSourceMode] = useState<'upload' | 'web' | 'url'>('upload');
  const [customWebDomain, setCustomWebDomain] = useState('');
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Validación Pro y Feedback Visual
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Autocompletado de entidades
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función de Validación Rigurosa por Campo
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'entity_name':
        if (!value || !value.trim()) return 'El nombre de la entidad o institución es obligatorio.';
        if (value.trim().length < 3) return 'Debe ingresar al menos 3 caracteres del nombre institucional.';
        return undefined;

      case 'entity_ruc':
        if (!value || !value.trim()) return undefined; // RUC opcional pero si se ingresa debe ser 100% válido
        const cleanRuc = String(value).replace(/\D/g, '');
        if (cleanRuc.length !== 11) return 'El RUC debe tener exactamente 11 dígitos numéricos.';
        if (!cleanRuc.startsWith('10') && !cleanRuc.startsWith('20') && !cleanRuc.startsWith('15') && !cleanRuc.startsWith('17')) {
          return 'El RUC debe iniciar con 10 o 20 (criterio oficial SUNAT).';
        }
        return undefined;

      case 'title':
        if (!value || !value.trim()) return 'El título del puesto o código de convocatoria es obligatorio.';
        if (value.trim().length < 5) return 'Ingrese un título descriptivo (mínimo 5 caracteres).';
        return undefined;

      case 'salary_text':
        if (!value || !value.trim()) return 'Debe indicar la remuneración mensual o especificar "A convenir".';
        return undefined;

      case 'vacancies_count':
        if (!value || Number(value) < 1) return 'Debe especificar al menos 1 vacante.';
        return undefined;

      case 'apply_url':
        if (!value || !value.trim()) return 'El enlace al portal oficial de postulación o mesa de partes es obligatorio.';
        const trimmedUrl = String(value).trim().toLowerCase();
        if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
          return 'El enlace debe iniciar con https:// o http://';
        }
        if (
          trimmedUrl.includes('computrabajo.com') ||
          trimmedUrl.includes('bumeran.com') ||
          trimmedUrl.includes('convocatoriasdetrabajo.com') ||
          trimmedUrl.includes('portaltrabajos.com')
        ) {
          return 'No se permiten agregadores externos. Debe ser el portal o sistema oficial de la entidad.';
        }
        return undefined;

      case 'end_date':
        if (!value) return 'La fecha límite de postulación es obligatoria.';
        const today = new Date().toISOString().split('T')[0];
        if (value < today) return 'La fecha límite no puede ser anterior al día de hoy.';
        return undefined;

      case 'contact_email':
        if (value && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) return 'Ingrese un correo electrónico válido (ej: rrhh@entidad.gob.pe).';
        }
        return undefined;

      case 'contact_phone':
        if (value && value.trim()) {
          const cleanPhone = String(value).replace(/\D/g, '');
          if (cleanPhone.length < 7) return 'Ingrese un número de teléfono o celular válido (mínimo 7 dígitos).';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): FormErrors => {
    const errors: FormErrors = {};
    const eName = validateField('entity_name', formData.entity_name);
    if (eName) errors.entity_name = eName;

    const eRuc = validateField('entity_ruc', formData.entity_ruc);
    if (eRuc) errors.entity_ruc = eRuc;

    const eTitle = validateField('title', formData.title);
    if (eTitle) errors.title = eTitle;

    const eSalary = validateField('salary_text', formData.salary_text);
    if (eSalary) errors.salary_text = eSalary;

    const eVacancies = validateField('vacancies_count', formData.vacancies_count);
    if (eVacancies) errors.vacancies_count = eVacancies;

    const eApply = validateField('apply_url', formData.apply_url);
    if (eApply) errors.apply_url = eApply;

    const eEndDate = validateField('end_date', formData.end_date);
    if (eEndDate) errors.end_date = eEndDate;

    const eEmail = validateField('contact_email', formData.contact_email);
    if (eEmail) errors.contact_email = eEmail;

    const ePhone = validateField('contact_phone', formData.contact_phone);
    if (ePhone) errors.contact_phone = ePhone;

    return errors;
  };

  // Cálculo de Porcentaje de Completitud Inteligente
  const calculateProgress = () => {
    const mandatoryFields = [
      Boolean(formData.entity_name.trim() && formData.entity_name.trim().length >= 3),
      Boolean(!formData.entity_ruc || (formData.entity_ruc.length === 11 && !validateField('entity_ruc', formData.entity_ruc))),
      Boolean(formData.title.trim() && formData.title.trim().length >= 5),
      Boolean(formData.salary_text.trim()),
      Boolean(Number(formData.vacancies_count) >= 1),
      Boolean(formData.apply_url.trim() && (formData.apply_url.startsWith('http://') || formData.apply_url.startsWith('https://'))),
      Boolean(formData.end_date),
      Boolean(formData.requirements.trim())
    ];
    const completedCount = mandatoryFields.filter(Boolean).length;
    return Math.round((completedCount / mandatoryFields.length) * 100);
  };

  const formProgress = calculateProgress();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validar en tiempo real
    if (hasSubmitted || touchedFields[name]) {
      const err = validateField(name, value);
      setFieldErrors(prev => {
        const next = { ...prev };
        if (err) next[name as keyof FormErrors] = err;
        else delete next[name as keyof FormErrors];
        return next;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    // Auto-completar prefijo https:// para URLs si el usuario omitió el protocolo
    if ((name === 'apply_url' || name === 'bases_pdf_url') && value.trim() && !value.trim().startsWith('http://') && !value.trim().startsWith('https://')) {
      const autoUrl = `https://${value.trim()}`;
      setFormData(prev => ({ ...prev, [name]: autoUrl }));
      const err = validateField(name, autoUrl);
      setFieldErrors(prev => {
        const next = { ...prev };
        if (err) next[name as keyof FormErrors] = err;
        else delete next[name as keyof FormErrors];
        return next;
      });
      return;
    }

    // Auto-formatear salario si solo ingresó un número
    if (name === 'salary_text' && value.trim()) {
      const cleanNum = value.replace(/[^\d.]/g, '');
      if (cleanNum && !value.toLowerCase().includes('soles') && !value.toLowerCase().includes('convenir')) {
        const numVal = parseFloat(cleanNum);
        if (!isNaN(numVal) && numVal > 100) {
          const formatted = `S/ ${numVal.toLocaleString('es-PE', { minimumFractionDigits: 2 })} soles`;
          setFormData(prev => ({ ...prev, salary_text: formatted }));
        }
      }
    }

    const err = validateField(name, value);
    setFieldErrors(prev => {
      const next = { ...prev };
      if (err) next[name as keyof FormErrors] = err;
      else delete next[name as keyof FormErrors];
      return next;
    });
  };

  // Manejador inteligente para RUC: solo números y max 11 dígitos con detección inversa
  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleanNumbers = raw.replace(/\D/g, '').slice(0, 11);
    setFormData(prev => ({ ...prev, entity_ruc: cleanNumbers }));

    // Detección inversa si coincide con una entidad conocida
    if (cleanNumbers.length === 11) {
      const matched = POPULAR_ENTITIES.find(p => p.ruc === cleanNumbers);
      if (matched && !formData.entity_name) {
        setFormData(prev => ({
          ...prev,
          entity_name: matched.name,
          sector_type: matched.sector,
          region: matched.region,
          apply_url: prev.apply_url || matched.portal
        }));
      }
    }

    if (hasSubmitted || touchedFields.entity_ruc) {
      const err = validateField('entity_ruc', cleanNumbers);
      setFieldErrors(prev => {
        const next = { ...prev };
        if (err) next.entity_ruc = err;
        else delete next.entity_ruc;
        return next;
      });
    }
  };

  // Manejador inteligente de autocompletado de entidad
  const handleSelectEntity = (item: typeof POPULAR_ENTITIES[0]) => {
    const logoFromPortal = extractLogoFromDomain(item.portal);
    setFormData(prev => ({
      ...prev,
      entity_name: item.name,
      entity_ruc: item.ruc,
      sector_type: item.sector as any,
      region: item.region,
      category: item.category || prev.category,
      apply_url: prev.apply_url || item.portal,
      entity_logo: prev.entity_logo || logoFromPortal || ''
    }));
    setShowSuggestions(false);
    
    // Limpiar errores para los campos autocompletados
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.entity_name;
      delete next.entity_ruc;
      delete next.apply_url;
      return next;
    });
  };

  // Manejador de carga de archivo de imagen local (Base64)
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoUploadError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoUploadError('El archivo debe ser una imagen válida (PNG, JPG, WebP o SVG).');
      return;
    }

    // Máximo 2MB para payload óptimo en Next.js
    if (file.size > 2 * 1024 * 1024) {
      setLogoUploadError('La imagen supera el límite de 2MB. Por favor sube una imagen más ligera o comprimida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData(prev => ({ ...prev, entity_logo: base64 }));
      }
    };
    reader.onerror = () => {
      setLogoUploadError('No se pudo leer el archivo de imagen. Intenta de nuevo.');
    };
    reader.readAsDataURL(file);
  };

  // Captura inteligente de logo desde el dominio web
  const handleAutoCaptureLogo = (overrideUrl?: string) => {
    const targetUrl = overrideUrl || customWebDomain || formData.apply_url;
    setLogoUploadError(null);
    if (!targetUrl || !targetUrl.trim()) {
      setLogoUploadError('Ingresa primero la URL del portal o sitio web de la entidad.');
      return;
    }

    const captured = extractLogoFromDomain(targetUrl);
    if (captured) {
      setFormData(prev => ({ ...prev, entity_logo: captured }));
    } else {
      setLogoUploadError('No se pudo extraer el dominio de la URL ingresada.');
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, entity_logo: '' }));
    setLogoUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cargar plantilla de requisitos
  const handleLoadTemplate = (template: typeof REQUIREMENTS_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      requirements: template.content
    }));
  };

  // Agregar prefijo al título
  const handleAddTitlePrefix = (prefix: string) => {
    setFormData(prev => ({
      ...prev,
      title: prefix + prev.title.replace(/^CAS N° \d+-\d+:\s*|^Especialista en\s*|^Analista de\s*/i, '')
    }));
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.title;
      return next;
    });
  };

  // Controles rápidos de Vacantes
  const adjustVacancies = (delta: number) => {
    const current = Number(formData.vacancies_count) || 1;
    const nextVal = Math.max(1, current + delta);
    setFormData(prev => ({ ...prev, vacancies_count: nextVal }));
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.vacancies_count;
      return next;
    });
  };

  // Ajustes rápidos de Fecha Límite
  const setDeadlineDays = (days: number) => {
    const d = new Date(Date.now() + days * 86400000);
    const iso = d.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, end_date: iso }));
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.end_date;
      return next;
    });
  };

  const setDeadlineEndOfMonth = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const iso = endOfMonth.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, end_date: iso }));
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.end_date;
      return next;
    });
  };

  // Salto rápido a un campo con error
  const scrollToField = (fieldName: keyof FormErrors) => {
    const el = document.getElementById(`field-${fieldName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setHasSubmitted(true);

    const errors = validateAll();
    setFieldErrors(errors);

    const errorKeys = Object.keys(errors) as (keyof FormErrors)[];
    if (errorKeys.length > 0) {
      setShakeTrigger(prev => prev + 1);
      // Auto-scroll fluido al primer campo con error
      const firstFieldKey = errorKeys[0];
      scrollToField(firstFieldKey);
      setErrorMsg(`Por favor corrige los ${errorKeys.length} campos marcados en rojo para poder enviar la convocatoria.`);
      return;
    }

    if (!acceptedTerms) {
      setShakeTrigger(prev => prev + 1);
      setErrorMsg('Debes declarar la veracidad de la convocatoria y aceptar los Términos y Condiciones y la Política de Privacidad de Chamba Pro.');
      const termsEl = document.getElementById('field-accept-terms');
      if (termsEl) termsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/jobs/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar el registro de la convocatoria.');
      }

      setSuccessData({
        jobId: data.jobId,
        slug: data.slug
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado al enviar la solicitud.');
      setShakeTrigger(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      entity_name: '',
      entity_ruc: '',
      sector_type: 'CAS 1057',
      is_public_entity: true,
      title: '',
      vacancies_count: 1,
      salary_text: '',
      education_level: 'Titulado',
      region: 'Lima',
      category: 'Administración y Gestión Pública',
      bases_pdf_url: '',
      apply_url: '',
      entity_logo: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      requirements: '',
      description: '',
      contact_email: '',
      contact_phone: ''
    });
    setFieldErrors({});
    setTouchedFields({});
    setHasSubmitted(false);
    setErrorMsg(null);
    setLogoUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper de Clases CSS para Inputs con Borde Rojo Ultra Profesional y Foco Dinámico
  const getInputClasses = (fieldName: keyof FormErrors) => {
    const isError = Boolean((hasSubmitted || touchedFields[fieldName]) && fieldErrors[fieldName]);
    const isValid = Boolean(touchedFields[fieldName] && !fieldErrors[fieldName] && formData[fieldName as keyof typeof formData]);

    if (isError) {
      return "w-full px-4 py-3 bg-rose-950/40 border-2 border-rose-500 rounded-xl text-xs text-white placeholder-rose-300/40 focus:outline-none focus:ring-4 focus:ring-rose-500/30 transition-all shadow-[0_0_20px_rgba(244,63,94,0.25)] ring-2 ring-rose-500/40";
    }
    if (isValid) {
      return "w-full px-4 py-3 bg-slate-950 border border-emerald-500/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all";
    }
    return "w-full px-4 py-3 bg-slate-950 border border-white/10 hover:border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all";
  };

  // Helper para verificar si una sección tiene errores
  const section1HasErrors = Boolean(fieldErrors.entity_name || fieldErrors.entity_ruc);
  const section2HasErrors = Boolean(fieldErrors.title || fieldErrors.salary_text || fieldErrors.vacancies_count || fieldErrors.end_date);
  const section3HasErrors = Boolean(fieldErrors.apply_url);
  const section4HasErrors = Boolean(fieldErrors.contact_email || fieldErrors.contact_phone);

  // Pantalla de Éxito Editorial
  if (successData) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-500/40 p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-500/40 shadow-sm">
          <Clock size={36} className="animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold border border-amber-500/30 uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>En Revisión Editorial (&lt; 2 Horas)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            ¡Solicitud de Publicación Recibida!
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Tu convocatoria para <strong className="text-amber-400">{formData.title}</strong> ha ingresado a la cola de validación de <strong className="text-white">chamba pro</strong>.
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Para garantizar la seguridad de miles de postulantes peruanos, nuestro equipo de moderación en <strong className="text-emerald-400">ATPDev</strong> cotejará el RUC con SUNAT y comprobará el portal oficial antes de activarla en vivo.
          </p>
        </div>

        <div className="bg-slate-950/80 rounded-2xl p-5 border border-white/10 max-w-lg mx-auto text-left space-y-2.5 text-xs font-mono">
          <div className="flex justify-between text-slate-400 pb-2 border-b border-white/5">
            <span>Ticket de Solicitud:</span>
            <span className="text-white font-bold">{successData.jobId}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Entidad / RUC:</span>
            <span className="text-white truncate max-w-[220px]">
              {formData.entity_name} {formData.entity_ruc ? `(${formData.entity_ruc})` : ''}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Régimen / Puesto:</span>
            <span className="text-amber-400 truncate max-w-[220px]">{formData.sector_type} · {formData.title}</span>
          </div>
          {formData.contact_email && (
            <div className="flex justify-between text-slate-400">
              <span>Email de Contacto:</span>
              <span className="text-white">{formData.contact_email}</span>
            </div>
          )}
          {formData.contact_phone && (
            <div className="flex justify-between text-slate-400">
              <span>Teléfono / WhatsApp:</span>
              <span className="text-white">{formData.contact_phone}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-400 pt-2 border-t border-white/5">
            <span>Tiempo Máximo de Activación:</span>
            <span className="text-emerald-400 font-bold">Menos de 2 horas hábiles</span>
          </div>
        </div>

        {/* Ecosistema ATPDev Solutions Card */}
        <div className="max-w-lg mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-left flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white font-display flex items-center gap-1.5">
              <span>Ecosistema Tecnológico ATPDev</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Oficial</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              ¿Tu entidad o empresa requiere digitalizar legajos, automatizar postulaciones con IA o desarrollar software a medida?
            </p>
            <a 
              href="https://atpdev.dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono font-semibold underline pt-0.5"
            >
              <span>Conoce nuestras soluciones en atpdev.dev</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/empleos"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black font-display transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <span>Explorar Convocatorias Vigentes</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={() => {
              setSuccessData(null);
              resetForm();
            }}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-display transition-all border border-white/10 cursor-pointer"
          >
            Registrar Otra Solicitud
          </button>
        </div>
      </div>
    );
  }

  // Filtrar sugerencias de entidades
  const filteredEntities = formData.entity_name.trim().length >= 2
    ? POPULAR_ENTITIES.filter(e => 
        e.name.toLowerCase().includes(formData.entity_name.toLowerCase()) ||
        e.ruc.includes(formData.entity_name)
      ).slice(0, 6)
    : [];

  const errorKeys = Object.keys(fieldErrors) as (keyof FormErrors)[];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* HUD de Progreso Inteligente de Completitud */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap size={15} className={formProgress === 100 ? "text-emerald-400" : "text-amber-400"} />
            <span className="font-bold text-white font-display">Llenado Inteligente y Verificación Oficial</span>
          </div>
          <div className="font-mono text-xs">
            <span className={formProgress === 100 ? "text-emerald-400 font-bold" : "text-slate-300"}>
              {formProgress}% Completado
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              formProgress === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                : formProgress > 50 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-400' 
                : 'bg-gradient-to-r from-amber-500 to-emerald-500'
            }`}
            style={{ width: `${formProgress}%` }}
          />
        </div>
      </div>

      {/* Alerta de Error Superior con Botones de Salto Directo a Campos con Error */}
      {hasSubmitted && errorKeys.length > 0 && (
        <div 
          key={shakeTrigger} 
          className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500 text-rose-900 dark:text-rose-200 shadow-sm animate-shake space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shrink-0 mt-0.5">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">
                  Atención: Hay {errorKeys.length} {errorKeys.length === 1 ? 'campo pendiente o inválido' : 'campos pendientes o inválidos'}
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                  Los campos señalados con línea roja deben ser completados correctamente para enviar la convocatoria oficial:
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setFieldErrors({})}
              className="p-1 rounded-lg hover:bg-rose-200/50 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
              title="Cerrar aviso"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chips Interactivos para saltar al campo */}
          <div className="flex flex-wrap gap-2 pt-1">
            {errorKeys.map(key => (
              <button
                key={key}
                type="button"
                onClick={() => scrollToField(key)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-800 text-xs font-mono text-rose-800 dark:text-rose-100 border border-rose-300 dark:border-rose-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" />
                <span>{FIELD_LABELS[key] || key}</span>
                <ChevronRight size={12} className="text-rose-500 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 1: DATOS DE LA ENTIDAD O EMPRESA */}
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border p-6 sm:p-8 space-y-6 transition-colors shadow-sm ${
        section1HasErrors && hasSubmitted ? 'border-rose-500/50 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' : 'border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-base">
            <div className={`p-2 rounded-xl border ${
              section1HasErrors && hasSubmitted 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <Building2 size={18} />
            </div>
            <span>1. Información de la Entidad o Empresa</span>
          </div>
          {section1HasErrors && hasSubmitted ? (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-bold">
              <AlertCircle size={12} />
              <span>Corregir en esta sección</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">
              Campos con <span className="text-rose-400 font-bold">*</span> obligatorios
            </span>
          )}
        </div>

        {/* Atajos Rápidos de Entidades Oficiales de Perú */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold font-display flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>Relleno Inteligente 1-Clic para Entidades del Estado:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Autocompleta Nombre, RUC y Portal Oficial</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ENTITIES.slice(0, 10).map((ent, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectEntity(ent)}
                className="entity-quick-btn px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 text-[11px] font-mono text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span className="font-bold text-white hover:text-emerald-400">{ent.short}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nombre Oficial de la Institución con Autocompletado */}
          <div className="relative" ref={suggestionsRef}>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-entity_name" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.entity_name && (hasSubmitted || touchedFields.entity_name) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Nombre Oficial de la Institución / Empresa <span className="text-rose-400">*</span>
              </label>
              {fieldErrors.entity_name && (hasSubmitted || touchedFields.entity_name) ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Campo requerido
                </span>
              ) : filteredEntities.length > 0 && showSuggestions ? (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Sugerencias activas</span>
                </span>
              ) : null}
            </div>

            <div className="relative">
              <input
                id="field-entity_name"
                type="text"
                name="entity_name"
                value={formData.entity_name}
                onChange={(e) => {
                  handleChange(e);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBlur}
                placeholder="Ej: MUNICIPALIDAD DE MIRAFLORES o MINISTERIO DE ENERGÍA"
                className={getInputClasses('entity_name')}
              />
              {formData.entity_name.trim().length >= 3 && !fieldErrors.entity_name && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.entity_name && (hasSubmitted || touchedFields.entity_name) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>

            {/* Error debajo del campo con marco rojo destacado */}
            {fieldErrors.entity_name && (hasSubmitted || touchedFields.entity_name) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.entity_name}</span>
              </div>
            )}

            {/* Pop-up de Sugerencias Inteligentes */}
            {showSuggestions && filteredEntities.length > 0 && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-slate-900 border border-emerald-500/40 rounded-2xl p-2 shadow-2xl space-y-1 backdrop-blur-xl">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-2.5 py-1 flex items-center gap-1 border-b border-white/5 pb-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Entidades coincidentes (Clic para autocompletar RUC y portal):</span>
                </div>
                {filteredEntities.map((ent, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectEntity(ent)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between gap-2 group cursor-pointer"
                  >
                    <div className="truncate">
                      <span className="font-bold text-white group-hover:text-emerald-400">{ent.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">RUC: {ent.ruc}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Auto-rellenar
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RUC de la Entidad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-entity_ruc" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.entity_ruc && (hasSubmitted || touchedFields.entity_ruc) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                RUC de la Entidad (11 dígitos)
              </label>
              <div className="text-[10px] font-mono">
                {formData.entity_ruc.length === 11 && (formData.entity_ruc.startsWith('10') || formData.entity_ruc.startsWith('20') || formData.entity_ruc.startsWith('15')) ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Check size={11} />
                    <span>✓ RUC SUNAT Válido</span>
                  </span>
                ) : formData.entity_ruc.length > 0 ? (
                  <span className="text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {formData.entity_ruc.length}/11 dígitos
                  </span>
                ) : (
                  <span className="text-slate-400">Opcional pero recomendado</span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                id="field-entity_ruc"
                type="text"
                name="entity_ruc"
                maxLength={11}
                value={formData.entity_ruc}
                onChange={handleRucChange}
                onBlur={handleBlur}
                placeholder="Ej: 20131370645 (Solo números)"
                className={`${getInputClasses('entity_ruc')} font-mono`}
              />
              {formData.entity_ruc.length === 11 && !fieldErrors.entity_ruc && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.entity_ruc && (hasSubmitted || touchedFields.entity_ruc) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>

            {/* Error debajo del campo en rojo */}
            {fieldErrors.entity_ruc && (hasSubmitted || touchedFields.entity_ruc) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.entity_ruc}</span>
              </div>
            )}
          </div>

          {/* Régimen Laboral */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Régimen de Contratación <span className="text-rose-400">*</span>
            </label>
            <select
              name="sector_type"
              value={formData.sector_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-display cursor-pointer"
            >
              {REGIMENES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Ubicación / Región */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Ubicación / Región <span className="text-rose-400">*</span>
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-display cursor-pointer"
            >
              {REGIONES_PERU.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* LOGO OFICIAL O AFICHE INSTITUCIONAL */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-display font-bold text-white flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-400" />
                <span>Logo Oficial o Afiche Institucional de la Convocatoria</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Recomendado
                </span>
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sube el logo de tu entidad/empresa o captúralo con 1 clic desde su sitio web oficial.
              </p>
            </div>

            {/* Pestañas de Modo de Carga */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setLogoSourceMode('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  logoSourceMode === 'upload'
                    ? 'btn-brand-accent text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload size={12} />
                <span>Subir Archivo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLogoSourceMode('web');
                  if (formData.apply_url && !formData.entity_logo) {
                    handleAutoCaptureLogo(formData.apply_url);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  logoSourceMode === 'web'
                    ? 'btn-brand-accent text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe size={12} />
                <span>Capturar de Web</span>
              </button>

              <button
                type="button"
                onClick={() => setLogoSourceMode('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  logoSourceMode === 'url'
                    ? 'btn-brand-accent text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link2 size={12} />
                <span>Enlace URL</span>
              </button>
            </div>
          </div>

          {/* Subir Archivo desde PC o Celular */}
          {logoSourceMode === 'upload' && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border-2 border-dashed border-white/20 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
                  <Upload size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">
                    Seleccionar imagen o afiche de tu dispositivo
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Archivos admitidos: PNG, JPG, WebP o SVG (Máximo 2 MB)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleLogoFileChange}
                  className="hidden"
                  id="logo-file-input"
                />
                <label
                  htmlFor="logo-file-input"
                  className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold font-display border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm"
                >
                  Explorar Archivo...
                </label>
              </div>
            </div>
          )}

          {/* Autocaptura con 1 Clic desde el Sitio Web */}
          {logoSourceMode === 'web' && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Globe size={15} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder={formData.apply_url || "Ej: interbank.pe, unajma.edu.pe o minsa.gob.pe"}
                    value={customWebDomain}
                    onChange={(e) => setCustomWebDomain(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoCaptureLogo()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs font-display flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
                >
                  <Sparkles size={14} />
                  <span>Capturar Logo HD (1 Clic)</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Detecta automáticamente el dominio web institucional y extrae su isotipo o logo oficial en alta resolución.
              </p>
            </div>
          )}

          {/* Pegar Enlace URL Directo */}
          {logoSourceMode === 'url' && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
              <div className="relative">
                <Link2 size={15} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="url"
                  placeholder="https://tuempresa.com/assets/logo.png"
                  value={formData.entity_logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, entity_logo: e.target.value.trim() }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Pega el enlace directo a una imagen accesible públicamente (PNG, JPG o WebP).
              </p>
            </div>
          )}

          {logoUploadError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
              <span>{logoUploadError}</span>
            </div>
          )}

          {/* Tarjeta de Previsualización en Vivo de la Imagen */}
          {formData.entity_logo ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-inner animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white font-display">
                    Logo / Afiche cargado y listo para publicar
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Vista Previa Oficial
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Quitar imagen</span>
                </button>
              </div>

              {/* Mockup del Banner de Convocatoria de Chamba Pro */}
              <div className="w-full sm:max-w-md mx-auto h-28 rounded-xl bg-white p-3 flex items-center justify-center relative overflow-hidden shadow-md border border-slate-200">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
                <img
                  src={formData.entity_logo}
                  alt={formData.entity_name || 'Logo de convocatoria'}
                  className="max-h-20 max-w-[85%] object-contain drop-shadow"
                  onError={() => {
                    setTimeout(() => {
                      setLogoUploadError('No se pudo previsualizar la imagen. Verifica el formato o URL.');
                    }, 50);
                  }}
                />
              </div>

              <p className="text-center text-[10px] text-slate-400 font-mono">
                Este es el encabezado con el que se mostrará tu aviso en Chamba Pro al ser aprobado.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-3 text-xs text-slate-400">
              <Info size={16} className="text-cyan-400 shrink-0" />
              <span>
                <strong>Nota:</strong> Si no adjuntas imagen, Chamba Pro vinculará automáticamente el escudo oficial o logo institucional registrado en nuestra base de datos.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: DATOS DE LA CONVOCATORIA Y PERFIL DEL PUESTO */}
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border p-6 sm:p-8 space-y-6 transition-colors shadow-sm ${
        section2HasErrors && hasSubmitted ? 'border-rose-500/50 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' : 'border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-base">
            <div className={`p-2 rounded-xl border ${
              section2HasErrors && hasSubmitted 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <Briefcase size={18} />
            </div>
            <span>2. Datos de la Convocatoria y Perfil del Puesto</span>
          </div>
          {section2HasErrors && hasSubmitted && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-bold">
              <AlertCircle size={12} />
              <span>Campos requeridos pendientes</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Título del Puesto */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-title" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.title && (hasSubmitted || touchedFields.title) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Título del Puesto / Código de Proceso <span className="text-rose-400">*</span>
              </label>
              {fieldErrors.title && (hasSubmitted || touchedFields.title) && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Campo requerido
                </span>
              )}
            </div>

            {/* Prefijos Rápidos para Título */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[10px] font-mono text-slate-400">Prefijos Rápidos:</span>
              {TITLE_PREFIXES.map((pref, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddTitlePrefix(pref)}
                  className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {pref}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                id="field-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: CAS N° 045-2026: Especialista en Contrataciones del Estado"
                className={getInputClasses('title')}
              />
              {formData.title.trim().length >= 5 && !fieldErrors.title && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.title && (hasSubmitted || touchedFields.title) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>
            {fieldErrors.title && (hasSubmitted || touchedFields.title) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.title}</span>
              </div>
            )}
          </div>

          {/* Número de Vacantes con botones +/- */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-vacancies_count" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.vacancies_count && (hasSubmitted || touchedFields.vacancies_count) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Número de Vacantes <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 5, 10].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, vacancies_count: cnt }));
                      setFieldErrors(prev => {
                        const next = { ...prev };
                        delete next.vacancies_count;
                        return next;
                      });
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      formData.vacancies_count === cnt 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cnt} {cnt === 1 ? 'plaza' : 'plazas'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustVacancies(-1)}
                className="w-12 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center font-bold transition-all shrink-0 cursor-pointer"
                title="Disminuir vacante"
              >
                <Minus size={16} />
              </button>
              <input
                id="field-vacancies_count"
                type="number"
                name="vacancies_count"
                min={1}
                value={formData.vacancies_count}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${getInputClasses('vacancies_count')} text-center font-mono font-bold text-sm`}
              />
              <button
                type="button"
                onClick={() => adjustVacancies(1)}
                className="w-12 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center font-bold transition-all shrink-0 cursor-pointer"
                title="Aumentar vacante"
              >
                <Plus size={16} />
              </button>
            </div>
            {fieldErrors.vacancies_count && (hasSubmitted || touchedFields.vacancies_count) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.vacancies_count}</span>
              </div>
            )}
          </div>

          {/* Remuneración con Chips Rápidos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-salary_text" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.salary_text && (hasSubmitted || touchedFields.salary_text) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Remuneración Mensual (Soles) <span className="text-rose-400">*</span>
              </label>
              {fieldErrors.salary_text && (hasSubmitted || touchedFields.salary_text) && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Campo requerido
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="field-salary_text"
                type="text"
                name="salary_text"
                value={formData.salary_text}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: S/ 4,500.00 soles mensual o A convenir"
                className={getInputClasses('salary_text')}
              />
              {formData.salary_text && !fieldErrors.salary_text && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.salary_text && (hasSubmitted || touchedFields.salary_text) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>

            {/* Chips rápidos de remuneración */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_SALARIES.map((sal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, salary_text: sal }));
                    setFieldErrors(prev => {
                      const next = { ...prev };
                      delete next.salary_text;
                      return next;
                    });
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {sal.split(' ')[0]} {sal.split(' ')[1]}
                </button>
              ))}
            </div>

            {fieldErrors.salary_text && (hasSubmitted || touchedFields.salary_text) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.salary_text}</span>
              </div>
            )}
          </div>

          {/* Área / Especialidad */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Área / Especialidad
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {CATEGORIAS_EMPLEO.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Nivel Educativo */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Nivel Educativo Requerido
            </label>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Secundaria">Secundaria Completa</option>
              <option value="Técnico">Técnico Superior</option>
              <option value="Egresado">Egresado Universitario / Técnico</option>
              <option value="Bachiller">Bachiller Universitario</option>
              <option value="Titulado">Titulado Universitario Colegiado</option>
              <option value="Maestría / Doctorado">Maestría / Doctorado</option>
            </select>
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Fecha de Inicio de Convocatoria
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
            />
          </div>

          {/* Fecha Límite con Presets Rápidos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-end_date" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.end_date && (hasSubmitted || touchedFields.end_date) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Fecha Límite de Postulación <span className="text-rose-400">*</span>
              </label>
              {fieldErrors.end_date && (hasSubmitted || touchedFields.end_date) && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Campo requerido
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="field-end_date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${getInputClasses('end_date')} font-mono cursor-pointer`}
              />
            </div>

            {/* Presets de plazo */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setDeadlineDays(7)}
                className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-emerald-400 border border-white/5 transition-all cursor-pointer"
              >
                +7 días (Urgente)
              </button>
              <button
                type="button"
                onClick={() => setDeadlineDays(14)}
                className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-emerald-400 border border-white/5 transition-all cursor-pointer"
              >
                +14 días (Estándar)
              </button>
              <button
                type="button"
                onClick={() => setDeadlineDays(30)}
                className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-emerald-400 border border-white/5 transition-all cursor-pointer"
              >
                +30 días
              </button>
              <button
                type="button"
                onClick={setDeadlineEndOfMonth}
                className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-emerald-400 border border-white/5 transition-all cursor-pointer"
              >
                Fin de mes
              </button>
            </div>

            {fieldErrors.end_date && (hasSubmitted || touchedFields.end_date) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.end_date}</span>
              </div>
            )}
          </div>

          {/* Requisitos con Plantillas Rápidas */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Requisitos Principales (uno por viñeta)
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">Cargar Plantilla Oficial:</span>
                {REQUIREMENTS_TEMPLATES.map((tmpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleLoadTemplate(tmpl)}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-emerald-950 text-[10px] font-mono text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                    + {tmpl.badge}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Ej:&#10;- Título universitario en Contabilidad o Administración.&#10;- Experiencia general mínima de 3 años en el sector público.&#10;- Certificación OSCE vigente."
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none leading-relaxed font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: ENLACES OFICIALES Y BASES */}
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border p-6 sm:p-8 space-y-6 transition-colors shadow-sm ${
        section3HasErrors && hasSubmitted ? 'border-rose-500/50 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' : 'border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-base">
            <div className={`p-2 rounded-xl border ${
              section3HasErrors && hasSubmitted 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <FileText size={18} />
            </div>
            <span>3. Documentación Oficial y Enlaces de Postulación</span>
          </div>
          {section3HasErrors && hasSubmitted && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-bold">
              <AlertCircle size={12} />
              <span>URL requerida</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Portal Oficial de Postulación */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-apply_url" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.apply_url && (hasSubmitted || touchedFields.apply_url) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Portal Oficial de Postulación / Mesa de Partes Virtual <span className="text-rose-400">*</span>
              </label>
              {formData.apply_url && (formData.apply_url.startsWith('http://') || formData.apply_url.startsWith('https://')) && (
                <a
                  href={formData.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                >
                  <span>Probar enlace</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div className="relative">
              <input
                id="field-apply_url"
                type="url"
                name="apply_url"
                value={formData.apply_url}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://convocatorias.entidad.gob.pe o enlace del portal"
                className={`${getInputClasses('apply_url')} font-mono`}
              />
              {formData.apply_url && !fieldErrors.apply_url && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.apply_url && (hasSubmitted || touchedFields.apply_url) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              URL directa donde los postulantes cargarán anexos o se registrarán. (Agrega https:// automáticamente si se omite).
            </p>
            {fieldErrors.apply_url && (hasSubmitted || touchedFields.apply_url) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.apply_url}</span>
              </div>
            )}
          </div>

          {/* Enlace Directo a Bases Oficiales */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Enlace Directo a las Bases Oficiales (PDF o Google Drive)
              </label>
              {formData.bases_pdf_url && (formData.bases_pdf_url.startsWith('http://') || formData.bases_pdf_url.startsWith('https://')) && (
                <a
                  href={formData.bases_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                >
                  <span>Abrir bases</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <input
              type="url"
              name="bases_pdf_url"
              value={formData.bases_pdf_url}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://drive.google.com/... o https://cdn.entidad.gob.pe/bases.pdf"
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Permite a los postulantes previsualizar y descargar las bases y anexos con 1 solo clic.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: CONTACTO DE RECURSOS HUMANOS */}
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border p-6 sm:p-8 space-y-6 transition-colors shadow-sm ${
        section4HasErrors && hasSubmitted ? 'border-rose-500/50 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' : 'border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-base">
            <div className={`p-2 rounded-xl border ${
              section4HasErrors && hasSubmitted 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <Mail size={18} />
            </div>
            <span>4. Contacto de la Oficina de Recursos Humanos (OGRH)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Canales oficiales de consulta</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Correo de Contacto */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-contact_email" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.contact_email && (hasSubmitted || touchedFields.contact_email) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Correo Institucional de Consultas
              </label>
              {fieldErrors.contact_email && (hasSubmitted || touchedFields.contact_email) && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Formato incorrecto
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="field-contact_email"
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="convocatorias@entidad.gob.pe"
                className={`${getInputClasses('contact_email')} font-mono`}
              />
              {formData.contact_email && !fieldErrors.contact_email && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.contact_email && (hasSubmitted || touchedFields.contact_email) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>
            {fieldErrors.contact_email && (hasSubmitted || touchedFields.contact_email) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.contact_email}</span>
              </div>
            )}
          </div>

          {/* Teléfono de Contacto */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="field-contact_phone" 
                className={`block text-xs font-mono transition-colors ${
                  fieldErrors.contact_phone && (hasSubmitted || touchedFields.contact_phone) 
                    ? 'text-rose-400 font-bold' 
                    : 'text-slate-300'
                }`}
              >
                Teléfono / Central Telefónica
              </label>
              {fieldErrors.contact_phone && (hasSubmitted || touchedFields.contact_phone) && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Número incompleto
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="field-contact_phone"
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="(01) 513-9000 o 987654321"
                className={`${getInputClasses('contact_phone')} font-mono`}
              />
              {formData.contact_phone && !fieldErrors.contact_phone && (
                <Check size={18} className="absolute right-3.5 top-3.5 text-emerald-400 pointer-events-none" />
              )}
              {fieldErrors.contact_phone && (hasSubmitted || touchedFields.contact_phone) && (
                <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-400 pointer-events-none" />
              )}
            </div>
            {fieldErrors.contact_phone && (hasSubmitted || touchedFields.contact_phone) && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 mt-2 animate-fadeIn shadow-sm">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span>{fieldErrors.contact_phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACEPTACIÓN DE TÉRMINOS Y CONDICIONES (COMPLIANCE ADSENSE & LEY 29733) */}
      <div 
        id="field-accept-terms"
        className={`p-5 rounded-2xl border transition-all ${
          !acceptedTerms && hasSubmitted 
            ? 'bg-rose-500/10 border-rose-500/50 shadow-sm' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
          />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">
              Declaración de Veracidad y Aceptación de Condiciones Oficiales
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Declaro bajo juramento que los datos consignados en esta convocatoria son oficiales, legítimos y que la postulación es 100% gratuita para los postulantes. Acepto íntegramente los{' '}
              <Link href="/terminos-y-condiciones" target="_blank" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Términos y Condiciones de Uso
              </Link>{' '}
              y la{' '}
              <Link href="/politica-de-privacidad" target="_blank" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Política de Privacidad
              </Link>{' '}
              de Chamba Pro.
            </p>
          </div>
        </label>
        {!acceptedTerms && hasSubmitted && (
          <p className="text-[11px] font-mono text-rose-500 dark:text-rose-400 mt-2.5 flex items-center gap-1.5 font-bold">
            <AlertCircle size={13} />
            <span>Casilla obligatoria: debes aceptar los términos para poder remitir y publicar la oferta.</span>
          </p>
        )}
      </div>

      {/* BOTÓN DE ACCIÓN Y GARANTÍA EDITORIAL */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs text-slate-900 dark:text-white font-bold font-display flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Verificación Editorial Oficial en Menos de 2 Horas</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Publicación 100% gratuita para instituciones del Estado. Su convocatoria se indexará en el buscador general.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-brand-gradient w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-black font-display text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-xl"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white drop-shadow-sm">Validando y Registrando...</span>
            </>
          ) : (
            <>
              <Send size={18} className="text-white drop-shadow-sm" />
              <span className="text-white drop-shadow-sm">Publicar Convocatoria Oficial</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
