import { getSiteConfig } from "@atpdev/database";
import { User, Type, Palette, Globe, Link2, Shield, Database, Save, ExternalLink, MessageCircle } from "lucide-react";
import { saveSettings } from "./actions";
import { SOCIAL_ICON_MAP } from "@/components/SocialIcons";
import { ThemeBuilder } from "./ThemeBuilder";
import { SubmitButton } from "./SubmitButton";
import { AvatarPicker } from "./AvatarPicker";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const config = await getSiteConfig();

  const inputClass = "bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-gray-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm w-full";
  const labelClass = "text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 block";

  // Social networks config
  const socialNetworks = [
    { key: "whatsapp",  label: "WhatsApp",   color: "emerald" },
    { key: "telegram",  label: "Telegram",    color: "blue"    },
    { key: "github",    label: "GitHub",      color: "gray"    },
    { key: "linkedin",  label: "LinkedIn",    color: "blue"    },
    { key: "twitter",   label: "Twitter / X", color: "gray"    },
    { key: "facebook",  label: "Facebook",    color: "blue"    },
    { key: "instagram", label: "Instagram",   color: "pink"    },
    { key: "youtube",   label: "YouTube",     color: "red"     },
    { key: "tiktok",    label: "TikTok",      color: "purple"  },
    { key: "discord",   label: "Discord",     color: "indigo"  },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-gray-400">Configura tu portal público. Todos los cambios se reflejan instantáneamente.</p>
      </div>

      <form action={saveSettings}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === COLUMNA PRINCIPAL (2/3) === */}
          <div className="lg:col-span-2 space-y-6">

            {/* AVATAR PICKER */}
            <AvatarPicker initialAvatarUrl={config?.avatar_url || "/avatar.png"} />

            {/* PERFIL */}
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400"><User size={20} /></div>
                <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Perfil Personal</h2><p className="text-xs text-slate-500 dark:text-gray-400">Tu identidad en el portal público.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className={labelClass}>Nombre Completo</label><input type="text" name="full_name" defaultValue={config?.full_name || "Percy Acha Taipe"} className={inputClass} /></div>
                <div className="md:col-span-2"><label className={labelClass}>Bio Corta</label><input type="text" name="bio_short" defaultValue={config?.bio_short || ""} className={inputClass} /></div>
                <div className="md:col-span-2"><label className={labelClass}>Bio Larga</label><textarea name="bio_long" rows={3} defaultValue={config?.bio_long || ""} className={inputClass + " resize-none"} /></div>
              </div>
            </div>

            {/* HERO */}
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"><Type size={20} /></div>
                <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Hero Section</h2><p className="text-xs text-slate-500 dark:text-gray-400">Lo primero que ven tus visitantes.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Título del Hero</label><input type="text" name="hero_title" defaultValue={config?.hero_title || "Percy Acha"} className={inputClass} /></div>
                <div><label className={labelClass}>Subtítulo</label><input type="text" name="hero_subtitle" defaultValue={config?.hero_subtitle || "@ATPDEV"} className={inputClass} /></div>
                <div className="md:col-span-2"><label className={labelClass}>Typewriter (separado por comas)</label><input type="text" name="hero_typewriter" defaultValue={(config?.hero_typewriter || []).join(", ")} className={inputClass} /></div>
              </div>
            </div>

            {/* CONTACTO */}
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"><Globe size={20} /></div>
                <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Contacto</h2><p className="text-xs text-slate-500 dark:text-gray-400">Datos de la sección de contacto.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Email</label><input type="email" name="email" defaultValue={config?.email || "achataipepercy@gmail.com"} className={inputClass} /></div>
                <div><label className={labelClass}>Celular</label><input type="text" name="phone" defaultValue={config?.phone || "+51 987 006 572"} className={inputClass} /></div>
                <div><label className={labelClass}>Ubicación</label><input type="text" name="location" defaultValue={config?.location || ""} className={inputClass} /></div>
              </div>
            </div>

            {/* 🔥 REDES SOCIALES CON TOGGLES */}
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"><MessageCircle size={20} /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Redes Sociales</h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Activa o desactiva cada red. Solo las activas se muestran en tu portal.</p>
                </div>
              </div>

              <div className="space-y-3">
                {socialNetworks.map((network) => {
                  const urlKey     = `${network.key}_url` as keyof typeof config;
                  const enabledKey = `${network.key}_enabled` as keyof typeof config;
                  const isEnabled  = config ? (config[enabledKey] as boolean) : false;
                  const urlValue   = config ? (config[urlKey] as string) : '';
                  const IconComp   = SOCIAL_ICON_MAP[network.key];

                  return (
                    <div key={network.key} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isEnabled 
                        ? 'bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-gray-700' 
                        : 'bg-slate-100/60 dark:bg-[#1A1A1A]/50 border-slate-200 dark:border-gray-800/50 opacity-60'
                    }`}>

                      {/* Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          name={`${network.key}_enabled`}
                          defaultChecked={isEnabled}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>

                      {/* SVG Icon */}
                      <span className="w-8 flex items-center justify-center shrink-0 text-slate-600 dark:text-gray-300">
                        {IconComp && <IconComp size={20} />}
                      </span>

                      {/* Label + Input */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white w-28 shrink-0">{network.label}</span>
                        <input
                          type="text"
                          name={`${network.key}_url`}
                          defaultValue={urlValue}
                          placeholder={`https://...`}
                          className="flex-1 bg-white dark:bg-transparent border border-slate-300 dark:border-gray-800 text-slate-900 dark:text-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LINKS ESPECIALES */}
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"><Link2 size={20} /></div>
                <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Links Especiales</h2><p className="text-xs text-slate-500 dark:text-gray-400">CV y certificaciones.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>CV (URL del PDF)</label><input type="text" name="cv_url" defaultValue={config?.cv_url || "/cv.html"} className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Credly Badge (CCNA)</label>
                  <div className="flex gap-2">
                    <input type="url" name="credly_url" defaultValue={config?.credly_url || ""} className={inputClass} />
                    {config?.credly_url && <a href={config.credly_url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-500/20"><ExternalLink size={18} /></a>}
                  </div>
                </div>
              </div>
            </div>

            {/* COLORES + INTEGRACIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ThemeBuilder initialConfig={config} />
              
              <div className="space-y-6">
                {/* INTEGRACIONES */}
                <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400"><Globe size={18} /></div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Integraciones</h3>
                  </div>
                  <div className="space-y-4">
                    <div><label className={labelClass}>Google Analytics 4 ID</label><input type="text" name="ga4_id" defaultValue={config?.ga4_id || ""} className={inputClass} placeholder="G-XXXXXXXXXX" /></div>
                    <div><label className={labelClass}>AdSense Publisher ID</label><input type="text" name="adsense_id" defaultValue={config?.adsense_id || ""} className={inputClass} placeholder="ca-pub-XXXXXXXXXX" /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN GUARDAR */}
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </div>

          {/* === COLUMNA LATERAL === */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"><Shield size={18} /></div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Seguridad</h3></div>
              <div className="space-y-3">
                {[{ label: "Autenticación", value: "Supabase Auth" },{ label: "Middleware SSR", value: "Activo" },{ label: "RLS", value: "Habilitado" },{ label: "HTTPS (.dev)", value: "Automático" }].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1.5"><span className="text-slate-500 dark:text-gray-400">{item.label}</span><span className="text-slate-900 dark:text-white font-semibold">{item.value}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"><Database size={18} /></div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Base de Datos</h3></div>
              <div className="space-y-3">
                {[{ label: "Proveedor", value: "Supabase" },{ label: "Plan", value: "Free Tier" },{ label: "Tablas", value: "projects, leads, site_config" }].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1.5"><span className="text-slate-500 dark:text-gray-400">{item.label}</span><span className="text-slate-900 dark:text-white font-semibold">{item.value}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"><Globe size={18} /></div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Estado del Dominio</h3></div>
              <div className="space-y-3">
                {[
                  { label: "Dominio", value: "atpdev.dev", ok: true },
                  { label: "GA4", value: config?.ga4_id || "No config.", ok: !!config?.ga4_id },
                  { label: "AdSense", value: config?.adsense_id || "No config.", ok: !!config?.adsense_id },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-gray-800/50 last:border-none">
                    <div><p className="text-xs font-semibold text-slate-900 dark:text-white">{item.label}</p><p className="text-[10px] text-slate-500 dark:text-gray-500">{item.value}</p></div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.ok ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>{item.ok ? 'Activo' : 'Pendiente'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
