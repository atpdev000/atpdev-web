'use client';

import React from 'react';
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, User } from 'lucide-react';
import { CvData } from '../types';

function LinkedinIcon({ size = 13, className = "" }: { size?: number; className?: string }) {
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

export function TemplateModernExecutive({ data }: TemplateProps) {
  const { personal, profileSummary, education, courses, experiences, skills, languages } = data;

  return (
    <div className="bg-white text-slate-800 font-sans text-[11px] leading-relaxed max-w-[820px] mx-auto shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-6 print:sm:p-8 print:m-0 print:max-w-none print:w-full print:bg-white print:min-h-0 flex flex-row print:flex-row items-stretch min-h-[1050px]">
      {/* Columna Izquierda (Sidebar con acento azul pizarra corporativo) */}
      <aside className="w-[33%] print:w-[33%] shrink-0 bg-slate-900 text-slate-100 p-6 sm:p-7 space-y-6 print:p-6 print:space-y-4 print:bg-slate-900 print:text-white border-r border-slate-800 rounded-l-xl print:rounded-l-lg">
        {/* Foto de Perfil si está presente */}
        <div className="flex flex-col items-center text-center">
          {personal.photoUrl ? (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              className="w-28 h-28 rounded-full object-cover border-2 border-emerald-400 shadow-md mb-3"
              style={{ width: '96px', height: '96px' }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 mb-3">
              <User size={36} />
            </div>
          )}
          <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">
            {personal.dni ? `DNI: ${personal.dni}` : 'PERÚ'}
          </div>
          {personal.ruc && (
            <div className="font-mono text-[9px] text-slate-400">
              RUC: {personal.ruc}
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800 cv-avoid-break">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Contacto
          </h3>
          <div className="space-y-2 text-[10px] text-slate-300">
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-400 shrink-0" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-emerald-400 shrink-0" />
                <span className="break-all">{personal.email}</span>
              </div>
            )}
            {personal.city && (
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-emerald-400 shrink-0" />
                <span>{personal.city}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-2">
                <LinkedinIcon size={13} className="text-emerald-400 shrink-0" />
                <span className="break-all">{personal.linkedin}</span>
              </div>
            )}
            {personal.website && (
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-emerald-400 shrink-0" />
                <span className="break-all">{personal.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Competencias & Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-2 cv-avoid-break">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Competencias
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[9.5px] border border-slate-700/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <div className="space-y-2 cv-avoid-break">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Idiomas
            </h3>
            <div className="space-y-1.5 text-[10px]">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-slate-300">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-emerald-400 font-mono text-[9px] bg-slate-800/90 px-1.5 py-0.5 rounded">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habilitación Profesional */}
        {personal.colegiatoria && (
          <div className="space-y-1 pt-2 border-t border-slate-800 text-[9.5px] cv-avoid-break">
            <span className="text-emerald-400 font-bold block">Colegiatura:</span>
            <span className="text-slate-300">{personal.colegiatoria}</span>
          </div>
        )}
      </aside>

      {/* Columna Derecha (Contenido Principal) */}
      <div className="w-[67%] print:w-[67%] flex-1 p-8 sm:p-9 space-y-6 print:p-6 print:space-y-4 bg-white print:bg-white text-slate-900 rounded-r-xl print:rounded-r-lg border border-l-0 border-slate-200">
        {/* Cabecera Principal */}
        <div role="banner" className="cv-header border-b-2 border-slate-900 pb-4 cv-avoid-break">
          <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight font-serif">
            {personal.fullName || 'NOMBRES Y APELLIDOS'}
          </h2>
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mt-1">
            {personal.headline || 'PROFESIONAL / ESPECIALISTA'}
          </p>
        </div>

        {/* Perfil Profesional */}
        {profileSummary && (
          <section className="space-y-1.5 cv-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <User size={14} className="text-emerald-600" />
              <span>Perfil Profesional</span>
            </h2>
            <p className="text-[10.5px] text-slate-700 leading-relaxed text-justify">
              {profileSummary}
            </p>
          </section>
        )}

        {/* Experiencia Laboral */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <Briefcase size={14} className="text-emerald-600" />
            <span>Experiencia Laboral</span>
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-1 cv-avoid-break">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-bold text-slate-950 text-[11px]">
                    {exp.role || (exp.entity ? '' : '(Nuevo empleo en edición)')}{' '}
                    {exp.entity && <span className="font-normal text-slate-600">— {exp.entity}</span>}
                  </h3>
                  <span className="text-[9.5px] font-mono font-medium text-slate-500 shrink-0">
                    {exp.period}
                  </span>
                </div>
                {exp.type && (
                  <span className="inline-block text-[8.5px] uppercase font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Exp. {exp.type}
                  </span>
                )}
                {exp.functions && exp.functions.filter((fn) => fn.trim().length > 0).length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700 mt-1 pl-1">
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

        {/* Formación Académica */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <GraduationCap size={14} className="text-emerald-600" />
            <span>Formación Académica</span>
          </h2>
          <div className="space-y-2.5">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline gap-2 cv-avoid-break">
                <div>
                  <span className="font-bold text-slate-900 text-[10.5px]">
                    {edu.carrera ? `${edu.degree}: ${edu.carrera}` : edu.degree || '(Nuevo grado en edición)'}
                  </span>
                  {(edu.institution || edu.status) && (
                    <div className="text-[10px] text-slate-600">
                      {edu.institution} {edu.status ? `• ${edu.status}` : ''}
                    </div>
                  )}
                </div>
                {edu.year && (
                  <span className="font-mono text-[9.5px] text-slate-500 font-medium shrink-0">
                    {edu.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Cursos y Especializaciones */}
        {courses && courses.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Award size={14} className="text-emerald-600" />
              <span>Cursos & Especializaciones</span>
            </h2>
            <div className="space-y-2">
              {courses.map((course, idx) => (
                <div key={course.id || idx} className="flex justify-between items-baseline gap-2 text-[10px] cv-avoid-break">
                  <div>
                    <span className="font-semibold text-slate-900">{course.title || '(Nuevo curso en edición)'}</span>
                    {course.inst && <span className="text-slate-500"> — {course.inst}</span>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-800 font-mono text-[9.5px] bg-slate-100 px-1 py-0.5 rounded">
                      {course.hours}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
