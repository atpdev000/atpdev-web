'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  CheckCircle2,
  Sparkles,
  Copy,
  Zap,
  ArrowLeft,
  Puzzle,
  FolderOpen,
  ShieldCheck,
  RefreshCw,
  Flame,
} from 'lucide-react';

export default function ExtensionInstallPage() {
  const [isDetected, setIsDetected] = useState<boolean>(false);
  const [copiedFolder, setCopiedFolder] = useState<boolean>(false);
  const [copiedBrowserUrl, setCopiedBrowserUrl] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [launching, setLaunching] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [browserInfo, setBrowserInfo] = useState({
    name: 'Google Chrome',
    key: 'chrome',
    url: 'chrome://extensions',
    devModeTip: 'arriba a la derecha (esquina superior derecha de Chrome)',
    cmd: 'chrome',
  });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent;
    const isEdge = /Edg\//i.test(ua);
    const isOpera = /OPR\/|Opera/i.test(ua);
    const isBrave = Boolean((navigator as any).brave) || /Brave/i.test(ua);
    const isFirefox = /Firefox\//i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);

    if (isEdge) {
      setBrowserInfo({
        name: 'Microsoft Edge',
        key: 'edge',
        url: 'edge://extensions',
        devModeTip: 'abajo a la izquierda (esquina inferior izquierda de Edge)',
        cmd: 'msedge',
      });
    } else if (isOpera) {
      setBrowserInfo({
        name: 'Opera',
        key: 'opera',
        url: 'opera://extensions',
        devModeTip: 'arriba a la derecha (esquina superior derecha de Opera)',
        cmd: 'opera',
      });
    } else if (isBrave) {
      setBrowserInfo({
        name: 'Brave Browser',
        key: 'brave',
        url: 'brave://extensions',
        devModeTip: 'arriba a la derecha (esquina superior derecha de Brave)',
        cmd: 'brave',
      });
    } else if (isFirefox) {
      setBrowserInfo({
        name: 'Mozilla Firefox',
        key: 'firefox',
        url: 'about:debugging#/runtime/this-firefox',
        devModeTip: 'menú «Cargar complemento temporal...»',
        cmd: 'firefox',
      });
    } else if (isSafari) {
      setBrowserInfo({
        name: 'Apple Safari',
        key: 'safari',
        url: 'Safari Extensiones',
        devModeTip: 'Ajustes > Extensiones',
        cmd: 'safari',
      });
    } else {
      setBrowserInfo({
        name: 'Google Chrome',
        key: 'chrome',
        url: 'chrome://extensions',
        devModeTip: 'arriba a la derecha (esquina superior derecha de Chrome)',
        cmd: 'chrome',
      });
    }
  }, []);

  const EXTENSION_PATH = 'D:\\PROYECTOS\\atpdev-web\\extension-sorteos-pro';

  // 1. Detección en vivo de la extensión mediante DOM y postMessage de bridge.js
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStatus = () => {
      if (
        document.documentElement.getAttribute('data-sorteos-pro-extension') ||
        (window as any).__SORTEOS_PRO_EXTENSION__ ||
        (window as any).__SORTEOS_PRO_EXTENSION_ACTIVE__
      ) {
        setIsDetected(true);
        return;
      }
      window.postMessage({ type: 'SORTEOS_PRO_PING' }, '*');
    };

    const handleMessage = (e: MessageEvent) => {
      if (
        e.data &&
        (e.data.type === 'SORTEOS_PRO_PONG' ||
          e.data.source === 'sorteos-pro-extension' ||
          e.data.type === 'PONG')
      ) {
        setIsDetected(true);
      }
    };

    const onLoaded = () => setIsDetected(true);

    window.addEventListener('sorteos_pro_extension_loaded', onLoaded);
    window.addEventListener('message', handleMessage);
    checkStatus();
    const interval = setInterval(checkStatus, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sorteos_pro_extension_loaded', onLoaded);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleCopy = (text: string, type: 'folder' | 'browser' | 'script') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'folder') {
        setCopiedFolder(true);
        setTimeout(() => setCopiedFolder(false), 2500);
      } else if (type === 'browser') {
        setCopiedBrowserUrl(true);
        setTimeout(() => setCopiedBrowserUrl(false), 2500);
      } else if (type === 'script') {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2500);
      }
    }
  };

  const handleLaunchWindowsInstaller = async () => {
    setLaunching(true);
    setFeedback(null);
    try {
      handleCopy(EXTENSION_PATH, 'folder');
      const res = await fetch('/api/v1/extension/open-installer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ browser: browserInfo.name }),
      });
      const data = await res.json().catch(() => null);
      setFeedback(data?.message || `✅ ¡Se abrió ${browserInfo.name} y la carpeta de la extensión en el Explorador! Arrastra la carpeta hacia la ventana o pulsa «Cargar descomprimida».`);
    } catch {
      setFeedback(`ℹ️ Copia la ruta y abre ${browserInfo.url} manualmente en ${browserInfo.name}.`);
    } finally {
      setLaunching(false);
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3006';
  const quickSyncScript = `(async()=>{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:16px 24px;border-radius:14px;font-family:sans-serif;font-weight:bold;box-shadow:0 15px 35px rgba(0,0,0,0.4);font-size:15px;';b.innerText='⚡ Sorteos Pro: Sincronizando...';document.body.appendChild(b);const mm=location.pathname.match(/(?:status|statuses)\\/(?:\\d+)/i);const mid=mm?mm[1]:null;const l=[];const seen=new Set();for(let s=0;s<25;s++){document.querySelectorAll('div[role="button"],button').forEach(bt=>{const t=bt.innerText||'';if(t.includes('Mostrar')||t.includes('Show')||t.includes('respuestas')){try{bt.click()}catch(e){}}});document.querySelectorAll('article').forEach(a=>{const u=a.querySelector('[data-testid="User-Name"]');const tx=a.querySelector('[data-testid="tweetText"]');const tm=a.querySelector('time');if(!u)return;const tl=tm?tm.closest('a'):null;if(tl&&mid&&tl.getAttribute('href')?.includes(mid))return;const m=u.innerText.match(/@([a-zA-Z0-9_]{1,15})\\b/);const h=m?m[1]:'';const lines=u.innerText.split('\\n').map(x=>x.trim()).filter(Boolean);const n=lines.length>0&&!lines[0].startsWith('@')?lines[0]:h;const ct=tx?tx.innerText.trim():'Respuesta en X';if(h&&!seen.has(h.toLowerCase())){seen.add(h.toLowerCase());l.push({username:h,name:n,commentText:ct,timestamp:new Date().toISOString()});}});b.innerText='⚡ Sorteos Pro: '+l.length+' respuestas...';if(l.length>=34)break;window.scrollBy(0,1200);await new Promise(r=>setTimeout(r,400));}window.scrollTo({top:0,behavior:'smooth'});await fetch('${currentOrigin}/api/v1/social/import-live',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({postUrl:location.href,comments:l,count:l.length,handle:'@NACHOAT00'})});b.style.background='#059669';b.innerText='✅ ¡'+l.length+' respuestas enviadas a Sorteos Pro!';setTimeout(()=>b.remove(),4000);})();`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-slate-950 p-4 md:p-8">
      {/* Fondo Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-cyan-600/20 to-purple-600/20 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Barra Superior de Navegación */}
        <div className="flex items-center justify-between">
          <Link
            href="/sorteos/nuevo?platform=x"
            className="flex items-center gap-2 text-sm font-mono text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Sorteo</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sorteos Pro v1.0 Oficial
            </span>
          </div>
        </div>

        {/* Encabezado Principal */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-300 shadow-xl shadow-cyan-500/10">
            <Puzzle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Instalador de la Extensión en tu Navegador
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Permite extraer el <strong className="text-emerald-400 font-semibold">100% de respuestas reales</strong> de cualquier hilo de X (Twitter), sorteos de Instagram y YouTube directamente desde tu cuenta activa en 1 clic.
          </p>
        </div>

        {/* Hero Estado de Conexión en Vivo */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${
          isDetected
            ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/40 shadow-2xl shadow-emerald-500/20'
            : 'bg-slate-900/80 border-white/10 shadow-xl'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isDetected
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/50'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
              }`}>
                {isDetected ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {isDetected ? '¡Extensión Conectada y Activa!' : `Esperando Instalación en ${browserInfo.name}...`}
                  </h3>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-black ${
                    isDetected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isDetected ? '100% Listo' : 'En Espera'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isDetected
                    ? 'Tu navegador ya tiene el Extractor Oficial sincronizado. Ya puedes cerrar esta pestaña o volver a tu sorteo.'
                    : `Detectando automáticamente la extensión en ${browserInfo.name} cada segundo...`}
                </p>
              </div>
            </div>

            {isDetected ? (
              <Link
                href="/sorteos/nuevo?platform=x"
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono text-sm font-black shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Volver al Sorteo y Extraer (1 Clic)</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLaunchWindowsInstaller}
                disabled={launching}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono text-sm font-black shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                <span>{launching ? 'Abriendo Instalador...' : `🚀 Abrir Instalador en ${browserInfo.name}`}</span>
              </button>
            )}
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 2 Opciones de Instalación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Instalación Rápida en el Navegador Actual */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Instalación en {browserInfo.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                  10 Segundos
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Instalar Extensión en Modo Desarrollador</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Por seguridad del navegador, Windows bloquea que aplicaciones web externas instalen complementos sin confirmación. Solo sigue estos 3 pasos:
              </p>

              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">1. En {browserInfo.name} abre la pestaña de extensiones:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(browserInfo.url, 'browser')}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors cursor-pointer"
                    >
                      {copiedBrowserUrl ? '✓ Copiado' : 'Copiar URL'}
                    </button>
                  </div>
                  <div className="p-2 rounded bg-black/60 text-cyan-300 text-[11px] select-all font-bold">
                    {browserInfo.url}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-slate-300 font-bold">2. Activa el interruptor:</span>
                  <p className="text-[11px] text-slate-400">
                    Marca la casilla <strong className="text-white">«Modo de desarrollador»</strong> ({browserInfo.devModeTip}).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">3. Carga la carpeta de la extensión:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(EXTENSION_PATH, 'folder')}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-emerald-300 transition-colors cursor-pointer"
                    >
                      {copiedFolder ? '✓ Ruta Copiada' : 'Copiar Ruta'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pulsa <strong className="text-white">«Cargar descomprimida»</strong> y selecciona la carpeta (o simplemente arrastra la carpeta hacia la ventana de {browserInfo.name}):
                  </p>
                  <div className="p-2 rounded bg-black/60 text-emerald-300 text-[11px] select-all truncate font-bold">
                    {EXTENSION_PATH}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchWindowsInstaller}
              disabled={launching}
              className="w-full mt-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <span>Abrir Carpeta en Explorador de Archivos</span>
            </button>
          </div>

          {/* Tarjeta 2: En Producción (Tienda Oficial) + Extractor Directo */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  Tienda Oficial (En Producción)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  1 Clic Real
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Instalación para Usuarios Finales</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Cuando despliegues tu app a producción, tus usuarios no necesitarán activar modo desarrollador. Al pulsar el botón se abrirá la tienda oficial de Edge o Chrome con el botón azul <strong className="text-white">«Obtener»</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Microsoft Edge Add-ons & Chrome Web Store</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  La extensión incluye el manifiesto v3 verificado con soporte para lectura segura de respuestas en X, Instagram y YouTube sin almacenar contraseñas.
                </p>
              </div>

              {/* Sincronización Alternativa Sin Extensión */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    ¿Quieres extraer los 34 comentarios ya mismo?
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Si ya tienes el tweet de Juanca abierto en la pestaña de al lado, copia este script y pégalo en la consola (<kbd className="bg-white/10 px-1 py-0.5 rounded text-white">F12</kbd>):
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(quickSyncScript, 'script')}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedScript ? '✓ ¡Script Copiado al Portapapeles!' : 'Copiar Script Extractor 1-Clic'}</span>
                </button>
              </div>
            </div>

            <Link
              href="/sorteos/nuevo?platform=x"
              className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors text-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Sorteos Pro</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
