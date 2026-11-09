'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { 
  Globe, 
  FileText, 
  Mail, 
  Phone, 
  Send, 
  User, 
  MessageSquare, 
  Wifi, 
  FileCode, 
  Smartphone, 
  Image as ImageIcon, 
  Video, 
  Share2, 
  Calendar, 
  Binary,
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Palette, 
  Layers, 
  Upload, 
  Printer, 
  ChevronDown, 
  Trash2,
  ExternalLink,
  Eye,
  Sliders
} from 'lucide-react';
import { 
  buildWifiString, 
  buildVCardString, 
  buildWhatsAppString,
  buildEventString
} from '../../lib/parser';
import { 
  CodeType, 
  QRDesignConfig, 
  FrameStyle, 
  DotShape, 
  EyeFrameStyle, 
  EyeBallStyle, 
  PresetLogo 
} from '../../types';
import { COUNTRIES, CountryItem } from '../../data/countries';
import { renderCustomQRCode } from '../../lib/qrRenderer';

export default function GenerarStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ===================== PASO 1: CONTENIDO =====================
  const [activeType, setActiveType] = useState<CodeType>('url');

  // Enlace Web
  const [url, setUrl] = useState('https://atpdev.pe');

  // Texto
  const [textVal, setTextVal] = useState('Texto de ejemplo en código QR profesional.');

  // Email
  const [emailTo, setEmailTo] = useState('contacto@atpdev.pe');
  const [emailSubject, setEmailSubject] = useState('Consulta Comercial');
  const [emailBody, setEmailBody] = useState('Hola, quisiera más información sobre sus servicios.');

  // Llamada & SMS
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(COUNTRIES[0]); // Perú +51
  const [phoneNumber, setPhoneNumber] = useState('987654321');
  const [smsMessage, setSmsMessage] = useState('Hola, solicito información.');

  // V-Card
  const [vcardName, setVcardName] = useState('Carlos Mendoza');
  const [vcardOrg, setVcardOrg] = useState('ATP DEV Perú');
  const [vcardTitle, setVcardTitle] = useState('Director de Tecnología');
  const [vcardPhone, setVcardPhone] = useState('987654321');
  const [vcardEmail, setVcardEmail] = useState('carlos@atpdev.pe');
  const [vcardWebsite, setVcardWebsite] = useState('https://atpdev.pe');
  const [vcardAddress, setVcardAddress] = useState('Lima, Perú');
  const [vcardNote, setVcardNote] = useState('Contacto comercial prioritario');

  // WhatsApp
  const [waCountry, setWaCountry] = useState<CountryItem>(COUNTRIES[0]);
  const [waPhone, setWaPhone] = useState('987654321');
  const [waMessage, setWaMessage] = useState('¡Hola! Me contacto a través del código QR.');

  // Wi-Fi
  const [wifiSsid, setWifiSsid] = useState('Oficina_ATP_5G');
  const [wifiPass, setWifiPass] = useState('ClaveSegura2026');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // PDF
  const [pdfUrl, setPdfUrl] = useState('https://atpdev.pe/docs/brochure.pdf');

  // Aplicación (App Store / Play Store)
  const [appName, setAppName] = useState('Mi App Pro');
  const [appIosUrl, setAppIosUrl] = useState('https://apps.apple.com/app/id123456789');
  const [appAndroidUrl, setAppAndroidUrl] = useState('https://play.google.com/store/apps/details?id=com.atpdev.app');

  // Imágenes
  const [imagesUrl, setImagesUrl] = useState('https://photos.app.goo.gl/album-demo');

  // Vídeo
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  // Redes Sociales
  const [socialHandle, setSocialHandle] = useState('atpdev.oficial');
  const [socialNetwork, setSocialNetwork] = useState<'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'linkedin'>('instagram');

  // Evento
  const [eventTitle, setEventTitle] = useState('Lanzamiento Oficial 2026');
  const [eventLocation, setEventLocation] = useState('Centro de Convenciones de Lima');
  const [eventStart, setEventStart] = useState('2026-12-15T09:00');
  const [eventEnd, setEventEnd] = useState('2026-12-15T18:00');
  const [eventDesc, setEventDesc] = useState('Conferencia magistral y networking.');

  // Cripto / Código 2D
  const [cryptoCoin, setCryptoCoin] = useState<'bitcoin' | 'ethereum' | 'solana' | 'usdt'>('bitcoin');
  const [cryptoAddress, setCryptoAddress] = useState('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
  const [cryptoAmount, setCryptoAmount] = useState('0.05');

  // ===================== PASO 2: DISEÑO QR =====================
  const [designTab, setDesignTab] = useState<'marco' | 'forma' | 'color' | 'logo'>('marco');

  const [designConfig, setDesignConfig] = useState<QRDesignConfig>({
    frameStyle: 'bottom-banner',
    frameText: 'ESCÁNAME',
    frameColor: '#0284c7',
    frameTextColor: '#ffffff',
    dotShape: 'squares',
    eyeFrame: 'square',
    eyeBall: 'square',
    colorType: 'solid',
    fgColor: '#0f172a',
    gradientColor2: '#0284c7',
    gradientDirection: 'diagonal',
    bgColor: '#ffffff',
    customEyeColor: false,
    eyeColor: '#0284c7',
    logo: 'none',
    customLogoUrl: '',
    logoSize: 22,
    errorCorrection: 'H',
    margin: 2,
  });

  // Estados de exportación
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportResolution, setExportResolution] = useState<number>(1024);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  // Calcular la cadena raw según el tipo activo
  const computeRawData = useCallback((): string => {
    switch (activeType) {
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'text':
        return textVal;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:+${selectedCountry.dialCode}${phoneNumber.replace(/\D/g, '')}`;
      case 'sms':
        return `smsto:+${selectedCountry.dialCode}${phoneNumber.replace(/\D/g, '')}:${smsMessage}`;
      case 'contact':
        return buildVCardString({
          name: vcardName,
          org: vcardOrg,
          title: vcardTitle,
          phone: `+${selectedCountry.dialCode}${vcardPhone.replace(/\D/g, '')}`,
          email: vcardEmail,
          website: vcardWebsite,
          address: vcardAddress,
          note: vcardNote,
        });
      case 'whatsapp':
        return buildWhatsAppString(waCountry.dialCode, waPhone, waMessage);
      case 'wifi':
        return buildWifiString(wifiSsid, wifiPass, wifiAuth, wifiHidden);
      case 'pdf':
        return pdfUrl.startsWith('http') ? pdfUrl : `https://${pdfUrl}`;
      case 'app':
        return appIosUrl || appAndroidUrl || 'https://atpdev.pe';
      case 'images':
        return imagesUrl.startsWith('http') ? imagesUrl : `https://${imagesUrl}`;
      case 'video':
        return videoUrl.startsWith('http') ? videoUrl : `https://${videoUrl}`;
      case 'social':
        if (socialNetwork === 'instagram') return `https://instagram.com/${socialHandle.replace('@', '')}`;
        if (socialNetwork === 'tiktok') return `https://tiktok.com/@${socialHandle.replace('@', '')}`;
        if (socialNetwork === 'facebook') return `https://facebook.com/${socialHandle}`;
        if (socialNetwork === 'youtube') return `https://youtube.com/@${socialHandle}`;
        return `https://linkedin.com/in/${socialHandle}`;
      case 'event':
        return buildEventString({
          title: eventTitle,
          location: eventLocation,
          startDate: eventStart,
          endDate: eventEnd,
          description: eventDesc,
        });
      case 'crypto':
        if (cryptoCoin === 'bitcoin') return `bitcoin:${cryptoAddress}${cryptoAmount ? `?amount=${cryptoAmount}` : ''}`;
        if (cryptoCoin === 'ethereum') return `ethereum:${cryptoAddress}`;
        return `${cryptoCoin}:${cryptoAddress}`;
      default:
        return url;
    }
  }, [
    activeType,
    url,
    textVal,
    emailTo,
    emailSubject,
    emailBody,
    selectedCountry,
    phoneNumber,
    smsMessage,
    vcardName,
    vcardOrg,
    vcardTitle,
    vcardPhone,
    vcardEmail,
    vcardWebsite,
    vcardAddress,
    vcardNote,
    waCountry,
    waPhone,
    waMessage,
    wifiSsid,
    wifiPass,
    wifiAuth,
    wifiHidden,
    pdfUrl,
    appName,
    appIosUrl,
    appAndroidUrl,
    imagesUrl,
    videoUrl,
    socialHandle,
    socialNetwork,
    eventTitle,
    eventLocation,
    eventStart,
    eventEnd,
    eventDesc,
    cryptoCoin,
    cryptoAddress,
    cryptoAmount,
  ]);

  // Actualizar lienzo canvas en tiempo real
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawData = computeRawData();
    renderCustomQRCode(canvas, rawData, designConfig, 340);
  }, [computeRawData, designConfig]);

  // Subida de logo personalizado (con drag & drop o selector de archivo)
  const handleLogoFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setDesignConfig((prev) => ({
        ...prev,
        logo: 'upload',
        customLogoUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers para el logo
  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  };

  // Descargar PNG en alta definición (1024 o 2048)
  const downloadPNG = async () => {
    setDownloading(true);
    try {
      const exportCanvas = document.createElement('canvas');
      const rawData = computeRawData();
      await renderCustomQRCode(exportCanvas, rawData, designConfig, exportResolution);

      const url = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `codigo-qr-${activeType}-${exportResolution}px.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.warn('Error downloading PNG', e);
    } finally {
      setDownloading(false);
    }
  };

  // Descargar SVG vectorial
  const downloadSVG = async () => {
    try {
      const rawData = computeRawData();
      const svg = await QRCode.toString(rawData, {
        type: 'svg',
        margin: designConfig.margin,
        color: {
          dark: designConfig.fgColor,
          light: designConfig.bgColor,
        },
        errorCorrectionLevel: designConfig.errorCorrection,
      });

      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `codigo-qr-${activeType}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.warn('Error downloading SVG', e);
    }
  };

  // Copiar imagen al portapapeles
  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.warn('Clipboard copy error', err);
    }
  };

  // Imprimir código QR
  const printQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`
        <html>
          <head><title>Imprimir Código QR</title></head>
          <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;">
            <img src="${dataUrl}" style="max-width:420px;width:100%;border:1px solid #ddd;padding:12px;border-radius:16px;" />
            <h2 style="margin-top:16px;">${designConfig.frameText || 'Código QR'}</h2>
            <p style="color:#666;font-size:12px;">Generado con Lector QR Pro • atpdev.pe</p>
          </body>
        </html>
      `);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  // 15 Tipos de contenido oficiales estilo QR.io
  const CONTENT_TYPES = [
    { id: 'url', label: 'Enlace', icon: Globe },
    { id: 'text', label: 'Texto', icon: FileText },
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'phone', label: 'Llamada', icon: Phone },
    { id: 'sms', label: 'SMS', icon: Send },
    { id: 'contact', label: 'V-card', icon: User },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'wifi', label: 'WI-FI', icon: Wifi },
    { id: 'pdf', label: 'PDF', icon: FileCode },
    { id: 'app', label: 'Aplicación', icon: Smartphone },
    { id: 'images', label: 'Imágenes', icon: ImageIcon },
    { id: 'video', label: 'Vídeo', icon: Video },
    { id: 'social', label: 'Redes sociales', icon: Share2 },
    { id: 'event', label: 'Evento', icon: Calendar },
    { id: 'crypto', label: 'Código 2D', icon: Binary },
  ];

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generador Profesional de Códigos QR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Estudio de Creación y Diseño QR
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Personaliza tu código en 2 pasos: completa el contenido y dale estilo con marcos, formas, colores y logotipos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== COLUMNA IZQUIERDA: PASOS 1 Y 2 (7 cols) ==================== */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* ==================== PASO 1: COMPLETA EL CONTENIDO ==================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center font-mono">
                1
              </span>
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Completa el contenido
                </h2>
                <p className="text-xs text-slate-400">
                  Selecciona el formato y rellena los datos correspondientes.
                </p>
              </div>
            </div>

            {/* Grid de 15 Botones estilo QR.io */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CONTENT_TYPES.map((t) => {
                const Icon = t.icon;
                const isActive = activeType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveType(t.id as CodeType)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 shadow-md'
                        : 'bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] text-center leading-tight truncate w-full">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Formularios Dinámicos por Tipo */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              
              {/* 1. ENLACE (URL) */}
              {activeType === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Introduce tu sitio web (URL):
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://tudominio.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. TEXTO */}
              {activeType === 'text' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Introduce el texto libre:
                  </label>
                  <textarea
                    rows={4}
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    placeholder="Escribe aquí notas, avisos o información relevante..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <span className="text-[11px] text-slate-500 block text-right font-mono">
                    {textVal.length} caracteres
                  </span>
                </div>
              )}

              {/* 3. EMAIL */}
              {activeType === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Correo Electrónico de Destino:
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="ejemplo@empresa.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Mensaje:
                    </label>
                    <textarea
                      rows={3}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Mensaje prediseñado..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 4. LLAMADA & 5. SMS (Selector Universal de Países) */}
              {(activeType === 'phone' || activeType === 'sms') && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Número de Teléfono Internacional:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find((c) => c.code === e.target.value);
                          if (found) setSelectedCountry(found);
                        }}
                        className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} (+{c.dialCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-7">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ej. 987654321"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {activeType === 'sms' && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Texto del SMS:
                      </label>
                      <textarea
                        rows={2}
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Escribe el mensaje SMS que enviará el usuario..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 6. V-CARD */}
              {activeType === 'contact' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Nombre Completo:
                      </label>
                      <input
                        type="text"
                        value={vcardName}
                        onChange={(e) => setVcardName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Empresa:
                      </label>
                      <input
                        type="text"
                        value={vcardOrg}
                        onChange={(e) => setVcardOrg(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Cargo / Puesto:
                      </label>
                      <input
                        type="text"
                        value={vcardTitle}
                        onChange={(e) => setVcardTitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Teléfono Móvil:
                      </label>
                      <input
                        type="tel"
                        value={vcardPhone}
                        onChange={(e) => setVcardPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Email:
                      </label>
                      <input
                        type="email"
                        value={vcardEmail}
                        onChange={(e) => setVcardEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Sitio Web:
                      </label>
                      <input
                        type="url"
                        value={vcardWebsite}
                        onChange={(e) => setVcardWebsite(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 7. WHATSAPP */}
              {activeType === 'whatsapp' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Número de WhatsApp (País y Celular):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <select
                        value={waCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find((c) => c.code === e.target.value);
                          if (found) setWaCountry(found);
                        }}
                        className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} (+{c.dialCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-7">
                      <input
                        type="tel"
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        placeholder="Ej. 987654321"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Mensaje de Saludo Predeterminado:
                    </label>
                    <textarea
                      rows={2}
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 8. WI-FI */}
              {activeType === 'wifi' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Nombre de la Red Wi-Fi (SSID):
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Contraseña:
                    </label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Cifrado:
                      </label>
                      <select
                        value={wifiAuth}
                        onChange={(e) => setWifiAuth(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs cursor-pointer"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Sin Contraseña</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                        <input
                          type="checkbox"
                          checked={wifiHidden}
                          onChange={(e) => setWifiHidden(e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <span>Red Oculta</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. PDF */}
              {activeType === 'pdf' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Enlace Directo al Documento PDF:
                  </label>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://tudominio.com/archivo.pdf"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Al escanear, el teléfono abrirá o descargará el archivo PDF en su lector nativo.
                  </span>
                </div>
              )}

              {/* 10. APLICACIÓN */}
              {activeType === 'app' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Nombre de la App:
                    </label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Enlace a Apple App Store (iOS):
                    </label>
                    <input
                      type="url"
                      value={appIosUrl}
                      onChange={(e) => setAppIosUrl(e.target.value)}
                      placeholder="https://apps.apple.com/..."
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Enlace a Google Play Store (Android):
                    </label>
                    <input
                      type="url"
                      value={appAndroidUrl}
                      onChange={(e) => setAppAndroidUrl(e.target.value)}
                      placeholder="https://play.google.com/..."
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* 11. IMÁGENES */}
              {activeType === 'images' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Enlace a Galería de Fotos / Álbum:
                  </label>
                  <input
                    type="url"
                    value={imagesUrl}
                    onChange={(e) => setImagesUrl(e.target.value)}
                    placeholder="https://photos.app.goo.gl/..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              )}

              {/* 12. VÍDEO */}
              {activeType === 'video' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Enlace de Vídeo (YouTube, TikTok o Vimeo):
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              )}

              {/* 13. REDES SOCIALES */}
              {activeType === 'social' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Red Social:
                      </label>
                      <select
                        value={socialNetwork}
                        onChange={(e) => setSocialNetwork(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs cursor-pointer"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Usuario (@handle):
                      </label>
                      <input
                        type="text"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        placeholder="tuusuario"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 14. EVENTO */}
              {activeType === 'event' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Título del Evento:
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Ubicación:
                    </label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Inicio:
                      </label>
                      <input
                        type="datetime-local"
                        value={eventStart}
                        onChange={(e) => setEventStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Fin:
                      </label>
                      <input
                        type="datetime-local"
                        value={eventEnd}
                        onChange={(e) => setEventEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 15. CÓDIGO 2D / CRIPTO */}
              {activeType === 'crypto' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Moneda / Red:
                      </label>
                      <select
                        value={cryptoCoin}
                        onChange={(e) => setCryptoCoin(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs cursor-pointer"
                      >
                        <option value="bitcoin">Bitcoin (BTC)</option>
                        <option value="ethereum">Ethereum (ETH)</option>
                        <option value="solana">Solana (SOL)</option>
                        <option value="usdt">Tether (USDT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Monto Opcional:
                      </label>
                      <input
                        type="text"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        placeholder="0.05"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                      Dirección de Billetera (Wallet):
                    </label>
                    <input
                      type="text"
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* ==================== PASO 2: DISEÑA TU CÓDIGO QR ==================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white font-black text-xs flex items-center justify-center font-mono">
                2
              </span>
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Diseña tu código QR
                </h2>
                <p className="text-xs text-slate-400">
                  Personaliza marco, forma de puntos, colores y logotipo.
                </p>
              </div>
            </div>

            {/* Pestañas de diseño: Marco | Forma | Color | Logo */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setDesignTab('marco')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'marco' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Marco
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('forma')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'forma' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Forma
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('color')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'color' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Color
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('logo')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'logo' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Logo
              </button>
            </div>

            {/* CONTENIDO DE PESTAÑAS DE DISEÑO */}
            <div className="space-y-4">
              
              {/* SUB-PESTAÑA 1: MARCO */}
              {designTab === 'marco' && (
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-slate-400 block">
                    Elige un estilo de marco:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'none', label: 'Sin Marco' },
                      { id: 'bottom-banner', label: 'Banner Inferior' },
                      { id: 'top-banner', label: 'Banner Superior' },
                      { id: 'rounded-card', label: 'Tarjeta Redondeada' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDesignConfig({ ...designConfig, frameStyle: m.id as FrameStyle })}
                        className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          designConfig.frameStyle === m.id
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {designConfig.frameStyle !== 'none' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                          Texto del Marco (CTA):
                        </label>
                        <input
                          type="text"
                          value={designConfig.frameText}
                          onChange={(e) => setDesignConfig({ ...designConfig, frameText: e.target.value })}
                          placeholder="ESCÁNAME"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-400 block mb-1">
                            Color Marco:
                          </label>
                          <input
                            type="color"
                            value={designConfig.frameColor}
                            onChange={(e) => setDesignConfig({ ...designConfig, frameColor: e.target.value })}
                            className="w-9 h-9 rounded-lg bg-transparent cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-400 block mb-1">
                            Color Texto:
                          </label>
                          <input
                            type="color"
                            value={designConfig.frameTextColor}
                            onChange={(e) => setDesignConfig({ ...designConfig, frameTextColor: e.target.value })}
                            className="w-9 h-9 rounded-lg bg-transparent cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-PESTAÑA 2: FORMA */}
              {designTab === 'forma' && (
                <div className="space-y-4">
                  {/* Patrón de puntos */}
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                      Patrón de Módulos (Cuerpo):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'squares', label: 'Cuadrados' },
                        { id: 'dots', label: 'Puntos (Dots)' },
                        { id: 'rounded', label: 'Redondeados' },
                        { id: 'diamond', label: 'Diamantes' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setDesignConfig({ ...designConfig, dotShape: s.id as DotShape })}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            designConfig.dotShape === s.id
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estilo de Ojos */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Marco del Ojo:
                      </label>
                      <select
                        value={designConfig.eyeFrame}
                        onChange={(e) => setDesignConfig({ ...designConfig, eyeFrame: e.target.value as EyeFrameStyle })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs cursor-pointer"
                      >
                        <option value="square">Cuadrado</option>
                        <option value="rounded">Redondeado</option>
                        <option value="circle">Circular</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Pupila / Centro del Ojo:
                      </label>
                      <select
                        value={designConfig.eyeBall}
                        onChange={(e) => setDesignConfig({ ...designConfig, eyeBall: e.target.value as EyeBallStyle })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs cursor-pointer"
                      >
                        <option value="square">Cuadrado</option>
                        <option value="circle">Circular</option>
                        <option value="diamond">Diamante</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PESTAÑA 3: COLOR */}
              {designTab === 'color' && (
                <div className="space-y-4">
                  {/* Tipo de Color */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="radio"
                        checked={designConfig.colorType === 'solid'}
                        onChange={() => setDesignConfig({ ...designConfig, colorType: 'solid' })}
                        className="text-blue-600"
                      />
                      <span>Color Sólido</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="radio"
                        checked={designConfig.colorType === 'gradient'}
                        onChange={() => setDesignConfig({ ...designConfig, colorType: 'gradient' })}
                        className="text-blue-600"
                      />
                      <span>Degradado (Gradiente)</span>
                    </label>
                  </div>

                  {/* Pickers */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Color Principal:
                      </span>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={designConfig.fgColor}
                          onChange={(e) => setDesignConfig({ ...designConfig, fgColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-white">{designConfig.fgColor}</span>
                      </div>
                    </div>

                    {designConfig.colorType === 'gradient' && (
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Segundo Color:
                        </span>
                        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <input
                            type="color"
                            value={designConfig.gradientColor2}
                            onChange={(e) => setDesignConfig({ ...designConfig, gradientColor2: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-xs font-mono font-bold text-white">{designConfig.gradientColor2}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Color de Fondo:
                      </span>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={designConfig.bgColor}
                          onChange={(e) => setDesignConfig({ ...designConfig, bgColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-white">{designConfig.bgColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Color personalizado de ojos */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={designConfig.customEyeColor}
                        onChange={(e) => setDesignConfig({ ...designConfig, customEyeColor: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Color de ojos independiente</span>
                    </label>

                    {designConfig.customEyeColor && (
                      <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={designConfig.eyeColor}
                          onChange={(e) => setDesignConfig({ ...designConfig, eyeColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-white">{designConfig.eyeColor}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-PESTAÑA 4: LOGO (Con Drag & Drop universal) */}
              {designTab === 'logo' && (
                <div className="space-y-4">
                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={handleLogoDrop}
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      isDraggingLogo 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                    }`}
                  >
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoFile(file);
                      }}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">
                      Arrastra y suelta tu propio logo aquí o haz clic para examinar
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Soporta PNG transparente, SVG, JPG o WebP
                    </p>
                  </div>

                  {/* Logos Populares Predeterminados */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      O selecciona un logo popular de 1 clic:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {[
                        { id: 'none', label: 'Ninguno' },
                        { id: 'whatsapp', label: 'WhatsApp' },
                        { id: 'instagram', label: 'Instagram' },
                        { id: 'facebook', label: 'Facebook' },
                        { id: 'tiktok', label: 'TikTok' },
                        { id: 'youtube', label: 'YouTube' },
                        { id: 'twitter', label: 'X (Twitter)' },
                        { id: 'wifi', label: 'Wi-Fi' },
                        { id: 'pdf', label: 'PDF' },
                        { id: 'appstore', label: 'App Store' },
                        { id: 'googleplay', label: 'Google Play' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDesignConfig({ ...designConfig, logo: item.id as PresetLogo })}
                          className={`p-2 rounded-xl border text-[11px] font-bold text-center truncate transition-all cursor-pointer ${
                            designConfig.logo === item.id
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ==================== COLUMNA DERECHA: VISTA PREVIA Y EXPORTACIÓN (5 cols) ==================== */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-6">
            
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                Vista Previa en Vivo
              </span>
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Alta Precisión
              </span>
            </div>

            {/* Canvas Box */}
            <div className="p-4 rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center max-w-full overflow-hidden">
              <canvas
                ref={canvasRef}
                className="rounded-2xl max-w-full h-auto shadow-md"
              />
            </div>

            {/* Resolución de Exportación */}
            <div className="w-full flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
              <span className="font-semibold text-slate-400">Resolución de Exportación:</span>
              <select
                value={exportResolution}
                onChange={(e) => setExportResolution(Number(e.target.value))}
                className="bg-transparent font-bold text-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value={512} className="bg-slate-900 text-white">512 px (Estándar)</option>
                <option value={1024} className="bg-slate-900 text-white">1024 px (Alta Definición HD)</option>
                <option value={2048} className="bg-slate-900 text-white">2048 px (Ultra HD)</option>
              </select>
            </div>

            {/* Botones de Exportación */}
            <div className="w-full space-y-2.5">
              
              <button
                type="button"
                onClick={downloadPNG}
                disabled={downloading}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Generando imagen...' : `Descargar PNG (${exportResolution}px HD)`}</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={downloadSVG}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Descargar en formato vectorial sin pérdida"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Copiar imagen al portapapeles"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={printQR}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Imprimir código QR listo para usar"
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
