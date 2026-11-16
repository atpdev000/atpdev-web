import type { Metadata } from 'next';
import GoogleAdSense from '@/components/GoogleAdSense';

export const metadata: Metadata = {
  other: {
    'google-adsense-account': 'ca-pub-5414009811868137',
  },
};

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAdSense clientId="ca-pub-5414009811868137" />
      {children}
    </>
  );
}

