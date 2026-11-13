import React from 'react';
import Link from 'next/link';
import { ChefHat, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0c0a09] transition-colors py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#c22929] flex items-center justify-center text-white shadow-md">
                <ChefHat className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                PERÚ SABOR
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
              Plataforma digital especializada en documentar, costear, escalar y gestionar la culinaria peruana con inteligencia artificial verificable y fichas técnicas profesionales.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cálculos Culinarios Deterministas</span>
            </div>
          </div>

          {/* Links Col 1: Regiones */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 font-display">
              Regiones Gastronómicas
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/recetas?region=Costa" className="hover:text-[#c22929] transition-colors">
                  🌊 Costa & Tradición Marina
                </Link>
              </li>
              <li>
                <Link href="/recetas?region=Sierra" className="hover:text-[#c22929] transition-colors">
                  ⛰️ Sierra & Cocina Picantera
                </Link>
              </li>
              <li>
                <Link href="/recetas?region=Selva" className="hover:text-[#c22929] transition-colors">
                  🌴 Selva & Aromas Amazónicos
                </Link>
              </li>
              <li>
                <Link href="/recetas" className="hover:text-[#c22929] transition-colors">
                  🥟 Fusión Nikkei, Chifa & Criolla
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Módulos Pro */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 font-display">
              Herramientas de Restaurante
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/escalador" className="hover:text-[#c22929] transition-colors">
                  ⚖️ Escalador de Porciones & Mermas
                </Link>
              </li>
              <li>
                <Link href="/costeo" className="hover:text-[#c22929] transition-colors">
                  📊 Simulador de Food Cost & Márgenes
                </Link>
              </li>
              <li>
                <Link href="/menus" className="hover:text-[#c22929] transition-colors">
                  📋 Generador de Menús & Compras
                </Link>
              </li>
              <li>
                <Link href="/restaurante" className="hover:text-[#c22929] transition-colors">
                  🍽️ Gestión de Mesas & Comandas
                </Link>
              </li>
              <li>
                <Link href="/inventario" className="hover:text-[#c22929] transition-colors">
                  📦 Control de Insumos & Proveedores
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Inteligencia Culinaria */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 font-display">
              Asistente Chef IA
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
              Consulta en tiempo real cómo rescatar preparaciones, sustituir insumos en el extranjero y planificar el servicio de cocina.
            </p>
            <Link
              href="/chef-ia"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 font-black text-xs hover:bg-amber-500/20 transition-colors border border-amber-500/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Abrir Chef IA Perú</span>
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
          <p>© 2026 Perú Sabor Inteligente. Desarrollado con pasión gastronómica y rigor técnico.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacidad" className="hover:text-[#c22929] transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-[#c22929] transition-colors">
              Términos de Uso
            </Link>
            <a href="https://www.atpdev.dev/contacto" target="_blank" rel="noopener noreferrer" className="hover:text-[#c22929] transition-colors">
              Contacto
            </a>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span>Lima, Perú 🇵🇪</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

