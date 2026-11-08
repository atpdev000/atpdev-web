// components/Layout/VideoRewardsAds.tsx
'use client'

import AdDisplay from '@/components/Ads/AdDisplay'
import AdMultiplex from '@/components/Ads/AdMultiplex'
import AdInArticle from '@/components/Ads/AdInArticle'
import { useProPlan } from '@/hooks/useProPlan'

interface VideoRewardsAdsProps {
  position: 'left' | 'right'
}

export default function VideoRewardsAds({ position }: VideoRewardsAdsProps) {
  const { isPro } = useProPlan()
  if (isPro) return null

  return (
    <div className={`space-y-6 sticky top-24 ${position === 'left' ? 'ml-0' : 'mr-0'}`}>
      <div className="w-full flex justify-center">
        <AdDisplay adSlot="4095225502" width={300} height={600} />
      </div>
      <div className="w-full flex justify-center">
        <AdMultiplex adSlot="9155980495" width={300} height={250} />
      </div>
      <div className="w-full max-w-sm">
        <AdInArticle adSlot="5051701068" />
      </div>
    </div>
  )
}
