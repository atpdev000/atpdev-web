import type { Metadata } from 'next';
import { ChambaAdSense } from '@/components/ChambaAdSense';
import { getChambaAdsenseSettings } from '@/lib/adsenseConfig';

export async function generateMetadata(): Promise<Metadata> {
  const { enabled, clientId } = getChambaAdsenseSettings();
  if (!enabled || !clientId) return {};
  return {
    other: {
      'google-adsense-account': clientId,
    },
  };
}

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  const { enabled, clientId } = getChambaAdsenseSettings();
  return (
    <>
      {enabled && clientId ? <ChambaAdSense clientId={clientId} /> : null}
      {children}
    </>
  );
}

