"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function updateGtagConsent(state: "granted" | "denied") {
  if (typeof window !== "undefined") {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("consent", "update", {
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: state,
        analytics_storage: state,
      });
    }
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    } else if (consent === "accepted") {
      updateGtagConsent("granted");
    }
    let gdprApplies = false;
    const w = window as any;
    const bindTcf = () => {
      if (typeof w.__tcfapi === "function") {
        w.__tcfapi("addEventListener", 2, (tcData: any, success: boolean) => {
          if (success && tcData?.gdprApplies) {
            gdprApplies = true;
            setVisible(false);
          }
        });
      }
    };
    bindTcf();
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push({ CONSENT_DATA_READY: bindTcf });
    const onDocClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest?.('a[href="#cookies-config"]');
      if (el) {
        ev.preventDefault();
        if (gdprApplies && typeof w.googlefc?.showRevocationMessage === "function") {
          w.googlefc.showRevocationMessage();
        } else {
          setVisible(true);
        }
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
    updateGtagConsent("granted");
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
    updateGtagConsent("denied");
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
              <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
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
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all shadow-md"
            >
              Aceptar todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
