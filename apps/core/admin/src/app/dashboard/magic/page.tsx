import { getSubdomainConfig } from '@atpdev/database';
import MagicAdminClient from './MagicAdminClient';

export const dynamic = 'force-dynamic';

export default async function MagicAdminPage() {
  const config = getSubdomainConfig('magic');

  return (
    <MagicAdminClient initialConfig={config} />
  );
}
