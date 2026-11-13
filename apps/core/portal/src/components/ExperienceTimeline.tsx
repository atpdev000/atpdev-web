"use client";

import { motion } from "framer-motion";
import { Briefcase, BookOpen, Laptop, Activity, Star } from "lucide-react";
import { Experience } from "@atpdev/database";
import { getUiDictionary } from "@/utils/i18n-ui";

// Mapeo de icon_key → icono Lucide
const ICON_MAP: Record<string, React.ReactNode> = {
  briefcase: <Briefcase size={20} />,
  book:      <BookOpen size={20} />,
  laptop:    <Laptop size={20} />,
  activity:  <Activity size={20} />,
  star:      <Star size={20} />,
};

// Mapeo de color_key → clases Tailwind y tokens accesibles
const COLOR_MAP: Record<string, { colorVar: string; border: string; bg: string; dot: string }> = {
  blue:   { colorVar: "var(--badge-blue-text)",   border: "border-blue-500",   bg: "bg-blue-500/20",   dot: "border-blue-500"   },
  purple: { colorVar: "var(--badge-purple-text)", border: "border-purple-500", bg: "bg-purple-500/20", dot: "border-purple-500" },
  emerald:{ colorVar: "var(--badge-green-text)",  border: "border-emerald-500",bg: "bg-emerald-500/20",dot: "border-emerald-500"},
  amber:  { colorVar: "var(--badge-amber-text)",  border: "border-amber-500",  bg: "bg-amber-500/20",  dot: "border-amber-500"  },
  rose:   { colorVar: "var(--badge-rose-text)",   border: "border-rose-500",   bg: "bg-rose-500/20",   dot: "border-rose-500"   },
};

interface ExperienceTimelineProps {
  initialExperiences?: Experience[];
  lang?: string;
  uiDict?: Record<string, string>;
  enableGlow?: boolean;
  glowStyle?: string;
}

export default function ExperienceTimeline({ initialExperiences = [], lang = 'es', uiDict, enableGlow = true, glowStyle = 'border' }: ExperienceTimelineProps) {
  const glowClass = "interactive-card";
  const experiences = initialExperiences;

  const dict = uiDict || getUiDictionary(lang);
  const ui = {
    title1: dict.expTitle1,
    title2: dict.expTitle2,
    subtitle: dict.expSubtitle,
    loadingText: dict.expLoading
  };

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4 transition-colors" style={{ color: 'var(--text-color)' }}>
            {ui.title1} <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--tertiary))' }}>{ui.title2}</span>
          </h2>
          <p className="text-lg transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
            {ui.subtitle}
          </p>
        </motion.div>

        <div className="relative">
            {/* Línea central */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, var(--primary), var(--tertiary), transparent)' }}></div>

            <div className="space-y-12">
              {experiences.map((exp, index) => {
                const colors = COLOR_MAP[exp.color_key] || COLOR_MAP.blue;
                const icon   = ICON_MAP[exp.icon_key]  || <Briefcase size={20} />;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-[-8px] md:left-1/2 transform md:-translate-x-1/2 mt-1.5 md:mt-0 w-4 h-4 rounded-full border-2 ${colors.dot} z-10 shadow-sm`} style={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}></div>

                    {/* Content */}
                    <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                      <div className={`p-6 rounded-2xl border transition-colors group relative overflow-hidden shadow-lg hover:scale-[1.02] ${glowClass}`} style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(12px)', '--glow-bg': 'var(--glass-bg)' } as React.CSSProperties}>
                        <div className={`absolute top-0 ${index % 2 === 0 ? 'left-0' : 'right-0'} w-32 h-32 ${colors.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                        <div className={`flex items-center gap-3 mb-2 ${index % 2 !== 0 && "md:justify-end"}`}>
                          <div className={`p-2 rounded-lg border shadow-sm ${colors.border} ${index % 2 !== 0 && "md:order-last"}`} style={{ backgroundColor: 'var(--pill-bg)', color: colors.colorVar }}>
                            {icon}
                          </div>
                          <span className="text-sm font-bold px-3 py-1 rounded-full border shadow-sm transition-colors" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>
                            {exp.date_range}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-1 transition-colors" style={{ color: 'var(--text-color)' }}>{exp.role}</h3>
                        <h4 className="text-md font-semibold mb-3" style={{ color: colors.colorVar }}>{exp.company}</h4>
                        <p className="text-sm leading-relaxed transition-colors" style={{ color: 'var(--text-muted)' }}>{exp.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
      </div>
    </section>
  );
}
