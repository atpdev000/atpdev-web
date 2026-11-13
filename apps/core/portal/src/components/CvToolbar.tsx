"use client";

import Link from "next/link";
import { ArrowLeft, Printer, Globe } from "lucide-react";

export default function CvToolbar({
  backHref,
  backLabel,
  printLabel,
  otherLangHref,
  otherLangLabel,
}: {
  backHref: string;
  backLabel: string;
  printLabel: string;
  otherLangHref: string;
  otherLangLabel: string;
}) {
  return (
    <div
      className="print:hidden sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ backgroundColor: "var(--glass-bg)", borderColor: "var(--glass-border)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-color)" }}
        >
          <ArrowLeft size={16} />
          <span>{backLabel}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={otherLangHref}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--glass-border)", color: "var(--text-color)", backgroundColor: "var(--pill-bg)" }}
          >
            <Globe size={14} />
            <span>{otherLangLabel}</span>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: "var(--btn-primary-bg)" }}
          >
            <Printer size={16} />
            <span>{printLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
