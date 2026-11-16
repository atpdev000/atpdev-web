import type { Metadata } from 'next';
import { GoogleAdSense } from '@/components/GoogleAdSense';
import { ADSENSE_CLIENT_ID } from '@/lib/siteConfig';

export const metadata: Metadata = {
  other: {
    'google-adsense-account': ADSENSE_CLIENT_ID,
  },
};

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAdSense clientId={ADSENSE_CLIENT_ID} />
      {children}
    </>
  );
}

