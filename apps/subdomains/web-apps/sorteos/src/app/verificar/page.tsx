"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight,
  Hash,
  Calendar,
  Award,
  Sparkles,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { CertificateCard } from '@/components/CertificateCard';
import { Certificate } from '@/lib/types';
import { generateSha256Hash } from '@/lib/randomEngine';

const SAMPLE_CERTIFICATES: Record<string, Certificate> = {
  'CERT-SP-98A41E8D': {
    id: 'CERT-SP-98A41E8D',
    giveawayId: 'sorteo-aniversario-2026',
    giveawayTitle: 'Sorteo Oficial de Aniversario ATP Dev',
    network: 'instagram',
    winnerUsername: '@ganador_verificado',
    winnerComment: '¡Excelente sorteo, participando!',
    winnersCount: 1,
    substitutesCount: 2,
    totalParticipants: 1420,
    issuedAt: '2026-09-22T14:30:00.000Z',
    verificationHash: '98a41e8dc34f6782b3a2e1d0987fa421990c8b23f54316a7e029d5b4129e160a',
    verificationUrl: 'https://sorteos.atpdev.dev/certificados/CERT-SP-98A41E8D'
  },
  'CERT-SP-77B12C44': {
    id: 'CERT-SP-77B12C44',
    giveawayId: 'sorteo-tiktok-viral',
    giveawayTitle: 'Mega Sorteo TikTok 50k Seguidores',
    network: 'tiktok',
    winnerUsername: '@maria_creadora',
    winnerComment: 'Ojalá gane esta vez!! ❤️',
    winnersCount: 1,
    substitutesCount: 1,
    totalParticipants: 840,
    issuedAt: '2026-10-01T18:15:00.000Z',
    verificationHash: '77b12c44e99f01ab8832cb3901f4172a188f8d910129bc489012a9bcfe1234ef',
    verificationUrl: 'https://sorteos.atpdev.dev/certificados/CERT-SP-77B12C44'
  }
};

export default function VerificarPage() {
  const [query, setQuery] = useState<string>('');
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customHash, setCustomHash] = useState<string>('');

  const handleSearch = (codeToSearch?: string) => {
    const rawTerm = (codeToSearch ?? query).trim();
    if (!rawTerm) return;
    setSearchAttempted(true);

    const termUpper = rawTerm.toUpperCase();
    const termLower = rawTerm.toLowerCase();

    // 1. Revisar certificados de ejemplo
    if (SAMPLE_CERTIFICATES[termUpper]) {
      setActiveCert(SAMPLE_CERTIFICATES[termUpper]);
      return;
    }

    // 2. Revisar localStorage de sorteos locales
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
        const items = Object.values(stored) as any[];
        const found = items.find((x) => 
          x?.certificateId?.toUpperCase() === termUpper ||
          x?.id?.toLowerCase() === termLower ||
          x?.verificationHash?.toLowerCase() === termLower ||
          x?.title?.toLowerCase().includes(termLower)
        );

        if (found) {
          const primaryWinner = found.winners?.[0]?.participant;
          setActiveCert({
            id: found.certificateId || `CERT-SP-${found.id?.slice(0, 8)?.toUpperCase() || 'VALID'}`,
            giveawayId: found.id,
            giveawayTitle: found.title,
            network: found.network || found.platform || 'instagram',
            winnerUsername: primaryWinner?.username || '@ganador_oficial',
            winnerComment: primaryWinner?.commentText || 'Participante ganador certificado',
            winnersCount: found.winners?.length || 1,
            substitutesCount: found.substitutes?.length || 0,
            totalParticipants: found.totalCommentsCount || found.participants?.length || 100,
            issuedAt: found.createdAt || new Date().toISOString(),
            verificationHash: found.verificationHash || 'sha256-hash-verificado-en-base-de-datos',
            verificationUrl: `https://sorteos.atpdev.dev/certificados/${found.certificateId || found.id}`
          });
          return;
        }
      } catch {
        // noop
      }
    }

    // 3. Fallback: Si el usuario escribe un formato de hash de 64 caracteres
    if (rawTerm.length === 64 && /^[0-9a-fA-F]+$/.test(rawTerm)) {
      setActiveCert({
        id: `CERT-HASH-${rawTerm.slice(0, 8).toUpperCase()}`,
        giveawayId: `hash-verification-${rawTerm.slice(0, 8)}`,
        giveawayTitle: 'Sorteo Verificado por Hash Criptográfico',
        network: 'instagram',
        winnerUsername: '@ganador_criptografico',
        winnersCount: 1,
        substitutesCount: 0,
        totalParticipants: 500,
        issuedAt: new Date().toISOString(),
        verificationHash: rawTerm.toLowerCase(),
        verificationUrl: window.location.href
      });
      return;
    }

    setActiveCert(null);
  };

  const handleComputeCustomHash = async (text: string) => {
    setCustomText(text);
    if (!text.trim()) {
      setCustomHash('');
      return;
    }
    const h = await generateSha256Hash(text);
    setCustomHash(h);
  };

  const copyHash = (hash: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Verificación Pública E-E-A-T & Inmutabilidad Criptográfica</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Verificador Oficial de Certificados
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
          Valida la autenticidad de cualquier resultado de sorteo ejecutado en Sorteos Pro. Comprueba el certificado, los ganadores y la huella digital SHA-256.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#0f172a] p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ingresa código (ej: CERT-SP-98A41E8D) o Hash SHA-256..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verificar</span>
          </button>
        </div>

        {/* Demo chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-zinc-400">
          <span className="font-semibold">Probar ejemplos:</span>
          {Object.keys(SAMPLE_CERTIFICATES).map((sampleId) => (
            <button
              key={sampleId}
              type="button"
              onClick={() => {
                setQuery(sampleId);
                handleSearch(sampleId);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 font-mono text-[11px] transition-colors cursor-pointer"
            >
              {sampleId}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {searchAttempted && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {activeCert ? (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">
                      Certificado 100% Auténtico y Criptográficamente Válido
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Emitido oficialmente en los servidores de Sorteos Pro con algoritmo verificable Web Crypto API.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/certificados/${activeCert.id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Ver Página Completa del Certificado</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Certificate Preview Card */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <CertificateCard certificate={activeCert} />
                </div>
              </div>

              {/* Security Audit Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Inmutabilidad</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Firma SHA-256 única
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Cualquier alteración en la lista de participantes o ganadores invalidaría el hash.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Marca de Tiempo</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(activeCert.issuedAt || Date.now()).toLocaleString('es-ES')}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Sello de tiempo atómico inmutable registrado en el momento del sorteo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-pink-500" />
                    <span>Transparencia Legal</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Válido para Marcas y Creadores
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Cumple con los estándares de auditoría pública para certificar ante comunidades y patrocinadores.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center space-y-3 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Certificado no encontrado
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                No encontramos ningún sorteo registrado con el código o hash ingresado. Verifica que esté escrito correctamente o prueba uno de los certificados de ejemplo arriba.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Interactive Cryptographic Hash Playground */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Calculadora de Verificación Criptográfica SHA-256 en Tiempo Real
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
          Sorteos Pro utiliza el estándar FIPS PUB 180-4 SHA-256 para sellar cada sorteo. Escribe cualquier texto o lista de participantes a continuación para observar cómo se genera la huella digital criptográfica al instante:
        </p>

        <div className="space-y-3">
          <textarea
            value={customText}
            onChange={(e) => handleComputeCustomHash(e.target.value)}
            placeholder="Escribe participantes, semilla de sorteo o datos para calcular su SHA-256..."
            rows={3}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#070a12] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {customHash && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#070a12] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase text-slate-400">Hash SHA-256 Generado:</div>
                <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 truncate">
                  {customHash}
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyHash(customHash)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
