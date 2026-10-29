// components/ads/AdDisplay.tsx
'use client'
import Script from 'next/script'

interface AdProps {
  adSlot: string
  width?: number
  height?: number
}

export default function AdDisplay({ adSlot, width = 300, height = 600 }: AdProps) {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5414009811868137"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <Script
        id="adsense-display"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </>
  )
}
