import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

const adminSupabase = (supabaseUrl && adminKey) ? createClient(supabaseUrl, adminKey) : null as any;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null as any;


export type PageView = {
  id: string;
  domain: string;
  path: string;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
};

// =====================================================
// Escritura (Se llama desde el frontend tracker / API)
// =====================================================
export async function trackPageView(data: {
  domain: string;
  path: string;
  user_agent?: string;
  session_id?: string;
}): Promise<boolean> {
  const { error } = await supabase.from('page_views').insert([
    {
      domain: data.domain,
      path: data.path,
      user_agent: data.user_agent || null,
      session_id: data.session_id || null,
    },
  ]);

  if (error) {
    console.error('Error tracking page view:', error);
    return false;
  }
  return true;
}

// =====================================================
// Lectura (Para el Dashboard del Admin)
// =====================================================

export type AnalyticsSummary = {
  totalVisits: number;
  visitsByDomain: { domain: string; count: number }[];
  visitsByPath: { domain: string; path: string; count: number }[];
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  // En Supabase, para hacer agregaciones complejas sin RPC, a veces es más fácil traer la data de los últimos 30 días
  // o hacer conteos. Dado que page_views crecerá mucho, lo ideal sería RPC. Pero por ahora, traeremos todo o las agruparemos
  // de forma simple. Para MVP profesional, traemos todas las vistas de los últimos 30 días.
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await adminSupabase
    .from('page_views')
    .select('domain, path')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching analytics summary:', error);
    return null;
  }

  const visits = data || [];
  const totalVisits = visits.length;

  const domainMap: Record<string, number> = {};
  const pathMap: Record<string, number> = {};

  visits.forEach((v: { domain: string; path: string }) => {
    domainMap[v.domain] = (domainMap[v.domain] || 0) + 1;
    const fullPath = `${v.domain}${v.path}`;
    pathMap[fullPath] = (pathMap[fullPath] || 0) + 1;
  });

  const visitsByDomain = Object.entries(domainMap)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);

  const visitsByPath = Object.entries(pathMap)
    .map(([fullPath, count]) => {
      // Split back to domain and path
      const url = new URL(`http://${fullPath}`);
      return {
        domain: url.hostname,
        path: url.pathname,
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 paths

  return {
    totalVisits,
    visitsByDomain,
    visitsByPath,
  };
}

export type TrafficChartData = {
  date: string;
  directo: number; // Por ahora todo como visitas totales
  organico: number; // Simulado en 0
};

export async function getTrafficChartData(): Promise<TrafficChartData[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 30 dias incluyéndo hoy

  const { data, error } = await adminSupabase
    .from('page_views')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }

  // Inicializar arreglo de 30 dias
  const chartData: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    chartData[dateStr] = 0;
  }

  // Agrupar
  data?.forEach((v: { created_at: string }) => {
    const dateStr = v.created_at.split('T')[0];
    if (chartData[dateStr] !== undefined) {
      chartData[dateStr] += 1;
    }
  });

  return Object.entries(chartData).map(([date, count]) => ({
    date,
    directo: count,
    organico: 0
  }));
}

export type RecentVisit = {
  id: string;
  domain: string;
  path: string;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
  device: string;
  browser: string;
};

export async function getRecentVisits(limit = 25): Promise<RecentVisit[]> {
  if (!adminSupabase) return [];

  const { data, error } = await adminSupabase
    .from('page_views')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent visits:', error);
    return [];
  }

  return (data || []).map((v: PageView) => {
    const ua = v.user_agent || '';
    let device = 'Desktop';
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
      device = 'Móvil';
    } else if (/tablet|ipad/i.test(ua)) {
      device = 'Tablet';
    }

    let browser = 'Navegador';
    if (/edg/i.test(ua)) {
      browser = 'Edge';
    } else if (/bot|crawler|spider|headless/i.test(ua)) {
      browser = 'Bot / Crawler';
    } else if (/chrome|crios/i.test(ua) && !/edge|edg|opr/i.test(ua)) {
      browser = 'Chrome';
    } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
      browser = 'Safari';
    } else if (/firefox|fxios/i.test(ua)) {
      browser = 'Firefox';
    }

    return {
      ...v,
      device,
      browser,
    };
  });
}

