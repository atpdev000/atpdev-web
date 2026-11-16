import type { Metadata } from 'next'
import AdSenseInjector from '@/components/AdSenseInjector'

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-5414009811868137'

export const metadata: Metadata = {
  other: {
    'google-adsense-account': adsenseId,
  },
}

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseInjector adsenseId={adsenseId} />
      {children}
    </>
  )
}

