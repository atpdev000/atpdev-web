import { getAllExperiences, getAllSkills } from "@atpdev/database";
import { Plus, User2 } from "lucide-react";
import {
  addExperience, editExperience, removeExperience, toggleExperienceActive,
  addSkill, editSkill, removeSkill, toggleSkillActive,
} from "./actions";
import ExperienceCard from "./ExperienceCard";
import SkillCard from "./SkillCard";

const ICON_OPTIONS = [
  { key: "briefcase", label: "💼 Briefcase" },
  { key: "book",      label: "📖 Book" },
  { key: "laptop",    label: "💻 Laptop" },
  { key: "activity",  label: "⚡ Activity" },
  { key: "star",      label: "⭐ Star" },
  { key: "code2",     label: "🖥️ Code" },
  { key: "smartphone",label: "📱 Smartphone" },
  { key: "database",  label: "🗄️ Database" },
  { key: "brain",     label: "🧠 Brain" },
  { key: "server",    label: "🖧 Server" },
];

const COLOR_OPTIONS = [
  { key: "blue",    label: "Azul"       },
  { key: "purple",  label: "Violeta"    },
  { key: "emerald", label: "Verde"      },
  { key: "amber",   label: "Ámbar"      },
  { key: "rose",    label: "Rosa"       },
  { key: "green",   label: "Verde claro"},
];

const inputClass  = "bg-[#1A1A1A] border border-gray-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm w-full";
const labelClass  = "text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block";
const selectClass = "bg-[#1A1A1A] border border-gray-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm w-full";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const [experiences, skills] = await Promise.all([getAllExperiences(), getAllSkills()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <User2 className="text-blue-500" size={30} />
          Perfil Profesional
        </h1>
        <p className="text-gray-400">
          Gestiona tu trayectoria laboral y habilidades técnicas. Los cambios se reflejan al instante en el portal.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ══════════════════════════════════════════
            COLUMNA 1: EXPERIENCIA LABORAL
        ══════════════════════════════════════════ */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            💼 Trayectoria Laboral
            <span className="text-xs font-normal text-gray-500 ml-1">({experiences.length} entradas)</span>
          </h2>

          {experiences.length === 0 ? (
            <div className="bg-\[\#262626\] border border-dashed border-gray-700 rounded-2xl p-8 text-center text-gray-500 text-sm">
              No hay experiencias. Añade una abajo.
            </div>
          ) : (
            experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                iconOptions={ICON_OPTIONS}
                colorOptions={COLOR_OPTIONS}
                editAction={editExperience}
                removeAction={removeExperience}
                toggleAction={toggleExperienceActive}
              />
            ))
          )}

          {/* ── Formulario Añadir ── */}
          <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-5 mt-2">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={16} className="text-blue-500" /> Añadir Experiencia
            </h3>
            <form action={addExperience} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Cargo / Rol</label><input type="text" name="role" required placeholder="Ej. Docente" className={inputClass} /></div>
                <div><label className={labelClass}>Empresa</label><input type="text" name="company" required placeholder="Ej. IEST..." className={inputClass} /></div>
                <div><label className={labelClass}>Período</label><input type="text" name="date_range" required placeholder="Ej. 2023 – Presente" className={inputClass} /></div>
                <div><label className={labelClass}>Orden</label><input type="number" name="sort_order" defaultValue={experiences.length + 1} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Ícono</label>
                  <select name="icon_key" className={selectClass}>{ICON_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}</select>
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {COLOR_OPTIONS.map(o => {
                      const bgMap: Record<string, string> = { blue: 'bg-blue-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500', green: 'bg-green-500' };
                      return (
                        <label key={o.key} className="cursor-pointer group relative" title={o.label}>
                          <input type="radio" name="color_key" value={o.key} defaultChecked={o.key === 'blue'} className="peer sr-only" />
                          <div className={`w-6 h-6 rounded-full border-2 border-transparent peer-checked:border-white ${bgMap[o.key] || 'bg-gray-500'} transition-all group-hover:scale-110 shadow-sm peer-checked:scale-110 peer-checked:shadow-[0_0_10px_rgba(255,255,255,0.3)]`}></div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div><label className={labelClass}>Descripción</label><textarea name="description" required rows={2} placeholder="Descripción..." className={inputClass + " resize-none"} /></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                <Plus size={14} /> Guardar
              </button>
            </form>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            COLUMNA 2: HABILIDADES TÉCNICAS
        ══════════════════════════════════════════ */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            🖥️ Habilidades Técnicas
            <span className="text-xs font-normal text-gray-500 ml-1">({skills.length} categorías)</span>
          </h2>

          {skills.length === 0 ? (
            <div className="bg-\[\#262626\] border border-dashed border-gray-700 rounded-2xl p-8 text-center text-gray-500 text-sm">
              No hay categorías. Añade una abajo.
            </div>
          ) : (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                iconOptions={ICON_OPTIONS}
                colorOptions={COLOR_OPTIONS}
                editAction={editSkill}
                removeAction={removeSkill}
                toggleAction={toggleSkillActive}
              />
            ))
          )}

          {/* ── Formulario Añadir ── */}
          <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-5 mt-2">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={16} className="text-purple-500" /> Añadir Categoría de Skills
            </h3>
            <form action={addSkill} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Categoría</label><input type="text" name="category" required placeholder="Ej. Frontend & Web" className={inputClass} /></div>
                <div><label className={labelClass}>Orden</label><input type="number" name="sort_order" defaultValue={skills.length + 1} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Ícono</label>
                  <select name="icon_key" className={selectClass}>{ICON_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}</select>
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {COLOR_OPTIONS.map(o => {
                      const bgMap: Record<string, string> = { blue: 'bg-blue-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500', green: 'bg-green-500' };
                      return (
                        <label key={o.key} className="cursor-pointer group relative" title={o.label}>
                          <input type="radio" name="color_key" value={o.key} defaultChecked={o.key === 'blue'} className="peer sr-only" />
                          <div className={`w-6 h-6 rounded-full border-2 border-transparent peer-checked:border-white ${bgMap[o.key] || 'bg-gray-500'} transition-all group-hover:scale-110 shadow-sm peer-checked:scale-110 peer-checked:shadow-[0_0_10px_rgba(255,255,255,0.3)]`}></div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div><label className={labelClass}>Tecnologías (separadas por coma)</label><input type="text" name="items" required placeholder="Ej. Next.js, React, TypeScript" className={inputClass} /></div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                <Plus size={14} /> Guardar
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
