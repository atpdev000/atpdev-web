import type { Metadata } from 'next';
import { AdSenseInjector } from '@/components/AdSenseInjector';

export const metadata: Metadata = {
  other: {
    'google-adsense-account': 'ca-pub-5414009811868137',
  },
};

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseInjector />
      {children}
    </>
  );
}

