"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";

const inputClass =
  "bg-[#1A1A1A] border border-gray-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm w-full";
const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block";

export function AboutCardForm({
  initialFullName,
  initialBioShort,
  initialBioLong,
  initialCredlyUrl,
  initialAvatarUrl,
  saveAction,
}: {
  initialFullName: string;
  initialBioShort: string;
  initialBioLong: string;
  initialCredlyUrl: string;
  initialAvatarUrl: string;
  saveAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (formData: FormData) => {
    setStatus("idle");
    setErrorMsg("");
    startTransition(async () => {
      const res = await saveAction(formData);
      if (res.success) {
        setStatus("saved");
      } else {
        setStatus("error");
        setErrorMsg(res.error || "No se pudo guardar.");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre en Tarjeta (Sobre Mí)</label>
          <input
            type="text"
            name="full_name"
            required
            defaultValue={initialFullName}
            placeholder="Ej. Percy Acha Taipe"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>URL Credly (CCNAv7 / Insignias)</label>
          <input
            type="url"
            name="credly_url"
            defaultValue={initialCredlyUrl}
            placeholder="https://www.credly.com/..."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Subtítulo de &quot;Sobre Mí&quot; (Bio Corta)</label>
        <input
          type="text"
          name="bio_short"
          required
          defaultValue={initialBioShort}
          placeholder="Ej. Ingeniero de Sistemas apasionado por la docencia..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Descripción Principal (Bio Larga de Tarjeta)</label>
        <textarea
          name="bio_long"
          rows={3}
          required
          defaultValue={initialBioLong}
          placeholder="Ej. Bachiller en Ingeniería de Sistemas..."
          className={inputClass + " resize-y"}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {initialAvatarUrl && (
            <img
              src={initialAvatarUrl}
              alt={initialFullName}
              className="w-8 h-8 rounded-lg object-cover border border-gray-700"
            />
          )}
          <span>
            La foto/avatar se cambia desde{" "}
            <a href="/dashboard/settings" className="text-blue-400 hover:underline font-semibold">
              Settings
            </a>
            .
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isPending ? "Guardando..." : "Guardar Sobre Mí"}
        </button>
      </div>

      {status === "saved" && (
        <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
          <CheckCircle2 size={14} /> ¡Guardado y actualizado en atpdev.dev!
        </p>
      )}
      {status === "error" && <p className="text-xs text-red-400">{errorMsg}</p>}
    </form>
  );
}
