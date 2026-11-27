'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ColorearPlanId } from '@/lib/plans';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: ColorearPlanId;
  credits: number;
  totalGenerated: number;
  createdAt: string;
}

export interface UserOrder {
  id: string;
  orderCode: string;
  planId: ColorearPlanId;
  billingCycle: 'one_time' | 'monthly' | 'annual';
  credits: number;
  amountUsd: number;
  amountPen: number;
  method: 'stripe' | 'yape' | 'plin';
  status: 'pending' | 'paid' | 'rejected';
  operationCode?: string;
  createdAt: string;
  paidAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  orders: UserOrder[];
  stripeConfigured: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setUserCreditsLocal: (credits: number) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  orders: [],
  stripeConfigured: false,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
  setUserCreditsLocal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (data?.authenticated && data.user) {
        setUser(data.user);
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setStripeConfigured(Boolean(data.stripeConfigured));
      } else {
        setUser(null);
        setOrders([]);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    setOrders([]);
  }, []);

  const setUserCreditsLocal = useCallback((credits: number) => {
    setUser((prev) => (prev ? { ...prev, credits } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        stripeConfigured,
        loading,
        refresh,
        logout,
        setUserCreditsLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

