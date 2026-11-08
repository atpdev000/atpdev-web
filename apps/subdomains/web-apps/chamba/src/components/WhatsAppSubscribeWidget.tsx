'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface WhatsAppSubscribeWidgetProps {
  whatsappEnabled?: boolean;
  telegramEnabled?: boolean;
  whatsappUrl?: string;
  telegramUrl?: string;
}

export default function WhatsAppSubscribeWidget({
  whatsappEnabled = true,
  telegramEnabled = true,
  whatsappUrl,
  telegramUrl = 'https://t.me/chambapro_peru',
}: WhatsAppSubscribeWidgetProps) {
  const [selectedRegion, setSelectedRegion] = useState('Nacional');
  const [selectedCareer, setSelectedCareer] = useState('Todas las Carreras');

  if (!whatsappEnabled && !telegramEnabled) {
    return null;
  }

  const handleJoinWhatsApp = () => {
    if (whatsappUrl && whatsappUrl.startsWith('http')) {
      window.open(whatsappUrl, '_blank');
      return;
    }
    const cleanNumber = (whatsappUrl || '51987654321').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hola Chamba Pro, deseo unirme a las alertas de empleo para ${selectedCareer} en ${selectedRegion}.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleJoinTelegram = () => {
    const targetUrl = telegramUrl && telegramUrl.startsWith('http') 
      ? telegramUrl 
      : `https://t.me/${telegramUrl.replace(/^@/, '') || 'chambapro_peru'}`;
    window.open(targetUrl, '_blank');
  };

  const widgetTitle = whatsappEnabled && telegramEnabled
    ? 'Alertas de Convocatorias en tu Celular'
    : whatsappEnabled
    ? 'Recibe Convocatorias por WhatsApp'
    : 'Canal Oficial de Convocatorias en Telegram';

  return (
    <div className="my-8 p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <MessageSquare size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Notificaciones Gratuitas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {widgetTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Recibe avisos de convocatorias del Estado con bases oficiales directamente en tu smartphone.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          <div className="w-full sm:w-auto">
            <label htmlFor="subscribe-region-select" className="sr-only">Seleccionar región para alertas de convocatorias</label>
            <select
              id="subscribe-region-select"
              aria-label="Seleccionar región para alertas de convocatorias"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Nacional">Todas las Regiones</option>
              <option value="Lima">Lima y Callao</option>
              <option value="Arequipa">Arequipa</option>
              <option value="Cusco">Cusco</option>
              <option value="Junín">Junín</option>
              <option value="Puno">Puno</option>
              <option value="La Libertad">La Libertad</option>
              <option value="Piura">Piura</option>
            </select>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {whatsappEnabled && (
              <button
                type="button"
                onClick={handleJoinWhatsApp}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Canal WhatsApp</span>
              </button>
            )}
            {telegramEnabled && (
              <button
                type="button"
                onClick={handleJoinTelegram}
                className="w-full sm:w-auto px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>Telegram</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
