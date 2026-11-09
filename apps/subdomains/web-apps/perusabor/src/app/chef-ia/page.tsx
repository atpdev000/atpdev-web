'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  ChefHat, 
  Bot, 
  User, 
  BookOpen, 
  RefreshCw, 
  ArrowLeft,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';
import { PERUVIAN_RECIPES } from '@/data/recipes';
import { queryChefIAPeru } from '@/lib/chefIA';
import { ChefIAMessage } from '@/types';

function ChefIAChatContent() {
  const searchParams = useSearchParams();
  const initialRecipeSlug = searchParams.get('receta') || '';

  const [selectedRecipeSlug, setSelectedRecipeSlug] = useState<string>(initialRecipeSlug);
  const [messages, setMessages] = useState<ChefIAMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👨‍🍳 ¡Hola! Soy **Chef IA Perú**, tu asistente gastronómico especializado en recetas peruanas, técnicas de cocción, escalado determinista de porciones y gestión de restaurantes.\n\nPuedes preguntarme cómo preparar cualquier plato regional, cómo rescatar preparaciones que salieron mal (salsas cortadas, exceso de sal o acidez), o cómo sustituir insumos si estás fuera del país. ¿En qué te ayudo hoy?`,
      timestamp: 'Ahora',
      suggestedActions: [
        '¿Por qué el Lomo Saltado bota agua en el sartén?',
        '¿Cómo rescatar una huancaína o mayonesa cortada?',
        '¿Cómo sustituir el ají amarillo en el extranjero?',
        'Escalar Ceviche para 20 personas'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChefIAMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipeContext: selectedRecipeSlug || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simular razonamiento culinario
    setTimeout(() => {
      const response = queryChefIAPeru(text, selectedRecipeSlug);
      const botMsg: ChefIAMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/recetas"
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#c22929]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-display text-stone-900 dark:text-white">
                Chef IA Perú
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase">
                Verificado
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Asistente Culinario & Consultor Operativo de Restaurante
            </p>
          </div>
        </div>

        {/* Recipe context selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">Contexto de plato:</span>
          <select
            value={selectedRecipeSlug}
            onChange={(e) => setSelectedRecipeSlug(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="">(Consulta General)</option>
            {PERUVIAN_RECIPES.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-3xl border-2 border-b-6 border-stone-200 dark:border-stone-800 bg-white dark:bg-[#13110f] h-[580px] flex flex-col justify-between overflow-hidden shadow-sm">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center text-white ${
                  isBot ? 'bg-[#c22929] shadow-sm' : 'bg-stone-800'
                }`}>
                  {isBot ? <ChefHat className="w-5 h-5 stroke-[2.5]" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-2`}>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                    isBot 
                      ? 'bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200' 
                      : 'bg-[#c22929] text-white shadow-xs'
                  }`}>
                    <div className="whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>

                  <span className={`text-[10px] text-stone-400 block px-1 ${!isBot ? 'text-right' : ''}`}>
                    {msg.timestamp}
                  </span>

                  {/* Suggestion action chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[11px] transition-colors cursor-pointer text-left"
                        >
                          💬 {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 mr-auto">
              <div className="w-9 h-9 rounded-2xl bg-[#c22929] text-white flex items-center justify-center">
                <ChefHat className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex items-center gap-2">
                <span>Chef IA Perú está analizando la receta y los puntos de cocción...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Haz una pregunta a Chef IA Perú (ej: '¿Cómo hago para que el ceviche no amargue?')..."
              className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#13110f] border-2 border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#c22929]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3.5 rounded-2xl bg-[#c22929] hover:bg-red-700 disabled:opacity-40 text-white font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>

      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 font-medium">
        🛡️ <strong>Principio Rector del Sistema:</strong> La IA interpreta y asesora; los cálculos críticos de cantidades, costos e inocuidad alimentaria se ejecutan mediante funciones verificables.
      </div>

    </div>
  );
}

export default function ChefIAPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Cargando Chef IA Perú...</div>}>
      <ChefIAChatContent />
    </Suspense>
  );
}

