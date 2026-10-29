// app/components/Layout/BannerAds.tsx
'use client'

import AdDisplay from '@/components/Ads/AdDisplay'
import AdMultiplex from '@/components/Ads/AdMultiplex'
import AdInArticle from '@/components/Ads/AdInArticle'

export default function BannerAds() {
  return (
    <div className="w-full flex justify-center my-8">
      {/* Solo mostramos una unidad de anuncio por banner para mejorar el ratio contenido/publicidad */}
      <div className="w-full max-w-4xl border-y border-gray-100 py-4">
        <AdDisplay adSlot="4095225502" width={728} height={90} />
      </div>
    </div>
  )
}
