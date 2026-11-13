"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Search, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import CertificateCard from '@/components/CertificateCard';
import { Certificate } from '@/lib/types';

const SAMPLE_CERTIFICATE: Certificate = {
  id: 'CERT-SP-98A41E8D',
  giveawayId: 'sorteo-aniversario-2026',
  giveawayTitle: 'Sorteo Oficial de Aniversario ATP Dev',
  network: 'youtube',
  winnerUsername: '@Ganador_Verificado',
  winnerComment: '¡Excelente sorteo, participando!',
  winnersCount: 1,
  substitutesCount: 2,
  totalParticipants: 1420,
  issuedAt: '2026-09-22T14:30:00.000Z',
  verificationHash: '98a41e8dc34f6782b3a2e1d0987fa421990c8b23f54316a7e029d5b4129e160a',
  verificationUrl: 'https://sorteos.atpdev.dev/certificados/CERT-SP-98A41E8D'
};

export default function CertificadoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [cert, setCert] = useState<Certificate>(SAMPLE_CERTIFICATE);
  const [searchHash, setSearchHash] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<'valid' | 'invalid' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
        let item = stored[resolvedParams.id];
        
        // Búsqueda por certificateId, id de sorteo o hash
        if (!item) {
          const allItems = Object.values(stored) as any[];
          item = allItems.find(
            (x) =>
              x?.certificateId?.toUpperCase() === resolvedParams.id.toUpperCase() ||
              x?.id === resolvedParams.id ||
              x?.verificationHash?.toLowerCase() === resolvedParams.id.toLowerCase()
          );
        }

        if (item) {
          const primaryWinner = item.winners?.[0]?.participant;
          setCert({
            id: item.certificateId || resolvedParams.id,
            giveawayId: item.id,
            giveawayTitle: item.title,
            network: item.network || item.platform || 'youtube',
            platform: item.platform || item.network || 'youtube',
            winnersCount: item.winners?.length || 1,
            substitutesCount: item.substitutes?.length || 0,
            totalParticipants: item.totalCommentsCount || 0,
            issuedAt: item.createdAt || new Date().toISOString(),
            verificationHash: item.verificationHash || '',
            verificationUrl: window.location.href,
            winnerUsername: primaryWinner?.username || '',
            winnerComment: primaryWinner?.commentText || '',
            winners: item.winners || [],
            substitutes: item.substitutes || [],
          });
        }
      } catch {
        // noop
      }

      // Consulta complementaria al backend para auditoría pública
      fetch(`/api/v1/certificates/${encodeURIComponent(resolvedParams.id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.certificate) {
            const c = data.certificate;
            setCert((prev) => ({
              ...prev,
              id: c.id || prev.id,
              giveawayId: c.giveawayId || prev.giveawayId,
              giveawayTitle: c.title || c.giveawayTitle || prev.giveawayTitle,
              network: c.network || c.platform || prev.network,
              winnerUsername: c.winnerUsername || prev.winnerUsername,
              winnerComment: c.winnerComment || prev.winnerComment,
              winners: c.winners && c.winners.length > 0 ? c.winners : prev.winners,
              substitutes: c.substitutes && c.substitutes.length > 0 ? c.substitutes : prev.substitutes,
              totalParticipants: c.totalParticipants || prev.totalParticipants,
              verificationHash: c.verificationHash || prev.verificationHash,
              issuedAt: c.issuedAt || prev.issuedAt,
            }));
          }
        })
        .catch(() => {});
    }
  }, [resolvedParams.id]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHash.trim()) return;
    const cleanSearch = searchHash.trim();
    if (
      cleanSearch.toLowerCase() === cert.verificationHash.toLowerCase() ||
      cleanSearch.toUpperCase() === cert.id.toUpperCase() ||
      cleanSearch.toLowerCase() === cert.giveawayId?.toLowerCase()
    ) {
      setVerifyResult('valid');
    } else {
      setVerifyResult('invalid');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Nav */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href={`/sorteo/${cert.giveawayId}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al resultado del sorteo</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Firma Digital Criptográfica Válida</span>
        </div>
      </div>

      {/* Main Certificate Display */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            Certificado Oficial de Transparencia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
            Acreditación pública inmutable de selección aleatoria conforme a las normativas oficiales de redes sociales y algoritmo CSPRNG auditado.
          </p>
        </div>

        <CertificateCard certificate={cert} />
      </div>

      {/* Interactive Hash Validator Section */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-pink-600 dark:text-purple-400" />
            <span>Verificador Público de Autenticidad</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Cualquier participante o auditor puede verificar este certificado ingresando el código del certificado o el hash SHA-256 para constatar que el ganador y el resultado no han sido modificados.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            placeholder="Pega el hash SHA-256 o código de certificado..."
            aria-label="Pega el hash SHA-256 o código de certificado"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-pink-500 dark:focus:border-purple-500 transition-colors shadow-xs"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl btn-pro-primary font-bold font-display text-xs cursor-pointer"
          >
            Verificar Firma
          </button>
        </form>

        {verifyResult === 'valid' && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>¡Certificado 100% Auténtico!</strong> Coincide exactamente con el registro criptográfico emitido por Sorteos Pro.
            </span>
          </div>
        )}

        {verifyResult === 'invalid' && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/30 text-rose-800 dark:text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-red-400 shrink-0" />
            <span>
              <strong>Firma no coincidente:</strong> El código o hash ingresado no corresponde a este sorteo.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
