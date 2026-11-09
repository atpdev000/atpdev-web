'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Wifi, 
  User, 
  MessageSquare, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Copy, 
  Check, 
  Share2, 
  Star, 
  ExternalLink, 
  Download, 
  QrCode, 
  RotateCcw,
  Eye,
  EyeOff,
  ShieldCheck,
  Send,
  Calendar,
  FileCode,
  Smartphone,
  Binary,
  Video
} from 'lucide-react';
import { ScannedCode, CodeType } from '../types';
import Link from 'next/link';

interface ScanResultCardProps {
  code: ScannedCode;
  onNewScan: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  code,
  onNewScan,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFav, setIsFav] = useState(code.isFavorite);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Código QR - ${code.type.toUpperCase()}`,
          text: code.rawText,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy(code.rawText);
    }
  };

  const handleToggleFav = () => {
    setIsFav(!isFav);
    if (onToggleFavorite) {
      onToggleFavorite(code.id);
    }
  };

  // Descarga de V-Card (.vcf)
  const downloadVCard = () => {
    const blob = new Blob([code.rawText], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${code.parsedData.contact?.name || 'contacto'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descarga de Evento (.ics)
  const downloadICS = () => {
    const blob = new Blob([code.rawText], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${code.parsedData.event?.title || 'evento'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeMeta = (type: CodeType) => {
    switch (type) {
      case 'url':
        return { label: 'Enlace Web (URL)', icon: Globe, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
      case 'wifi':
        return { label: 'Red Wi-Fi', icon: Wifi, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      case 'contact':
        return { label: 'Contacto V-Card', icon: User, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
      case 'whatsapp':
        return { label: 'Chat de WhatsApp', icon: MessageSquare, color: 'text-green-500 bg-green-500/10 border-green-500/20' };
      case 'email':
        return { label: 'Correo Electrónico', icon: Mail, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      case 'phone':
        return { label: 'Llamada Telefónica', icon: Phone, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' };
      case 'sms':
        return { label: 'Mensaje SMS', icon: Send, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };
      case 'event':
        return { label: 'Evento de Calendario', icon: Calendar, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' };
      case 'pdf':
        return { label: 'Documento PDF', icon: FileCode, color: 'text-red-500 bg-red-500/10 border-red-500/20' };
      case 'app':
        return { label: 'Aplicación Móvil', icon: Smartphone, color: 'text-blue-600 bg-blue-600/10 border-blue-600/20' };
      case 'video':
        return { label: 'Vídeo en Línea', icon: Video, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      case 'crypto':
        return { label: 'Criptomoneda / Billetera 2D', icon: Binary, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
      case 'geo':
        return { label: 'Ubicación Geográfica', icon: MapPin, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      default:
        return { label: 'Texto Plano', icon: FileText, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const meta = getTypeMeta(code.type);
  const IconComponent = meta.icon;
  const formattedDate = new Date(code.timestamp).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-fadeIn">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

      {/* Header with Type & Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border ${meta.color}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 font-mono">
              {code.format}
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-display">
              {meta.label}
            </h3>
            <span className="text-[11px] text-slate-400">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleFav}
            aria-label="Marcar como favorito"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isFav ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Compartir resultado"
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Structured Content Area */}
      <div className="py-5 space-y-4">
        
        {/* CASE: URL / VIDEO / PDF */}
        {(code.type === 'url' || code.type === 'video' || code.type === 'pdf') && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 break-all">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                {code.type === 'pdf' ? 'Documento PDF:' : code.type === 'video' ? 'Vídeo en Línea:' : 'Destino Web:'}
              </span>
              <a
                href={code.parsedData.url || code.rawText}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-blue-400 hover:underline flex items-center gap-1.5"
              >
                <span>{code.parsedData.url || code.rawText}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            <a
              href={code.parsedData.url || code.rawText}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{code.type === 'pdf' ? 'Abrir Documento PDF' : code.type === 'video' ? 'Ver Vídeo' : 'Abrir Enlace Web'}</span>
            </a>
          </div>
        )}

        {/* CASE: EVENTO DE CALENDARIO */}
        {code.type === 'event' && code.parsedData.event && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-base font-bold text-white font-display">
                {code.parsedData.event.title}
              </h4>
              {code.parsedData.event.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{code.parsedData.event.location}</span>
                </div>
              )}
              {code.parsedData.event.startDate && (
                <div className="text-xs text-cyan-400 font-mono">
                  Fecha: {code.parsedData.event.startDate}
                </div>
              )}
              {code.parsedData.event.description && (
                <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  {code.parsedData.event.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={downloadICS}
              className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Añadir a mi Calendario (.ics)</span>
            </button>
          </div>
        )}

        {/* CASE: WI-FI */}
        {code.type === 'wifi' && code.parsedData.wifi && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Nombre de Red (SSID):</span>
                <p className="text-base font-bold text-white font-mono">{code.parsedData.wifi.ssid}</p>
              </div>

              {code.parsedData.wifi.password ? (
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Contraseña:</span>
                  <div className="flex items-center justify-between mt-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {showPassword ? code.parsedData.wifi.password : '••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Red Abierta (Sin Contraseña)</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 font-mono">
                Seguridad: {code.parsedData.wifi.authType} {code.parsedData.wifi.isHidden ? '• Red Oculta' : ''}
              </div>
            </div>

            {code.parsedData.wifi.password && (
              <button
                type="button"
                onClick={() => handleCopy(code.parsedData.wifi?.password || '')}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? '¡Contraseña Copiada!' : 'Copiar Contraseña Wi-Fi'}</span>
              </button>
            )}
          </div>
        )}

        {/* CASE: CONTACT VCARD */}
        {code.type === 'contact' && code.parsedData.contact && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-lg font-black text-white font-display">
                {code.parsedData.contact.name}
              </h4>
              {code.parsedData.contact.title && (
                <p className="text-xs text-cyan-400 font-semibold">{code.parsedData.contact.title}</p>
              )}
              {code.parsedData.contact.org && (
                <p className="text-xs text-slate-400 font-medium">{code.parsedData.contact.org}</p>
              )}
              {code.parsedData.contact.phone && (
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-400 font-medium">Teléfono:</span>
                  <a href={`tel:${code.parsedData.contact.phone}`} className="font-bold text-blue-400 hover:underline">
                    {code.parsedData.contact.phone}
                  </a>
                </div>
              )}
              {code.parsedData.contact.email && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <a href={`mailto:${code.parsedData.contact.email}`} className="font-bold text-blue-400 hover:underline">
                    {code.parsedData.contact.email}
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={downloadVCard}
              className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Guardar Contacto (.vcf)</span>
            </button>
          </div>
        )}

        {/* CASE: WHATSAPP */}
        {code.type === 'whatsapp' && code.parsedData.whatsapp && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Número de WhatsApp:</span>
              <p className="text-base font-bold text-green-400 font-mono">+{code.parsedData.whatsapp.phone}</p>
              {code.parsedData.whatsapp.message && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Mensaje preparado:</span>
                  <p className="text-sm text-slate-300 italic bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    "{code.parsedData.whatsapp.message}"
                  </p>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/${code.parsedData.whatsapp.phone}${code.parsedData.whatsapp.message ? `?text=${encodeURIComponent(code.parsedData.whatsapp.message)}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir en WhatsApp</span>
            </a>
          </div>
        )}

        {/* CASE: EMAIL */}
        {code.type === 'email' && code.parsedData.email && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Para:</span>
                <p className="text-sm font-bold text-white font-mono">{code.parsedData.email.address}</p>
              </div>
              {code.parsedData.email.subject && (
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Asunto:</span>
                  <p className="text-sm text-slate-300 font-medium">{code.parsedData.email.subject}</p>
                </div>
              )}
            </div>

            <a
              href={`mailto:${code.parsedData.email.address}?subject=${encodeURIComponent(code.parsedData.email.subject || '')}&body=${encodeURIComponent(code.parsedData.email.body || '')}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Redactar Correo</span>
            </a>
          </div>
        )}

        {/* CASE: PHONE */}
        {code.type === 'phone' && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Número a llamar:</span>
              <p className="text-xl font-bold text-cyan-400 font-mono">{code.parsedData.phone || code.rawText}</p>
            </div>

            <a
              href={`tel:${code.parsedData.phone || code.rawText}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar por Teléfono</span>
            </a>
          </div>
        )}

        {/* CASE: SMS */}
        {code.type === 'sms' && code.parsedData.sms && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Destinatario SMS:</span>
                <p className="text-base font-bold text-indigo-400 font-mono">{code.parsedData.sms.phone}</p>
              </div>
              {code.parsedData.sms.message && (
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Texto del Mensaje:</span>
                  <p className="text-sm text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    {code.parsedData.sms.message}
                  </p>
                </div>
              )}
            </div>

            <a
              href={`sms:${code.parsedData.sms.phone}?body=${encodeURIComponent(code.parsedData.sms.message || '')}`}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Mensaje SMS</span>
            </a>
          </div>
        )}

        {/* CASE: CRIPTO / 2D */}
        {code.type === 'crypto' && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Dirección Cripto / Billetera:</span>
              <p className="text-xs font-mono font-bold text-amber-400 break-all">
                {code.rawText}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(code.rawText)}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? '¡Dirección Copiada!' : 'Copiar Dirección'}</span>
            </button>
          </div>
        )}

        {/* CASE: RAW TEXT / GENERIC FALLBACK */}
        {(code.type === 'text' || code.type === 'geo') && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Texto detectado:</span>
              <p className="text-sm font-mono text-slate-200 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                {code.rawText}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Secondary Actions (Copy & Generator Shortcut) */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleCopy(code.rawText)}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
        </button>

        <Link
          href={`/generar?text=${encodeURIComponent(code.rawText)}&type=${code.type}`}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <QrCode className="w-4 h-4 text-cyan-400" />
          <span>Editar como QR</span>
        </Link>
      </div>

      {/* Primary Reset Scan Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onNewScan}
          className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-black text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Escanear Otro Código</span>
        </button>
      </div>

    </div>
  );
};

export default ScanResultCard;
