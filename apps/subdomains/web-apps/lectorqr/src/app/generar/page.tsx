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
  Code,
  ExternalLink,
  Sliders,
  Type,
  Maximize2
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
  QRPattern, 
  QRMarkerOut, 
  QRMarkerIn, 
  QROptionLogo, 
  QROuterFrame,
  QRLabelFont
} from '../../types';
import { COUNTRIES, CountryItem } from '../../data/countries';
import { renderCustomQRCode } from '../../lib/qrRenderer';

export default function GenerarStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ===================== PASO 1: CONTENIDO =====================
  const [activeType, setActiveType] = useState<CodeType>('url');
  const [url, setUrl] = useState('https://atpdev.pe');
  const [textVal, setTextVal] = useState('Texto de ejemplo en código QR profesional.');
  const [emailTo, setEmailTo] = useState('contacto@atpdev.pe');
  const [emailSubject, setEmailSubject] = useState('Consulta Comercial');
  const [emailBody, setEmailBody] = useState('Hola, quisiera más información sobre sus servicios.');

  // Llamada & SMS con selector internacional
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

  // PDF & Apps & Redes
  const [pdfUrl, setPdfUrl] = useState('https://atpdev.pe/docs/brochure.pdf');
  const [appName, setAppName] = useState('Mi App Pro');
  const [appIosUrl, setAppIosUrl] = useState('https://apps.apple.com/app/id123456789');
  const [appAndroidUrl, setAppAndroidUrl] = useState('https://play.google.com/store/apps/details?id=com.atpdev.app');
  const [imagesUrl, setImagesUrl] = useState('https://photos.app.goo.gl/album-demo');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [socialHandle, setSocialHandle] = useState('atpdev.oficial');
  const [socialNetwork, setSocialNetwork] = useState<'tiktok' | 'instagram' | 'facebook' | 'youtube' | 'linkedin'>('tiktok');
  const [eventTitle, setEventTitle] = useState('Conferencia Tech 2026');
  const [eventLocation, setEventLocation] = useState('Lima Convention Center');
  const [eventStart, setEventStart] = useState('2026-12-15T09:00');
  const [eventEnd, setEventEnd] = useState('2026-12-15T18:00');
  const [eventDesc, setEventDesc] = useState('Lanzamiento y networking.');
  const [cryptoCoin, setCryptoCoin] = useState<'bitcoin' | 'ethereum' | 'solana' | 'usdt'>('bitcoin');
  const [cryptoAddress, setCryptoAddress] = useState('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
  const [cryptoAmount, setCryptoAmount] = useState('0.05');

  // ===================== PASO 2: DISEÑO QR CON ESPECIFICACIÓN COMPLETA =====================
  const [designTab, setDesignTab] = useState<'marco' | 'forma' | 'color' | 'logo' | 'api'>('marco');

  const [designConfig, setDesignConfig] = useState<QRDesignConfig>({
    transparent: false,
    backcolor: '#FFFFFF',
    frontcolor: '#000000',
    gradient: false,
    radial: false,
    gradient_color: '#0284c7',
    marker_out_color: '#000000',
    marker_in_color: '#000000',
    pattern: 'default',
    marker: 'default',
    marker_in: 'default',
    optionlogo: 'tiktok',
    no_logo_bg: false,
    logoSize: 22,
    outer_frame: 'bottom',
    framelabel: 'SCAN ME',
    label_font: 'Arial, Helvetica, sans-serif',
    custom_frame_color: false,
    framecolor: '#000000',
    frame_text_color: '#ffffff',
    errorCorrection: 'H',
    margin: 2,
  });

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
        if (socialNetwork === 'tiktok') return `https://tiktok.com/@${socialHandle.replace('@', '')}`;
        if (socialNetwork === 'instagram') return `https://instagram.com/${socialHandle.replace('@', '')}`;
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

  // Manejador de subida de logo con drag & drop
  const handleLogoFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (PNG, JPG, SVG o WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setDesignConfig((prev) => ({
        ...prev,
        optionlogo: 'upload',
        customLogoUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  };

  // Descarga en Alta Resolución
  const downloadPNG = async () => {
    setDownloading(true);
    try {
      const exportCanvas = document.createElement('canvas');
      const rawData = computeRawData();
      await renderCustomQRCode(exportCanvas, rawData, designConfig, exportResolution);

      const a = document.createElement('a');
      a.download = `codigo-qr-${activeType}-${exportResolution}px.png`;
      a.href = exportCanvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.warn('Error downloading PNG', e);
    } finally {
      setDownloading(false);
    }
  };

  // Descarga SVG
  const downloadSVG = async () => {
    try {
      const rawData = computeRawData();
      const svg = await QRCode.toString(rawData, {
        type: 'svg',
        margin: designConfig.margin,
        color: {
          dark: designConfig.frontcolor,
          light: designConfig.transparent ? '#00000000' : designConfig.backcolor,
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

  // Copiar al portapapeles
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

  // Imprimir
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
            <h2 style="margin-top:16px;">${designConfig.framelabel || 'Código QR'}</h2>
            <p style="color:#666;font-size:12px;">Generado con Lector QR Pro • atpdev.pe</p>
          </body>
        </html>
      `);
      w.document.close();
      w.focus();
      w.print();
    }
  };

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
          <span>Generador Profesional de Códigos QR estilo QR.io</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Estudio de Creación y Diseño QR
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Personaliza tu código en 2 pasos con marcos interactivos, formas de puntos, logos oficiales (TikTok, WhatsApp, etc.) y API para desarrolladores.
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

            {/* Formularios Dinámicos */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
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

              {activeType === 'social' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Plataforma Oficial:
                      </label>
                      <select
                        value={socialNetwork}
                        onChange={(e) => setSocialNetwork(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs cursor-pointer font-bold"
                      >
                        <option value="tiktok">🎵 TikTok Oficial</option>
                        <option value="instagram">📸 Instagram</option>
                        <option value="facebook">📘 Facebook</option>
                        <option value="youtube">🔴 YouTube</option>
                        <option value="linkedin">💼 LinkedIn</option>
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

              {/* Teléfonos con Selector Internacional */}
              {(activeType === 'phone' || activeType === 'sms' || activeType === 'whatsapp') && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Número de Teléfono Internacional (Universal para cualquier país):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <select
                        value={activeType === 'whatsapp' ? waCountry.code : selectedCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find((c) => c.code === e.target.value);
                          if (found) {
                            if (activeType === 'whatsapp') setWaCountry(found);
                            else setSelectedCountry(found);
                          }
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
                        value={activeType === 'whatsapp' ? waPhone : phoneNumber}
                        onChange={(e) => activeType === 'whatsapp' ? setWaPhone(e.target.value) : setPhoneNumber(e.target.value)}
                        placeholder="Ej. 987654321"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono"
                      />
                    </div>
                  </div>

                  {activeType === 'whatsapp' && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Mensaje Pre-escrito:
                      </label>
                      <textarea
                        rows={2}
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Wi-Fi */}
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
                </div>
              )}

              {/* Otros tipos genéricos */}
              {activeType === 'text' && (
                <textarea
                  rows={4}
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  placeholder="Introduce el texto..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm resize-none"
                />
              )}

              {activeType === 'pdf' && (
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://tudominio.com/documento.pdf"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
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
                  Marco, forma, colores, logos oficiales y parámetros de API.
                </p>
              </div>
            </div>

            {/* Pestañas de diseño: Marco | Forma | Color | Logo | API */}
            <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setDesignTab('marco')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'marco' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Marco
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('forma')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'forma' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Forma
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('color')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'color' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Color
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('logo')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  designTab === 'logo' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Logo
              </button>
              <button
                type="button"
                onClick={() => setDesignTab('api')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  designTab === 'api' ? 'bg-cyan-600 text-white shadow' : 'text-cyan-400 hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>API</span>
              </button>
            </div>

            {/* CONTENIDO DE PESTAÑAS DE DISEÑO */}
            <div className="space-y-4">
              
              {/* SUB-PESTAÑA 1: MARCO (outer_frame) */}
              {designTab === 'marco' && (
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-slate-400 block">
                    Estilos de Marco (outer_frame):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'none', label: 'none (Sin Marco)' },
                      { id: 'bottom', label: 'bottom (Inferior)' },
                      { id: 'top', label: 'top (Superior)' },
                      { id: 'balloon-bottom', label: 'balloon-bottom' },
                      { id: 'balloon-top', label: 'balloon-top' },
                      { id: 'ribbon-bottom', label: 'ribbon-bottom' },
                      { id: 'ribbon-top', label: 'ribbon-top' },
                      { id: 'phone', label: 'phone (Celular)' },
                      { id: 'cine', label: 'cine (Marco Cine)' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDesignConfig({ ...designConfig, outer_frame: m.id as QROuterFrame })}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          designConfig.outer_frame === m.id
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {designConfig.outer_frame !== 'none' && (
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                            Texto del Marco (framelabel):
                          </label>
                          <input
                            type="text"
                            value={designConfig.framelabel}
                            onChange={(e) => setDesignConfig({ ...designConfig, framelabel: e.target.value })}
                            placeholder="SCAN ME"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                            Tipografía (label_font):
                          </label>
                          <select
                            value={designConfig.label_font}
                            onChange={(e) => setDesignConfig({ ...designConfig, label_font: e.target.value as QRLabelFont })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs cursor-pointer"
                          >
                            <option value="Arial, Helvetica, sans-serif">Arial / Sans-serif Moderno</option>
                            <option value="'Times New Roman', Times, serif">Times New Roman / Serif Clásico</option>
                            <option value="'Courier New', Courier, monospace">Courier New / Monospace Tech</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={designConfig.custom_frame_color}
                            onChange={(e) => setDesignConfig({ ...designConfig, custom_frame_color: e.target.checked })}
                            className="rounded text-blue-600"
                          />
                          <span>Color Personalizado de Marco (custom_frame_color)</span>
                        </label>

                        {designConfig.custom_frame_color && (
                          <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                            <input
                              type="color"
                              value={designConfig.framecolor}
                              onChange={(e) => setDesignConfig({ ...designConfig, framecolor: e.target.value })}
                              className="w-6 h-6 rounded cursor-pointer bg-transparent"
                            />
                            <span className="text-xs font-mono font-bold text-white">{designConfig.framecolor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-PESTAÑA 2: FORMA (pattern, marker, marker_in) */}
              {designTab === 'forma' && (
                <div className="space-y-4">
                  {/* Pattern */}
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                      Patrón de Puntos (pattern):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'default', label: 'default (cuadrado)' },
                        { id: 'circle', label: 'circle (puntos)' },
                        { id: 'star', label: 'star (estrellas)' },
                        { id: 'diamond', label: 'diamond (rombos)' },
                        { id: 'sparkle', label: 'sparkle (destellos)' },
                        { id: 'heart', label: 'heart (corazones)' },
                        { id: 'plus', label: 'plus (+)' },
                        { id: 'x', label: 'x (equis)' },
                        { id: 'blob', label: 'blob (suave)' },
                        { id: 'special-circle', label: 'special-circle' },
                        { id: 'special-diamond', label: 'special-diamond' },
                        { id: 'ellipse', label: 'ellipse' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setDesignConfig({ ...designConfig, pattern: p.id as QRPattern })}
                          className={`p-2 rounded-xl border text-[11px] font-bold text-center truncate transition-all cursor-pointer ${
                            designConfig.pattern === p.id
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Marker (outer corners) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Marco Exterior de Esquinas (marker):
                      </label>
                      <select
                        value={designConfig.marker}
                        onChange={(e) => setDesignConfig({ ...designConfig, marker: e.target.value as QRMarkerOut })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs cursor-pointer font-bold"
                      >
                        <option value="default">default (Cuadrado estándar)</option>
                        <option value="circle">circle (Círculo)</option>
                        <option value="rounded">rounded (Borde redondeado)</option>
                        <option value="drop">drop (Gota de agua)</option>
                        <option value="dropeye">dropeye (Ojo gota)</option>
                        <option value="flower">flower (Flor suave)</option>
                      </select>
                    </div>

                    {/* Marker_in (inner pupil) */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                        Pupila Interior de Esquinas (marker_in):
                      </label>
                      <select
                        value={designConfig.marker_in}
                        onChange={(e) => setDesignConfig({ ...designConfig, marker_in: e.target.value as QRMarkerIn })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs cursor-pointer font-bold"
                      >
                        <option value="default">default (Cuadrado 3x3)</option>
                        <option value="circle">circle (Círculo sólido)</option>
                        <option value="diamond">diamond (Rombo)</option>
                        <option value="star">star (Estrella 5 puntas)</option>
                        <option value="sun">sun (Sol brillante)</option>
                        <option value="heart">heart (Corazón)</option>
                        <option value="rounded">rounded (Esquinas redondeadas)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PESTAÑA 3: COLOR (frontcolor, backcolor, gradient, radial, transparent) */}
              {designTab === 'color' && (
                <div className="space-y-4">
                  {/* Toggles de Degradado, Radial y Transparencia */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={designConfig.gradient}
                        onChange={(e) => setDesignConfig({ ...designConfig, gradient: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Degradado (gradient)</span>
                    </label>

                    {designConfig.gradient && (
                      <label className="flex items-center gap-1.5 cursor-pointer text-cyan-400">
                        <input
                          type="checkbox"
                          checked={designConfig.radial}
                          onChange={(e) => setDesignConfig({ ...designConfig, radial: e.target.checked })}
                          className="rounded text-cyan-500"
                        />
                        <span>Radial (radial gradient)</span>
                      </label>
                    )}

                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                      <input
                        type="checkbox"
                        checked={designConfig.transparent}
                        onChange={(e) => setDesignConfig({ ...designConfig, transparent: e.target.checked })}
                        className="rounded text-amber-500"
                      />
                      <span>Fondo Transparente (transparent)</span>
                    </label>
                  </div>

                  {/* Pickers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Puntos (frontcolor):
                      </span>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={designConfig.frontcolor}
                          onChange={(e) => setDesignConfig({ ...designConfig, frontcolor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-white">{designConfig.frontcolor}</span>
                      </div>
                    </div>

                    {designConfig.gradient && (
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Degradado (gradient_color):
                        </span>
                        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <input
                            type="color"
                            value={designConfig.gradient_color}
                            onChange={(e) => setDesignConfig({ ...designConfig, gradient_color: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-xs font-mono font-bold text-white">{designConfig.gradient_color}</span>
                        </div>
                      </div>
                    )}

                    {!designConfig.transparent && (
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Fondo (backcolor):
                        </span>
                        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <input
                            type="color"
                            value={designConfig.backcolor}
                            onChange={(e) => setDesignConfig({ ...designConfig, backcolor: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer bg-transparent"
                          />
                          <span className="text-xs font-mono font-bold text-white">{designConfig.backcolor}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Esquinas (marker_out_color):
                      </span>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={designConfig.marker_out_color}
                          onChange={(e) => setDesignConfig({ ...designConfig, marker_out_color: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-white">{designConfig.marker_out_color}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Pupilas (marker_in_color):
                      </span>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input
                          type="color"
                          value={designConfig.marker_in_color}
                          onChange={(e) => setDesignConfig({ ...designConfig, marker_in_color: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-white">{designConfig.marker_in_color}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-PESTAÑA 4: LOGO (optionlogo, no_logo_bg, upload) */}
              {designTab === 'logo' && (
                <div className="space-y-4">
                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={handleLogoDrop}
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
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
                    <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-white">
                      Arrastra y suelta tu propio logo aquí o haz clic para subir
                    </p>
                  </div>

                  {/* Toggle Fondo del Logo */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300">
                      Sin Fondo Detrás del Logo (no_logo_bg):
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={designConfig.no_logo_bg}
                        onChange={(e) => setDesignConfig({ ...designConfig, no_logo_bg: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Logos Oficiales (Incluyendo TikTok) */}
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                      Logos Oficiales de Plataformas y Redes (optionlogo):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { id: 'tiktok', label: '🎵 TikTok' },
                        { id: 'whatsapp', label: 'WA WhatsApp' },
                        { id: 'instagram', label: '📸 Instagram' },
                        { id: 'facebook', label: '📘 Facebook' },
                        { id: 'youtube', label: '🔴 YouTube' },
                        { id: 'twitter', label: '𝕏 Twitter/X' },
                        { id: 'linkedin', label: '💼 LinkedIn' },
                        { id: 'spotify', label: '♫ Spotify' },
                        { id: 'telegram', label: '✈ Telegram' },
                        { id: 'pinterest', label: '📌 Pinterest' },
                        { id: 'paypal', label: '🅿 PayPal' },
                        { id: 'btc', label: '₿ Bitcoin' },
                        { id: 'wifi', label: '📶 Wi-Fi' },
                        { id: 'email', label: '✉ Email' },
                        { id: 'link', label: '🔗 Enlace' },
                        { id: 'location', label: '📍 Ubicación' },
                        { id: 'pdf', label: '📄 PDF' },
                        { id: 'none', label: '✖ Ninguno' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDesignConfig({ ...designConfig, optionlogo: item.id as QROptionLogo })}
                          className={`p-2 rounded-xl border text-[11px] font-bold text-center truncate transition-all cursor-pointer ${
                            designConfig.optionlogo === item.id
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
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

              {/* SUB-PESTAÑA 5: API DEVELOPERS */}
              {designTab === 'api' && (
                <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-black uppercase text-cyan-400 font-mono">
                      URL del Endpoint API en Vivo:
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      GET / POST Activo
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Puedes incrustar este código QR dinámicamente en cualquier sitio web, aplicación móvil o sistema backend usando tu endpoint:
                  </p>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
                    https://lectorqr.atpdev.dev/api/qr?data={encodeURIComponent(computeRawData())}&pattern={designConfig.pattern}&marker={designConfig.marker}&marker_in={designConfig.marker_in}&optionlogo={designConfig.optionlogo}&outer_frame={designConfig.outer_frame}&framelabel={encodeURIComponent(designConfig.framelabel)}&frontcolor={encodeURIComponent(designConfig.frontcolor)}&backcolor={encodeURIComponent(designConfig.backcolor)}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block">Ejemplo en HTML &lt;img&gt;:</span>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 select-all">
                      {`<img src="https://lectorqr.atpdev.dev/api/qr?data=${computeRawData()}&optionlogo=${designConfig.optionlogo}" alt="QR Code" width="300" />`}
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
                HD Render
              </span>
            </div>

            {/* Canvas Box */}
            <div className="p-4 rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center max-w-full overflow-hidden">
              <canvas
                ref={canvasRef}
                className="rounded-2xl max-w-full h-auto shadow-md"
              />
            </div>

            {/* Selector de Resolución de Exportación */}
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

            {/* Botones de Descarga */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={downloadPNG}
                disabled={downloading}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Generando...' : `Descargar PNG (${exportResolution}px HD)`}</span>
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
