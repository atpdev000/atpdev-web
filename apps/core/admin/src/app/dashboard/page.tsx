import { Users, FolderKanban, Eye, Wallet } from "lucide-react";
import { getProjects, getLeads, getAnalyticsSummary, getTrafficChartData } from "@atpdev/database";
import { TrafficChart } from "@/components/TrafficChart";
import { DashboardActions } from "@/components/DashboardActions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

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
          <p className="text-gray-400 text-sm">Monitoreo en tiempo real de tu portafolio y generación de leads.</p>
        </div>
        
        <DashboardActions totalVisits={totalVisits} totalLeads={totalLeads} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
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

      {/* Bottom Row: Chart & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area (2/3 width) */}
        <div className="lg:col-span-2 bg-\[\#262626\] border border-gray-800 rounded-2xl p-6">
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
            * Datos generados por ATP Analytics Engine.
          </p>
        </div>

        {/* Leads Sidebar (1/3 width) */}
        <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6 flex flex-col h-full">
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
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* Visitas por Dominio */}
        <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Visitas por Origen (Dominio)</h2>
          <div className="grid grid-cols-2 mb-4 pb-2 border-b border-gray-800/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dominio</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Vistas</span>
          </div>
          <div className="space-y-4">
            {analytics?.visitsByDomain.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Sin datos aún.</p>
            ) : (
              analytics?.visitsByDomain.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="font-semibold text-white text-sm">{item.domain}</span>
                  <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visitas por Ruta */}
        <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Top Páginas más visitadas</h2>
          <div className="grid grid-cols-2 mb-4 pb-2 border-b border-gray-800/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ruta</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Vistas</span>
          </div>
          <div className="space-y-4">
            {analytics?.visitsByPath.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Sin datos aún.</p>
            ) : (
              analytics?.visitsByPath.slice(0, 7).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="font-semibold text-gray-300 text-sm truncate max-w-[200px]" title={item.path}>
                    <span className="text-gray-500 text-xs mr-1">{item.domain}</span>
                    {item.path}
                  </span>
                  <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
