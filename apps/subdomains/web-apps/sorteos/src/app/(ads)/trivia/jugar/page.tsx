"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, 
  Sparkles, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  ArrowRight, 
  RotateCcw, 
  Copy, 
  Share2, 
  Crown, 
  Medal, 
  Zap, 
  Star,
  Users,
  Gift,
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import ConfettiEffect from '@/components/ConfettiEffect';
import { 
  playCorrectChime, 
  playWrongBuzz, 
  playCelebrationSound 
} from '@/lib/soundEffects';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface ParticipantResult {
  id: string;
  pin: string;
  name: string;
  email: string;
  avatar: string;
  score: number;
  total: number;
  kahootPoints: number;
  timeSeconds: number;
  percentage: number;
  approved: boolean;
  date: string;
}

const AVATARS = ['🦊', '🦁', '🐼', '🚀', '⚡', '💎', '👑', '🎯', '🦄', '🐯', '🔥', '🌟'];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'p-1',
    question: '¿Cuál es la capital oficial de Australia?',
    options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctIndex: 2,
    explanation: 'Canberra fue elegida como capital en 1908 como solución de compromiso entre Sídney y Melbourne.'
  },
  {
    id: 'p-2',
    question: '¿Cuál es el río más caudaloso y largo del planeta Tierra?',
    options: ['Río Nilo', 'Río Amazonas', 'Río Yangtsé', 'Río Misisipi'],
    correctIndex: 1,
    explanation: 'El río Amazonas supera los 6,992 km y vierte más de 200,000 m³ de agua dulce por segundo al Atlántico.'
  },
  {
    id: 'p-3',
    question: '¿En qué continente se encuentra el desierto del Sahara?',
    options: ['Asia', 'África', 'Oceanía', 'América'],
    correctIndex: 1,
    explanation: 'El Sahara abarca más de 9 millones de km² a lo largo del norte de África.'
  },
  {
    id: 'p-4',
    question: '¿Qué país europeo tiene una singular silueta geográfica en forma de bota?',
    options: ['España', 'Grecia', 'Italia', 'Portugal'],
    correctIndex: 2,
    explanation: 'La península itálica es famosa en el mundo entero por su silueta inconfundible de bota de cuero.'
  }
];

function TriviaPlayerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pinParam = searchParams.get('pin') || 'TRIVIA-PRO';

  // Estados de Partida
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'question' | 'feedback' | 'finished'>('lobby');
  const [pin, setPin] = useState(pinParam);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [inputError, setInputError] = useState<string | null>(null);

  // Preguntas y Reglas
  const [triviaTitle, setTriviaTitle] = useState('Trivia Oficial Sorteos Pro');
  const [rewardCode, setRewardCode] = useState('TRIVIA25OFF');
  const [timerMax, setTimerMax] = useState<number>(15);
  const [approvalThreshold, setApprovalThreshold] = useState<number>(75);
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);

  // Progreso de Juego
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalKahootPoints, setTotalKahootPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Selección
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Ranking y Posición Final
  const [roomLeaderboard, setRoomLeaderboard] = useState<ParticipantResult[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Cargar configuración de la Sala desde localStorage
  useEffect(() => {
    try {
      const roomConfig = localStorage.getItem(`sorteos_trivia_room_config_${pin}`);
      if (roomConfig) {
        const parsed = JSON.parse(roomConfig);
        if (parsed.title) setTriviaTitle(parsed.title);
        if (parsed.rewardCode) setRewardCode(parsed.rewardCode);
        if (parsed.timer) setTimerMax(parsed.timer);
        if (parsed.threshold) setApprovalThreshold(parsed.threshold);
        if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          setQuestions(parsed.questions);
        }
      }

      // Cargar ranking existente de la sala
      const roomScores = localStorage.getItem(`sorteos_trivia_room_scores_${pin}`);
      if (roomScores) {
        const parsedScores: ParticipantResult[] = JSON.parse(roomScores);
        if (Array.isArray(parsedScores)) {
          setRoomLeaderboard(parsedScores.sort((a, b) => b.kahootPoints - a.kahootPoints));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [pin]);

  // Temporizador de la pregunta activa
  useEffect(() => {
    if (gameState !== 'question' || timerMax === 0) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTotalElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, timerMax]);

  const currentQ = questions[currentIdx] || questions[0];

  // Iniciar Partida desde Lobby
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setInputError('Por favor ingresa tu nombre o nickname.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (playerEmail.trim() && !emailRegex.test(playerEmail.trim())) {
      setInputError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    setInputError(null);

    // Animación de 3 segundos previa tipo Kahoot
    setGameState('countdown');
    setTimeout(() => {
      setGameState('question');
      setTimeLeft(timerMax);
    }, 1500);
  };

  // Manejar respuesta
  const handleAnswer = (optionIdx: number) => {
    if (gameState !== 'question') return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQ.correctIndex;
    let earned = 0;

    if (isCorrect) {
      // Fórmula de Puntos Kahoot:
      // Base: 1000 pts
      // Rapidez: hasta 500 pts extra según los segundos restantes
      const speedBonus = timerMax > 0 ? Math.round((timeLeft / timerMax) * 500) : 250;
      const streakBonus = streak * 100;
      earned = 1000 + speedBonus + streakBonus;

      setCorrectAnswersCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      playCorrectChime();
    } else {
      setStreak(0);
      playWrongBuzz();
    }

    setLastPointsEarned(earned);
    setTotalKahootPoints((prev) => prev + earned);
    setGameState('feedback');
  };

  // Pasar a siguiente pregunta o terminar
  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(timerMax);
      setGameState('question');
    } else {
      finishGame();
    }
  };

  // Finalizar juego y registrar en Leaderboard
  const finishGame = () => {
    const finalCorrect = correctAnswersCount;
    const pct = Math.round((finalCorrect / questions.length) * 100);
    const approved = pct >= approvalThreshold;

    const myResult: ParticipantResult = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pin,
      name: playerName.trim(),
      email: playerEmail.trim() || `${playerName.toLowerCase().replace(/\s+/g, '')}@jugador.pro`,
      avatar: selectedAvatar,
      score: finalCorrect,
      total: questions.length,
      kahootPoints: totalKahootPoints,
      timeSeconds: totalElapsedTime,
      percentage: pct,
      approved,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      // Actualizar scores de la sala
      const stored = localStorage.getItem(`sorteos_trivia_room_scores_${pin}`);
      const existing: ParticipantResult[] = stored ? JSON.parse(stored) : [];
      const updated = [...existing, myResult].sort((a, b) => b.kahootPoints - a.kahootPoints);
      localStorage.setItem(`sorteos_trivia_room_scores_${pin}`, JSON.stringify(updated));

      // También registrar en base general de leads de la trivia
      const globalLeads = localStorage.getItem('sorteos_trivia_leads');
      const leadsParsed = globalLeads ? JSON.parse(globalLeads) : [];
      localStorage.setItem('sorteos_trivia_leads', JSON.stringify([
        {
          id: myResult.id,
          name: myResult.name,
          email: myResult.email,
          score: myResult.score,
          total: myResult.total,
          percentage: myResult.percentage,
          approved: myResult.approved,
          date: new Date().toLocaleString()
        },
        ...leadsParsed
      ]));

      // Disparar evento storage para sincronizar organizador en vivo
      window.dispatchEvent(new Event('storage'));

      setRoomLeaderboard(updated);
      const position = updated.findIndex((r) => r.id === myResult.id) + 1;
      setMyRank(position > 0 ? position : 1);
    } catch (e) {
      console.error(e);
    }

    if (approved) {
      setShowConfetti(true);
      playCelebrationSound();
    }

    setGameState('finished');
  };

  const copyCoupon = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rewardCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-white flex flex-col justify-between selection:bg-pink-500 selection:text-white relative overflow-hidden font-sans">
      <ConfettiEffect active={showConfetti} />

      {/* Glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-purple-600/20 via-pink-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header Minimalista Kahoot Style */}
      <header className="relative z-10 px-4 py-4 border-b border-white/10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <Link href="/herramientas/trivia" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-md">
            SP
          </div>
          <span className="font-black text-sm tracking-tight text-white">
            Sorteos Pro <span className="text-pink-500">Live</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PIN: {pin}</span>
          </div>
        </div>
      </header>

      {/* ─── PANTALLA 1: LOBBY DE INGRESO ─────────────────────────────────── */}
      {gameState === 'lobby' && (
        <main className="relative z-10 max-w-md mx-auto w-full px-4 py-10 flex-1 flex flex-col justify-center">
          <div className="p-8 rounded-3xl bg-[#0f172a]/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-6 text-center">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-800/40 text-pink-400 text-xs font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sala de Juego Oficial</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {triviaTitle}
              </h1>
              <p className="text-xs text-zinc-400">
                ¡Ingresa tu nombre para unirte al ranking y competir por los mejores premios!
              </p>
            </div>

            <form onSubmit={handleStartGame} className="space-y-4 text-left">
              {/* Avatar Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400">
                  Elige tu Avatar de Jugador:
                </label>
                <div className="grid grid-cols-6 gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`h-10 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-pink-600 scale-110 shadow-md ring-2 ring-white/40'
                          : 'hover:bg-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400">
                  Tu Nickname / Nombre Completo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofia Gómez"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Correo */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 flex items-center justify-between">
                  <span>Tu Correo Electrónico:</span>
                  <span className="text-[10px] text-zinc-500">Para reclamar premio</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu.email@gmail.com"
                  value={playerEmail}
                  onChange={(e) => setPlayerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-mono text-xs"
                />
              </div>

              {inputError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs text-center">
                  {inputError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl btn-pro-primary text-sm font-black shadow-lg shadow-pink-600/25 hover:scale-102 transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{selectedAvatar} ¡Entrar a la Partida!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[11px] text-zinc-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Validación Anti-Fraude • {questions.length} Preguntas</span>
            </div>
          </div>
        </main>
      )}

      {/* ─── PANTALLA 2: COUNTDOWN ANIMADO ──────────────────────────────── */}
      {gameState === 'countdown' && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="text-6xl animate-bounce">{selectedAvatar}</div>
          <h2 className="text-3xl font-black text-white">¡Prepárate, {playerName}!</h2>
          <div className="text-pink-500 font-mono text-sm uppercase tracking-widest font-bold">
            La trivia comienza ahora...
          </div>
        </main>
      )}

      {/* ─── PANTALLA 3: GAMEPLAY INTERACTIVO KAHOOT STYLE ──────────────── */}
      {(gameState === 'question' || gameState === 'feedback') && (
        <main className="relative z-10 max-w-2xl mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-between">
          
          {/* Top Bar: Pregunta, Puntos, Streak */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-zinc-300">
                Pregunta {currentIdx + 1} de {questions.length}
              </span>

              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Racha x{streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{totalKahootPoints} pts</span>
                </div>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-pink-500 to-purple-600'
                }`}
                style={{ width: `${(timeLeft / timerMax) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Tiempo restante:</span>
              <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse text-sm' : 'text-zinc-200'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Enunciado de la Pregunta */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 text-center shadow-xl">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {currentQ.question}
              </h2>
            </div>
          </div>

          {/* Opciones Grandes Estilo Kahoot (4 Colores Icónicos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              // Paleta Kahoot: 0: Rojo/Rosa, 1: Azul, 2: Amarillo/Ambar, 3: Verde
              const colorSchemes = [
                'bg-rose-600/80 hover:bg-rose-600 border-rose-500/50',
                'bg-blue-600/80 hover:bg-blue-600 border-blue-500/50',
                'bg-amber-600/80 hover:bg-amber-600 border-amber-500/50',
                'bg-emerald-600/80 hover:bg-emerald-600 border-emerald-500/50'
              ];

              let stateStyle = colorSchemes[idx % colorSchemes.length];

              if (gameState === 'feedback') {
                if (isCorrect) {
                  stateStyle = 'bg-emerald-500 border-white text-white ring-4 ring-emerald-500/50 scale-102';
                } else if (isSelected) {
                  stateStyle = 'bg-rose-700 border-white text-white ring-4 ring-rose-500/50';
                } else {
                  stateStyle = 'opacity-30 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={gameState === 'feedback'}
                  onClick={() => handleAnswer(idx)}
                  className={`p-5 rounded-2xl border text-left transition-all font-bold flex items-center justify-between gap-3 shadow-lg cursor-pointer ${stateStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center font-mono text-sm font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base">{opt}</span>
                  </div>

                  {gameState === 'feedback' && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                  )}
                  {gameState === 'feedback' && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Botón Siguiente */}
          {gameState === 'feedback' && (
            <div className="p-5 rounded-3xl bg-[#0f172a] border border-white/10 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm font-black text-emerald-400">¡Respuesta Correcta!</div>
                        <div className="text-xs text-zinc-400 font-mono">+{lastPointsEarned} puntos Kahoot</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                        ✕
                      </div>
                      <div>
                        <div className="text-sm font-black text-rose-400">Respuesta Incorrecta</div>
                        <div className="text-xs text-zinc-400">0 puntos en esta ronda</div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-pro-primary px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2 cursor-pointer shadow-md hover:scale-102"
                >
                  <span>{currentIdx + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Puntuación Final'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {currentQ.explanation && (
                <p className="text-xs text-zinc-400 border-t border-white/5 pt-2">
                  <strong className="text-zinc-200">Explicación:</strong> {currentQ.explanation}
                </p>
              )}
            </div>
          )}
        </main>
      )}

      {/* ─── PANTALLA 4: RESULTADO FINAL & RANKING ───────────────────────── */}
      {gameState === 'finished' && (
        <main className="relative z-10 max-w-xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center space-y-6">
          <div className="p-8 rounded-3xl bg-[#0f172a]/95 border border-white/10 shadow-2xl text-center space-y-6">
            
            <div className="w-20 h-20 rounded-3xl mx-auto bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xl">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="text-2xl">{selectedAvatar}</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ¡Gran partida, {playerName}!
              </h2>
              <p className="text-xs text-zinc-400">
                Puntuación final: <strong className="text-pink-400 font-mono text-sm">{totalKahootPoints} Puntos Kahoot</strong> ({correctAnswersCount} de {questions.length} aciertos)
              </p>
            </div>

            {/* Badge de Posición en el Ranking */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-around">
              <div>
                <div className="text-[10px] font-mono uppercase text-zinc-400">Puesto en Sala</div>
                <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1 font-mono">
                  {myRank === 1 && <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />}
                  #{myRank || 1}
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-[10px] font-mono uppercase text-zinc-400">Tiempo Total</div>
                <div className="text-xl font-bold font-mono text-zinc-200">{totalElapsedTime}s</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-[10px] font-mono uppercase text-zinc-400">Estado</div>
                <div className="text-xs font-bold font-mono text-emerald-400">
                  {correctAnswersCount >= Math.ceil(questions.length * 0.75) ? 'Aprobado ✓' : 'Completado'}
                </div>
              </div>
            </div>

            {/* Cupón Ganado */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-pink-400">
                Tu Recompensa Desbloqueada
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-black font-mono tracking-widest text-white px-4 py-1.5 rounded-xl bg-black/40 border border-pink-500/40">
                  {rewardCode}
                </span>
                <button
                  onClick={copyCoupon}
                  className="p-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white transition-colors cursor-pointer"
                  title="Copiar código"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedCoupon && (
                <div className="text-[11px] font-bold text-emerald-400">¡Copiado al portapapeles!</div>
              )}
            </div>

            {/* Top 3 Podio de la Sala */}
            <div className="space-y-2 text-left">
              <div className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center justify-between">
                <span>Top Podio en Vivo ({pin}):</span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {roomLeaderboard.slice(0, 5).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      entry.name === playerName
                        ? 'bg-pink-950/40 border-pink-500/50 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center font-mono font-black text-amber-400">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                      </span>
                      <span>{entry.avatar}</span>
                      <span className="truncate max-w-[140px]">{entry.name}</span>
                    </div>
                    <span className="font-mono font-bold text-pink-400">{entry.kahootPoints} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentIdx(0);
                  setTimeLeft(timerMax);
                  setCorrectAnswersCount(0);
                  setTotalKahootPoints(0);
                  setStreak(0);
                  setTotalElapsedTime(0);
                  setSelectedOption(null);
                  setShowConfetti(false);
                  setGameState('question');
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jugar de Nuevo</span>
              </button>

              <Link
                href="/herramientas/trivia"
                className="btn-pro-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2"
              >
                <span>Crear mi Propia Trivia</span>
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="relative z-10 px-4 py-4 text-center text-xs text-zinc-500 font-mono">
        Sorteos Pro • Plataforma Oficial de Gamificación & Trivias Online
      </footer>
    </div>
  );
}

export default function TriviaPlayerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070a13] flex items-center justify-center text-white">Cargando sala de trivia...</div>}>
      <TriviaPlayerContent />
    </Suspense>
  );
}
