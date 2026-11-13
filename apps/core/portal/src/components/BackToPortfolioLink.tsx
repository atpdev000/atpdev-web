"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

/** Enlace de retorno al portafolio con prefetch activo y estado visual de carga al navegar. */
export function BackToPortfolioLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [navigating, setNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  return (
    <Link
      href={href}
      prefetch={true}
      onClick={() => setNavigating(true)}
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95 shadow-sm"
    >
      {navigating ? <Loader2 size={14} className="animate-spin" /> : <ArrowLeft size={14} />}
      <span>{navigating ? "Volviendo..." : label}</span>
    </Link>
  );
}
