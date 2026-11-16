import { getSubdomainConfig } from '@atpdev/database';

export function getChambaAdsenseSettings() {
  const config = getSubdomainConfig('chamba');
  const enabled =
    config.modules?.adsense_enabled !== false &&
    config.monetization?.adsense_enabled !== false;
  const rawDbAdsense = config.monetization?.adsense_client_id?.trim() || '';
  const validDbAdsense =
    rawDbAdsense && !rawDbAdsense.includes('0000000000')
      ? rawDbAdsense.startsWith('ca-')
        ? rawDbAdsense
        : `ca-${rawDbAdsense}`
      : '';
  const clientId =
    validDbAdsense ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
    'ca-pub-5414009811868137';

  return { enabled, clientId };
}

