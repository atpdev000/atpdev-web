// hooks/useProPlan.ts
'use client'

import { useState, useEffect } from 'react'

export type PlanType = 'free' | 'pro' | 'business'

export function useProPlan() {
  const [plan, setPlan] = useState<PlanType>('free')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem('atp_descargador_plan') as PlanType
      if (storedPlan === 'pro' || storedPlan === 'business') {
        setPlan(storedPlan)
      } else {
        setPlan('free')
      }
    } catch {
      setPlan('free')
    } finally {
      setIsLoaded(true)
    }

    const handleStorageChange = () => {
      try {
        const updated = localStorage.getItem('atp_descargador_plan') as PlanType
        setPlan(updated === 'pro' || updated === 'business' ? updated : 'free')
      } catch {}
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('plan-changed', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('plan-changed', handleStorageChange)
    }
  }, [])

  const activatePlan = (newPlan: PlanType) => {
    try {
      localStorage.setItem('atp_descargador_plan', newPlan)
      setPlan(newPlan)
      window.dispatchEvent(new Event('plan-changed'))
    } catch (e) {
      console.error('Error guardando plan:', e)
    }
  }

  const cancelPlan = () => {
    try {
      localStorage.setItem('atp_descargador_plan', 'free')
      setPlan('free')
      window.dispatchEvent(new Event('plan-changed'))
    } catch (e) {
      console.error('Error cancelando plan:', e)
    }
  }

  const isPro = plan === 'pro' || plan === 'business'

  return {
    plan,
    isPro,
    isLoaded,
    activatePlan,
    cancelPlan
  }
}
