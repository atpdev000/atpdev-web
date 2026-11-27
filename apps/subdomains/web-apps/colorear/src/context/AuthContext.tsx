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
  avatarUrl?: string | null;
  authProviders?: Array<'email' | 'google'>;
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

export interface OAuthProvidersStatus {
  google: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  orders: UserOrder[];
  stripeConfigured: boolean;
  oauthProviders: OAuthProvidersStatus;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setUserCreditsLocal: (credits: number) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  orders: [],
  stripeConfigured: false,
  oauthProviders: { google: false },
  loading: true,
  refresh: async () => {},
  logout: async () => {},
  setUserCreditsLocal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [oauthProviders, setOauthProviders] = useState<OAuthProvidersStatus>({
    google: false,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      setStripeConfigured(Boolean(data?.stripeConfigured));
      if (data?.oauthProviders) {
        setOauthProviders({
          google: Boolean(data.oauthProviders.google),
        });
      }
      if (data?.authenticated && data.user) {
        setUser(data.user);
        setOrders(Array.isArray(data.orders) ? data.orders : []);
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
        oauthProviders,
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
