// hooks/useProPlan.ts
'use client'

import { useState, useEffect } from 'react'

export type PlanType = 'free' | 'pro' | 'business'

export interface PlanDetails {
  plan: PlanType
  licenseCode?: string
  activatedAt?: string
  expiresAt?: string
  billingCycle?: 'monthly' | 'annual'
}

export function useProPlan() {
  const [plan, setPlan] = useState<PlanType>('free')
  const [planDetails, setPlanDetails] = useState<PlanDetails>({ plan: 'free' })
  const [isLoaded, setIsLoaded] = useState(false)

  const loadFromStorage = () => {
    try {
      const storedPlan = localStorage.getItem('atp_descargador_plan') as PlanType
      const storedDetails = localStorage.getItem('atp_descargador_plan_details')
      
      let parsedDetails: PlanDetails = { plan: 'free' }
      if (storedDetails) {
        try {
          parsedDetails = JSON.parse(storedDetails)
        } catch {}
      }

      if (storedPlan === 'pro' || storedPlan === 'business') {
        setPlan(storedPlan)
        setPlanDetails(parsedDetails.plan ? parsedDetails : { plan: storedPlan })
      } else {
        setPlan('free')
        setPlanDetails({ plan: 'free' })
      }
    } catch {
      setPlan('free')
      setPlanDetails({ plan: 'free' })
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    loadFromStorage()

    // Comprobar parámetros de éxito de pago en la URL (ej: ?success=pro o ?success=business)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const successParam = params.get('success')
      const planParam = params.get('plan') as PlanType

      if (successParam === 'true' || successParam === 'pro' || successParam === 'business') {
        const targetPlan = (planParam === 'business' || successParam === 'business') ? 'business' : 'pro'
        activatePlan(targetPlan, 'ONLINE-CHECKOUT')
        // Limpiar URL sin recargar
        const url = new URL(window.location.href)
        url.searchParams.delete('success')
        url.searchParams.delete('plan')
        url.searchParams.delete('session_id')
        window.history.replaceState({}, '', url.toString())
      }
    }

    const handleStorageChange = () => {
      loadFromStorage()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('plan-changed', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('plan-changed', handleStorageChange)
    }
  }, [])

  const activatePlan = (newPlan: PlanType, code?: string, cycle: 'monthly' | 'annual' = 'annual') => {
    try {
      const now = new Date()
      const expiry = new Date()
      if (cycle === 'annual') {
        expiry.setFullYear(expiry.getFullYear() + 1)
      } else {
        expiry.setMonth(expiry.getMonth() + 1)
      }

      const details: PlanDetails = {
        plan: newPlan,
        licenseCode: code || (newPlan === 'free' ? undefined : 'ATP-PRO-ACTIVE'),
        activatedAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        billingCycle: cycle
      }

      localStorage.setItem('atp_descargador_plan', newPlan)
      localStorage.setItem('atp_descargador_plan_details', JSON.stringify(details))
      setPlan(newPlan)
      setPlanDetails(details)
      window.dispatchEvent(new Event('plan-changed'))
    } catch (e) {
      console.error('Error guardando plan:', e)
    }
  }

  const cancelPlan = () => {
    try {
      localStorage.setItem('atp_descargador_plan', 'free')
      localStorage.removeItem('atp_descargador_plan_details')
      setPlan('free')
      setPlanDetails({ plan: 'free' })
      window.dispatchEvent(new Event('plan-changed'))
    } catch (e) {
      console.error('Error cancelando plan:', e)
    }
  }

  const isPro = plan === 'pro' || plan === 'business'

  return {
    plan,
    planDetails,
    isPro,
    isLoaded,
    activatePlan,
    cancelPlan
  }
}
