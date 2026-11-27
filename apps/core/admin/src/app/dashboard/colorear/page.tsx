import { getSubdomainConfig } from '@atpdev/database';
import { fetchColorearBillingDataAction } from './actions';
import ColorearAdminClient from './ColorearAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Colorear Pro CMS & Billing | ATP DEV Admin',
  description: 'Administración de órdenes Yape/Plin, créditos IA, pasarelas de pago, licencias y SEO de Colorear Pro.',
};

export default async function ColorearAdminPage() {
  const [config, billing] = await Promise.all([
    Promise.resolve(getSubdomainConfig('colorear')),
    fetchColorearBillingDataAction(),
  ]);

  return (
    <ColorearAdminClient
      initialConfig={config}
      initialBilling={billing}
    />
  );
}

