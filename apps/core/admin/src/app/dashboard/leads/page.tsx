import { getLeads } from "@atpdev/database";
import LeadsClient from "./LeadsClient";

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">CRM: Bandeja de Entrada</h1>
        <p className="text-gray-400 text-sm">Gestiona y responde a los mensajes recibidos desde tu portafolio.</p>
      </div>

      <LeadsClient initialLeads={leads} />
    </div>
  );
}
