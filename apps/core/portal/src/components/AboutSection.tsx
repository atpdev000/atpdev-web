"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, Smartphone, Database, BrainCircuit, GraduationCap, Award, Server, ExternalLink } from "lucide-react";
import { Skill, SiteConfig } from "@atpdev/database";

// Mapeo de icon_key → componente Lucide
const ICON_MAP: Record<string, React.ReactNode> = {
  code2:      <Code2 size={16} />,
  smartphone: <Smartphone size={16} />,
  database:   <Database size={16} />,
  brain:      <BrainCircuit size={16} />,
  server:     <Server size={16} />,
};

// Mapeo de color_key → tokens con alto contraste en modo claro y oscuro
const COLOR_MAP: Record<string, { colorVar: string }> = {
  blue:   { colorVar: "var(--badge-blue-text)"   },
  green:  { colorVar: "var(--badge-green-text)"  },
  purple: { colorVar: "var(--badge-purple-text)" },
  rose:   { colorVar: "var(--badge-rose-text)"   },
  amber:  { colorVar: "var(--badge-amber-text)"  },
};

import { translateClient } from "@/utils/translate";

interface AboutSectionProps {
  initialSkills?: Skill[];
  initialCredlyUrl?: string;
  config?: SiteConfig | null;
  lang?: string;
  enableGlow?: boolean;
  glowStyle?: string;
}

export default function AboutSection({ initialSkills = [], initialCredlyUrl = "", config = null, lang = 'es', enableGlow = true, glowStyle = 'border' }: AboutSectionProps) {
  const glowClass = "interactive-card";

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [credlyUrl, setCredlyUrl] = useState<string>(initialCredlyUrl);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const [ui, setUi] = useState({
    title1: "Sobre ",
    title2: "Mí",
    subtitle: "Ingeniero de Sistemas apasionado por la docencia y el desarrollo de software de alto impacto.",
    card1Title: "Percy Acha Taipe",
    card1Desc: "Bachiller en Ingeniería de Sistemas por la Universidad Nacional José María Arguedas (UNAJMA). Combino mi experiencia técnica en desarrollo Fullstack y Mobile con mi vocación por la enseñanza.",
    card2Title: "Formación Académica",
    card2Desc: "Ingeniería de Sistemas (UNAJMA)\nPosgrado en progreso (Maestría en IA, UNIR)",
    card3Title: "Especialización Continua",
    card3DescSuffix: ", Oracle SQL, Power BI, IA, Desarrollo del Kernel Linux (LFD103)."
  });

  const displaySubtitle = config?.bio_short?.trim() || ui.subtitle;
  const displayName = config?.full_name?.trim() || ui.card1Title;
  const displayBioLong = config?.bio_long?.trim() || ui.card1Desc;
  const avatarUrl = config?.avatar_url?.trim() || "";

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUrl]);

  useEffect(() => {
    if (lang === 'es') return;
    const translateData = async () => {
      const translatedSkills = await Promise.all(initialSkills.map(async s => ({
        ...s,
        category: await translateClient(s.category, lang),
        items: await Promise.all(s.items.map(i => translateClient(i, lang)))
      })));
      setSkills(translatedSkills);

      const keys = Object.keys(ui) as (keyof typeof ui)[];
      const newUi = { ...ui };
      await Promise.all(keys.map(async k => { newUi[k] = await translateClient(ui[k], lang); }));
      setUi(newUi);
    };
    translateData();
  }, [lang]);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[120px]" style={{ backgroundColor: 'var(--primary)' }}></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] rounded-full blur-[120px]" style={{ backgroundColor: 'var(--tertiary)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
          <p className="max-w-2xl mx-auto text-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            {displaySubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`lg:col-span-5 backdrop-blur-xl border rounded-3xl p-8 flex flex-col justify-center transition-colors shadow-lg hover:scale-[1.02] ${glowClass}`}
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(30px)', '--glow-bg': 'var(--glass-bg)' } as React.CSSProperties}
          >
            <div className="flex items-center gap-4 mb-6">
              {avatarUrl && !avatarFailed && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden border shrink-0 shadow-md" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--pill-bg)' }}>
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={64}
                    height={64}
                    unoptimized={avatarUrl.startsWith('data:')}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold transition-colors" style={{ color: 'var(--text-color)' }}>{displayName}</h3>
            </div>
            <p className="leading-relaxed mb-6 transition-colors whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
              {displayBioLong}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--primary)' }}>
                  <GraduationCap style={{ color: 'var(--accent-text)' }} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold transition-colors" style={{ color: 'var(--text-color)' }}>{ui.card2Title}</h4>
                  <p className="text-sm whitespace-pre-line transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.card2Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--tertiary)' }}>
                  <Award style={{ color: 'var(--tertiary-text)' }} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold transition-colors" style={{ color: 'var(--text-color)' }}>{ui.card3Title}</h4>
                  <p className="text-sm mt-1 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    {credlyUrl ? (
                      <a href={credlyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2" style={{ color: 'var(--accent-text)' }}>
                        CCNAv7 <ExternalLink size={12} />
                      </a>
                    ) : "CCNAv7"}
                    {ui.card3DescSuffix}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Bento Grid — dinámico desde Supabase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
          >
            {skills.map((skill) => {
                const colors = COLOR_MAP[skill.color_key] || COLOR_MAP.blue;
                const icon   = ICON_MAP[skill.icon_key]  || <Code2 size={16} />;
                return (
                  <div
                    key={skill.id}
                    className={`border rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg ${glowClass}`}
                    style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', '--glow-bg': 'var(--glass-bg)' } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg border shadow-sm" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: colors.colorVar }}>
                        {icon}
                      </div>
                      <h4 className="font-bold" style={{ color: colors.colorVar }}>{skill.category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2.5 py-1 rounded-md border shadow-sm transition-colors"
                          style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            }
          </motion.div>
        </div>
      </div>
    </section>
  );
}
