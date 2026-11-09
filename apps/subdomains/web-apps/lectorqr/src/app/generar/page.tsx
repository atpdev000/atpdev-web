'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Globe, 
  Wifi, 
  User, 
  MessageSquare, 
  FileText, 
  Mail, 
  Phone, 
  Send,
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Palette, 
  Sliders, 
  Printer,
  RefreshCw
} from 'lucide-react';
import { 
  buildWifiString, 
  buildVCardString, 
  buildWhatsAppString 
} from '../../lib/parser';
import { CodeType } from '../../types';

export default function GenerarPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tipo de código activo
  const [activeType, setActiveType] = useState<CodeType>('url');

  // Valores de los formularios
  const [url, setUrl] = useState('https://atpdev.pe');
  
  // Wi-Fi
  const [wifiSsid, setWifiSsid] = useState('MiRedWiFi');
  const [wifiPass, setWifiPass] = useState('ClaveSegura2026');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // WhatsApp
  const [waPhone, setWaPhone] = useState('51987654321');
  const [waMessage, setWaMessage] = useState('¡Hola! Me comunico desde el código QR.');

  // Contacto (vCard)
  const [contactName, setContactName] = useState('Juan Pérez');
  const [contactPhone, setContactPhone] = useState('+51 987 654 321');
  const [contactEmail, setContactEmail] = useState('juan.perez@ejemplo.com');
  const [contactOrg, setContactOrg] = useState('Empresa SAC');

  // Texto
  const [textContent, setTextContent] = useState('Texto de ejemplo para código QR profesional.');

  // Email
  const [emailTo, setEmailTo] = useState('contacto@atpdev.pe');
  const [emailSubject, setEmailSubject] = useState('Consulta de Servicios');
  const [emailBody, setEmailBody] = useState('Hola, quisiera más información sobre sus servicios.');

  // Teléfono
  const [phoneNumber, setPhoneNumber] = useState('+51987654321');

  // Personalización visual
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState<number>(2);
  const [centerIcon, setCenterIcon] = useState<'none' | 'whatsapp' | 'wifi' | 'link' | 'star'>('none');

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Calcular la cadena raw a codificar
  const getEncodedString = (): string => {
    switch (activeType) {
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'wifi':
        return buildWifiString(wifiSsid, wifiPass, wifiAuth, wifiHidden);
      case 'whatsapp':
        return buildWhatsAppString(waPhone, waMessage);
      case 'contact':
        return buildVCardString(contactName, contactPhone, contactEmail, contactOrg);
      case 'text':
        return textContent;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      case 'sms':
        return `smsto:${phoneNumber}:${textContent}`;
      default:
        return textContent;
    }
  };

  // Renderizar QR en Canvas
  useEffect(() => {
    const rawData = getEncodedString();
    const canvas = canvasRef.current;
    if (!canvas || !rawData.trim()) return;

    QRCode.toCanvas(
      canvas,
      rawData,
      {
        width: 320,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      },
      (error) => {
        if (error) {
          console.warn('Error rendering QR Code:', error);
          return;
        }

        // Si hay icono central, dibujarlo en el canvas
        if (centerIcon !== 'none') {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const size = 52;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;

            // Fondo circular blanco con borde
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = bgColor;
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = fgColor;
            ctx.stroke();
            ctx.restore();

            // Dibujar icono sencillo
            ctx.save();
            ctx.fillStyle = fgColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 22px sans-serif';
            let iconText = '★';
            if (centerIcon === 'whatsapp') iconText = 'WA';
            if (centerIcon === 'wifi') iconText = 'WiFi';
            if (centerIcon === 'link') iconText = '🔗';
            ctx.fillText(iconText, canvas.width / 2, canvas.height / 2);
            ctx.restore();
          }
        }
      }
    );
  }, [
    activeType,
    url,
    wifiSsid,
    wifiPass,
    wifiAuth,
    wifiHidden,
    waPhone,
    waMessage,
    contactName,
    contactPhone,
    contactEmail,
    contactOrg,
    textContent,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    fgColor,
    bgColor,
    errorCorrection,
    margin,
    centerIcon,
  ]);

  // Descargar PNG en Alta Resolución (1024x1024)
  const downloadPNG = async () => {
    setDownloading(true);
    try {
      const rawData = getEncodedString();
      const highResCanvas = document.createElement('canvas');
      await QRCode.toCanvas(highResCanvas, rawData, {
        width: 1024,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      const url = highResCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `codigo-qr-${activeType}-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Error downloading QR', err);
    } finally {
      setDownloading(false);
    }
  };

  // Descargar SVG Vectorial
  const downloadSVG = async () => {
    try {
      const rawData = getEncodedString();
      const svgString = await QRCode.toString(rawData, {
        type: 'svg',
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `codigo-qr-${activeType}-${Date.now()}.svg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Error downloading SVG', err);
    }
  };

  // Copiar imagen al portapapeles
  const copyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.warn('Failed to copy image', err);
    }
  };

  // Imprimir QR
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Imprimir Código QR Pro</title></head>
          <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;">
            <img src="${dataUrl}" style="max-width:400px;width:100%;height:auto;border:1px solid #ccc;padding:12px;border-radius:16px;" />
            <h2 style="margin-top:16px;">Código QR Generado con Lector QR Pro</h2>
            <p style="color:#666;font-size:12px;">https://atpdev.pe/lectorqr</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const types = [
    { id: 'url', label: 'Enlace Web', icon: Globe },
    { id: 'wifi', label: 'Red Wi-Fi', icon: Wifi },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'contact', label: 'Contacto vCard', icon: User },
    { id: 'text', label: 'Texto Plano', icon: FileText },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Teléfono', icon: Phone },
  ];

  const colorPresets = [
    { name: 'Clásico Pro', fg: '#090d16', bg: '#ffffff' },
    { name: 'Azul Electric', fg: '#1d4ed8', bg: '#eff6ff' },
    { name: 'Cian Neón', fg: '#0891b2', bg: '#ecfeff' },
    { name: 'Esmeralda', fg: '#059669', bg: '#ecfdf5' },
    { name: 'Púrpura VIP', fg: '#7c3aed', bg: '#f5f3ff' },
    { name: 'Carbón Dark', fg: '#38bdf8', bg: '#020617' },
  ];

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generador Profesional de Códigos QR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Estudio de Generación QR
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Crea códigos QR personalizados para enlaces, redes Wi-Fi, WhatsApp, tarjetas de presentación vCard y descárgalos en alta resolución.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Data Form & Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tabs Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Tipo de Contenido a Codificar:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {types.map((t) => {
                const Icon = t.icon;
                const isActive = activeType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveType(t.id as CodeType)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Specific to Active Type */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            
            {/* 1. URL Form */}
            {activeType === 'url' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Enlace Web (URL o Dominio):
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://tudominio.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 2. Wi-Fi Form */}
            {activeType === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Nombre de la Red Wi-Fi (SSID):
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Ej. MiCasa_5G"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Contraseña de la Red:
                  </label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Contraseña Wi-Fi"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Seguridad:
                    </label>
                    <select
                      value={wifiAuth}
                      onChange={(e) => setWifiAuth(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Sin Contraseña (Abierta)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <span>¿Es una red oculta?</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 3. WhatsApp Form */}
            {activeType === 'whatsapp' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Número de Teléfono (con código de país sin +):
                  </label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="Ej. 51987654321"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Ejemplo para Perú: 51 seguido de tu número celular de 9 dígitos.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Mensaje Prediseñado (Opcional):
                  </label>
                  <textarea
                    rows={3}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Escribe el mensaje que enviará el usuario al escanear..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* 4. Contact (vCard) Form */}
            {activeType === 'contact' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Teléfono Móvil:
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+51 987 654 321"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Correo Electrónico:
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Empresa / Organización:
                  </label>
                  <input
                    type="text"
                    value={contactOrg}
                    onChange={(e) => setContactOrg(e.target.value)}
                    placeholder="ATP DEV Perú"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 5. Text Form */}
            {activeType === 'text' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Contenido de Texto Libre:
                </label>
                <textarea
                  rows={4}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Escribe cualquier información o nota aquí..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            )}

            {/* 6. Email Form */}
            {activeType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Destinatario:
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Asunto:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Asunto del correo"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Cuerpo del Mensaje:
                  </label>
                  <textarea
                    rows={3}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Escribe el mensaje prediseñado..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* 7. Phone Form */}
            {activeType === 'phone' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Número Telefónico:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Visual Customization Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Personalización Visual y Colores
              </h3>
            </div>

            {/* Color Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Paletas Rápidas Prediseñadas:
              </span>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" 
                      style={{ backgroundColor: p.fg }} 
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Color del Código (QR):
                </label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Color de Fondo:
                </label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Advanced Settings (Error Correction & Margin) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Corrección de Errores:
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="L">L - 7% Recuperación</option>
                  <option value="M">M - 15% Estándar</option>
                  <option value="Q">Q - 25% Alta</option>
                  <option value="H">H - 30% Máxima (Logos)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Margen Exterior (Quiet Zone):
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="0">Sin Margen (0)</option>
                  <option value="1">Margen Delgado (1)</option>
                  <option value="2">Margen Normal (2)</option>
                  <option value="4">Margen Amplio (4)</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Live QR Preview & Export Center (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-6">
            
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                Vista Previa en Vivo
              </span>
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                HD 320x320
              </span>
            </div>

            {/* Canvas Box */}
            <div className="p-4 rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                className="rounded-2xl max-w-full h-auto shadow-md"
              />
            </div>

            {/* Quick stats on encoded string */}
            <p className="text-[11px] text-slate-400 font-mono break-all max-w-xs line-clamp-2">
              {getEncodedString()}
            </p>

            {/* Export Buttons */}
            <div className="w-full space-y-2.5">
              
              <button
                type="button"
                onClick={downloadPNG}
                disabled={downloading}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Generando PNG...' : 'Descargar Imagen PNG (1024px HD)'}</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={downloadSVG}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Descargar en formato vectorial sin pérdida de calidad"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyImageToClipboard}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Copiar imagen al portapapeles"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Imprimir código QR en tamaño carta"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-400" />
                  <span>Imprimir</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
