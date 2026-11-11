"use client";

import React from 'react';
import Link from 'next/link';
import { Gift, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#070a12] text-slate-600 dark:text-zinc-400 text-sm relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-xs flex items-center justify-center text-white">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold font-display text-slate-900 dark:text-white">sorteos <span className="text-pink-600 dark:text-pink-400">pro</span></span>
            </Link>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              {t('footer_brand_desc')}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-3 py-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('footer_csprng_badge')}</span>
            </div>
          </div>

          {/* Col 1: Herramientas Gratuitas */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold">{t('footer_tools_title')}</p>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-400">
              <li><Link href="/herramientas/lista" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_names')}</Link></li>
              <li><Link href="/herramientas/ruleta" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_roulette')}</Link></li>
              <li><Link href="/herramientas/dados" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_dice')}</Link></li>
              <li><Link href="/herramientas/moneda" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_coin')}</Link></li>
              <li><Link href="/herramientas/numeros" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_numbers')}</Link></li>
              <li><Link href="/herramientas/equipos" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_teams')}</Link></li>
              <li><Link href="/herramientas/amigo-invisible" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('tool_secret_santa')}</Link></li>
            </ul>
          </div>

          {/* Col 2: Sorteos Redes */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold">{t('footer_social_title')}</p>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-400">
              <li><Link href="/sorteos/nuevo?platform=instagram" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('footer_sorteo_ig')}</Link></li>
              <li><Link href="/sorteos/nuevo?platform=tiktok" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1.5 px-0.5 inline-block">{t('footer_sorteo_tiktok')}</Link></li>
              <li><Link href="/sorteos/nuevo?platform=youtube" className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1.5 px-0.5 inline-block">{t('footer_sorteo_yt')}</Link></li>
              <li><Link href="/sorteos/nuevo?platform=facebook" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1.5 px-0.5 inline-block">{t('footer_sorteo_fb')}</Link></li>
              <li><Link href="/sorteos/nuevo?platform=x" className="hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-0.5 inline-block">{t('footer_sorteo_x')}</Link></li>
              <li><Link href="/sorteos/nuevo?platform=threads" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1.5 px-0.5 inline-block">{t('footer_sorteo_threads')}</Link></li>
              <li><Link href="/planes" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">{t('nav_pricing')}</Link></li>
            </ul>

          </div>

          {/* Col 3: Legal & Seguridad */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold">{t('footer_legal_title')}</p>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-400">
              <li><Link href="/blog" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">Blog y Recursos</Link></li>
              <li><Link href="/quienes-somos" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">Quiénes Somos</Link></li>
              <li><Link href="/contacto" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5 px-0.5 inline-block">Contacto y Soporte</Link></li>
              <li><Link href="/terminos-y-condiciones" className="hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-0.5 inline-block">{t('footer_terms')}</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-0.5 inline-block">{t('footer_privacy')}</Link></li>
              <li><Link href="/certificados/CERT-SP-98A41E8D" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1.5 px-0.5 inline-block">{t('nav_verify_cert')}</Link></li>
              <li><Link href="/admin" className="text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors py-1.5 px-0.5 inline-block">{t('footer_admin')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} Sorteos Pro. {t('footer_all_rights')}</p>
          <div className="flex items-center gap-2">
            <span>{t('footer_developed_with')}</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>{t('footer_by')}</span>
            <span className="text-slate-800 dark:text-white font-bold">ATP Dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
