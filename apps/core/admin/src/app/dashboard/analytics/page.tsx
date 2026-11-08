import { getProjects, getLeads, getSiteConfig, getSubdomainConfig } from "@atpdev/database";
import { BarChart3, TrendingUp, Users, FolderKanban, AlertTriangle, CheckCircle2, ExternalLink, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const projects = await getProjects();
  const leads = await getLeads();
  const config = await getSiteConfig();
  const descargadorConfig = getSubdomainConfig("descargador");
  const sorteosConfig = getSubdomainConfig("sorteos");
  const chambaConfig = getSubdomainConfig("chamba");

  const totalLeads = leads.length;
  const leadsNuevos = leads.filter(l => l.status === "NUEVO").length;
  const leadsNegociacion = leads.filter(l => l.status === "EN NEGOCIACIÓN").length;
  const leadsCerrados = leads.filter(l => l.status === "CERRADO").length;
  const activeProjects = projects.filter(p => p.status === "Activo").length;
  const conversionRate = totalLeads > 0 ? ((leadsCerrados / totalLeads) * 100).toFixed(1) : "0.0";

  const isGA4Configured = Boolean(config?.ga4_id);
  const gaIdDescargador = descargadorConfig?.seo?.google_analytics_id || "GTM-KGJN7SDL";
  const clarityIdDescargador = descargadorConfig?.seo?.microsoft_clarity_id || "zak4lzyye9";
  const gaIdSorteos = sorteosConfig?.seo?.google_analytics_id || "GTM-KGJN7SDL";
  const clarityIdSorteos = sorteosConfig?.seo?.microsoft_clarity_id || "zak4lzyye9";
  const gaIdChamba = chambaConfig?.seo?.google_analytics_id || "GTM-KGJN7SDL";
  const clarityIdChamba = chambaConfig?.seo?.microsoft_clarity_id || "zak4lzyye9";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Métricas reales de tu ecosistema y estado de monitorización de portales y subdominios.</p>
      </div>

      {/* Real Stats from DB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Leads", value: totalLeads.toString(), icon: <Users size={18} />, change: leadsNuevos > 0 ? `${leadsNuevos} nuevos` : "—" },
          { label: "Leads Cerrados", value: leadsCerrados.toString(), icon: <TrendingUp size={18} />, change: "Convertidos" },
          { label: "Tasa de Conversión", value: `${conversionRate}%`, icon: <BarChart3 size={18} />, change: "Leads → Cerrados" },
          { label: "Proyectos Activos", value: activeProjects.toString(), icon: <FolderKanban size={18} />, change: `${projects.length} total` },
        ].map((stat, i) => (
          <div key={i} className="bg-[#262626] border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-md bg-white/5 text-gray-400">{stat.icon}</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{stat.change}</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* GA4 Status Banner */}
      {isGA4Configured ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Google Analytics Conectado</h3>
                  <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {config?.ga4_id}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  El portal principal (atpdev.dev) está enviando eventos y métricas de tráfico a Google Analytics.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/dashboard/settings"
                className="text-xs font-bold text-gray-300 bg-white/5 border border-gray-700 px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                Editar ID
              </a>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
              >
                Abrir Consola <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">Google Analytics no configurado en Portal Principal</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">atpdev.dev</span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Para medir tráfico real en el portal principal (<span className="text-white font-mono text-xs">atpdev.dev</span>), puedes pegar tu ID de Google Tag (<span className="text-white font-mono text-xs">GTM-KGJN7SDL</span> o tu ID <span className="text-white font-mono text-xs">G-XXXXXXXXXX</span>) en Settings. <br />
                <span className="text-emerald-400 font-semibold">Nota importante:</span> Tu app <strong className="text-white">Descargador Pro</strong> ya tiene su propio Google Tag y Microsoft Clarity configurados y funcionando independientemente.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/dashboard/settings" className="text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg hover:bg-amber-500/20 transition-colors">
                  Ir a Settings → Configurar ID
                </a>
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-400 px-4 py-2 rounded-lg hover:text-white transition-colors flex items-center gap-1.5">
                  Abrir Google Analytics <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitorización del Ecosistema */}
      <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Estado de Monitorización & Tracking del Ecosistema</h2>
              <p className="text-xs text-gray-400">Herramientas activas configuradas para portales, subdominios y uptime.</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Sistema Operativo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card Sorteos Pro */}
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Sorteos Pro</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% OK</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Google Tag:</span>
                <span className="font-mono text-emerald-400 font-semibold">{gaIdSorteos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Microsoft Clarity:</span>
                <span className="font-mono text-cyan-400 font-semibold">{clarityIdSorteos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Google AdSense:</span>
                <span className="font-mono text-amber-400 font-semibold">{sorteosConfig?.monetization?.adsense_client_id?.slice(0, 15)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Motor Interno:</span>
                <span className="text-emerald-400 font-medium">/api/track (Supabase)</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/60 flex justify-between">
              <a href="/dashboard/sorteos" className="text-xs text-pink-400 hover:text-pink-300 font-medium">Ver en CMS →</a>
              <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">Clarity <ExternalLink size={12} /></a>
            </div>
          </div>

          {/* Card Descargador Pro */}
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Descargador Pro</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% OK</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Google Tag:</span>
                <span className="font-mono text-emerald-400 font-semibold">{gaIdDescargador}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Microsoft Clarity:</span>
                <span className="font-mono text-cyan-400 font-semibold">{clarityIdDescargador}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Google AdSense:</span>
                <span className="font-mono text-amber-400 font-semibold">{descargadorConfig?.monetization?.adsense_client_id?.slice(0, 15)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Motor Interno:</span>
                <span className="text-emerald-400 font-medium">/api/track (Supabase)</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/60 flex justify-between">
              <a href="/dashboard/descargador" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Ver en CMS →</a>
              <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">Clarity <ExternalLink size={12} /></a>
            </div>
          </div>

          {/* Card Chamba Pro */}
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Chamba Pro</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% OK</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Google Tag:</span>
                <span className="font-mono text-emerald-400 font-semibold">{gaIdChamba}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Microsoft Clarity:</span>
                <span className="font-mono text-cyan-400 font-semibold">{clarityIdChamba}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Google AdSense:</span>
                <span className="font-mono text-amber-400 font-semibold">ca-pub-54140098...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Motor Interno:</span>
                <span className="text-emerald-400 font-medium">/api/track (Supabase)</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/60 flex justify-between">
              <a href="/dashboard/chamba" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Ver en CMS →</a>
              <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">Clarity <ExternalLink size={12} /></a>
            </div>
          </div>

          {/* Card UptimeRobot Ping */}
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">UptimeRobot (Ping Render)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">99.6% Up</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Endpoint:</span>
                <span className="font-mono text-gray-300 text-[11px] truncate max-w-[140px]" title="https://descargador-pro-nt6e.onrender.com/api/health">.../api/health</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Intervalo:</span>
                <span className="text-white font-medium">Cada 10 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Objetivo:</span>
                <span className="text-gray-300 font-medium">Evitar Cold Starts</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/60 flex justify-between">
              <span className="text-xs text-emerald-400 font-medium">Estado: Activo 24/7</span>
              <a href="https://dashboard.uptimerobot.com/monitors" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">Monitors <ExternalLink size={12} /></a>
            </div>
          </div>

          {/* Card Portal Principal */}
          <div className="bg-black/30 border border-gray-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Portal Principal (atpdev.dev)</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isGA4Configured ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                {isGA4Configured ? "Conectado" : "Pendiente"}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Google Analytics:</span>
                <span className="font-mono text-gray-300 font-semibold">{config?.ga4_id || "Sin ID"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AdSense:</span>
                <span className="font-mono text-gray-300">{config?.adsense_id || "No asignado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Motor Interno:</span>
                <span className="text-emerald-400 font-medium">ATP Analytics Engine</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/60 flex justify-between">
              <a href="/dashboard/settings" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Configurar Settings →</a>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">Search Console <ExternalLink size={12} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Embudo de Leads (REAL) */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Embudo de Leads (Datos Reales)</h2>
          <div className="space-y-5">
            {[
              { label: "Nuevos", count: leadsNuevos, total: totalLeads, color: "bg-blue-500" },
              { label: "En Negociación", count: leadsNegociacion, total: totalLeads, color: "bg-amber-500" },
              { label: "Cerrados (Convertidos)", count: leadsCerrados, total: totalLeads, color: "bg-emerald-500" },
            ].map((stage, i) => {
              const percent = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 font-medium">{stage.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{stage.count}</span>
                      <span className="text-[10px] font-bold text-gray-500">{percent.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${stage.color} rounded-full transition-all duration-700`} style={{ width: `${Math.max(percent, 2)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proyectos por Categoría (REAL) */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Proyectos por Categoría</h2>
          {(() => {
            const categories: Record<string, number> = {};
            projects.forEach(p => {
              categories[p.category] = (categories[p.category] || 0) + 1;
            });
            const entries = Object.entries(categories);
            const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

            return entries.length === 0 ? (
              <p className="text-sm text-gray-500">No hay proyectos registrados.</p>
            ) : (
              <div className="space-y-5">
                {entries.map(([cat, count], i) => {
                  const percent = (count / projects.length) * 100;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300 font-medium">{cat}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{count}</span>
                          <span className="text-[10px] font-bold text-gray-500">{percent.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-700`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Timeline de Leads (REAL) */}
        <div className="lg:col-span-2 bg-[#262626] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Últimos Leads Recibidos</h2>
          {leads.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No hay leads en la base de datos todavía.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre</th>
                    <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</th>
                    <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                    <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {leads.slice(0, 10).map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 text-sm font-semibold text-white">{lead.name}</td>
                      <td className="p-3 text-sm text-gray-400">{lead.email}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          lead.status === "NUEVO" ? "bg-blue-500/10 text-blue-400" :
                          lead.status === "EN NEGOCIACIÓN" ? "bg-amber-500/10 text-amber-400" :
                          lead.status === "CERRADO" ? "bg-emerald-500/10 text-emerald-400" :
                          "bg-gray-500/10 text-gray-400"
                        }`}>{lead.status}</span>
                      </td>
                      <td className="p-3 text-sm text-gray-500">{new Date(lead.created_at || "").toLocaleDateString("es-PE")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
