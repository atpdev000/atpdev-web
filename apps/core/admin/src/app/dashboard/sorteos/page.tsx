import { 
  getSorteosGiveaways, 
  getSorteosUsers, 
  getSorteosFeatureFlags, 
  getSorteosMetrics, 
  getSubdomainConfig 
} from '@atpdev/database';
import { fetchSorteosOrdersAction } from './actions';
import SorteosAdminClient from './SorteosAdminClient';

export const dynamic = 'force-dynamic';

export default async function SorteosAdminPage() {
  const [giveaways, users, featureFlags, metrics, config, orders] = await Promise.all([
    getSorteosGiveaways(),
    getSorteosUsers(),
    getSorteosFeatureFlags(),
    getSorteosMetrics(),
    getSubdomainConfig('sorteos'),
    fetchSorteosOrdersAction(),
  ]);

  return (
    <SorteosAdminClient 
      initialGiveaways={giveaways}
      initialUsers={users}
      initialFeatureFlags={featureFlags}
      initialMetrics={metrics}
      initialConfig={config}
      initialOrders={orders}
    />
  );
}
