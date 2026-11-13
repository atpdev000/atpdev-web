"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { QrCode, X, Eye, Share2, Check, ShieldCheck, Globe, Camera } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { StickyDownloadBar } from "./StickyDownloadBar";
import { QrModal } from "./QrModal";

interface ProjectArticleViewerProps {
  description: string;
  image: string;
  title: string;
  playstore?: string | null;
  appstore?: string | null;
  qrConfig?: {
    theme?: string;
    badgeStyle?: "white" | "transparent" | "accent" | "dark";
    cardBg?: "dark" | "light" | "transparent";
    cornerStyle?: "rounded" | "squircle" | "square";
    qrBorder?: "neon" | "white" | "none";
    outerFrame?: "neon" | "white" | "subtle" | "none";
    textTone?: "auto" | "dark" | "light";
  } | null;
}

const SUPPORTED_LANGS = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
];

export function ProjectArticleViewer({
  description,
  image,
  title,
  playstore,
  appstore,
  qrConfig
}: ProjectArticleViewerProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const activeDownloadUrl = appstore || playstore || currentUrl;

  const formattedDescription = React.useMemo(() => {
    if (!description) return "";
    return description.replace(/!\[([\s\S]*?)\]\(([\s\S]*?)\)/g, (match, alt, url) => {
      const cleanUrl = url.replace(/\s+/g, "");
      return `![${alt}](${cleanUrl})`;
    });
  }, [description]);

  return (
    <div className="space-y-8">
      {/* Scroll Reading Progress Bar (Neon Cyan Gradient) */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 z-50 transition-all duration-150 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />



      {/* Action Bar (Share, Security Audit & QR Install Modal Trigger) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 text-xs font-mono text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck size={14} /> {playstore || appstore ? "SHA-256 Verificado" : "HTTPS Verificado"}
          </span>
          <span className="hidden sm:inline text-gray-500">
            • {playstore || appstore ? "100% Offline & Seguro" : "Web App Segura & Rápida"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            {copied ? "¡Enlace Copiado!" : "Compartir"}
          </button>
          {activeDownloadUrl && (
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <QrCode size={14} /> Escanear QR
            </button>
          )}
        </div>
      </div>

      {/* Rich Article Body (ReactMarkdown + remarkGfm Level God Styling) */}
      <div className="prose max-w-none space-y-6 text-lg leading-relaxed text-[var(--text-color)]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          urlTransform={(url) => url}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl md:text-4xl font-black text-[var(--text-color)] pt-8 pb-3 border-b border-[var(--glass-border)] title-gradient flex items-center gap-3">
                <span className="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_12px_#3b82f6]"></span>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl md:text-3xl font-black text-[var(--text-color)] pt-8 pb-3 border-b border-[var(--glass-border)] title-gradient flex items-center gap-3">
                <span className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4]"></span>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl md:text-2xl font-bold text-[var(--text-color)] pt-6 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-base md:text-lg leading-relaxed text-[var(--text-color)] opacity-90 font-sans my-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2.5 my-4 pl-2">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2.5 text-base md:text-lg text-[var(--text-color)] opacity-90">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0 shadow-[0_0_8px_#06b6d4]"></span>
                <span className="flex-1">{children}</span>
              </li>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2.5 my-4 list-decimal list-inside text-base md:text-lg text-[var(--text-color)] opacity-90">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-6 p-5 rounded-2xl bg-cyan-500/10 border-l-4 border-cyan-400 text-[var(--text-color)] backdrop-blur-md italic text-base">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-8 rounded-2xl border border-[var(--glass-border)] shadow-2xl bg-[var(--glass-bg)] backdrop-blur-md">
                <table className="w-full text-left border-collapse text-sm md:text-base">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-cyan-500/10 text-cyan-400 font-bold border-b border-[var(--glass-border)] uppercase tracking-wider text-xs">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-color)]">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-cyan-500/5 transition-colors">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="p-4 font-semibold text-[var(--text-color)]">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="p-4 text-[var(--text-color)] opacity-90">
                {children}
              </td>
            ),
            code: ({ className, children }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm font-semibold">
                    {children}
                  </code>
                );
              }
              return (
                <div className="my-6 p-4 rounded-2xl bg-[#090d16] border border-[var(--glass-border)] text-emerald-400 font-mono text-sm overflow-x-auto shadow-inner">
                  <code>{children}</code>
                </div>
              );
            },
            hr: () => (
              <hr className="my-10 border-t border-[var(--glass-border)]" />
            ),
            img: ({ src, alt }) => {
              if (!src || typeof src !== "string" || src.trim() === "") return null;
              return (
                <span className="block my-8 rounded-3xl p-4 md:p-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-2xl">
                  <img
                    src={src}
                    alt={typeof alt === "string" ? alt : "Captura del sistema"}
                    className="w-full h-auto max-h-[550px] object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  {alt && typeof alt === "string" && (
                    <span className="mt-3 text-center text-xs text-cyan-400 font-mono flex items-center justify-center gap-1.5">
                      <Camera size={13} className="text-cyan-400" />
                      {alt}
                    </span>
                  )}
                </span>
              );
            }
          }}
        >
          {formattedDescription}
        </ReactMarkdown>
      </div>

      {/* Persistent Floating Bottom Download CTA Bar */}
      <StickyDownloadBar
        title={title}
        playstore={playstore}
        appstore={appstore}
        onOpenQr={() => setShowQrModal(true)}
      />

      {/* Image Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={activeImage}
              alt="Ampliada"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* QR Download & Mobile Installation Modal */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title={title}
        url={activeDownloadUrl}
        appImage={image}
        defaultThemeId={qrConfig?.theme}
        defaultBadgeStyle={qrConfig?.badgeStyle}
        defaultCardBg={qrConfig?.cardBg}
        defaultCornerStyle={qrConfig?.cornerStyle}
        defaultQrBorderStyle={qrConfig?.qrBorder}
        defaultOuterFrame={qrConfig?.outerFrame}
        defaultTextTone={qrConfig?.textTone}
      />
    </div>
  );
}
