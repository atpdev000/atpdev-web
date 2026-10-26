import { getProjects, getLeads } from "@atpdev/database";
import { BarChart3, TrendingUp, Users, FolderKanban, AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const projects = await getProjects();
  const leads = await getLeads();

  const totalLeads = leads.length;
  const leadsNuevos = leads.filter(l => l.status === "NUEVO").length;
  const leadsNegociacion = leads.filter(l => l.status === "EN NEGOCIACIÓN").length;
  const leadsCerrados = leads.filter(l => l.status === "CERRADO").length;
  const activeProjects = projects.filter(p => p.status === 'Activo').length;
  const conversionRate = totalLeads > 0 ? ((leadsCerrados / totalLeads) * 100).toFixed(1) : "0.0";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Métricas reales de tu ecosistema calculadas desde la base de datos.</p>
      </div>

      {/* Real Stats from DB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Leads", value: totalLeads.toString(), icon: <Users size={18} />, change: leadsNuevos > 0 ? `${leadsNuevos} nuevos` : "—" },
          { label: "Leads Cerrados", value: leadsCerrados.toString(), icon: <TrendingUp size={18} />, change: "Convertidos" },
          { label: "Tasa de Conversión", value: `${conversionRate}%`, icon: <BarChart3 size={18} />, change: "Leads → Cerrados" },
          { label: "Proyectos Activos", value: activeProjects.toString(), icon: <FolderKanban size={18} />, change: `${projects.length} total` },
        ].map((stat, i) => (
          <div key={i} className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-md bg-white/5 text-gray-400">{stat.icon}</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{stat.change}</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* GA4 Pending Banner */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Google Analytics 4 no configurado</h3>
            <p className="text-sm text-gray-400 mb-4">
              Para ver métricas de tráfico reales (visitas, páginas vistas, dispositivos, rebote), necesitas conectar Google Analytics 4.
            </p>
            <div className="flex gap-3">
              <a href="/dashboard/settings" className="text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg hover:bg-amber-500/20 transition-colors">
                Ir a Settings → Configurar GA4 ID
              </a>
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-400 px-4 py-2 rounded-lg hover:text-white transition-colors">
                Abrir Google Analytics →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Embudo de Leads (REAL) */}
        <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6">
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
        <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6">
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
        <div className="lg:col-span-2 bg-\[\#262626\] border border-gray-800 rounded-2xl p-6">
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
                          lead.status === 'NUEVO' ? 'bg-blue-500/10 text-blue-400' :
                          lead.status === 'EN NEGOCIACIÓN' ? 'bg-amber-500/10 text-amber-400' :
                          lead.status === 'CERRADO' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>{lead.status}</span>
                      </td>
                      <td className="p-3 text-sm text-gray-500">{new Date(lead.created_at || '').toLocaleDateString('es-PE')}</td>
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
