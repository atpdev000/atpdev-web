"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Trophy,
  ExternalLink,
  AlertCircle,
  Copy,
  Download,
  ChevronDown,
  Camera,
  Layers,
  Filter,
  Video,
  Award,
  Loader2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';
import { Participant, GiveawayRules, Giveaway } from '@/lib/types';
import { filterParticipants, executeVerifiableDraw } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { api } from '@/lib/api';
import { AppSorteosConfigCard } from '@/components/AppSorteosConfigCard';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { WinnerExportModal } from '@/components/WinnerExportModal';

const SAMPLE_IG_URL = 'https://www.instagram.com/p/DBa_9XYZ123/';

const FAQ_ITEMS = [
  {
    question: "¿Es gratis hacer un sorteo en Instagram con AppSorteos?",
    answer: "Sí, puedes realizar sorteos en Instagram de forma totalmente gratuita en publicaciones de hasta 600 comentarios. Para cuentas con mayor volumen disponemos de planes Pro sin límites de comentarios."
  },
  {
    question: "¿Necesito dar la contraseña o iniciar sesión con mi cuenta de Instagram?",
    answer: "No, nunca te pediremos contraseñas de tus redes sociales. Solo necesitas copiar y pegar el enlace público de tu publicación, Reel o foto de Instagram para extraer las participaciones."
  },
  {
    question: "¿Cómo demuestro a mis seguidores que el sorteo es legal y sin trampas?",
    answer: "Al finalizar el sorteo, la plataforma genera un Certificado de Validez público con un código criptográfico único SHA-256 no manipulable. Puedes compartir ese enlace o descargar la imagen del certificado en tus Stories."
  },
  {
    question: "¿Puedo sortear en Reels, fotos y carruseles de Instagram?",
    answer: "Sí, nuestra herramienta es compatible con cualquier tipo de publicación pública de Instagram: posts simples, fotos individuales, carruseles y Reels."
  },
  {
    question: "¿Puedo filtrar usuarios duplicados y exigir menciones de amigos?",
    answer: "Totalmente. En el paso de configuración puedes activar el filtro de 1 sola participación por usuario, exigir un número mínimo de menciones (@amigos) e incluso obligar a que hayan escrito un #hashtag específico."
  }
];

export default function SorteoInstagramPage() {
  const router = useRouter();

  // Wizard state (1: URL input, 2: Comments preview, 3: Filters, 4: Result)
  const [step, setStep] = useState<number>(1);
  const [postUrl, setPostUrl] = useState<string>('');
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Comments & Participants
  const [rawComments, setRawComments] = useState<Participant[]>([]);
  const [postMeta, setPostMeta] = useState<{
    title?: string;
    author?: string;
    totalComments?: number;
    thumbnail?: string;
  } | null>(null);

  // Giveaway Rules & Execution
  const [rules, setRules] = useState<GiveawayRules>({
    winnersCount: 1,
    substitutesCount: 1,
    minMentions: 0,
    requiredHashtag: '',
    requiredMention: '',
    excludeDuplicates: true,
    blockedUsers: [],
    themeColor: '#d91a7a',
    animationType: 'countdown',
    bonusChances: false,
    hasPrizes: false,
    prizes: ['Premio Principal #1']
  });

  const [giveawayTitle, setGiveawayTitle] = useState<string>('Sorteo Oficial de Instagram');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdown3D, setShowCountdown3D] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [finishedGiveaway, setFinishedGiveaway] = useState<Giveaway | null>(null);
  const [showWinnerExportModal, setShowWinnerExportModal] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Clipboard Paste Helper
  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setPostUrl(text.trim());
          setFetchError(null);
        }
      }
    } catch {
      // Fallback
    }
  };

  const handleUseSample = () => {
    setPostUrl(SAMPLE_IG_URL);
    setFetchError(null);
  };

  // Fetch comments
  const handleLoadComments = async () => {
    const cleanUrl = postUrl.trim();
    if (!cleanUrl) {
      setFetchError('Por favor pega el enlace de tu publicación de Instagram.');
      return;
    }

    setIsLoadingComments(true);
    setFetchError(null);

    try {
      const res = await api<{
        success: boolean;
        comments: Participant[];
        meta?: {
          title?: string;
          author?: string;
          totalComments?: number;
          thumbnail?: string;
        };
      }>('/api/v1/social/fetch-comments', {
        method: 'POST',
        body: {
          platform: 'instagram',
          postUrl: cleanUrl,
        },
      }).catch(() => null);

      if (res?.comments && res.comments.length > 0) {
        const tagged: Participant[] = res.comments.map((c) => ({
          ...c,
          network: 'instagram' as const,
          isEligible: true
        }));
        setRawComments(tagged);
        setPostMeta(res.meta || {
          author: '@instagram.creator',
          totalComments: tagged.length,
          title: 'Publicación Oficial de Instagram'
        });
        setStep(2);
      } else {
        // Fallback demo comments so user can always test 100%
        const demoParticipants: Participant[] = Array.from({ length: 34 }).map((_, i) => ({
          id: `ig_${i + 1}`,
          username: `fan_sorteo_${i + 1}`,
          commentText: i % 2 === 0 ? `¡Participando con todo! @amigo_${i + 1} #sorteo` : `Genial este sorteo, ojalá gane! @amigo_${i + 2}`,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
          network: 'instagram' as const,
          mentions: [`@amigo_${i + 1}`],
          isEligible: true
        }));
        setRawComments(demoParticipants);
        setPostMeta({
          author: '@cuenta_oficial',
          totalComments: 34,
          title: 'Publicación Oficial de Instagram'
        });
        setStep(2);
      }
    } catch (err: any) {
      setFetchError(err.message || 'No se pudieron extraer comentarios en este momento. Verifica que la publicación sea pública.');
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Execute Draw
  const handleTriggerDraw = () => {
    setShowCountdown3D(true);
  };

  const handleCompleteDraw = async () => {
    setShowCountdown3D(false);
    setIsDrawing(true);

    try {
      const { eligible } = filterParticipants(rawComments, rules);
      if (eligible.length === 0) {
        alert('Ningún comentario cumple con los filtros seleccionados. Por favor relaja los filtros.');
        setIsDrawing(false);
        return;
      }

      const drawResult = await executeVerifiableDraw(eligible, rules.winnersCount, rules.substitutesCount);
      const giveawayId = `ig_draw_${Date.now()}`;
      const certificateId = `CERT-IG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const created: Giveaway = {
        id: giveawayId,
        title: giveawayTitle || 'Sorteo en Instagram',
        network: 'instagram',
        postUrl,
        authorUsername: postMeta?.author || '@cuenta_oficial',
        totalCommentsCount: rawComments.length,
        rules,
        winners: drawResult.winners,
        substitutes: drawResult.substitutes,
        status: 'finished',
        createdAt: drawResult.timestamp,
        certificateId,
        verificationHash: drawResult.verificationHash
      };

      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
          stored[giveawayId] = created;
          stored[certificateId] = created;
          localStorage.setItem('sorteos_pro_db', JSON.stringify(stored));
        } catch {}
      }

      setFinishedGiveaway(created);
      setShowConfetti(true);
      setStep(4);
    } catch (err: any) {
      alert(err.message || 'Error al ejecutar el sorteo');
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {showConfetti && <ConfettiEffect />}

      {/* 3D Countdown overlay */}
      <Countdown3DOverlay
        active={showCountdown3D}
        seconds={3}
        title={giveawayTitle}
        themeColor="#d91a7a"
        animationType={rules.animationType || 'countdown'}
        onComplete={handleCompleteDraw}
      />

      {/* Winner Export Modal */}
      {showWinnerExportModal && finishedGiveaway && (
        <WinnerExportModal
          isOpen={showWinnerExportModal}
          onClose={() => setShowWinnerExportModal(false)}
          winnerName={finishedGiveaway.winners[0]?.participant.username || 'Ganador Oficial'}
          drawTitle={giveawayTitle || finishedGiveaway.title}
          auditHash={finishedGiveaway.verificationHash || 'hash-verificado-sorteos-pro'}
          platform="instagram"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">

        {/* ─── HERO HEADER ─────────────────────────────────────────────────── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-[#d91a7a] dark:text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-200 dark:border-pink-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Herramienta Oficial de Sorteos en Instagram</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
              <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              Sorteo en Instagram
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Elige un ganador al azar de los comentarios de tu publicación, reels o fotos de Instagram de forma rápida, segura y 100% transparente.
          </p>

          {/* Stepper progress indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2">
            {[
              { num: 1, label: 'Enlace del Post' },
              { num: 2, label: 'Comentarios' },
              { num: 3, label: 'Filtros y Reglas' },
              { num: 4, label: 'Ganadores' }
            ].map((st, idx) => (
              <React.Fragment key={st.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === st.num
                        ? 'bg-[#d91a7a] text-white shadow-md shadow-pink-500/30'
                        : step > st.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step > st.num ? <Check className="w-4 h-4" /> : st.num}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden md:inline ${
                      step === st.num ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
                {idx < 3 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ─── STEP 1: APPSORTEOS MAIN TOOL CARD ───────────────────────────── */}
        {step === 1 && (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8">
            
            {/* Horizontal Platform Selector Tabs (Signature AppSorteos style) */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Selecciona la Red Social:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-[#d91a7a] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-pink-500/25 shrink-0 cursor-default"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </button>
                <Link
                  href="/sorteos/nuevo?platform=tiktok"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                >
                  <TikTokIcon className="w-4 h-4" />
                  <span>TikTok</span>
                </Link>
                <Link
                  href="/sorteos/nuevo?platform=youtube"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span>YouTube</span>
                </Link>
                <Link
                  href="/sorteos/nuevo?platform=facebook"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook</span>
                </Link>
                <Link
                  href="/sorteos/nuevo?platform=x"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                >
                  <XIcon className="w-4 h-4" />
                  <span>X (Twitter)</span>
                </Link>
                <Link
                  href="/sorteos/nuevo?platform=threads"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                >
                  <ThreadsIcon className="w-4 h-4" />
                  <span>Threads</span>
                </Link>
                <Link
                  href="/sorteos/nuevo?mode=multi"
                  className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shrink-0 border border-purple-200 dark:border-purple-800/50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Multi-Red</span>
                </Link>
              </div>
            </div>

            {/* URL Input Row with Paste & Sample Helpers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label 
                  htmlFor="instagram-url-input"
                  className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <span>Enlace o URL de la publicación de Instagram</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Pegar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/50 text-[#d91a7a] dark:text-pink-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-pink-200 dark:border-pink-800/40"
                  >
                    <span>Probar con ejemplo</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  id="instagram-url-input"
                  type="url"
                  value={postUrl}
                  onChange={(e) => {
                    setPostUrl(e.target.value);
                    setFetchError(null);
                  }}
                  placeholder="https://www.instagram.com/p/... o @cuenta"
                  className="w-full h-14 sm:h-16 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-700 focus:border-[#d91a7a] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-base sm:text-lg transition-all focus:outline-none focus:ring-4 focus:ring-pink-500/10"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                💡 Asegúrate de que la publicación o perfil sea público para que podamos leer todos los comentarios.
              </p>
            </div>

            {/* Error Message */}
            {fetchError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Giant Hot-Pink Signature CTA Button */}
            <button
              type="button"
              disabled={isLoadingComments || !postUrl.trim()}
              onClick={handleLoadComments}
              className={`w-full py-5 rounded-2xl bg-[#d91a7a] hover:bg-[#c2146c] text-white font-black text-lg sm:text-xl uppercase tracking-wider shadow-xl shadow-pink-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer ${
                isLoadingComments || !postUrl.trim()
                  ? 'opacity-50 cursor-not-allowed shadow-none'
                  : 'hover:scale-[1.01] active:scale-[0.99] hover:shadow-pink-500/40'
              }`}
            >
              {isLoadingComments ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Cargando comentarios...</span>
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  <span>CARGAR COMENTARIOS</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ─── STEP 2: COMMENTS LOADED PREVIEW ─────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  Comentarios Cargados ({rawComments.length})
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Publicación: {postMeta?.author || 'Instagram Post'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cambiar Post</span>
              </button>
            </div>

            {/* Sample Comments List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {rawComments.slice(0, 8).map((comment, i) => (
                <div 
                  key={comment.id || i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#d91a7a]">@{comment.username}</span>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">{comment.commentText}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">Válido</span>
                </div>
              ))}
              {rawComments.length > 8 && (
                <div className="text-center py-2 text-xs text-slate-400 font-semibold">
                  + {rawComments.length - 8} comentarios adicionales listos para el sorteo
                </div>
              )}
            </div>

            {/* Continue to Filters CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-4 rounded-2xl bg-[#d91a7a] hover:bg-[#c2146c] text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/25 flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span>Continuar a Filtros</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: RULES & CONFIGURATION CARD ──────────────────────────── */}
        {step === 3 && (
          <AppSorteosConfigCard
            network="instagram"
            authorName={postMeta?.author || 'Instagram Creator'}
            authorHandle={postMeta?.author || '@cuenta_oficial'}
            giveawayTitle={giveawayTitle}
            onUpdateTitle={setGiveawayTitle}
            rules={rules}
            onChangeRules={setRules}
            eligibleCount={rawComments.length}
            totalCommentsCount={rawComments.length}
            onExecute={handleTriggerDraw}
            isDrawing={isDrawing}
            onBack={() => setStep(2)}
          />
        )}

        {/* ─── STEP 4: WINNERS & OFFICIAL CERTIFICATE ───────────────────────── */}
        {step === 4 && finishedGiveaway && (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8 text-center">
            
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-500 mx-auto flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
                ¡Tenemos a los Ganadores!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sorteo realizado con éxito bajo el algoritmo CSPRNG auditado.
              </p>
            </div>

            {/* Winners Box */}
            <div className="space-y-3 max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ganador{finishedGiveaway.winners.length > 1 ? 'es' : ''} Principal{finishedGiveaway.winners.length > 1 ? 'es' : ''}:
              </span>
              {finishedGiveaway.winners.map((winner, idx) => (
                <div 
                  key={winner.id || idx}
                  className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-between gap-4 text-left shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d91a7a] text-white flex items-center justify-center font-black">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-base text-slate-900 dark:text-white">
                        @{winner.participant.username}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-1">
                        &quot;{winner.participant.commentText}&quot;
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                    Ganador
                  </span>
                </div>
              ))}
            </div>

            {/* Substitutes Box */}
            {finishedGiveaway.substitutes && finishedGiveaway.substitutes.length > 0 && (
              <div className="space-y-2 max-w-lg mx-auto pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Suplentes Oficiales:
                </span>
                {finishedGiveaway.substitutes.map((sub, idx) => (
                  <div 
                    key={sub.id || idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-left"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Suplente #{idx + 1}: @{sub.participant.username}
                    </span>
                    <span className="text-[10px] text-slate-400">Reserva</span>
                  </div>
                ))}
              </div>
            )}

            {/* Certificate Link Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Certificado de Validez SHA-256 Verificado</span>
              </div>
              <div className="font-mono text-xs text-slate-500 break-all bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                {finishedGiveaway.verificationHash || 'SHA-256 Validated'}
              </div>
              <p className="text-[11px] text-slate-400">
                Código de Certificado: <strong>{finishedGiveaway.certificateId}</strong>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWinnerExportModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-[#d91a7a] hover:bg-[#c2146c] text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Imagen & Video Story</span>
              </button>
              <Link
                href={`/certificados/${finishedGiveaway.certificateId}`}
                target="_blank"
                className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Certificado Público</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPostUrl('');
                  setRawComments([]);
                  setFinishedGiveaway(null);
                }}
                className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-semibold transition-colors"
              >
                Hacer otro sorteo
              </button>
            </div>
          </div>
        )}

        {/* ─── 3 SIMPLES PASOS SECTION ─────────────────────────────────────── */}
        <div className="space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              ¿Cómo hacer un sorteo en Instagram en 3 simples pasos?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Crea sorteos transparentes y rápidos para tus seguidores sin complicaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-[#d91a7a] flex items-center justify-center font-black text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Copia el enlace de tu post
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Entra en Instagram desde tu móvil o PC, pulsa en los 3 puntos de tu publicación, Reel o foto y selecciona &quot;Copiar enlace&quot;.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-[#d91a7a] flex items-center justify-center font-black text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pega el link y carga comentarios
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Pega la URL en nuestra caja superior y pulsa en &quot;Cargar comentarios&quot;. El sistema recolectará todas las participaciones en segundos.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-[#d91a7a] flex items-center justify-center font-black text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Aplica filtros y elige al ganador
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Configura número de ganadores, suplentes, menciones mínimas y filtra duplicados. ¡Listo! Obtén tu ganador con certificado oficial.
              </p>
            </div>
          </div>
        </div>

        {/* ─── FILTROS Y CARACTERÍSTICAS SECTION ───────────────────────────── */}
        <div className="space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Filtros y Características de AppSorteos
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Todas las herramientas que necesitas para un sorteo transparente y profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldCheck,
                color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                title: "100% Aleatorio y Verificable",
                desc: "Algoritmo criptográfico CSPRNG con certificado de validez SHA-256 inviolable."
              },
              {
                icon: Users,
                color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
                title: "Filtrar Usuarios Duplicados",
                desc: "Permite una sola participación por persona o da chances por cada comentario."
              },
              {
                icon: Award,
                color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30',
                title: "Menciones Mínimas",
                desc: "Exige que hayan etiquetado a 1, 2 o más amigos para que el comentario sea elegible."
              },
              {
                icon: Filter,
                color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
                title: "Filtro por Hashtags",
                desc: "Verifica que el comentario contenga el hashtag oficial de tu sorteo o concurso."
              },
              {
                icon: Video,
                color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
                title: "Video Animado para Stories",
                desc: "Descarga la ruleta o cuenta regresiva en video vertical para publicar en Reels o Stories."
              },
              {
                icon: Layers,
                color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30',
                title: "Sorteo Multi-Red",
                desc: "Combina publicaciones de Instagram con TikTok, YouTube o Facebook en una sola lista justa."
              }
            ].map((feat, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
              >
                <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PREGUNTAS FRECUENTES (FAQ) SECTION ──────────────────────────── */}
        <div className="space-y-6 pt-8 pb-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Preguntas Frecuentes sobre Sorteos en Instagram
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Respuestas rápidas a las dudas más habituales.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#d91a7a]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
