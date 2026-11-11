'use client';

import React, { useState } from 'react';
import { 
  User, GraduationCap, Briefcase, BookOpen, Award, Plus, Trash2, 
  Upload, X, Languages, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight,
  Check, FileText, ChevronRight
} from 'lucide-react';
import { CvData, EducationItem, ExperienceItem, CourseItem, LanguageItem } from './types';

interface Props {
  data: CvData;
  onChange: (updated: CvData) => void;
}

type SectionId = 'personal' | 'profile' | 'education' | 'experience' | 'courses' | 'skills';

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: '1. Personal', icon: User },
  { id: 'profile', label: '2. Perfil', icon: FileText },
  { id: 'education', label: '3. Educación', icon: GraduationCap },
  { id: 'experience', label: '4. Experiencia', icon: Briefcase },
  { id: 'courses', label: '5. Cursos', icon: BookOpen },
  { id: 'skills', label: '6. Skills & Idiomas', icon: Languages },
];

export function CvForm({ data, onChange }: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>('personal');
  const [newSkillInput, setNewSkillInput] = useState('');

  // Helpers to update state immutably
  const updatePersonal = (field: keyof CvData['personal'], value: string) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updatePersonal('photoUrl', compressedDataUrl);
        } else {
          updatePersonal('photoUrl', event.target?.result as string);
        }
      };
      img.onerror = () => {
        updatePersonal('photoUrl', event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonal('photoUrl', '');
  };

  // Education Helpers - Initialized with EMPTY fields for clean user typing
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: 'BACHILLER',
      carrera: '',
      institution: '',
      year: '',
      status: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  // Experience Helpers - Initialized with EMPTY fields
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      entity: '',
      role: '',
      period: '',
      type: 'Específica',
      functions: [''],
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: any) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter((e) => e.id !== id) });
  };

  const addFunctionToExperience = (expId: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            functions: [...(exp.functions || []), ''],
          };
        }
        return exp;
      }),
    });
  };

  const updateFunctionInExperience = (expId: string, fIdx: number, val: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id === expId) {
          const newFns = [...(exp.functions || [])];
          newFns[fIdx] = val;
          return { ...exp, functions: newFns };
        }
        return exp;
      }),
    });
  };

  const removeFunctionFromExperience = (expId: string, fIdx: number) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            functions: (exp.functions || []).filter((_, idx) => idx !== fIdx),
          };
        }
        return exp;
      }),
    });
  };

  // Courses Helpers - Initialized with EMPTY fields
  const addCourse = () => {
    const newCourse: CourseItem = {
      id: Date.now().toString(),
      title: '',
      inst: '',
      hours: '',
      year: '',
    };
    onChange({ ...data, courses: [...data.courses, newCourse] });
  };

  const updateCourse = (id: string, field: keyof CourseItem, val: string) => {
    onChange({
      ...data,
      courses: data.courses.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    });
  };

  const removeCourse = (id: string) => {
    onChange({ ...data, courses: data.courses.filter((c) => c.id !== id) });
  };

  // Skills Helpers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skillToRemove) });
  };

  // Languages Helpers - Initialized with EMPTY fields
  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermedio',
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, val: any) => {
    onChange({
      ...data,
      languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    });
  };

  const removeLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
  };

  // Calculations for pending items across ALL 6 sections
  const isPersonalPending = !data.personal.fullName?.trim() || !data.personal.dni?.trim() || !data.personal.email?.trim() || !data.personal.phone?.trim();
  const pendingPersonalCount = isPersonalPending ? 1 : 0;

  const isProfilePending = !data.profileSummary?.trim() || data.profileSummary.trim().length < 15;
  const pendingProfileCount = isProfilePending ? 1 : 0;

  const pendingEducationCount = data.education.filter(
    (e) => !e.carrera?.trim() || !e.institution?.trim()
  ).length;

  const pendingExperienceCount = data.experiences.filter(
    (e) => !e.entity?.trim() || !e.role?.trim()
  ).length;

  const pendingCourseCount = data.courses.filter(
    (c) => !c.title?.trim() || !c.inst?.trim()
  ).length;

  const isSkillsEmpty = data.skills.length === 0;
  const pendingLanguageCount = data.languages.filter(
    (l) => !l.name?.trim()
  ).length;
  const pendingSkillsSectionCount = (isSkillsEmpty ? 1 : 0) + pendingLanguageCount;

  // Completion metrics across all 6 sections
  const isPersonalComplete = Boolean(
    data.personal.fullName?.trim() &&
    data.personal.dni?.trim() &&
    data.personal.email?.trim() &&
    data.personal.phone?.trim()
  );
  const isProfileComplete = Boolean(data.profileSummary?.trim() && data.profileSummary.trim().length >= 20);
  const isEducationComplete = data.education.length > 0 && !data.education.some((e) => !e.carrera?.trim() || !e.institution?.trim());
  const isExperienceComplete = data.experiences.length > 0 && !data.experiences.some((e) => !e.entity?.trim() || !e.role?.trim());
  const isCoursesComplete = data.courses.length > 0 && !data.courses.some((c) => !c.title?.trim() || !c.inst?.trim());
  const isSkillsComplete = data.skills.length > 0 && !data.languages.some((l) => !l.name?.trim());

  const completedSectionsCount = [
    isPersonalComplete,
    isProfileComplete,
    isEducationComplete,
    isExperienceComplete,
    isCoursesComplete,
    isSkillsComplete,
  ].filter(Boolean).length;

  const completionPercent = Math.round((completedSectionsCount / 6) * 100);

  // Step navigation helpers
  const sectionIds: SectionId[] = ['personal', 'profile', 'education', 'experience', 'courses', 'skills'];
  const currentSectionIdx = sectionIds.indexOf(activeSection);

  const goToNextSection = () => {
    if (currentSectionIdx < sectionIds.length - 1) {
      setActiveSection(sectionIds[currentSectionIdx + 1]);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIdx > 0) {
      setActiveSection(sectionIds[currentSectionIdx - 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Studio Progress Metric Bar */}
      <div className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              completionPercent === 100
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse'
                : 'bg-amber-400 animate-pulse'
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white font-display">
                Completitud del CV:
              </span>
              <span
                className={`font-mono text-xs font-black ${
                  completionPercent === 100 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {completionPercent}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({completedSectionsCount} de 6 secciones listas)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-950 border border-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completionPercent === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 to-emerald-400'
              }`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          {completionPercent === 100 ? (
            <span className="text-[10px] font-bold text-emerald-400 font-mono hidden md:inline">
              ✓ 100% Listo
            </span>
          ) : (
            <span className="text-[10px] font-mono text-amber-300 hidden md:inline">
              En edición
            </span>
          )}
        </div>
      </div>

      {/* Navigation tabs with executive badges in structured responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 text-xs shadow-lg">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          // Check pending alert for this tab
          let pendingCount = 0;
          let totalCount = 0;
          if (sec.id === 'personal') {
            pendingCount = pendingPersonalCount;
            totalCount = 1;
          } else if (sec.id === 'profile') {
            pendingCount = pendingProfileCount;
            totalCount = 1;
          } else if (sec.id === 'education') {
            pendingCount = pendingEducationCount;
            totalCount = data.education.length;
          } else if (sec.id === 'experience') {
            pendingCount = pendingExperienceCount;
            totalCount = data.experiences.length;
          } else if (sec.id === 'courses') {
            pendingCount = pendingCourseCount;
            totalCount = data.courses.length;
          } else if (sec.id === 'skills') {
            pendingCount = pendingSkillsSectionCount;
            totalCount = data.skills.length + data.languages.length;
          }

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between gap-1.5 cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40 scale-[1.01]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon size={14} className={`shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="font-semibold whitespace-nowrap text-[11.5px]">{sec.label}</span>
              </div>

              {/* Counter / Alert Badge */}
              {pendingCount > 0 ? (
                <span
                  className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-rose-500 text-white shadow-sm shadow-rose-950 animate-pulse shrink-0"
                  title={`${pendingCount} registro(s) pendiente(s) de llenar`}
                >
                  !
                </span>
              ) : totalCount > 0 ? (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                    isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {totalCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* SECCIÓN 1: DATOS PERSONALES */}
      {activeSection === 'personal' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Datos Personales & Identificación</span>
            </h3>
            <div className="flex items-center gap-2">
              {isPersonalPending ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10.5px] font-mono font-bold tracking-wide animate-pulse">
                  <AlertCircle size={12} className="text-rose-400" />
                  <span>⚠️ Faltan datos obligatorios</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>✓ Completo</span>
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-400">Paso 1 de 6</span>
            </div>
          </div>

          {/* Foto de perfil opcional */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center gap-4">
            <div className="relative">
              {data.personal.photoUrl ? (
                <div className="relative group">
                  <img
                    src={data.personal.photoUrl}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shadow-emerald-950/50"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Eliminar foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-dashed border-white/20 flex items-center justify-center text-slate-500">
                  <User size={24} />
                </div>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-slate-200 block">
                Foto de Perfil (Opcional)
              </label>
              <p className="text-[11px] text-slate-400">
                Visible en las 4 plantillas (en CAS / Estado como Foto Carné oficial, en Ejecutiva, ATS y Tech). Formatos JPG, PNG o WebP.
              </p>
              <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold cursor-pointer border border-white/10 transition-colors shadow-sm">
                <Upload size={13} className="text-emerald-400" />
                <span>{data.personal.photoUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-300 font-mono flex items-center justify-between">
                <span>Nombres y Apellidos Completos: *</span>
                {!data.personal.fullName?.trim() && (
                  <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>
                )}
              </label>
              <input
                type="text"
                value={data.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                placeholder="JUAN ALBERTO PÉREZ RODRÍGUEZ"
                className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                  !data.personal.fullName?.trim()
                    ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                    : 'border border-white/10 bg-slate-950 focus:border-emerald-500/60'
                }`}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-mono">Título Profesional / Headline:</label>
              <input
                type="text"
                value={data.personal.headline}
                onChange={(e) => updatePersonal('headline', e.target.value)}
                placeholder="Ingeniero de Sistemas | Especialista en Contrataciones del Estado"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-mono flex items-center justify-between">
                <span>N° DNI / C.E.: *</span>
                {!data.personal.dni?.trim() && (
                  <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>
                )}
              </label>
              <input
                type="text"
                value={data.personal.dni}
                onChange={(e) => updatePersonal('dni', e.target.value)}
                placeholder="45678912"
                className={`w-full p-2.5 rounded-xl font-mono text-white transition-all focus:outline-none ${
                  !data.personal.dni?.trim()
                    ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                    : 'border border-white/10 bg-slate-950 focus:border-emerald-500/60'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">N° RUC (10):</label>
              <input
                type="text"
                value={data.personal.ruc}
                onChange={(e) => updatePersonal('ruc', e.target.value)}
                placeholder="10456789123"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-mono flex items-center justify-between">
                <span>Celular / Teléfono: *</span>
                {!data.personal.phone?.trim() && (
                  <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>
                )}
              </label>
              <input
                type="text"
                suppressHydrationWarning
                value={data.personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                placeholder="+51 987 654 321"
                className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                  !data.personal.phone?.trim()
                    ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                    : 'border border-white/10 bg-slate-950 focus:border-emerald-500/60'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-mono flex items-center justify-between">
                <span>Correo Electrónico: *</span>
                {!data.personal.email?.trim() && (
                  <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>
                )}
              </label>
              <input
                type="email"
                suppressHydrationWarning
                value={data.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                placeholder="juan.perez@email.com"
                className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                  !data.personal.email?.trim()
                    ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                    : 'border border-white/10 bg-slate-950 focus:border-emerald-500/60'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Dirección Domiciliaria:</label>
              <input
                type="text"
                value={data.personal.address}
                onChange={(e) => updatePersonal('address', e.target.value)}
                placeholder="Av. Javier Prado Este 2450"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Ciudad y País:</label>
              <input
                type="text"
                value={data.personal.city}
                onChange={(e) => updatePersonal('city', e.target.value)}
                placeholder="Lima, Perú"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-mono">Colegiatura Profesional (Si aplica):</label>
              <input
                type="text"
                value={data.personal.colegiatoria}
                onChange={(e) => updatePersonal('colegiatoria', e.target.value)}
                placeholder="CIP N° 245890 (Colegiado y Habilitado)"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Perfil LinkedIn (Opcional):</label>
              <input
                type="text"
                value={data.personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                placeholder="linkedin.com/in/juanperez"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Portafolio / Web (Opcional):</label>
              <input
                type="text"
                value={data.personal.website}
                onChange={(e) => updatePersonal('website', e.target.value)}
                placeholder="github.com/juanperez"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Bottom step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <div />
            <button
              type="button"
              onClick={goToNextSection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Continuar a Perfil</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: PERFIL PROFESIONAL */}
      {activeSection === 'profile' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Resumen Profesional / Perfil Ejecutivo</span>
            </h3>
            <div className="flex items-center gap-2">
              {isProfilePending ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10.5px] font-mono font-bold tracking-wide animate-pulse">
                  <AlertCircle size={12} className="text-rose-400" />
                  <span>⚠️ Resumen por redactar</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>✓ Completo</span>
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-400">Paso 2 de 6</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-400">
              Escribe un resumen conciso de 3 a 5 líneas destacando tus años de trayectoria, especialidades principales, logros y vocación de servicio.
            </p>
            <textarea
              rows={6}
              value={data.profileSummary}
              onChange={(e) => onChange({ ...data, profileSummary: e.target.value })}
              placeholder="Ingeniero de Sistemas colegiado con más de 7 años de experiencia liderando proyectos..."
              className={`w-full p-3 rounded-2xl text-white leading-relaxed focus:outline-none shadow-inner transition-all ${
                isProfilePending
                  ? 'border-2 border-rose-500/80 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : 'border border-white/10 bg-slate-950 focus:border-emerald-500/60'
              }`}
            />
            <div className="flex justify-between text-[11px] font-mono">
              {isProfilePending ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> Redacta tu resumen profesional para que figure en tu CV.
                </span>
              ) : (
                <span className="text-slate-500">Consejo: Menciona normativas (Ley 30225, SERVIR) o tecnologías clave.</span>
              )}
              <span className={data.profileSummary.length < 20 ? 'text-rose-400 font-semibold' : 'text-slate-500'}>
                {data.profileSummary.length} caracteres
              </span>
            </div>
          </div>

          {/* Bottom step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={goToPrevSection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver a Personal</span>
            </button>
            <button
              type="button"
              onClick={goToNextSection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Continuar a Educación</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: FORMACIÓN ACADÉMICA */}
      {activeSection === 'education' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Formación Académica ({data.education.length})</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Grados universitarios, técnicos, bachilleres, títulos o posgrados.
              </p>
            </div>

            {/* Professional executive Add button */}
            <button
              type="button"
              onClick={addEducation}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-md shadow-emerald-950/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] border border-emerald-300/40 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="p-0.5 rounded-md bg-black/15 group-hover:rotate-90 transition-transform duration-300">
                <Plus size={14} className="stroke-[3]" />
              </span>
              <span>+ Agregar Grado</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {data.education.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-white/10 text-center space-y-3 bg-slate-950/40">
                <GraduationCap size={32} className="mx-auto text-slate-600" />
                <div className="space-y-1">
                  <p className="text-slate-300 font-bold text-xs">No has agregado grados académicos aún</p>
                  <p className="text-slate-500 text-[11px]">Agrega tu grado universitario, bachiller, título o maestría para que figure en tu CV.</p>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>+ Agregar Primer Grado</span>
                </button>
              </div>
            ) : (
              data.education.map((edu, idx) => {
                const isPending = !edu.carrera?.trim() || !edu.institution?.trim();
                return (
                  <div
                    key={edu.id}
                    className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 space-y-3.5 text-xs relative ${
                      isPending
                        ? 'border-2 border-rose-500 bg-gradient-to-b from-rose-950/25 via-slate-950/95 to-slate-950/95 shadow-[0_0_22px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/40'
                        : 'border border-emerald-500/30 bg-slate-950/80 hover:border-emerald-500/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono font-bold text-xs ${isPending ? 'text-rose-400' : 'text-emerald-400'}`}>
                          Grado Académico N° {idx + 1}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10.5px] font-mono font-bold tracking-wide animate-pulse">
                            <AlertCircle size={12} className="text-rose-400" />
                            <span>⚠️ Campos por completar</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>✓ Completo</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
                        title="Eliminar este grado"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[11px]">Nivel o Condición Académica:</label>
                        <select
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="SECUNDARIA COMPLETA">Secundaria Completa</option>
                          <option value="TÉCNICO EGRESADO">Técnico Egresado</option>
                          <option value="TÉCNICO TITULADO">Técnico Titulado</option>
                          <option value="EGRESADO UNIVERSITARIO">Egresado Universitario</option>
                          <option value="BACHILLER">Bachiller Universitario</option>
                          <option value="TITULADO Y COLEGIADO">Titulado y Colegiado Habilitado</option>
                          <option value="MAESTRÍA">Maestría</option>
                          <option value="DOCTORADO">Doctorado</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
                          <span>Carrera o Especialidad: *</span>
                          {!edu.carrera?.trim() && <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>}
                        </label>
                        <input
                          type="text"
                          value={edu.carrera}
                          onChange={(e) => updateEducation(edu.id, 'carrera', e.target.value)}
                          placeholder="Ej: Ingeniería de Sistemas e Informática"
                          className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                            !edu.carrera?.trim()
                              ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                              : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
                          <span>Universidad o Instituto: *</span>
                          {!edu.institution?.trim() && <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>}
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Ej: Universidad Nacional Mayor de San Marcos"
                          className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                            !edu.institution?.trim()
                              ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                              : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[11px]">Año / Periodo (Egreso o Título):</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                          placeholder="Ej: 2018 - 2022"
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/60"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={goToPrevSection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver a Perfil</span>
            </button>
            <button
              type="button"
              onClick={goToNextSection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Continuar a Experiencia</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 4: EXPERIENCIA LABORAL */}
      {activeSection === 'experience' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Experiencia Laboral ({data.experiences.length})</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Clasifica entre Experiencia General o Específica según las bases CAS.
              </p>
            </div>

            {/* Professional executive Add button */}
            <button
              type="button"
              onClick={addExperience}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-md shadow-emerald-950/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] border border-emerald-300/40 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="p-0.5 rounded-md bg-black/15 group-hover:rotate-90 transition-transform duration-300">
                <Plus size={14} className="stroke-[3]" />
              </span>
              <span>+ Agregar Experiencia</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.experiences.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-white/10 text-center space-y-3 bg-slate-950/40">
                <Briefcase size={32} className="mx-auto text-slate-600" />
                <div className="space-y-1">
                  <p className="text-slate-300 font-bold text-xs">No has registrado experiencias laborales</p>
                  <p className="text-slate-500 text-[11px]">Agrega tus empleos anteriores o cargos actuales para calcular tus tiempos de servicio.</p>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>+ Agregar Primer Empleo</span>
                </button>
              </div>
            ) : (
              data.experiences.map((exp, idx) => {
                const isPending = !exp.entity?.trim() || !exp.role?.trim();
                return (
                  <div
                    key={exp.id}
                    className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 space-y-3.5 text-xs relative ${
                      isPending
                        ? 'border-2 border-rose-500 bg-gradient-to-b from-rose-950/25 via-slate-950/95 to-slate-950/95 shadow-[0_0_22px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/40'
                        : 'border border-emerald-500/30 bg-slate-950/80 hover:border-emerald-500/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono font-bold text-xs ${isPending ? 'text-rose-400' : 'text-emerald-400'}`}>
                          Experiencia N° {idx + 1}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10.5px] font-mono font-bold tracking-wide animate-pulse">
                            <AlertCircle size={12} className="text-rose-400" />
                            <span>⚠️ Campos por completar</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Completo</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
                        title="Eliminar este empleo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
                          <span>Entidad Pública / Empresa: *</span>
                          {!exp.entity?.trim() && <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>}
                        </label>
                        <input
                          type="text"
                          value={exp.entity}
                          onChange={(e) => updateExperience(exp.id, 'entity', e.target.value)}
                          placeholder="Ej: Ministerio de Educación (MINEDU) / Empresa S.A.C."
                          className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                            !exp.entity?.trim()
                              ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                              : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
                          <span>Cargo Desempeñado: *</span>
                          {!exp.role?.trim() && <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>}
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Ej: Coordinador de Sistemas / Analista Programador"
                          className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                            !exp.role?.trim()
                              ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                              : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[11px]">Periodo / Tiempo:</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                          placeholder="Ej: 01/2023 - 12/2024 (24 Meses)"
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/60"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[11px]">Clasificación de Experiencia (CAS):</label>
                        <select
                          value={exp.type}
                          onChange={(e) => updateExperience(exp.id, 'type', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Específica">Experiencia Específica (Relacionada al puesto)</option>
                          <option value="General">Experiencia General (Trayectoria acumulada)</option>
                        </select>
                      </div>
                    </div>

                    {/* Funciones y logros con botón profesional */}
                    <div className="space-y-2.5 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-mono text-[11px] font-semibold">
                          Funciones y Logros Destacados ({(exp.functions || []).filter(f => f.trim()).length}):
                        </label>
                        <button
                          type="button"
                          onClick={() => addFunctionToExperience(exp.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 font-mono text-[11px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <Plus size={12} className="stroke-[3]" />
                          <span>+ Agregar Viñeta</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(exp.functions || []).map((fn, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <input
                              type="text"
                              value={fn}
                              onChange={(e) => updateFunctionInExperience(exp.id, fIdx, e.target.value)}
                              placeholder="Ej: Liderazgo en la modernización de servicios y mesa de partes digital..."
                              className="flex-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-emerald-500/60"
                            />
                            <button
                              type="button"
                              onClick={() => removeFunctionFromExperience(exp.id, fIdx)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Quitar viñeta"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={goToPrevSection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver a Educación</span>
            </button>
            <button
              type="button"
              onClick={goToNextSection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Continuar a Cursos</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 5: CURSOS Y CAPACITACIONES */}
      {activeSection === 'courses' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Capacitaciones & Horas Lectivas ({data.courses.length})</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cómputo de horas mínimas exigidas por el Estado (SERVIR) y el sector privado.
              </p>
            </div>

            {/* Professional executive Add button */}
            <button
              type="button"
              onClick={addCourse}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-md shadow-emerald-950/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] border border-emerald-300/40 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="p-0.5 rounded-md bg-black/15 group-hover:rotate-90 transition-transform duration-300">
                <Plus size={14} className="stroke-[3]" />
              </span>
              <span>+ Agregar Curso</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {data.courses.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-white/10 text-center space-y-3 bg-slate-950/40">
                <BookOpen size={32} className="mx-auto text-slate-600" />
                <div className="space-y-1">
                  <p className="text-slate-300 font-bold text-xs">No has registrado cursos o diplomados</p>
                  <p className="text-slate-500 text-[11px]">Agrega diplomados, talleres o certificaciones para sustentar horas lectivas en convocatorias.</p>
                </div>
                <button
                  type="button"
                  onClick={addCourse}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>+ Agregar Primer Curso</span>
                </button>
              </div>
            ) : (
              data.courses.map((c, idx) => {
                const isPending = !c.title?.trim() || !c.inst?.trim();
                return (
                  <div
                    key={c.id}
                    className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 space-y-3 text-xs relative ${
                      isPending
                        ? 'border-2 border-rose-500 bg-gradient-to-b from-rose-950/25 via-slate-950/95 to-slate-950/95 shadow-[0_0_22px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/40'
                        : 'border border-emerald-500/30 bg-slate-950/80 hover:border-emerald-500/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono font-bold text-xs ${isPending ? 'text-rose-400' : 'text-emerald-400'}`}>
                          Curso N° {idx + 1}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10.5px] font-mono font-bold tracking-wide animate-pulse">
                            <AlertCircle size={12} className="text-rose-400" />
                            <span>⚠️ Campos por completar</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Completo</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCourse(c.id)}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
                        title="Eliminar este curso"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
                        <span>Denominación del Curso / Diplomado: *</span>
                        {!c.title?.trim() && <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>}
                      </label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => updateCourse(c.id, 'title', e.target.value)}
                        placeholder="Ej: Diplomado en Contrataciones del Estado y SEACE / Scrum Master"
                        className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                          !c.title?.trim()
                            ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                            : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-slate-300 font-mono text-[11px] flex items-center justify-between">
                          <span>Institución Dictante: *</span>
                          {!c.inst?.trim() && <span className="text-rose-400 text-[10px] font-semibold">Requerido</span>}
                        </label>
                        <input
                          type="text"
                          value={c.inst}
                          onChange={(e) => updateCourse(c.id, 'inst', e.target.value)}
                          placeholder="Ej: OSCE / ENAP - SERVIR / Pontificia Universidad Católica"
                          className={`w-full p-2.5 rounded-xl text-white transition-all focus:outline-none ${
                            !c.inst?.trim()
                              ? 'border-2 border-rose-500/70 bg-rose-950/20 focus:border-rose-400 placeholder:text-rose-300/40'
                              : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[11px]">Horas Lectivas:</label>
                        <input
                          type="text"
                          value={c.hours}
                          onChange={(e) => updateCourse(c.id, 'hours', e.target.value)}
                          placeholder="Ej: 120 horas"
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-500/60"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={goToPrevSection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver a Experiencia</span>
            </button>
            <button
              type="button"
              onClick={goToNextSection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Continuar a Skills & Idiomas</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 6: HABILIDADES & IDIOMAS */}
      {activeSection === 'skills' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          {/* Competencias Clave */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Award size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Competencias & Habilidades Clave ({data.skills.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Herramientas, metodologías o normativas específicas del cargo.
                </p>
              </div>
              <div>
                {isSkillsEmpty ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10.5px] font-mono font-bold tracking-wide animate-pulse">
                    <AlertCircle size={12} className="text-rose-400" />
                    <span>⚠️ Mínimo 1 habilidad</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>✓ {data.skills.length} Habilidades</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Escribe una habilidad (ej: SIAF, SEACE, Liderazgo, Python) y pulsa Enter..."
                className={`flex-1 p-2.5 rounded-xl text-white text-xs focus:outline-none shadow-inner transition-all ${
                  isSkillsEmpty
                    ? 'border-2 border-rose-500/60 bg-rose-950/20 placeholder:text-rose-300/40 focus:border-rose-400'
                    : 'border border-white/10 bg-slate-950 focus:border-emerald-500/60'
                }`}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-md shadow-emerald-950/40 border border-emerald-400/40 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer shrink-0"
              >
                + Añadir Skill
              </button>
            </div>

            {data.skills.length === 0 ? (
              <div className="p-4 rounded-2xl border-2 border-dashed border-rose-500/70 bg-rose-950/20 text-center space-y-1 shadow-[0_0_15px_rgba(244,63,94,0.12)]">
                <p className="text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5">
                  <AlertCircle size={14} className="text-rose-400" />
                  <span>⚠️ No has añadido habilidades clave aún</span>
                </p>
                <p className="text-slate-400 text-[11px]">
                  Escribe al menos 3 competencias técnicas o blandas arriba y presiona "+ Añadir Skill".
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-slate-200 text-xs flex items-center gap-2 shadow-sm hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-0.5"
                      title="Eliminar habilidad"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Idiomas */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <Languages size={16} className="text-emerald-400" />
                  <span>Idiomas ({data.languages.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Lenguas nativas o extranjeras con nivel de dominio acreditado.
                </p>
              </div>

              {/* Professional executive Add button */}
              <button
                type="button"
                onClick={addLanguage}
                className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-md shadow-emerald-950/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] border border-emerald-300/40 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span className="p-0.5 rounded-md bg-black/15 group-hover:rotate-90 transition-transform duration-300">
                  <Plus size={13} className="stroke-[3]" />
                </span>
                <span>+ Agregar Idioma</span>
              </button>
            </div>

            <div className="space-y-2">
              {data.languages.map((l) => {
                const isPending = !l.name?.trim();
                return (
                  <div
                    key={l.id}
                    className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs ${
                      isPending
                        ? 'border-2 border-rose-500 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : 'border border-white/10 bg-slate-950/80'
                    }`}
                  >
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) => updateLanguage(l.id, 'name', e.target.value)}
                      placeholder="Ej: Inglés / Francés / Quechua"
                      className={`flex-1 p-2 rounded-lg text-white transition-all focus:outline-none ${
                        isPending
                          ? 'border border-rose-500/70 bg-rose-950/30 focus:border-rose-400 placeholder:text-rose-300/40'
                          : 'border border-white/10 bg-slate-900 focus:border-emerald-500/60'
                      }`}
                    />
                    <select
                      value={l.level}
                      onChange={(e) => updateLanguage(l.id, 'level', e.target.value)}
                      className="p-2 rounded-lg bg-slate-900 border border-white/10 text-emerald-400 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Nativo">Nativo</option>
                      <option value="Bilingüe">Bilingüe</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeLanguage(l.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/5 hover:border-rose-500/40 transition-all cursor-pointer"
                      title="Eliminar idioma"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom step navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6 flex-wrap gap-2">
            <button
              type="button"
              onClick={goToPrevSection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver a Cursos</span>
            </button>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={16} />
              <span>¡Todo listo! Revisa tu vista previa a la derecha y descarga en PDF o Word.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
