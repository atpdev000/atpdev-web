import { Users, FolderKanban, Eye, Wallet, Globe, Clock, Laptop, Smartphone, ExternalLink, Activity, Compass, Mail, Database, ArrowUpRight, ShieldCheck, Server } from "lucide-react";
import { getProjects, getLeads, getAnalyticsSummary, getTrafficChartData, getRecentVisits, RecentVisit } from "@atpdev/database";
import { TrafficChart } from "@/components/TrafficChart";
import { DashboardActions } from "@/components/DashboardActions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function formatVisitTime(isoString: string) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { relative: '—', formattedDate: '—' };
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - d.getTime()) / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relative = '';
    if (diffSecs < 60) relative = 'Justo ahora';
    else if (diffMins < 60) relative = `Hace ${diffMins} min`;
    else if (diffHours < 24) relative = `Hace ${diffHours} h`;
    else if (diffDays === 1) relative = 'Ayer';
    else relative = `Hace ${diffDays} d`;

    const formattedDate = d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return { relative, formattedDate };
  } catch {
    return { relative: '—', formattedDate: isoString };
  }
}

function getDomainBadge(domain: string) {
  const d = (domain || '').toLowerCase();
  if (d.includes('descargador')) {
    return { name: 'Descargador Pro', sub: domain, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  }
  if (d.includes('paltoscan')) {
    return { name: 'PaltoScan', sub: domain, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  }
  if (d.includes('chamba')) {
    return { name: 'Chamba Pro', sub: domain, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
  }
  if (d.includes('sorteos')) {
    return { name: 'Sorteos Pro', sub: domain, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
  }
  if (d.includes('atpdev.dev') || d.includes('atpdev-cms-portal')) {
    return { name: 'Portal Principal', sub: 'atpdev.dev', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
  }
  return { name: 'Web', sub: domain, color: 'bg-gray-500/10 text-gray-300 border-gray-700/50' };
}

export default async function DashboardPage() {
  const projects = await getProjects();
  const leads = await getLeads();

  // Datos REALES calculados desde la base de datos
  const totalLeads = leads.length;
  const leadsNuevos = leads.filter(l => l.status === "NUEVO").length;
  const activeProjects = projects.filter(p => p.status === 'Activo').length;
  const totalProjects = projects.length;

  const analytics = await getAnalyticsSummary();
  const chartData = await getTrafficChartData();
  const recentVisits: RecentVisit[] = await getRecentVisits(20);
  const totalVisits = analytics?.totalVisits || 0;

  const metrics = [
    { label: "Total Leads", value: totalLeads.toString(), increase: leadsNuevos > 0 ? `${leadsNuevos} nuevos` : "—", icon: <Users size={18} /> },
    { label: "Proyectos activos", value: activeProjects.toString(), increase: `${totalProjects} total`, icon: <FolderKanban size={18} /> },
    { label: "Visitas totales (30d)", value: totalVisits.toString(), increase: "Datos reales", icon: <Eye size={18} /> },
    { label: "Ingresos AdSense", value: "$0.00", increase: "Sin AdSense", icon: <Wallet size={18} /> },
  ];

  return (
    <div>
      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Monitoreo en tiempo real de tu portafolio, subdominios y generación de leads.</p>
        </div>
        
        <DashboardActions totalVisits={totalVisits} totalLeads={totalLeads} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[#262626] border border-gray-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-md bg-white/5 text-gray-400">
                {metric.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                metric.increase.includes("Sin") || metric.increase === "—"
                  ? "bg-gray-500/10 text-gray-500"
                  : "bg-green-500/10 text-green-400"
              }`}>
                {metric.increase}
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 mb-1">{metric.label}</p>
              <h3 className={`text-3xl font-black tracking-tight ${
                metric.value === "Pendiente" || metric.value === "$0.00" ? "text-gray-600" : "text-white"
              }`}>{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud & Email Quick Access Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Zoho Mail Card */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/40 transition">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Mail size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Correo Corporativo</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Zoho Mail</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">contacto@atpdev.dev · hello@atpdev.dev</p>
              </div>
            </div>
            <Link
              href="/dashboard/cloud-hub"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
            >
              <span>Configuración</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80">
            <a
              href="https://mail.zoho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Abrir Webmail Zoho</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              href="https://mailadmin.zoho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold transition border border-gray-700/60"
            >
              Admin Zoho
            </a>
          </div>
        </div>

        {/* Supabase Database Card */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Base de Datos Cloud</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Supabase</span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Ref: yeeupdgjfrkkaurytyrs</p>
              </div>
            </div>
            <Link
              href="/dashboard/cloud-hub"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
            >
              <span>Monitoreo</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80">
            <a
              href="https://supabase.com/dashboard/project/yeeupdgjfrkkaurytyrs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Abrir Supabase Studio</span>
              <ArrowUpRight size={13} />
            </a>
            <a
              href="https://supabase.com/dashboard/project/yeeupdgjfrkkaurytyrs/editor"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold transition border border-gray-700/60"
            >
              Table Editor
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row: Chart & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Chart Area (2/3 width) */}
        <div className="lg:col-span-2 bg-[#262626] border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Tráfico de los últimos 30 días</h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Directo
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-600"></span> Orgánico
              </div>
            </div>
          </div>
          
          <TrafficChart data={chartData} />
          
          <p className="text-[10px] text-gray-600 text-center mt-4">
            * Datos generados por ATP Analytics Engine en tiempo real.
          </p>
        </div>

        {/* Leads Sidebar (1/3 width) */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Leads recientes</h2>
            <Link href="/dashboard/leads" className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-2 mb-4 pb-2 border-b border-gray-800/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lead</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Estado</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {leads.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500 mb-2">No hay leads aún.</p>
                <p className="text-xs text-gray-600">Los mensajes del formulario público aparecerán aquí.</p>
              </div>
            ) : (
              leads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex justify-between items-center group">
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{lead.name}</h4>
                    <p className="text-xs text-gray-500">{lead.company || lead.email}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      lead.status === 'NUEVO' ? 'bg-gray-500/20 text-gray-300' :
                      lead.status === 'EN NEGOCIACIÓN' ? 'bg-amber-500/20 text-amber-500' :
                      lead.status === 'CERRADO' ? 'bg-green-500/20 text-green-500' :
                      'bg-rose-500/20 text-rose-500'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(lead.created_at || '').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Breakdown de Analíticas (Subdominios y Rutas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Visitas por Dominio */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Visitas por Origen (Dominio)</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {analytics?.visitsByDomain.length || 0} dominios
            </span>
          </div>
          <div className="grid grid-cols-2 mb-4 pb-2 border-b border-gray-800/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dominio / Plataforma</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Vistas</span>
          </div>
          <div className="space-y-3">
            {analytics?.visitsByDomain.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Sin datos aún.</p>
            ) : (
              analytics?.visitsByDomain.map((item, idx) => {
                const badge = getDomainBadge(item.domain);
                return (
                  <div key={idx} className="flex justify-between items-center group p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                        {badge.name}
                      </span>
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]" title={item.domain}>
                        {item.domain}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      {item.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Visitas por Ruta */}
        <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Top Páginas más visitadas</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Ranking
            </span>
          </div>
          <div className="grid grid-cols-2 mb-4 pb-2 border-b border-gray-800/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ruta / Página</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Vistas</span>
          </div>
          <div className="space-y-3">
            {analytics?.visitsByPath.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Sin datos aún.</p>
            ) : (
              analytics?.visitsByPath.slice(0, 7).map((item, idx) => {
                const badge = getDomainBadge(item.domain);
                return (
                  <div key={idx} className="flex justify-between items-center group p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2.5 truncate max-w-[260px]">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.color} shrink-0`}>
                        {badge.name}
                      </span>
                      <span className="font-mono text-sm text-gray-200 truncate" title={`${item.domain}${item.path}`}>
                        {item.path}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 shrink-0">
                      {item.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* REGISTRO DE VISITAS EN TIEMPO REAL (PÁGINAS, FECHAS & SUBDOMINIOS) */}
      <div className="bg-[#262626] border border-gray-800 rounded-2xl p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Registro de Visitas en Vivo (Páginas, Fechas & Subdominios)</h2>
              <p className="text-xs text-gray-400">Historial detallado en tiempo real con fecha exacta, página visitada, dispositivo y plataforma.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">Live Sync</span>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-gray-800">
              {recentVisits.length} recientes
            </span>
          </div>
        </div>

        {recentVisits.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-gray-800 rounded-xl">
            <Compass size={32} className="mx-auto text-gray-600 mb-2" />
            <p className="text-sm font-semibold text-gray-400">No se han registrado visitas todavía.</p>
            <p className="text-xs text-gray-500 mt-1">A medida que los usuarios naveguen por tus sitios, aparecerán aquí en vivo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="p-3">Plataforma / Subdominio</th>
                  <th className="p-3">Página Visitada</th>
                  <th className="p-3">Dispositivo / Navegador</th>
                  <th className="p-3 text-right">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {recentVisits.map((visit) => {
                  const badge = getDomainBadge(visit.domain);
                  const time = formatVisitTime(visit.created_at);
                  const isMobile = visit.device === 'Móvil';

                  return (
                    <tr key={visit.id} className="hover:bg-white/[0.03] transition-colors group">
                      {/* Dominio / Subdominio */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono hidden md:inline truncate max-w-[180px]" title={visit.domain}>
                            {visit.domain}
                          </span>
                        </div>
                      </td>

                      {/* Ruta / Página */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {visit.path || '/'}
                          </span>
                        </div>
                      </td>

                      {/* Dispositivo y Navegador */}
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          {isMobile ? (
                            <Smartphone size={14} className="text-cyan-400 shrink-0" />
                          ) : (
                            <Laptop size={14} className="text-blue-400 shrink-0" />
                          )}
                          <span>{visit.device}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400">{visit.browser}</span>
                        </div>
                      </td>

                      {/* Fecha y Hora Exacta */}
                      <td className="p-3 text-right">
                        <div>
                          <span className="text-xs font-semibold text-gray-200 block">
                            {time.relative}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono block">
                            {time.formattedDate}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
