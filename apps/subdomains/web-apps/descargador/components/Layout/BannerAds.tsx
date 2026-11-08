// components/Layout/BannerAds.tsx
'use client'

import AdDisplay from '@/components/Ads/AdDisplay'
import { useProPlan } from '@/hooks/useProPlan'

export default function BannerAds() {
  const { isPro } = useProPlan()
  if (isPro) return null

  return (
    <div className="w-full flex justify-center my-8">
      <div className="w-full max-w-4xl border-y border-gray-100 dark:border-slate-800 py-4">
        <AdDisplay adSlot="4095225502" width={728} height={90} />
      </div>
    </div>
  )
}
