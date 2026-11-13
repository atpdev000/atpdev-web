"use client";

import dynamic from "next/dynamic";
import { Send, CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react";
import { createLead } from "@/app/actions/contact";
import { SiteConfig } from "@atpdev/database";
import { SOCIAL_ICON_MAP } from "./SocialIcons";
import { motion, AnimatePresence } from "framer-motion";
import MagneticEffect from "./MagneticEffect";

const LazyPhoneInput = dynamic(() => import("./LazyPhoneInput"), { ssr: false });

// Map of social network keys to icon and label metadata
export const SOCIAL_PLATFORMS = [
  { key: "whatsapp", name: "WhatsApp", color: "hover:bg-emerald-600/20 hover:border-emerald-500/40 hover:text-emerald-400" },
  { key: "telegram", name: "Telegram", color: "hover:bg-sky-600/20 hover:border-sky-500/40 hover:text-sky-400" },
  { key: "github",   name: "GitHub",   color: "hover:bg-gray-700/40 hover:border-gray-500/40 hover:text-gray-200" },
  { key: "linkedin", name: "LinkedIn", color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400" },
  { key: "twitter",  name: "Twitter / X", color: "hover:bg-gray-700/40 hover:border-gray-500/40 hover:text-gray-200" },
  { key: "facebook", name: "Facebook", color: "hover:bg-blue-700/20 hover:border-blue-600/40 hover:text-blue-400" },
  { key: "instagram",name: "Instagram",color: "hover:bg-pink-600/20 hover:border-pink-500/40 hover:text-pink-400" },
  { key: "youtube",  name: "YouTube",  color: "hover:bg-red-600/20 hover:border-red-500/40 hover:text-red-400" },
  { key: "tiktok",   name: "TikTok",   color: "hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-purple-400" },
  { key: "discord",  name: "Discord",  color: "hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-400" },
];

import { useParams } from "next/navigation";
import { useState } from "react";
import { getUiDictionary } from "@/utils/i18n-ui";

export default function ContactForm({ config, uiDict }: { config?: SiteConfig | null; uiDict?: Record<string, string> }) {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState<{name?: string, email?: string, message?: string}>({});
  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [phoneWidgetActive, setPhoneWidgetActive] = useState(false);
  
  const dict = uiDict || getUiDictionary(lang);
  const ui = {
    title1: dict.contactTitle1,
    title2: dict.contactTitle2,
    subtitle: dict.contactSubtitle,
    emailLabel: dict.contactEmailLabel,
    phoneLabel: dict.contactPhoneLabel,
    socialLabel: dict.contactSocialLabel,
    formName: dict.contactFormName,
    formNamePlaceholder: dict.contactFormNamePlaceholder,
    formEmail: dict.contactFormEmail,
    formEmailPlaceholder: dict.contactFormEmailPlaceholder,
    formPhone: dict.contactFormPhone,
    formMessage: dict.contactFormMessage,
    formMessagePlaceholder: dict.contactFormMessagePlaceholder,
    btnSending: dict.contactBtnSending,
    btnSent: dict.contactBtnSent,
    btnError: dict.contactBtnError,
    btnSend: dict.contactBtnSend,
    sentDesc: dict.contactSentDesc,
    sendAnother: dict.contactSendAnother,
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    
    // Custom Validation
    const errors: {name?: string, email?: string, message?: string} = {};
    if (!name || name.trim() === "") errors.name = "Por favor, ingresa tu nombre.";
    if (!email || email.trim() === "") errors.email = "El correo es obligatorio para responderte.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Ingresa un correo electrónico válido.";
    if (!message || message.trim() === "") errors.message = "No olvides escribir tu mensaje.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStatus("submitting");
    
    const result = await createLead(name, email, message, phoneValue || "");
    if (result) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  // Filter enabled social platforms
  const activeSocials = SOCIAL_PLATFORMS.filter(platform => {
    if (!config) return false;
    const enabledKey = `${platform.key}_enabled` as keyof SiteConfig;
    const urlKey = `${platform.key}_url` as keyof SiteConfig;
    return !!config[enabledKey] && !!config[urlKey];
  });

  return (
    <section id="contact" className="py-24 scroll-mt-20 relative overflow-hidden transition-colors border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }}></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight transition-colors" style={{ color: 'var(--text-color)' }}>
              {ui.title1} <br/> <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--tertiary))' }}>{ui.title2}</span>
            </h2>
            <p className="text-lg mb-10 max-w-md leading-relaxed transition-colors" style={{ color: 'var(--text-muted)' }}>
              {ui.subtitle}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0" style={{ backgroundColor: 'rgba(0,82,255,0.1)', borderColor: 'var(--primary)' }}>
                  <Mail style={{ color: 'var(--accent-text)' }} size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.emailLabel}</p>
                  <a href={`mailto:${config?.email || 'contacto@atpdev.dev'}`} className="text-lg font-medium transition-colors hover:opacity-80" style={{ color: 'var(--accent-text)' }}>
                    {config?.email || 'contacto@atpdev.dev'}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Phone style={{ color: 'var(--badge-green-text)' }} size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.phoneLabel}</p>
                  <a href={`https://wa.me/${(config?.phone || '+51987006572').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-lg font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-color)' }}>
                    {config?.phone || '+51 987 006 572'}
                  </a>
                </div>
              </div>
            </div>

            {/* Redes Sociales Dinámicas */}
            {activeSocials.length > 0 && (
              <div className="mt-12">
                <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>{ui.socialLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map(social => {
                    const urlKey = `${social.key}_url` as keyof SiteConfig;
                    const url = config?.[urlKey] as string;
                    return (
                      <a
                        key={social.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${social.color} shadow-sm`}
                        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
                      >
                        {(() => { const Icon = SOCIAL_ICON_MAP[social.key]; return Icon ? <Icon size={15} /> : null; })()}
                        <span>{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="p-8 rounded-3xl shadow-2xl relative border transition-colors" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(12px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none"></div>
            
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center h-full py-16 px-6"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <motion.div
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </motion.div>
                </motion.div>
                
                <h3 className="text-3xl font-black mb-4 tracking-tight transition-colors" style={{ color: 'var(--text-color)' }}>{ui.btnSent}</h3>
                <p className="text-base max-w-[280px] mb-10 leading-relaxed transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  He recibido tu mensaje con éxito. Me pondré en contacto contigo a la brevedad.
                </p>
                
                <button 
                  onClick={() => setStatus("idle")}
                  className="group relative flex items-center gap-2 border px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-black/5 dark:hover:bg-white/10"
                  style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}
                >
                  <span className="relative z-10">Enviar nuevo mensaje</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col relative z-10">
              <div className="mb-6 relative">
                <label htmlFor="contact-name" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.formName}</label>
                <input 
                  id="contact-name"
                  type="text" 
                  name="name"
                  onChange={() => setFormErrors(prev => ({...prev, name: undefined}))}
                  placeholder={ui.formNamePlaceholder}
                  className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all focus:shadow-[0_0_15px_var(--primary)] placeholder-opacity-50`}
                  style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--text-color)' }}
                />
                <AnimatePresence>
                  {formErrors.name && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs font-medium">
                      <AlertCircle size={12} /> {formErrors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mb-6 relative">
                <label htmlFor="contact-email" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.formEmail}</label>
                <input 
                  id="contact-email"
                  type="email" 
                  name="email"
                  onChange={() => setFormErrors(prev => ({...prev, email: undefined}))}
                  placeholder={ui.formEmailPlaceholder}
                  className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all focus:shadow-[0_0_15px_var(--primary)] placeholder-opacity-50`}
                  style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--text-color)' }}
                />
                <AnimatePresence>
                  {formErrors.email && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs font-medium">
                      <AlertCircle size={12} /> {formErrors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mb-6 relative phone-input-wrapper">
                <label htmlFor="contact-phone" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--text-muted)' }}>{ui.formPhone}</label>
                {phoneWidgetActive ? (
                  <LazyPhoneInput
                    id="contact-phone"
                    value={phoneValue}
                    onChange={setPhoneValue}
                    className="w-full border border-transparent focus-within:border-blue-500 rounded-xl px-4 py-3 transition-all focus-within:shadow-[0_0_15px_var(--primary)]"
                    style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--text-color)' }}
                  />
                ) : (
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={phoneValue || ""}
                    onFocus={() => setPhoneWidgetActive(true)}
                    onClick={() => setPhoneWidgetActive(true)}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    placeholder="+51 987 006 572"
                    className="w-full border border-transparent focus:border-blue-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all focus:shadow-[0_0_15px_var(--primary)]"
                    style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--text-color)' }}
                  />
                )}
                <style dangerouslySetInnerHTML={{__html: `
                  .phone-input-wrapper .PhoneInputInput {
                    background: transparent;
                    border: none;
                    color: inherit;
                    outline: none;
                    margin-left: 10px;
                  }
                  .phone-input-wrapper .PhoneInputCountrySelectArrow {
                    color: #9ca3af;
                  }
                  .phone-input-wrapper .PhoneInputCountrySelect option {
                    color: black;
                    background-color: white;
                  }
                `}} />
              </div>
              <div className="mb-8 relative">
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2 transition-colors" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{ui.formMessage}</label>
                <textarea 
                  id="contact-message"
                  rows={4}
                  name="message"
                  onChange={() => setFormErrors(prev => ({...prev, message: undefined}))}
                  placeholder={ui.formMessagePlaceholder}
                  className={`w-full border ${formErrors.message ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all focus:shadow-[0_0_15px_var(--primary)] resize-none placeholder-opacity-50`}
                  style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--text-color)' }}
                ></textarea>
                <AnimatePresence>
                  {formErrors.message && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs font-medium">
                      <AlertCircle size={12} /> {formErrors.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <MagneticEffect intensity={0.15}>
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg text-white ${
                    status === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : "hover:scale-[1.03] hover:shadow-[0_0_25px_var(--primary)] hover:opacity-90"
                  }`}
                  style={status !== "error" ? { backgroundColor: 'var(--btn-primary-bg)' } : {}}
                >
                  {status === "submitting" ? (
                    <>{ui.btnSending}</>
                  ) : status === "error" ? (
                    <><AlertCircle size={20} /> {ui.btnError}</>
                  ) : (
                    <>{ui.btnSend} <Send size={18} /></>
                  )}
                </button>
              </MagneticEffect>                
                {status === "error" && (
                  <div className="mt-4 flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                    <AlertCircle size={16} /> Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
