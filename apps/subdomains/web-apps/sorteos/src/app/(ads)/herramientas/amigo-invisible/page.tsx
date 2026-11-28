"use client";

import React, { useState, useEffect } from 'react';
import { 
  Gift, Sparkles, Plus, Trash2, Eye, EyeOff, 
  Copy, Check, Share2, Shuffle, CheckCircle2, Calendar, 
  DollarSign, Volume2, VolumeX, Maximize2, Minimize2, Tv 
} from 'lucide-react';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { shuffleArray, generateSha256Hash } from '@/lib/randomEngine';
import { 
  playCardFlip, playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';
import { ListFileImporter } from '@/components/ListFileImporter';
import { ExportResultHub } from '@/components/ExportResultHub';
import { parsePastedParticipantText } from '@/lib/fileListExtractor';

const DEFAULT_PARTICIPANTS = [
  'Carlos Gómez',
  'Lucía Fernández',
  'Andrés Mendoza',
  'Valeria Silva',
  'Mateo Torres',
];

interface Match {
  giver: string;
  receiver: string;
  revealed: boolean;
}

export default function AmigoInvisiblePage() {
  const { t } = useLanguage();
  const [participants, setParticipants] = useState<string[]>(DEFAULT_PARTICIPANTS);
  const [newPerson, setNewPerson] = useState<string>('');
  const [budget, setBudget] = useState<string>('$20.00');
  const [deadline, setDeadline] = useState<string>('24 de Diciembre');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [friendNotice, setFriendNotice] = useState<string | null>(null);
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggleSound = () => {
    setMuted(toggleAudioMute());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const isUntouchedDemo = (list: string[]) =>
    list.length === DEFAULT_PARTICIPANTS.length &&
    list.every((item, idx) => item === DEFAULT_PARTICIPANTS[idx]);

  const appendBulkNames = (incoming: string[]) => {
    if (incoming.length === 0) return;
    setFriendNotice(null);
    let feedbackMsg = '';
    if (isUntouchedDemo(participants) && incoming.length >= 2) {
      setParticipants(incoming);
      feedbackMsg = `✓ ${incoming.length} participantes agregados en orden (lista demo reemplazada).`;
    } else {
      const seen = new Set(participants.map((p) => p.toLowerCase()));
      const additions = incoming.filter((name) => !seen.has(name.toLowerCase()));
      if (additions.length === 0) {
        feedbackMsg = 'Esos participantes ya estaban en la lista.';
      } else {
        setParticipants([...participants, ...additions]);
        feedbackMsg = `✓ +${additions.length} participante${additions.length > 1 ? 's' : ''} agregado${additions.length > 1 ? 's' : ''} automáticamente en orden.`;
      }
    }
    setMatches([]);
    setNewPerson('');
    playCardFlip();
    setPasteFeedback(feedbackMsg);
    setTimeout(() => setPasteFeedback(null), 5000);
  };

  const handlePersonInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const plainText = e.clipboardData?.getData('text/plain') || '';
    if (!plainText.trim()) return;
    const { names, isBulkPaste } = parsePastedParticipantText(plainText);
    if (isBulkPaste && names.length > 0) {
      e.preventDefault();
      appendBulkNames(names);
    }
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    const { names, isBulkPaste } = parsePastedParticipantText(newPerson);
    if (isBulkPaste && names.length > 0) {
      appendBulkNames(names);
      return;
    }
    const clean = newPerson.trim();
    if (!clean) return;
    if (participants.some((p) => p.toLowerCase() === clean.toLowerCase())) {
      setFriendNotice('Esta persona ya está en la lista de participantes.');
      setTimeout(() => setFriendNotice(null), 4000);
      return;
    }
    setFriendNotice(null);
    setParticipants([...participants, clean]);
    setNewPerson('');
  };

  const handleRemovePerson = (idx: number) => {
    if (participants.length <= 3) {
      setFriendNotice('Se requieren al menos 3 personas para el sorteo de amigo invisible.');
      setTimeout(() => setFriendNotice(null), 4000);
      return;
    }
    setFriendNotice(null);
    setParticipants(participants.filter((_, i) => i !== idx));
  };

  const handleImportParticipants = (newParticipants: string[], mode: 'replace' | 'append') => {
    if (mode === 'append') {
      setParticipants((prev) => {
        const seen = new Set(prev.map((p) => p.toLowerCase()));
        const additions = newParticipants.filter((p) => !seen.has(p.toLowerCase()));
        return [...prev, ...additions];
      });
    } else {
      setParticipants(newParticipants);
    }
    setMatches([]);
    playCardFlip();
  };

  const handleStartDraw = () => {
    if (participants.length < 3 || isDrawing) return;
    setShowCountdown(true);
  };

  const executeMatches = async () => {
    setShowCountdown(false);
    setIsDrawing(true);

    const givers = [...participants];
    let receivers: string[] = [];
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 100) {
      attempts++;
      receivers = shuffleArray(givers);
      valid = givers.every((giver, i) => giver !== receivers[i]);
    }

    if (!valid) {
      receivers = [...givers.slice(1), givers[0]];
    }

    const calculatedMatches: Match[] = givers.map((giver, i) => ({
      giver,
      receiver: receivers[i],
      revealed: false
    }));

    const hash = await generateSha256Hash(
      `amigo-invisible-${Date.now()}-${givers.join(',')}`
    );

    setMatches(calculatedMatches);
    setAuditHash(hash);
    setIsDrawing(false);
    playWinnerFanfare();
  };

  const toggleReveal = (idx: number) => {
    playCardFlip();
    setMatches((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, revealed: !m.revealed } : m))
    );
  };

  const copySecretMessage = (m: Match, idx: number) => {
    const text = `🤫 ¡Hola ${m.giver}! En el Sorteo de Amigo Invisible te ha tocado regalarle a:\n\n🎁 ${m.receiver}\n\n💰 Presupuesto: ${budget || 'Libre'}\n📅 Fecha de entrega: ${deadline || 'Por acordar'}\n\n🔒 Sorteo privado y certificado por Sorteos Pro`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const shareViaWhatsApp = (m: Match) => {
    const text = `🤫 ¡Hola ${m.giver}! En el Amigo Invisible te tocó regalarle a: 🎁 *${m.receiver}*.\n💰 Presupuesto: ${budget}\n📅 Fecha: ${deadline}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />
      <ConfettiEffect active={matches.length > 0 && !isDrawing} />

      {friendNotice && (
        <div role="alert" className="max-w-lg mx-auto p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center justify-between gap-2">
          <span>{friendNotice}</span>
          <button type="button" onClick={() => setFriendNotice(null)} className="cursor-pointer opacity-75 hover:opacity-100">✕</button>
        </div>
      )}

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title={t('countdown_matching_secret')}
        onComplete={executeMatches}
      />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Gift className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          {t('secret_santa_title')}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
          {t('secret_santa_desc')}
        </p>

        {/* Small Audio & Screen Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-600" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-pink-600" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {matches.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLiveStream(true)}
              className="py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{t('btn_live_mode')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Participants & Rules */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {t('secret_santa_participants_label')} ({participants.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setParticipants(['Carlos Gómez', 'Lucía Fernández', 'Andrés Mendoza', 'Valeria Silva', 'Mateo Torres', 'Sofía Vargas', 'Diego Ramos'])}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-pink-900/30 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Cargar participantes de ejemplo"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-purple-400" />
                  <span>Cargar Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setParticipants([])}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-rose-950/30 text-slate-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300 text-xs font-bold border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Limpiar toda la lista"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

            {/* Add person form */}
            <form onSubmit={handleAddPerson} className="space-y-1.5">
              <div className="flex gap-2">
                <label htmlFor="person-name-input" className="sr-only">
                  Nombre de la persona o pega lista de Excel
                </label>
                <input
                  id="person-name-input"
                  name="personName"
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onPaste={handlePersonInputPaste}
                  placeholder="Nombre o pega lista de Excel (Ctrl+V)..."
                  aria-label={t('secret_santa_placeholder_name')}
                  className="flex-1 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50 dark:focus:ring-pink-900/20"
                />
                <button
                  type="submit"
                  disabled={!newPerson.trim()}
                  aria-label="Agregar participante a la lista"
                  className="p-2.5 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] disabled:opacity-50 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              {pasteFeedback && (
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 px-1">
                  {pasteFeedback}
                </p>
              )}
            </form>

            {/* Participants pills */}
            <div data-no-translate="true" className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {participants.map((person, idx) => (
                <div
                  key={`${person}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-zinc-200"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-lg bg-pink-100/80 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 text-[11px] font-mono font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold truncate">{person}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(idx)}
                    aria-label={`Eliminar a ${person}`}
                    className="text-slate-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Subida Universal: Word, Excel, PDF, CSV, TXT e Imagen OCR */}
            <ListFileImporter onImport={handleImportParticipants} currentCount={participants.length} />

            {/* Extra details: Budget and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
              <div className="space-y-1">
                <label htmlFor="budget-input" className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" /> {t('secret_santa_budget_label')}:
                </label>
                <input
                  id="budget-input"
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ej: $20.00"
                  className="w-full rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#d91a7a]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="deadline-input" className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" /> {t('secret_santa_deadline_label')}:
                </label>
                <input
                  id="deadline-input"
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Ej: 24 Diciembre"
                  className="w-full rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#d91a7a]"
                />
              </div>
            </div>

            {/* Draw Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={participants.length < 3 || isDrawing}
                onClick={handleStartDraw}
                className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 text-white font-bold w-full text-base py-3.5 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Shuffle className="w-5 h-5" />
                <span>{t('secret_santa_btn_generate')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form: Secret Match Cards */}
        <div className="lg:col-span-6 space-y-4">
          {matches.length > 0 ? (
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-white/10">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-500" />
                    <span>{t('secret_santa_secret_card')}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {t('secret_santa_instructions')}
                  </p>
                </div>
                <ExportResultHub
                  variant="secret-santa"
                  matches={matches}
                  budget={budget}
                  deadline={deadline}
                  auditHash={auditHash}
                  buttonText="Exportar Todo (PDF, Word, Excel, Imagen)"
                />
              </div>

              {/* Match list with 3D Flip style */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 transition-all hover:border-pink-300 dark:hover:border-pink-500/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        🎁 {m.giver}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(idx)}
                        className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors cursor-pointer"
                      >
                        {m.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{m.revealed ? t('secret_santa_hide') : t('secret_santa_reveal')}</span>
                      </button>
                    </div>

                    {/* Secret Box */}
                    <div
                      className={`p-3.5 rounded-xl border text-center transition-all duration-300 select-none ${
                        m.revealed
                          ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/40 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-[#1e293b] border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-500 font-mono text-xs'
                      }`}
                    >
                      {m.revealed ? (
                        <div className="space-y-0.5 animate-in zoom-in-95 duration-200">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 block font-normal">
                            {t('secret_santa_give_secret_to')}
                          </span>
                          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">{m.receiver}</span>
                        </div>
                      ) : (
                        <span>🔒 {t('secret_santa_reveal')}</span>
                      )}
                    </div>

                    {/* Actions: Copy or WhatsApp */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copySecretMessage(m, idx)}
                        className="flex-1 py-2 px-3 rounded-lg bg-white dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('btn_copied')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t('btn_copy')}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => shareViaWhatsApp(m)}
                        className="py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-emerald-200 dark:border-emerald-800/40 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t('secret_santa_share_whatsapp')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Audit Hash */}
              {auditHash && (
                <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Audit Hash: {auditHash.slice(0, 24)}...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-12 text-center space-y-3 border border-slate-200 dark:border-white/10 shadow-sm text-slate-500 dark:text-zinc-400 flex flex-col items-center justify-center min-h-[380px]">
              <Gift className="w-12 h-12 text-pink-400" />
              <p className="text-base font-bold text-slate-900 dark:text-white">{t('secret_santa_ready_title')}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                {t('secret_santa_ready_desc')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AdSense Ad Placement */}
      <div className="pt-6">
        <AdBanner format="horizontal" />
      </div>

      {/* Live Stream Stage */}
      {matches.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="Amigo Invisible - Sorteo Secreto"
          winner={`¡Emparejamiento de ${matches.length} participantes realizado!`}
          auditHash={auditHash}
          platform="Amigo Secreto"
          onReroll={handleStartDraw}
        />
      )}
    </div>
  );
}
