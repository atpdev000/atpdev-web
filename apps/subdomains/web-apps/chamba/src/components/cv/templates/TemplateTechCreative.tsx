'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe, UserCheck, Terminal, BookOpen, Briefcase, Award } from 'lucide-react';
import { CvData } from '../types';

function LinkedinIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface TemplateProps {
  data: CvData;
}

export function TemplateTechCreative({ data }: TemplateProps) {
  const { personal, profileSummary, education, courses, experiences, skills, languages } = data;

  return (
    <div className="bg-white text-slate-900 font-sans text-[11px] leading-relaxed p-8 sm:p-10 max-w-[820px] mx-auto shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-10 print:sm:p-12 print:m-0 print:max-w-none print:w-full print:bg-white space-y-5 print:space-y-3.5">
      {/* Top Banner Accent */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full print:bg-emerald-600 -mt-2 mb-2 print:mt-0 print:mb-2.5" />

      {/* Header */}
      <div role="banner" className="cv-header flex flex-col sm:flex-row print:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-200 cv-avoid-break">
        <div className="space-y-1 flex-1">
          <h2 className="text-2xl font-black tracking-tight text-slate-950 font-display">
            {personal.fullName || 'NOMBRES Y APELLIDOS'}
          </h2>
          <p className="text-xs font-bold text-emerald-600 tracking-wide font-mono">
            {personal.headline || 'PROFESIONAL TECNOLÓGICO & DIGITAL'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-slate-600">
            {personal.city && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-emerald-500" />
                {personal.city}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} className="text-emerald-500" />
                {personal.phone}
              </span>
            )}
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} className="text-emerald-500" />
                {personal.email}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinIcon size={12} className="text-emerald-500" />
                {personal.linkedin}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1">
                <Globe size={12} className="text-emerald-500" />
                {personal.website}
              </span>
            )}
          </div>
        </div>

        {/* Photo and IDs */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName || 'Foto'}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
              style={{ width: '72px', height: '72px' }}
            />
          )}
          <div className="text-right font-mono text-[9px] text-slate-500">
            {personal.dni && <div>DNI: {personal.dni}</div>}
            {personal.ruc && <div>RUC: {personal.ruc}</div>}
          </div>
        </div>
      </div>

      {/* Profile summary */}
      {profileSummary && (
        <section className="space-y-1 cv-avoid-break">
          <div className="flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-wider text-slate-900">
            <UserCheck size={14} className="text-emerald-500" />
            <span>Perfil Profesional & Visión</span>
          </div>
          <p className="text-[10.5px] text-slate-700 leading-relaxed text-justify bg-slate-50 p-3 rounded-xl border border-slate-100">
            {profileSummary}
          </p>
        </section>
      )}

      {/* Experiencia Laboral */}
      <section className="space-y-3 print:space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
          <Briefcase size={14} className="text-emerald-500" />
          <span>Trayectoria & Experiencia Profesional</span>
        </div>
        <div className="space-y-3 print:space-y-2">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-1 cv-avoid-break">
              <div className="flex justify-between items-baseline gap-2">
                <div>
                  <h3 className="font-bold text-slate-950 text-[11px]">
                    {exp.role || (exp.entity ? '' : '(Nuevo empleo en edición)')}
                  </h3>
                  {exp.entity && (
                    <span className="text-[10px] font-semibold text-emerald-700">
                      {exp.entity}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[9.5px] font-medium text-slate-500 block">
                    {exp.period}
                  </span>
                  {exp.type && (
                    <span className="inline-block text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Exp. {exp.type}
                    </span>
                  )}
                </div>
              </div>
              {exp.functions && exp.functions.filter((fn) => fn.trim().length > 0).length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700 pl-1">
                  {exp.functions
                    .filter((fn) => fn.trim().length > 0)
                    .map((fn, fIdx) => (
                      <li key={fIdx} className="leading-snug">{fn}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Grid: Formación Académica & Habilidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 print:gap-3 cv-avoid-break">
        {/* Educación */}
        <section className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            <BookOpen size={14} className="text-emerald-500" />
            <span>Formación Académica</span>
          </div>
          <div className="space-y-1.5">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="space-y-0.5">
                <div className="font-bold text-slate-900 text-[10.5px]">
                  {edu.carrera || edu.degree}
                </div>
                <div className="text-[10px] text-slate-600">
                  {edu.institution}
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  {edu.year} {edu.status && `• ${edu.status}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stack Tecnológico & Habilidades */}
        <section className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            <Terminal size={14} className="text-emerald-500" />
            <span>Stack Técnico & Competencias</span>
          </div>
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-0.5 rounded-lg text-[9.5px] font-mono font-medium border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {languages && languages.length > 0 && (
            <div className="pt-1 text-[10px]">
              <span className="font-bold text-slate-900 block mb-0.5">Idiomas:</span>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((l) => (
                  <span key={l.id} className="text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[9.5px]">
                    {l.name} <strong className="text-emerald-600 font-mono">({l.level})</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Cursos y Especializaciones */}
      {courses && courses.length > 0 && (
        <section className="space-y-1.5 cv-avoid-break">
          <div className="flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            <Award size={14} className="text-emerald-500" />
            <span>Cursos de Especialización & Certificaciones</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2 text-[10px]">
            {courses.map((course, idx) => (
              <div key={course.id || idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center gap-2">
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">{course.title}</span>
                  <span className="text-[9px] text-slate-500">{course.inst}</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                  {course.hours}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
