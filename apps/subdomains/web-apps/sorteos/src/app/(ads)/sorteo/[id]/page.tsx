"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  ShieldCheck, 
  Calendar, 
  ExternalLink, 
  Share2, 
  Check, 
  Users, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';

import { Giveaway } from '@/lib/types';
import ConfettiEffect from '@/components/ConfettiEffect';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { playWinnerFanfare } from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';

// Fallback demo giveaway si no existe en localStorage
const DEMO_GIVEAWAY: Giveaway = {
  id: 'sorteo-aniversario-2026',
  title: 'Sorteo Oficial de Aniversario ATP Dev',
  network: 'instagram',
  postUrl: 'https://www.instagram.com/p/DBa_9XYZ123/',
  authorUsername: 'atpdev_oficial',
  totalCommentsCount: 1420,
  rules: {
    excludeDuplicates: true,
    minMentions: 1,
    requiredHashtag: '#sorteopro',
    blockedUsers: [],
    winnersCount: 1,
    substitutesCount: 2
  },
  winners: [
    {
      id: 'win-1',
      participant: {
        id: 'p-1',
        username: 'valeria.gomez',
        commentText: '¡Me encanta este giveaway! Participando con @carlos_m y @sofia.r #sorteopro',
        isEligible: true
      },
      type: 'winner',
      position: 1,
      selectedAt: '2026-09-22T14:30:00.000Z'
    }
  ],
  substitutes: [
    {
      id: 'sub-1',
      participant: {
        id: 'p-2',
        username: 'diego_martinez99',
        commentText: 'Quiero ganar para regalarle a @mariana.paz #sorteopro',
        isEligible: true
      },
      type: 'substitute',
      position: 1,
      selectedAt: '2026-09-22T14:30:00.000Z'
    },
    {
      id: 'sub-2',
      participant: {
        id: 'p-3',
        username: 'camila_rodriguez',
        commentText: 'Participo!! @lucia.v y @andres_b #sorteopro',
        isEligible: true
      },
      type: 'substitute',
      position: 2,
      selectedAt: '2026-09-22T14:30:00.000Z'
    }
  ],
  status: 'finished',
  createdAt: '2026-09-22T14:30:00.000Z',
  certificateId: 'CERT-SP-98A41E8D',
  verificationHash: '98a41e8dc34f6782b3a2e1d0987fa421990c8b23f54316a7e029d5b4129e160a'
};

export default function SorteoPublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { t } = useLanguage();
  const [giveaway, setGiveaway] = useState<Giveaway>(DEMO_GIVEAWAY);
  const [copied, setCopied] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
      if (stored[resolvedParams.id]) {
        setGiveaway(stored[resolvedParams.id]);
      }
      playWinnerFanfare();
    }
  }, [resolvedParams.id]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNetworkIcon = () => {
    switch (giveaway.network) {
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return <TikTokIcon className="w-4 h-4 text-cyan-400" />;
      case 'youtube':
        return <YoutubeIcon className="w-4 h-4 text-red-500" />;
      case 'facebook':
        return <FacebookIcon className="w-4 h-4 text-blue-500" />;
      case 'x':
        return <XIcon className="w-4 h-4 text-slate-900 dark:text-white" />;
      case 'threads':
        return <ThreadsIcon className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-pink-600 dark:text-purple-400" />;
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <ConfettiEffect />

      {/* Back nav & breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('btn_back_home')}</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? t('btn_copied') : t('btn_copy')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLiveStream(true)}
            className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 dark:bg-purple-600/30 dark:hover:bg-purple-600/50 dark:border-purple-500/40 text-xs font-mono text-pink-700 dark:text-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📺 {t('btn_live_mode')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:border-amber-500/30 text-xs font-mono text-amber-800 dark:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📸 {t('btn_export')}</span>
          </button>

          <Link
            href={`/certificados/${giveaway.certificateId || 'CERT-SP-98A41E8D'}`}
            className="px-3.5 py-1.5 rounded-xl gold-gradient-badge text-black text-xs font-bold font-display flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('wizard_view_cert')}</span>
          </Link>
        </div>
      </div>

      {/* Public Giveaway Header Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              {getNetworkIcon()}
              <span className="capitalize">{giveaway.network}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('verified_badge')}</span>
            </span>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-1.5" suppressHydrationWarning>
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(giveaway.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            {giveaway.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 flex items-center gap-2 flex-wrap">
            <span>{t('organized_by')} <strong className="text-slate-900 dark:text-white">@{giveaway.authorUsername || 'host'}</strong></span>
            {giveaway.postUrl && (
              <>
                <span className="text-slate-400 dark:text-zinc-600">•</span>
                <a
                  href={giveaway.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 dark:text-purple-400 hover:underline underline-offset-4 flex items-center gap-1 font-mono text-xs"
                >
                  <span>{t('view_original_post')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Official Winners Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gold-gradient-badge flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-950" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            {t('wizard_winners_official')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {giveaway.winners.map((winner) => (
            <div
              key={winner.id}
              className="bg-amber-50/60 dark:bg-[#0f172a] rounded-2xl p-6 border-2 border-amber-300 dark:border-amber-500/30 space-y-3 relative overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black font-black font-display text-lg flex items-center justify-center shadow-md shadow-amber-400/20">
                    #{winner.position}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-amber-800 dark:text-amber-400 font-bold">{t('winner_primary')}</span>
                    <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                      @{winner.participant.username}
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/20 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                  {t('verified_tag')}
                </div>
              </div>

              {winner.participant.commentText && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-black/40 border border-amber-200 dark:border-white/5 text-xs text-slate-700 dark:text-zinc-300 italic">
                  &ldquo;{winner.participant.commentText}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Substitutes Section */}
      {giveaway.substitutes && giveaway.substitutes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {t('wizard_substitutes_reserve')} ({giveaway.substitutes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giveaway.substitutes.map((sub) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-500 dark:text-zinc-400">{t('wizard_substitute_label')} #{sub.position}</span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">{t('substitute_reserve')}</span>
                </div>
                <div className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  @{sub.participant.username}
                </div>
                {sub.participant.commentText && (
                  <p className="text-slate-600 dark:text-zinc-400 italic line-clamp-2">
                    &ldquo;{sub.participant.commentText}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit & Cryptographic Transparency */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white font-display">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('audit_title')}</span>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
            ID: {giveaway.id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-zinc-500 block">{t('audit_comments_analyzed')}</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">{giveaway.totalCommentsCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-zinc-500 block">{t('audit_filter_duplicates')}</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">
              {giveaway.rules.excludeDuplicates ? t('audit_active_duplicate') : t('audit_inactive')}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-zinc-500 block">{t('audit_mentions_required')}</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">{giveaway.rules.minMentions}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs font-mono space-y-1">
          <span className="text-slate-500 dark:text-zinc-500 text-[11px] block">{t('audit_hash_label')}</span>
          <span className="text-emerald-700 dark:text-emerald-400 break-all select-all">{giveaway.verificationHash}</span>
        </div>
      </div>

      {/* Bottom Pro Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href={`/certificados/${giveaway.certificateId || 'CERT-SP-98A41E8D'}`}
          className="btn-pro-gold py-4 px-8 text-sm flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-amber-950" />
          <span>{t('wizard_view_cert')}</span>
        </Link>

        <Link
          href="/sorteos/nuevo"
          className="btn-pro-primary py-4 px-8 text-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-pink-200" />
          <span>{t('create_own_giveaway')}</span>
        </Link>
      </div>

      {/* Live Stream Stage Modal */}
      {giveaway.winners.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title={giveaway.title}
          winner={`@${giveaway.winners[0]?.participant.username}`}
          substitutes={giveaway.substitutes?.map((s) => `@${s.participant.username}`)}
          auditHash={giveaway.verificationHash}
          platform={`Sorteo ${(giveaway.network || 'redes').toUpperCase()}`}
        />
      )}

      {/* Winner Export Modal */}
      {giveaway.winners.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={`@${giveaway.winners[0]?.participant.username}`}
          drawTitle={giveaway.title}
          auditHash={giveaway.verificationHash}
          platform={`Sorteo ${(giveaway.network || 'redes').toUpperCase()}`}
        />
      )}
    </div>
  );
}
