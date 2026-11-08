// components/Layout/SidebarAds.tsx
'use client'

import AdDisplay from '@/components/Ads/AdDisplay'
import AdMultiplex from '@/components/Ads/AdMultiplex'
import { useProPlan } from '@/hooks/useProPlan'

interface SidebarAdsProps {
  position?: 'left' | 'right'
}

export default function SidebarAds({ position = 'right' }: SidebarAdsProps) {
  const { isPro } = useProPlan()
  if (isPro) return null

  return (
    <div className={`space-y-6 sticky top-24 ${position === 'left' ? 'ml-0' : 'mr-0'}`}>
      <AdDisplay adSlot="4095225502" width={300} height={600} />
      <AdMultiplex adSlot="9155980495" width={300} height={250} />
    </div>
  )
}
