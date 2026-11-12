"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
    
    // Consent Mode v2 update - Granted
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
    
    // Consent Mode v2 update - Denied
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 md:px-8 md:pb-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-5 shadow-2xl shadow-black/50 pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-1">🍪 Usamos cookies</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Utilizamos cookies propias y de terceros (incluyendo Google AdSense) para mejorar la experiencia y mostrar anuncios personalizados.{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                Política de Privacidad
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="text-gray-400 hover:text-white text-xs font-medium px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={accept}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all shadow-md shadow-blue-900/40"
            >
              Aceptar todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
