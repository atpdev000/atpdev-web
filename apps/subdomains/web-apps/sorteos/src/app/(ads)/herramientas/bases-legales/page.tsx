"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  Gift, 
  Scale
} from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';

export default function BasesLegalesPage() {
  const [giveawayName, setGiveawayName] = useState<string>('Gran Sorteo de Fin de Mes');
  const [organizer, setOrganizer] = useState<string>('@mi_marca_oficial');
  const [platform, setPlatform] = useState<string>('Instagram');
  const [prize, setPrize] = useState<string>('1x iPhone 16 Pro Max de 256GB');
  const [country, setCountry] = useState<string>('Perú y Latinoamérica');
  const [startDate, setStartDate] = useState<string>('15 de Octubre de 2026');
  const [endDate, setEndDate] = useState<string>('30 de Octubre de 2026 a las 20:00 hrs');
  const [minAge, setMinAge] = useState<string>('18');
  
  // Requisitos
  const [reqFollow, setReqFollow] = useState<boolean>(true);
  const [reqLike, setReqLike] = useState<boolean>(true);
  const [reqCommentFriends, setReqCommentFriends] = useState<boolean>(true);
  const [friendsCount, setFriendsCount] = useState<number>(2);
  const [reqShareStory, setReqShareStory] = useState<boolean>(true);
  const [reqHashtag, setReqHashtag] = useState<boolean>(false);
  const [hashtagValue, setHashtagValue] = useState<string>('#SorteoOficial');

  const [activeTab, setActiveTab] = useState<'caption' | 'legal'>('caption');
  const [copied, setCopied] = useState<boolean>(false);

  // Generación de Texto para Caption / Post
  const generateCaption = () => {
    let text = `🎉 ¡SORTEO OFICIAL: ${giveawayName.toUpperCase()}! 🎉\n\n`;
    text += `Estamos muy emocionados de premiar a nuestra comunidad con: 🎁 ${prize}!\n\n`;
    text += `👇 ¿CÓMO PARTICIPAR? Es muy fácil:\n`;
    if (reqFollow) text += `1️⃣ Sigue nuestra cuenta oficial ${organizer}\n`;
    if (reqLike) text += `2️⃣ Dale LIKE ❤️ a esta publicación\n`;
    if (reqCommentFriends) text += `3️⃣ Comenta mencionando a ${friendsCount} amig@s (más comentarios = más oportunidades de ganar)\n`;
    if (reqShareStory) text += `4️⃣ ¡EXTRA CHANCE! Comparte este post en tus historias y etiquétanos\n`;
    if (reqHashtag && hashtagValue) text += `5️⃣ Usa el hashtag ${hashtagValue}\n`;
    text += `\n📅 FECHAS:\n`;
    text += `• Inicio: ${startDate}\n`;
    text += `• Cierre: ${endDate}\n`;
    text += `• Ámbito: Válido para residentes de ${country} (mayores de ${minAge} años).\n\n`;
    text += `🛡️ TRANSPARENCIA Y GANADOR:\n`;
    text += `El ganador o ganadora será seleccionado(a) de manera 100% transparente y aleatoria mediante Sorteos Pro con certificado criptográfico SHA-256 verificado.\n\n`;
    text += `⚠️ NOTA LEGAL: Esta promoción no está patrocinada, administrada ni asociada a ${platform} ni a Meta Platforms Inc. Bases completas disponibles para consulta pública. ¡Mucha suerte a tod@s! 🍀✨`;
    return text;
  };

  // Generación de Bases Legales Formales
  const generateFullLegalTerms = () => {
    return `BASES LEGALES Y TÉRMINOS Y CONDICIONES DE LA PROMOCIÓN
"${giveawayName.toUpperCase()}"

1. ORGANIZADOR DE LA PROMOCIÓN
La presente actividad promocional es organizada por "${organizer}", en adelante el "Organizador", y se llevará a cabo a través de la plataforma digital ${platform}.

2. ÁMBITO TERRITORIAL Y LEGITIMACIÓN PARA PARTICIPAR
Podrán participar todas aquellas personas naturales residentes legales en ${country}, que cuenten con un perfil de usuario activo y público en ${platform} y sean mayores de ${minAge} años a la fecha de inicio del sorteo. Quedan excluidos empleados directos del Organizador y cuentas automatizadas o bots.

3. PLAZO Y VIGENCIA
El periodo de participación iniciará el día ${startDate} y finalizará indefectiblemente el día ${endDate}. Los comentarios o interacciones registrados con posterioridad a dicho término no serán computados en el sorteo.

4. MECÁNICA DE PARTICIPACIÓN
Para considerarse participante válido, el usuario deberá cumplir con los siguientes pasos durante el periodo de vigencia:
${reqFollow ? `- Seguir la cuenta oficial del Organizador: ${organizer}.\n` : ''}${reqLike ? `- Marcar con "Me gusta" o "Like" la publicación oficial de la promoción.\n` : ''}${reqCommentFriends ? `- Publicar al menos un comentario válido etiquetando a un mínimo de ${friendsCount} persona(s) real(es).\n` : ''}${reqShareStory ? `- (Opcional para chance adicional): Compartir la publicación en historias públicas.\n` : ''}
5. PREMIO OFRECIDO
Se entregará el siguiente premio único o lote de premios:
${prize}
El premio es personal, intransferible y no podrá ser canjeado por su valor en dinero en efectivo ni sustituido por otro bien salvo acuerdo expreso del Organizador.

6. ELECCIÓN DEL GANADOR Y CERTIFICACIÓN PÚBLICA
La selección del ganador y suplentes se llevará a cabo el día de cierre mediante la plataforma tecnológica Sorteos Pro (https://sorteos.atpdev.dev), garantizando:
a) Selección aleatoria certificada con algoritmos criptográficos basados en el estándar SHA-256.
b) Emisión de un Certificado de Validez Público con marca temporal inmutable.
c) Publicación del resultado en los canales oficiales del Organizador.
Si el ganador no responde o no cumple con los requisitos dentro de las 48 horas siguientes a la notificación, se procederá a contactar al suplente respectivo.

7. EXONERACIÓN DE RESPONSABILIDAD DE PLATAFORMAS
Se deja expresa constancia de que esta promoción no está patrocinada, avalada, administrada ni asociada en modo alguno a Meta Platforms Inc., Instagram, Facebook, TikTok ni Google LLC. Los participantes exoneran a dichas plataformas de toda responsabilidad derivada de la presente promoción.

8. ACEPTACIÓN DE LAS BASES
La participación en esta promoción implica la aceptación total e incondicional de las presentes Bases Legales.`;
  };

  const currentContent = activeTab === 'caption' ? generateCaption() : generateFullLegalTerms();

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bases-legales-${giveawayName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
          <Scale className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Generador de Bases Legales para Sorteos
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
          Crea en 30 segundos los términos legales y el texto para el post de tu sorteo en Instagram, TikTok o Facebook, cumpliendo con las políticas de Meta y transparencia legal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left Column) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
            <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Configuración de tu Sorteo
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Nombre del Sorteo</label>
              <input
                type="text"
                value={giveawayName}
                onChange={(e) => setGiveawayName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Organizador (@cuenta)</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Red Principal</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                  <option value="Multi-Red">Multi-Red Social</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Premio(s)</label>
              <input
                type="text"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">País o Región</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Edad Mínima</label>
                <input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Fecha de Inicio</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Fecha y Hora de Cierre</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Checklist de requisitos */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-zinc-300">Requisitos para participar:</label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqFollow}
                  onChange={(e) => setReqFollow(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-slate-700 dark:text-zinc-300">Seguir la cuenta organizadora</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqLike}
                  onChange={(e) => setReqLike(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-slate-700 dark:text-zinc-300">Dar Like al post</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqCommentFriends}
                  onChange={(e) => setReqCommentFriends(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-slate-700 dark:text-zinc-300">Mencionar amigos en comentarios ({friendsCount})</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqShareStory}
                  onChange={(e) => setReqShareStory(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-slate-700 dark:text-zinc-300">Compartir en historias (extra chance)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Output Generator (Right Column) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('caption')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'caption'
                    ? 'bg-white dark:bg-[#1e293b] text-pink-600 dark:text-pink-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                📝 Texto para Post (Caption)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('legal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'legal'
                    ? 'bg-white dark:bg-[#1e293b] text-pink-600 dark:text-pink-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                ⚖️ Bases Legales Formales
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Descargar archivo .txt"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar .txt</span>
              </button>
            </div>
          </div>

          {/* Generated Text Preview */}
          <div className="relative">
            <textarea
              readOnly
              value={currentContent}
              rows={16}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#070a12] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 dark:text-zinc-200 focus:outline-none resize-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Incluye cláusula de transparencia compatible con Sorteos Pro y certificación inmutable con hash SHA-256.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
