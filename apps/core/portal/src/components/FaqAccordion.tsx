"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Download, Zap, Lock } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

interface FaqAccordionProps {
  items?: FaqItem[];
  lang?: string;
  hideHeader?: boolean;
}

export function FaqAccordion({ items, lang = "es", hideHeader = false }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FaqItem[] = [
    {
      question: lang === "es" ? "¿Cómo acceder o utilizar esta plataforma?" : "How can I access or use this platform?",
      answer: lang === "es"
        ? "Puedes utilizar la herramienta directamente desde el enlace oficial de la aplicación web o descargar el paquete móvil cuando esté disponible en Google Play o App Store."
        : "You can access the tool directly through its official web application link or install the mobile release when available on Google Play or App Store.",
      icon: <Download size={18} className="text-emerald-400" />
    },
    {
      question: lang === "es" ? "¿El uso básico requiere registro o suscripción?" : "Does basic usage require registration or a subscription?",
      answer: lang === "es"
        ? "No. Las herramientas públicas y guías técnicas de ATP Dev se pueden consultar directamente en el navegador sin registros forzados."
        : "No. ATP Dev public tools and technical guides can be accessed directly in the browser without forced sign-ups.",
      icon: <Zap size={18} className="text-yellow-400" />
    },
    {
      question: lang === "es" ? "¿Cómo se protegen los datos y la privacidad del usuario?" : "How is user data and privacy protected?",
      answer: lang === "es"
        ? "Todas las aplicaciones operan sobre HTTPS cifrado y priorizan el procesamiento local en el dispositivo siempre que la arquitectura lo permite, cumpliendo nuestra Política de Privacidad."
        : "All applications run over encrypted HTTPS and prioritize local on-device processing whenever possible, in compliance with our Privacy Policy.",
      icon: <Lock size={18} className="text-purple-400" />
    }
  ];

  const faqList = items && items.length > 0 ? items : defaultFaqs;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="mt-8 pt-6 border-t border-[var(--glass-border)]">
      {!hideHeader && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text-color)]">
              {lang === "es" ? "Preguntas Frecuentes & Soporte" : "Frequently Asked Questions & Support"}
            </h3>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              {lang === "es" ? "Guía de instalación y especificaciones técnicas" : "Installation guide and technical specifications"}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqList.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-[var(--glass-bg)] border-emerald-500/40 shadow-lg"
                  : "bg-[var(--pill-bg)] border-[var(--glass-border)] hover:border-emerald-500/30"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 px-5 flex items-center justify-between gap-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-bold text-sm text-[var(--text-color)]">{item.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[var(--text-color)] opacity-60 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-emerald-400 opacity-100" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-[var(--text-color)] opacity-90 leading-relaxed border-t border-[var(--glass-border)] pt-3 animate-in fade-in duration-200">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
