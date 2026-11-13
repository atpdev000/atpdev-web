"use client";

import { motion } from "framer-motion";
import { 
  BrainCircuit, Cpu, FlaskConical, Bot, Database, Zap, CheckCircle2,
  Code, Terminal, Globe, Cloud, Layout, Image as ImageIcon, Video, Music,
  MessageSquare, Sparkles, FileText, Settings, Shield, Server, Layers,
  Smartphone, Monitor, PenTool, GitBranch, Fingerprint, Lock,
  HardDrive, Network, Workflow, Box, Cuboid, Radio
} from "lucide-react";
import { AIModelData } from "@atpdev/database";

export const ICONS_MAP: Record<string, React.ReactNode> = {
  "BrainCircuit": <BrainCircuit size={24} />,
  "Cpu": <Cpu size={24} />,
  "FlaskConical": <FlaskConical size={24} />,
  "Bot": <Bot size={24} />,
  "Database": <Database size={24} />,
  "Zap": <Zap size={24} />,
  "Code": <Code size={24} />,
  "Terminal": <Terminal size={24} />,
  "Globe": <Globe size={24} />,
  "Cloud": <Cloud size={24} />,
  "Layout": <Layout size={24} />,
  "Image": <ImageIcon size={24} />,
  "Video": <Video size={24} />,
  "Music": <Music size={24} />,
  "MessageSquare": <MessageSquare size={24} />,
  "Sparkles": <Sparkles size={24} />,
  "FileText": <FileText size={24} />,
  "Settings": <Settings size={24} />,
  "Shield": <Shield size={24} />,
  "Server": <Server size={24} />,
  "Layers": <Layers size={24} />,
  "Smartphone": <Smartphone size={24} />,
  "Monitor": <Monitor size={24} />,
  "PenTool": <PenTool size={24} />,
  "GitBranch": <GitBranch size={24} />,
  "Fingerprint": <Fingerprint size={24} />,
  "Lock": <Lock size={24} />,
  "HardDrive": <HardDrive size={24} />,
  "Network": <Network size={24} />,
  "Workflow": <Workflow size={24} />,
  "Box": <Box size={24} />,
  "Cuboid": <Cuboid size={24} />,
  "Radio": <Radio size={24} />,
};

export default function AIModelsSection({ projects, ui, aiModels, enableGlow = true, glowStyle = 'border' }: { projects: any[], ui: any, aiModels: AIModelData[], enableGlow?: boolean, glowStyle?: string }) {
  const glowClass = "interactive-card";
  const activeModels = aiModels.map(model => {
    const usedInProjects = projects.filter(p => 
      p.status !== 'Privado' && 
      p.stack.some((t: string) => model.tags.includes(t.toLowerCase()))
    );
    return {
      ...model,
      usedIn: usedInProjects.map(p => p.title),
      isActive: usedInProjects.length > 0 || model.id === 'pgvector'
    };
  }).filter(m => m.is_visible);

  if (activeModels.length === 0) return null;

  return (
    <section id="ai-models" className="py-24 relative overflow-hidden transition-colors border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--tertiary) 12%, transparent) 0%, transparent 70%)' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-sm font-bold" style={{ borderColor: 'var(--tertiary)', backgroundColor: 'rgba(156,39,176,0.1)', color: 'var(--tertiary-text)' }}>
            <BrainCircuit size={16} /> AI Integrations
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 transition-colors" style={{ color: 'var(--text-color)' }}>
            {ui.aiTitle1} <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--tertiary))' }}>{ui.aiTitle2}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            {ui.aiDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeModels.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`border rounded-3xl p-8 transition-all group hover:-translate-y-1 hover:shadow-2xl shadow-lg ${glowClass}`}
              style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(12px)', '--glow-bg': 'var(--glass-bg)' } as React.CSSProperties}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--primary)', color: 'var(--accent-text)' }}>
                  {ICONS_MAP[model.icon_name || "Cpu"]}
                </div>
                {model.usedIn.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10" style={{ color: 'var(--badge-green-text)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {ui.aiActive}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 transition-colors" style={{ color: 'var(--text-color)' }}>{model.name}</h3>
              <p className="text-xs mb-4 transition-colors" style={{ color: 'var(--text-muted)' }}>{model.provider}</p>
              <p className="text-sm leading-relaxed mb-6 transition-colors" style={{ color: 'var(--text-muted)' }}>
                {model.description}
              </p>

              <div className="space-y-3 mt-auto">
                <div className="text-xs font-bold uppercase tracking-widest mb-2 transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.aiCaps}</div>
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.slice(0, 3).map(cap => (
                    <span key={cap} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border shadow-sm transition-colors" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>
                      <CheckCircle2 size={10} style={{ color: 'var(--tertiary-text)' }} /> {cap}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
