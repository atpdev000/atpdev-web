import { getSubdomainConfig } from '@atpdev/database';
import DniAdminClient from './DniAdminClient';

export const dynamic = 'force-dynamic';

export default async function DniAdminPage() {
  const config = getSubdomainConfig('dni');

  return (
    <DniAdminClient initialConfig={config} />
  );
}
