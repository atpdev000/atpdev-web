import { NextResponse } from 'next/server';
import { getSubdomainConfig } from '@atpdev/database';
import { ADSENSE_PUB_ID, ADSENSE_CLIENT_ID } from '@/lib/siteConfig';

export async function GET() {
  const config = getSubdomainConfig('chamba');
  const dbClientId = config?.monetization?.adsense_client_id?.trim();
  const validDbId = dbClientId && !dbClientId.includes('0000000000') ? dbClientId : '';
  const rawId = validDbId || ADSENSE_PUB_ID || ADSENSE_CLIENT_ID || 'pub-5414009811868137';
  const cleanPubId = rawId.trim().replace(/^ca-/, '');

  const adsTxtContent = `# Google AdSense ads.txt for chamba pro (empleos.atpdev.dev)
google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0
`;

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
