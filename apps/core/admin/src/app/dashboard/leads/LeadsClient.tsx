"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Mail, 
  Building, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Reply, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send, 
  Loader2, 
  Settings, 
  Smartphone,
  Download,
  Briefcase,
  Gift,
  Globe,
  Search,
  Filter,
  Tag,
  ExternalLink,
  Layers,
  UtensilsCrossed,
  QrCode,
  ScanLine,
  FileText
} from "lucide-react";
import { updateLeadStatus } from "./actions";
import { generateAiReply, sendEmailReply, getSenderEmail } from "./email-actions";
import { Lead } from "@atpdev/database";

export interface LeadOriginInfo {
  key: string;
  name: string;
  subdomain: string;
  color: string;
  badgeClass: string;
  pillClass: string;
  icon: any;
}

export const PLATFORMS_CATALOG = [
  { key: "descargador", name: "Descargador Pro", icon: Download, activeClass: "bg-purple-600 text-white shadow-sm shadow-purple-600/30", idleClass: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20" },
  { key: "chamba", name: "Chamba Pro", icon: Briefcase, activeClass: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30", idleClass: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20" },
  { key: "sorteos", name: "Sorteos Pro", icon: Gift, activeClass: "bg-pink-600 text-white shadow-sm shadow-pink-600/30", idleClass: "bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 border border-pink-500/20" },
  { key: "magic", name: "Interactivo Magic", icon: Sparkles, activeClass: "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30", idleClass: "bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/20" },
  { key: "perusabor", name: "Perú Sabor Pro", icon: UtensilsCrossed, activeClass: "bg-amber-600 text-white shadow-sm shadow-amber-600/30", idleClass: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20" },
  { key: "lectorqr", name: "Lector QR Pro", icon: QrCode, activeClass: "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30", idleClass: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20" },
  { key: "dni", name: "DNI Scanner Pro", icon: ScanLine, activeClass: "bg-cyan-600 text-white shadow-sm shadow-cyan-600/30", idleClass: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20" },
  { key: "masteratpdf", name: "MasterATPDF Pro", icon: FileText, activeClass: "bg-rose-600 text-white shadow-sm shadow-rose-600/30", idleClass: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20" },
  { key: "portal", name: "Portal Principal", icon: Globe, activeClass: "bg-blue-600 text-white shadow-sm shadow-blue-600/30", idleClass: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20" },
];

export function getLeadOrigin(lead: Lead): LeadOriginInfo {
  const company = (lead.company || "").toLowerCase();
  const msg = (lead.message || "").toLowerCase();

  // 1. Descargador Pro
  if (company.includes("descargador") || msg.includes("descargador") || msg.includes("download")) {
    return {
      key: "descargador",
      name: "Descargador Pro",
      subdomain: "descargador.atpdev.dev",
      color: "purple",
      badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      pillClass: "text-purple-300 bg-purple-500/10 border-purple-500/30",
      icon: Download,
    };
  }

  // 2. Chamba Pro
  if (company.includes("chamba") || msg.includes("chamba") || msg.includes("convocatoria") || msg.includes("cas ")) {
    return {
      key: "chamba",
      name: "Chamba Pro",
      subdomain: "chamba.atpdev.dev",
      color: "emerald",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      pillClass: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
      icon: Briefcase,
    };
  }

  // 3. Sorteos Pro
  if (company.includes("sorteo") || msg.includes("sorteo") || msg.includes("giveaway") || msg.includes("ruleta")) {
    return {
      key: "sorteos",
      name: "Sorteos Pro",
      subdomain: "sorteos.atpdev.dev",
      color: "pink",
      badgeClass: "bg-pink-500/15 text-pink-400 border-pink-500/30",
      pillClass: "text-pink-300 bg-pink-500/10 border-pink-500/30",
      icon: Gift,
    };
  }

  // 4. Interactivo Magic
  if (company.includes("magic") || company.includes("interactivo") || msg.includes("interactivo magic")) {
    return {
      key: "magic",
      name: "Interactivo Magic",
      subdomain: "magic.atpdev.dev",
      color: "fuchsia",
      badgeClass: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
      pillClass: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30",
      icon: Sparkles,
    };
  }

  // 5. Perú Sabor Pro
  if (company.includes("perusabor") || company.includes("sabor") || msg.includes("peru sabor") || msg.includes("receta")) {
    return {
      key: "perusabor",
      name: "Perú Sabor Pro",
      subdomain: "perusabor.atpdev.dev",
      color: "amber",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      pillClass: "text-amber-300 bg-amber-500/10 border-amber-500/30",
      icon: UtensilsCrossed,
    };
  }

  // 6. Lector QR Pro
  if (company.includes("lectorqr") || company.includes("qr") || msg.includes("lector qr") || msg.includes("codigo qr")) {
    return {
      key: "lectorqr",
      name: "Lector QR Pro",
      subdomain: "lectorqr.atpdev.dev",
      color: "indigo",
      badgeClass: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      pillClass: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30",
      icon: QrCode,
    };
  }

  // 7. DNI Scanner Pro
  if (company.includes("dni") || msg.includes("dni scanner") || msg.includes("reniec")) {
    return {
      key: "dni",
      name: "DNI Scanner Pro",
      subdomain: "dni.atpdev.dev",
      color: "cyan",
      badgeClass: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      pillClass: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
      icon: ScanLine,
    };
  }

  // 8. MasterATPDF Pro
  if (company.includes("pdf") || company.includes("masteratpdf") || msg.includes("masteratpdf")) {
    return {
      key: "masteratpdf",
      name: "MasterATPDF Pro",
      subdomain: "masteratpdf.atpdev.dev",
      color: "rose",
      badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      pillClass: "text-rose-300 bg-rose-500/10 border-rose-500/30",
      icon: FileText,
    };
  }

  // 9. Portal Principal
  if (company.includes("portafolio") || company.includes("portal") || !lead.company || company === "directo" || company === "desde portafolio") {
    return {
      key: "portal",
      name: "Portal Principal",
      subdomain: "atpdev.dev",
      color: "blue",
      badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      pillClass: "text-blue-300 bg-blue-500/10 border-blue-500/30",
      icon: Globe,
    };
  }

  // 10. Fallback Dinámico para cualquier nuevo subdominio creado en el futuro
  const cleanName = (lead.company || "").replace(/\(.*?\)/g, "").trim() || "Web Externa";
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return {
    key: slug || "other",
    name: cleanName,
    subdomain: `${slug || "app"}.atpdev.dev`,
    color: "teal",
    badgeClass: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    pillClass: "text-teal-300 bg-teal-500/10 border-teal-500/30",
    icon: Tag,
  };
}

export function getLeadCategory(lead: Lead): string | null {
  // 1. Check regex in company e.g. "Descargador Pro (Soporte Técnico de Descargas)"
  const companyMatch = (lead.company || "").match(/\((.*?)\)/);
  if (companyMatch && companyMatch[1]) return companyMatch[1].trim();

  // 2. Check regex in message e.g. "[Asunto: Soporte Técnico de Descargas]"
  const msgMatch = (lead.message || "").match(/\[Asunto:\s*(.*?)\]/i);
  if (msgMatch && msgMatch[1]) return msgMatch[1].trim();

  return null;
}

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Smart Reply State
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [senderEmail, setSenderEmail] = useState<string | null>(null);

  // Fetch sender email on mount
  useEffect(() => {
    getSenderEmail().then(email => setSenderEmail(email));
  }, []);

  // Status Metrics
  const responded = initialLeads.filter(l => l.status !== 'NUEVO').length;
  const pending = initialLeads.filter(l => l.status === 'NUEVO').length;
  const progressPercent = initialLeads.length > 0 ? (responded / initialLeads.length) * 100 : 0;

  // Origin Counts
  const originCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: initialLeads.length,
      other: 0,
    };
    PLATFORMS_CATALOG.forEach(p => {
      counts[p.key] = 0;
    });
    initialLeads.forEach(lead => {
      const orig = getLeadOrigin(lead);
      counts[orig.key] = (counts[orig.key] || 0) + 1;
    });
    return counts;
  }, [initialLeads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return initialLeads.filter(lead => {
      // 1. Origin Filter
      if (selectedOrigin !== "all") {
        const orig = getLeadOrigin(lead);
        if (orig.key !== selectedOrigin) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (lead.name || "").toLowerCase();
        const email = (lead.email || "").toLowerCase();
        const msg = (lead.message || "").toLowerCase();
        const comp = (lead.company || "").toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !msg.includes(q) && !comp.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [initialLeads, selectedOrigin, statusFilter, searchQuery]);

  const handleStatusChange = async (id: number, status: string) => {
    await updateLeadStatus(id, status);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleGenerateAiReply = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await generateAiReply(selectedLead.name, selectedLead.message);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.reply) {
        setReplyText(res.reply);
      }
    } catch (e: any) {
      setErrorMsg("Ocurrió un error inesperado al conectar con Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedLead || !replyText.trim()) return;
    setIsSending(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const origin = getLeadOrigin(selectedLead);
      const subject = `Re: Tu consulta en ${origin.name} (${selectedLead.name})`;
      const res = await sendEmailReply(selectedLead.email, subject, replyText);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("¡Correo enviado con éxito desde tu cuenta corporativa! El usuario recibirá tu respuesta de inmediato.");
        // Auto-marcar como en negociación
        if (selectedLead.status === 'NUEVO') {
          handleStatusChange(selectedLead.id, 'EN NEGOCIACIÓN');
        }
      }
    } catch (e: any) {
      setErrorMsg("Ocurrió un error inesperado al enviar el correo.");
    } finally {
      setIsSending(false);
    }
  };

  const selectedOriginInfo = selectedLead ? getLeadOrigin(selectedLead) : null;
  const selectedCategory = selectedLead ? getLeadCategory(selectedLead) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-4 sm:mx-0 space-y-4">
      
      {/* Metrics Header */}
      <div className="bg-[#262626] border border-gray-800 rounded-2xl p-5 shrink-0 flex flex-col md:flex-row items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Centro de Leads & Mensajes de Atención
            <span className="text-xs font-mono font-bold text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-gray-700/50">
              {initialLeads.length} Total
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Has atendido a <strong className="text-white">{responded} mensajes</strong>. Te faltan <strong className="text-rose-400">{pending} mensajes nuevos</strong> por gestionar.
          </p>
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400">Tasa de Resolución</span>
            <span className="text-emerald-400 font-mono font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-[#12141a] rounded-full overflow-hidden border border-gray-800">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER TABS BY ORIGIN (PÁGINA O SUBDOMINIO) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1e2029] border border-gray-800/80 p-3 rounded-2xl shrink-0">
        {/* Origin Badges - Plataformas & Subdominios */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <button
            onClick={() => setSelectedOrigin("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedOrigin === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers size={13} />
            <span>Todos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
              {originCounts.all}
            </span>
          </button>

          {PLATFORMS_CATALOG.map((platform) => {
            const Icon = platform.icon;
            const count = originCounts[platform.key] || 0;
            const isSelected = selectedOrigin === platform.key;

            return (
              <button
                key={platform.key}
                onClick={() => setSelectedOrigin(platform.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected ? platform.activeClass : platform.idleClass
                }`}
                title={`Filtrar mensajes de ${platform.name}`}
              >
                <Icon size={13} />
                <span>{platform.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Quick Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en mensajes..."
              className="w-full bg-[#12141a] border border-gray-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#12141a] border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-gray-300 font-semibold focus:outline-none focus:border-blue-500 shrink-0"
          >
            <option value="all">Todos los estados</option>
            <option value="NUEVO">Nuevos</option>
            <option value="EN NEGOCIACIÓN">En Progreso</option>
            <option value="CERRADO">Cerrados</option>
          </select>
        </div>
      </div>

      {/* Main Gmail-like Interface */}
      <div className="flex-1 bg-[#12141a] sm:rounded-2xl border-y sm:border sm:border-gray-800 overflow-hidden flex relative min-h-0">
        
        {/* Left Side: Inbox List */}
        <div className={`w-full ${selectedLead ? 'hidden md:flex' : 'flex'} md:w-[420px] flex-col border-r border-gray-800 bg-[#1a1c23]`}>
          <div className="p-3.5 border-b border-gray-800 bg-[#222530] flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Bandeja de Entrada
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                {filteredLeads.length} mensajes
              </span>
            </div>
            {selectedOrigin !== "all" && (
              <button
                onClick={() => setSelectedOrigin("all")}
                className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-gray-800/40">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Mail className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-400 font-medium">No se encontraron mensajes en esta categoría.</p>
                <button
                  onClick={() => { setSelectedOrigin("all"); setStatusFilter("all"); setSearchQuery(""); }}
                  className="text-xs text-blue-400 hover:underline pt-2 font-semibold"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const origin = getLeadOrigin(lead);
                const category = getLeadCategory(lead);
                const OriginIcon = origin.icon;

                return (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowReplyBox(false);
                      setReplyText("");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className={`w-full text-left p-4 hover:bg-white/5 transition-colors relative flex flex-col gap-1.5 cursor-pointer ${
                      selectedLead?.id === lead.id ? 'bg-blue-600/10 hover:bg-blue-600/10' : ''
                    }`}
                  >
                    {selectedLead?.id === lead.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
                    )}

                    {/* Top Row: Origin Badge & Date */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${origin.badgeClass}`}>
                        <OriginIcon size={11} />
                        <span>{origin.name}</span>
                      </span>

                      <span className="text-[10px] text-gray-500 whitespace-nowrap font-mono">
                        {new Date(lead.created_at || "").toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {/* Sender Name */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold truncate text-xs sm:text-sm ${lead.status === 'NUEVO' ? 'text-white' : 'text-gray-300'}`}>
                        {lead.name}
                      </span>
                      {lead.status === 'NUEVO' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                      )}
                    </div>

                    {/* Message Preview */}
                    <p className={`text-xs line-clamp-2 leading-relaxed ${lead.status === 'NUEVO' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {lead.message}
                    </p>

                    {/* Bottom Row: Category & Status Badge */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        {category && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-gray-700/60 truncate max-w-[170px]" title={category}>
                            {category}
                          </span>
                        )}
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider ${
                        lead.status === 'NUEVO' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                        lead.status === 'CERRADO' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detail View */}
        <div className={`flex-1 flex-col ${selectedLead ? 'flex' : 'hidden md:flex'} bg-[#0a0b0e] relative min-h-0`}>
          {selectedLead && selectedOriginInfo ? (
            <div className="flex flex-col h-full absolute inset-0">
              
              {/* Detail Header */}
              <div className="px-6 py-4 border-b border-gray-800 bg-[#12141a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => {
                      setSelectedLead(null);
                      setShowReplyBox(false);
                      setReplyText("");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 shrink-0 cursor-pointer"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  
                  <div>
                    {/* Origin & Subdomain Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${selectedOriginInfo.badgeClass}`}>
                        <selectedOriginInfo.icon size={13} />
                        <span>Origen: {selectedOriginInfo.name}</span>
                      </span>

                      <a
                        href={`https://${selectedOriginInfo.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-white px-2 py-0.5 rounded-lg bg-white/5 border border-gray-800 transition"
                      >
                        <span>{selectedOriginInfo.subdomain}</span>
                        <ExternalLink size={11} />
                      </a>

                      {selectedCategory && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-purple-300 border border-purple-500/30">
                          {selectedCategory}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      {selectedLead.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <a href={`mailto:${selectedLead.email}`} className="text-xs sm:text-sm text-blue-400 hover:underline flex items-center gap-1.5">
                        <Mail size={13} /> {selectedLead.email}
                      </a>
                      {selectedLead.phone && (
                        <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-emerald-400 hover:underline flex items-center gap-1.5">
                          <Smartphone size={13} /> {selectedLead.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedLead.status === 'NUEVO' && (
                    <button
                      onClick={() => handleStatusChange(selectedLead.id, 'EN NEGOCIACIÓN')}
                      className="text-xs bg-[#1a1c23] hover:bg-[#262626] border border-gray-700 text-gray-300 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Marcar como En Progreso"
                    >
                      <Clock size={13} /> En Progreso
                    </button>
                  )}
                  {selectedLead.status !== 'CERRADO' && (
                    <button
                      onClick={() => handleStatusChange(selectedLead.id, 'CERRADO')}
                      className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Marcar como Resuelto"
                    >
                      <CheckCircle2 size={13} /> Finalizar
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedLead(null);
                      setShowReplyBox(false);
                      setReplyText("");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Cerrar Detalle"
                  >
                    <X size={13} /> Cerrar
                  </button>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
                <div className="max-w-3xl space-y-6">
                  {/* Sender Banner */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 shrink-0">
                      {selectedLead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-200 text-sm">
                        De: <strong className="text-white">{selectedLead.name}</strong> ({selectedLead.email})
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Recibido el {new Date(selectedLead.created_at || "").toLocaleString('es-PE', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Message Box */}
                  <div className="bg-[#181a22] border border-gray-800 rounded-2xl p-6 shadow-inner space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag size={13} className="text-blue-400" />
                        Mensaje Original
                      </span>
                      <span className="text-[11px] font-mono text-gray-500">
                        {selectedOriginInfo.name}
                      </span>
                    </div>

                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base font-normal">
                      {selectedLead.message}
                    </p>
                  </div>

                  {/* Smart Reply Section */}
                  <div className="border-t border-gray-800 pt-6 space-y-4">
                    {successMsg && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-2 font-medium text-xs sm:text-sm">
                        <CheckCircle2 size={18} className="shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}
                    {errorMsg && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl font-medium text-xs sm:text-sm">
                        Error: {errorMsg}
                      </div>
                    )}

                    {!showReplyBox ? (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowReplyBox(true)}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                        >
                          <Reply size={16} /> Escribir Respuesta Manual
                        </button>
                        <button
                          onClick={() => {
                            setShowReplyBox(true);
                            handleGenerateAiReply();
                          }}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
                        >
                          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          {isGenerating ? "Gemini redactando..." : "Redactar con IA (Gemini)"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#181a22] border border-gray-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                            <Reply size={16} className="text-blue-400" />
                            Responder a {selectedLead.name} ({selectedLead.email})
                          </h4>
                          <span className="text-[11px] font-mono text-gray-500">
                            Remitente: {senderEmail || "hello@atpdev.dev"}
                          </span>
                        </div>

                        <textarea
                          rows={6}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Escribe tu respuesta aquí o haz clic en 'Generar con IA' para una sugerencia rápida..."
                          className="w-full bg-[#101218] border border-gray-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleGenerateAiReply}
                              disabled={isGenerating}
                              className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                            >
                              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                              <span>Regenerar con IA</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowReplyBox(false)}
                              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSendEmail}
                              disabled={isSending || !replyText.trim()}
                              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                              <span>{isSending ? "Enviando..." : "Enviar Correo Oficial"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-gray-800 flex items-center justify-center text-gray-400">
                <Mail size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-300">Selecciona un mensaje</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Haz clic en cualquier mensaje de la bandeja de entrada para ver el detalle del remitente, su origen y responderle.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
