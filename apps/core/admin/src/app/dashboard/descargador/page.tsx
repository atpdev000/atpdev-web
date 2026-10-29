import { getSubdomainConfig } from '@atpdev/database';
import DescargadorAdminClient from './DescargadorAdminClient';

export const dynamic = 'force-dynamic';

export default async function DescargadorAdminPage() {
  const config = getSubdomainConfig('descargador');

  return (
    <DescargadorAdminClient initialConfig={config} />
  );
}
