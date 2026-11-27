import type { Metadata } from 'next';
import { Mail, Globe, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto y Activación de Créditos',
  description: 'Canales de soporte técnico, sugerencias de categorías y activación de planes Pro en Colorear Pro.',
  alternates: { canonical: 'https://colorear.atpdev.dev/contacto' },
};

export default function ContactoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
          Contacto y Soporte Técnico
        </h1>
        <p className="text-sm text-zinc-600 dark:text-slate-300 leading-relaxed">
          ¿Necesitas ayuda con el formato de un libro para Amazon KDP, activar un paquete de créditos
          Pro o sugerir nuevas colecciones gratuitas para colegios?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-2">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="font-display font-bold text-base text-zinc-900 dark:text-white">
            Correo directo
          </h2>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            Atención para soporte, privacidad y activación de paquetes de créditos Pro (Yape, Plin o
            tarjeta).
          </p>
          <a
            href="mailto:contacto@atpdev.dev?subject=Colorear%20Pro%20-%20Consulta"
            className="text-sm font-bold text-blue-700 dark:text-blue-400 underline block pt-1"
          >
            contacto@atpdev.dev
          </a>
        </div>

        <div className="sheet-card rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-2">
          <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-display font-bold text-base text-zinc-900 dark:text-white">
            Ecosistema ATP Dev
          </h2>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            Conoce el resto de herramientas gratuitas de productividad, PDF y diseño web.
          </p>
          <a
            href="https://www.atpdev.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-blue-700 dark:text-blue-400 underline block pt-1"
          >
            www.atpdev.dev
          </a>
        </div>
      </div>

      <div className="sheet-card rounded-2xl bg-zinc-50 dark:bg-slate-900/60 p-5 flex items-start gap-3 text-xs text-zinc-600 dark:text-slate-400">
        <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Para activar un <strong>Pack Creador KDP</strong> o <strong>Estudio Editorial Pro</strong>,
          indícanos en tu correo el plan elegido y tu medio de pago preferido (Yape, Plin, transferencia
          o tarjeta internacional). Respondemos en menos de 24 horas hábiles.
        </p>
      </div>
    </div>
  );
}

