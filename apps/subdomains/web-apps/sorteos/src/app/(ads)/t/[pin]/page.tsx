"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ShortPinRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const pin = params?.pin ? String(params.pin) : 'TRIVIA-PRO';
    router.replace(`/trivia/jugar?pin=${encodeURIComponent(pin)}`);
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-sm font-mono text-zinc-400">Entrando a la sala de juego...</div>
    </div>
  );
}
