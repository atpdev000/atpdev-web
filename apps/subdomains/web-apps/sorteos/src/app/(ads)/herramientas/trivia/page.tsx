"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  Timer, 
  Sparkles, 
  ArrowRight,
  Download,
  Share2,
  QrCode,
  Code2,
  Copy,
  Plus,
  Trash2,
  Check,
  Play,
  FileSpreadsheet,
  Globe2,
  Palette,
  ShieldCheck,
  BarChart3,
  Store,
  Smartphone,
  ChevronDown,
  Gift,
  Star,
  UploadCloud,
  Eye,
  X,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  Settings2,
  Crown,
  Medal,
  Flame,
  Zap,
  Users,
  Maximize2,
  Minimize2,
  LogIn,
  UserCheck,
  Radio
} from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { 
  playCorrectChime, 
  playWrongBuzz, 
  playCelebrationSound, 
  playDrumRoll 
} from '@/lib/soundEffects';
import { getToken } from '@/lib/api';

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

interface LeadEntry {
  id: string;
  name: string;
  email: string;
  score: number;
  total: number;
  percentage: number;
  approved: boolean;
  date: string;
}

const PRESET_TOPICS: { 
  id: string;
  name: string; 
  subtitle: string;
  badge: string;
  icon: string; 
  questions: Question[];
  rewardCode: string;
}[] = [
  {
    id: 'paises',
    name: 'Países & Cultura General',
    subtitle: 'Prueba de geografía, capitales y curiosidades del mundo.',
    badge: 'Popular',
    icon: '🌍',
    rewardCode: 'MUNDO2026',
    questions: [
      {
        id: 'cult-1',
        question: '¿Cuál es la capital oficial de Australia?',
        options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctIndex: 2,
        explanation: 'Canberra fue elegida como capital en 1908 como solución de compromiso entre Sídney y Melbourne.'
      },
      {
        id: 'cult-2',
        question: '¿Cuál es el río más caudaloso y largo del planeta Tierra?',
        options: ['Río Nilo', 'Río Amazonas', 'Río Yangtsé', 'Río Misisipi'],
        correctIndex: 1,
        explanation: 'El río Amazonas supera los 6,992 km y vierte más de 200,000 m³ de agua dulce por segundo al Atlántico.'
      },
      {
        id: 'cult-3',
        question: '¿En qué continente se encuentra el desierto del Sahara?',
        options: ['Asia', 'África', 'Oceanía', 'América del Norte'],
        correctIndex: 1,
        explanation: 'El Sahara abarca más de 9 millones de km² a lo largo del norte de África.'
      },
      {
        id: 'cult-4',
        question: '¿Qué país europeo tiene una singular silueta geográfica en forma de bota?',
        options: ['España', 'Grecia', 'Italia', 'Portugal'],
        correctIndex: 2,
        explanation: 'La península itálica es famosa en el mundo entero por su silueta inconfundible de bota de cuero.'
      }
    ]
  },
  {
    id: 'peliculas',
    name: 'Películas & Cine de los 90s',
    subtitle: 'Revive los mayores clásicos del cine taquillero y gana.',
    badge: 'Cinefilos',
    icon: '🍿',
    rewardCode: 'CINEMAX90',
    questions: [
      {
        id: 'cine-1',
        question: '¿Quién dirigió la histórica película Titanic (1997)?',
        options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'George Lucas'],
        correctIndex: 2,
        explanation: 'James Cameron dirigió la cinta que empató el récord histórico de 11 premios Óscar.'
      },
      {
        id: 'cine-2',
        question: '¿En qué año se estrenó Jurassic Park por primera vez en cines?',
        options: ['1991', '1993', '1995', '1998'],
        correctIndex: 1,
        explanation: 'Jurassic Park de Steven Spielberg revolucionó los efectos digitales en 1993.'
      },
      {
        id: 'cine-3',
        question: '¿Cuál es el nombre del protagonista de la película The Matrix (1999)?',
        options: ['Neo (Thomas Anderson)', 'Morpheus', 'John Wick', 'Cypher'],
        correctIndex: 0,
        explanation: 'Keanu Reeves inmortalizó el papel de Thomas Anderson (Neo) en Matrix.'
      },
      {
        id: 'cine-4',
        question: '¿Qué actor interpretó al inolvidable Forrest Gump?',
        options: ['Brad Pitt', 'Tom Hanks', 'Robin Williams', 'Al Pacino'],
        correctIndex: 1,
        explanation: 'Tom Hanks ganó el premio Óscar a Mejor Actor en 1994 por este papel icónico.'
      }
    ]
  },
  {
    id: 'mkt',
    name: 'Marketing & Tu Marca',
    subtitle: 'Evalúa cuánto conocen tus seguidores sobre tus productos y valores.',
    badge: 'E-Commerce',
    icon: '🚀',
    rewardCode: 'TRIVIA25OFF',
    questions: [
      {
        id: 'mkt-1',
        question: '¿Cuál es el estándar criptográfico utilizado por Sorteos Pro para certificar ganadores inmutables?',
        options: ['MD5', 'SHA-256', 'Base64', 'CRC32'],
        correctIndex: 1,
        explanation: 'SHA-256 genera un hash criptográfico de 64 caracteres único e inalterable.'
      },
      {
        id: 'mkt-2',
        question: '¿Qué ventaja directa ofrece insertar una Trivia interactiva con cupón de salida (Exit-Intent)?',
        options: ['Mayor aburrimiento', 'Reduce el rebote, cualifica clientes y dispara las compras hasta un 300%', 'Pierde clientes', 'Ninguna ventaja'],
        correctIndex: 1,
        explanation: 'Gamificar la experiencia del cliente transforma visitas dudosas en compradores fidelizados.'
      },
      {
        id: 'mkt-3',
        question: '¿Qué red social permite recolección de comentarios directa mediante la API oficial de Google Data?',
        options: ['YouTube', 'Twitch', 'Snapchat', 'Pinterest'],
        correctIndex: 0,
        explanation: 'YouTube utiliza la API oficial de Google Data v3 para indexar comentarios en vivo sin límites.'
      },
      {
        id: 'mkt-4',
        question: '¿Cuál es la mejor práctica al realizar un sorteo en Instagram o TikTok para generar confianza?',
        options: ['Elegir a dedo sin sorteo', 'Publicar Bases Legales y Certificado de Validez Verificable', 'Ocultar a los ganadores', 'Borrar comentarios'],
        correctIndex: 1,
        explanation: 'La transparencia total y la trazabilidad criptográfica fidelizan a tu comunidad de por vida.'
      }
    ]
  },
  {
    id: 'halloween',
    name: 'Halloween & Misterio',
    subtitle: 'Trivia temática de terror, mitos y celebraciones.',
    badge: 'Temática',
    icon: '🎃',
    rewardCode: 'SPOOKY50',
    questions: [
      {
        id: 'hal-1',
        question: '¿De qué verdura se hacían originalmente las linternas de Jack-o\'-lantern en Irlanda?',
        options: ['Calabazas', 'Nabos', 'Zanahorias', 'Patatas'],
        correctIndex: 1,
        explanation: 'En Irlanda y Escocia tradicionalmente se tallaban nabos antes de adoptar las calabazas en América.'
      },
      {
        id: 'hal-2',
        question: '¿En qué país histórico se sitúa la región de Transilvania, hogar literario de Drácula?',
        options: ['Hungría', 'Rumanía', 'Polonia', 'Bulgaria'],
        correctIndex: 1,
        explanation: 'Transilvania es una región histórica situada en el corazón de Rumanía.'
      },
      {
        id: 'hal-3',
        question: '¿Cuál es la frase tradicional que dicen los niños al pedir dulces en Halloween?',
        options: ['Dulce o Truco (Trick or Treat)', 'Dame caramelos', 'Abracadabra', 'Premio o castigo'],
        correctIndex: 0,
        explanation: '"Trick or treat" es la tradición anglosajona extendida a todo el mundo moderno.'
      }
    ]
  },
  {
    id: 'survey',
    name: 'Encuesta de Satisfacción (Feedback)',
    subtitle: 'Preguntas sin respuesta incorrecta para recoger la opinión de tus clientes.',
    badge: 'Cuestionario',
    icon: '⭐',
    rewardCode: 'GRACIAS15',
    questions: [
      {
        id: 'surv-1',
        question: '¿Cómo calificarías la experiencia general de navegación en nuestra tienda?',
        options: ['Excelente y muy fluida', 'Buena, encontré lo que buscaba', 'Regular, faltan opciones', 'Difícil de navegar'],
        correctIndex: 0,
        explanation: '¡Gracias por tu valoración! Todas las opiniones nos ayudan a mejorar continuamente.'
      },
      {
        id: 'surv-2',
        question: '¿Qué tipo de promociones prefieres recibir en tus compras frecuentes?',
        options: ['Cupones directos de 20-30% de descuento', 'Envío gratis en todos los pedidos', 'Regalos sorpresa con cada compra', 'Sorteos mensuales de productos premium'],
        correctIndex: 0,
        explanation: 'Tu preferencia ha quedado registrada para personalizar tus futuros beneficios.'
      },
      {
        id: 'surv-3',
        question: '¿Nos recomendarías con un amigo o familiar?',
        options: ['Definitivamente sí (10/10)', 'Muy probablemente', 'Tal vez en el futuro', 'No estoy seguro'],
        correctIndex: 0,
        explanation: '¡Agradecemos inmensamente tu tiempo y lealtad con nuestra marca!'
      }
    ]
  }
];

const INITIAL_LEADERBOARD: ParticipantResult[] = [
  {
    id: 'p-1',
    pin: 'TRIVIA-PRO',
    name: 'Camila Morales',
    email: 'camila.m@gmail.com',
    avatar: '👑',
    score: 4,
    total: 4,
    kahootPoints: 4850,
    timeSeconds: 9.4,
    percentage: 100,
    approved: true,
    date: '15:42'
  },
  {
    id: 'p-2',
    pin: 'TRIVIA-PRO',
    name: 'Mateo Fernández',
    email: 'mateo.f@gmail.com',
    avatar: '⚡',
    score: 4,
    total: 4,
    kahootPoints: 4620,
    timeSeconds: 11.2,
    percentage: 100,
    approved: true,
    date: '16:05'
  },
  {
    id: 'p-3',
    pin: 'TRIVIA-PRO',
    name: 'David Rivas',
    email: 'david.rivas@outlook.com',
    avatar: '🚀',
    score: 3,
    total: 4,
    kahootPoints: 3410,
    timeSeconds: 14.8,
    percentage: 75,
    approved: true,
    date: '16:10'
  },
  {
    id: 'p-4',
    pin: 'TRIVIA-PRO',
    name: 'Sofía Herrera',
    email: 'sofia.herrera@yahoo.es',
    avatar: '🦊',
    score: 2,
    total: 4,
    kahootPoints: 2190,
    timeSeconds: 19.5,
    percentage: 50,
    approved: false,
    date: '16:24'
  }
];

const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com',
  'sharklasers.com', 'throwawaymail.com', 'yopmail.com', 'getairmail.com'
];

export default function TriviaPage() {
  const router = useRouter();

  // Tabs: 'play' | 'leaderboard' | 'builder' | 'leads' | 'embed'
  const [activeTab, setActiveTab] = useState<'play' | 'leaderboard' | 'builder' | 'leads' | 'embed'>('play');

  // Estado de Autenticación del Organizador
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Configuración de Sala de Juego & PIN
  const [roomPin, setRoomPin] = useState('TRIVIA-PRO');
  const [activePresetId, setActivePresetId] = useState<string>('paises');
  const [triviaTitle, setTriviaTitle] = useState('Trivia de Países & Cultura General');
  const [triviaDesc, setTriviaDesc] = useState('Pon a prueba tus conocimientos, desbloquea tu cupón de descuento y entra al sorteo oficial.');
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [approvalThreshold, setApprovalThreshold] = useState<number>(75);
  const [rewardCode, setRewardCode] = useState('MUNDO2026');

  // Preguntas activas
  const [questions, setQuestions] = useState<Question[]>(PRESET_TOPICS[0].questions);

  // Estado del juego demo local
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Formulario Lead demo
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRegistered, setLeadRegistered] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Leaderboard / Podio Tipo Kahoot en Tiempo Real
  const [leaderboard, setLeaderboard] = useState<ParticipantResult[]>(INITIAL_LEADERBOARD);

  // Base de datos de Leads
  const [leads, setLeads] = useState<LeadEntry[]>(INITIAL_LEADERBOARD.map(p => ({
    id: p.id,
    name: p.name,
    email: p.email,
    score: p.score,
    total: p.total,
    percentage: p.percentage,
    approved: p.approved,
    date: `11/10/2026, ${p.date}`
  })));

  // Editor: Nueva pregunta temporal
  const [newQTitle, setNewQTitle] = useState('');
  const [newQOpts, setNewQOpts] = useState(['', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState(0);

  // CSV Import Modal
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');

  // Modales adicionales
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showExitIntentDemo, setShowExitIntentDemo] = useState(false);
  const [showLiveStageFullscreen, setShowLiveStageFullscreen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Acordeón FAQ
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Copia de embed o link
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const gameSectionRef = useRef<HTMLDivElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  // Detectar inicio de sesión del organizador
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(Boolean(token));
  }, []);

  // Cargar y sincronizar Leaderboard de la sala desde localStorage en tiempo real
  const syncRoomData = () => {
    try {
      const roomScores = localStorage.getItem(`sorteos_trivia_room_scores_${roomPin}`);
      if (roomScores) {
        const parsed: ParticipantResult[] = JSON.parse(roomScores);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sorted = parsed.sort((a, b) => b.kahootPoints - a.kahootPoints);
          setLeaderboard(sorted);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    syncRoomData();

    // Guardar configuración inicial de la sala para que los jugadores la reciban
    try {
      localStorage.setItem(`sorteos_trivia_room_config_${roomPin}`, JSON.stringify({
        title: triviaTitle,
        rewardCode,
        timer: timerSeconds,
        threshold: approvalThreshold,
        questions
      }));
    } catch (e) {}

    // Escuchar eventos de storage (cuando un jugador contesta en otra pestaña o ventana)
    const handleStorage = () => {
      syncRoomData();
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(syncRoomData, 2000); // Polling ligero

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [roomPin, triviaTitle, rewardCode, timerSeconds, approvalThreshold, questions]);

  // Timer del jugador demo local
  useEffect(() => {
    if (activeTab !== 'play' || isFinished || isAnswered || timerSeconds === 0) return;
    if (timeLeft <= 0) {
      handleOptionSelect(-1); // Timeout
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished, activeTab, timerSeconds]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isSurveyMode = activePresetId === 'survey';
    if (isSurveyMode || idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      playCorrectChime();
    } else {
      playWrongBuzz();
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Ingresa un correo electrónico con formato válido.');
      return false;
    }
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      setEmailError('Sistema Anti-Fraude: No se admiten correos desechables o temporales.');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(timerSeconds);
    } else {
      setIsFinished(true);
      const isSurveyMode = activePresetId === 'survey';
      const finalScore = isSurveyMode ? questions.length : (selectedOption === currentQ.correctIndex ? score + 1 : score);
      const pct = Math.round((finalScore / questions.length) * 100);
      const approved = pct >= approvalThreshold;

      if (approved) {
        setShowConfetti(true);
        playCelebrationSound();
      }

      if (leadEmail.trim() && validateEmail(leadEmail.trim())) {
        const newLead: LeadEntry = {
          id: `lead-${Date.now()}`,
          name: leadName.trim() || 'Participante Anónimo',
          email: leadEmail.trim(),
          score: finalScore,
          total: questions.length,
          percentage: pct,
          approved: approved,
          date: new Date().toLocaleString()
        };
        const updated = [newLead, ...leads];
        setLeads(updated);
        try {
          localStorage.setItem('sorteos_trivia_leads', JSON.stringify(updated));
        } catch (e) {}
        setLeadRegistered(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setTimeLeft(timerSeconds);
    setShowConfetti(false);
    setLeadRegistered(false);
    setEmailError(null);
  };

  const loadPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setActivePresetId(preset.id);
    setQuestions(preset.questions);
    setTriviaTitle(`Trivia de ${preset.name}`);
    setRewardCode(preset.rewardCode);
    handleRestart();
    setActiveTab('play');
    if (gameSectionRef.current) {
      gameSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddQuestion = () => {
    if (!newQTitle.trim()) return;
    const validOpts = newQOpts.map((o, idx) => o.trim() || `Opción ${String.fromCharCode(65 + idx)}`);
    const q: Question = {
      id: `custom-${Date.now()}`,
      question: newQTitle.trim(),
      options: validOpts,
      correctIndex: newQCorrect
    };
    setQuestions((prev) => [...prev, q]);
    setNewQTitle('');
    setNewQOpts(['', '', '', '']);
    setNewQCorrect(0);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    handleRestart();
  };

  // Importar CSV
  const handleProcessCsv = (csvText: string) => {
    if (!csvText.trim()) return;
    const lines = csvText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const imported: Question[] = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('pregunta')) return;
      const parts = line.split(',').map((p) => p.replace(/^["']|["']$/g, '').trim());
      if (parts.length >= 3) {
        const questionText = parts[0];
        const correctVal = parts[parts.length - 1];
        let correctIdx = parseInt(correctVal, 10);
        if (isNaN(correctIdx) || correctIdx < 0) correctIdx = 0;

        const options = parts.slice(1, parts.length - 1);
        if (options.length >= 2) {
          imported.push({
            id: `csv-${Date.now()}-${idx}`,
            question: questionText,
            options,
            correctIndex: Math.min(correctIdx, options.length - 1)
          });
        }
      }
    });

    if (imported.length > 0) {
      setQuestions(imported);
      setTriviaTitle(`Trivia Personalizada (${imported.length} preguntas)`);
      handleRestart();
      setShowCsvModal(false);
      setCsvRawText('');
      alert(`¡Se importaron ${imported.length} preguntas exitosamente!`);
    } else {
      alert('Formato CSV requerido: Pregunta,Opción 1,Opción 2,Opción 3,ÍndiceCorrecto (0-3)');
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        handleProcessCsv(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Exportar Leads CSV
  const exportLeadsCSV = () => {
    const headers = 'ID,Nombre,Email,Aciertos,Total,Porcentaje,Aprobado,Fecha\n';
    const rows = leads.map(
      (l) => `${l.id},"${l.name}","${l.email}",${l.score},${l.total},${l.percentage}%,${l.approved ? 'SI' : 'NO'},"${l.date}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_trivia_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pasar a Sorteo Final
  const transferToDraw = (targetRoute: '/herramientas/lista' | '/herramientas/ruleta', source: 'podium' | 'all') => {
    let names: string[] = [];
    if (source === 'podium') {
      names = leaderboard.slice(0, 3).map((p) => p.name);
    } else {
      const approved = leaderboard.filter((p) => p.approved);
      names = approved.length > 0 ? approved.map((p) => p.name) : leaderboard.map((p) => p.name);
    }

    if (names.length === 0) {
      alert('No hay participantes registrados para sortear.');
      return;
    }

    try {
      localStorage.setItem('sorteo_imported_names', JSON.stringify(names));
    } catch (e) {
      console.error(e);
    }

    router.push(`${targetRoute}?source=trivia`);
  };

  // URLs de enlace de juego
  const publicPlayUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/trivia/jugar?pin=${encodeURIComponent(roomPin)}` 
    : `https://sorteos.pro/trivia/jugar?pin=${encodeURIComponent(roomPin)}`;

  const shortPlayUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/t/${encodeURIComponent(roomPin)}` 
    : `https://sorteos.pro/t/${encodeURIComponent(roomPin)}`;

  const embedCode = `<iframe src="${publicPlayUrl}" width="100%" height="720" frameborder="0" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" allow="autoplay"></iframe>`;

  const copyToClipboard = (text: string, type: 'link' | 'embed' | 'pin') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else if (type === 'embed') {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      } else {
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2000);
      }
    }
  };

  // Podio Top 3
  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-zinc-100 selection:bg-pink-500 selection:text-white pb-20">
      <ConfettiEffect active={showConfetti} />

      {/* Pill Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ToolSwitcher />
      </div>

      {/* ─── BANNER DE AUTENTICACIÓN / ORGANIZADOR OFICIAL ─────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {isLoggedIn ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Organizador Autenticado: Tus salas y podios en vivo se guardan automáticamente en la nube.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                Sala: {roomPin}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
              <div className="text-slate-700 dark:text-zinc-300">
                <strong>¿Quieres proyectar podios en vivo como Kahoot?</strong> Inicia sesión para tener salas permanentes y sincronizar jugadores desde sus móviles.
              </div>
            </div>
            <Link
              href="/login?redirect=/herramientas/trivia"
              className="btn-pro-primary px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión / Registro</span>
            </Link>
          </div>
        )}
      </div>

      {/* ─── HERO HEADER ESTILO APPSORTEOS + KAHOOT ───────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-16 border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Generador de Trivias & Salas en Vivo Tipo Kahoot</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Crea una Trivia Online
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Crea cuestionarios interactivos con enlace público para tus participantes, ranking de puntuación en vivo, podio animado y pase directo al bombo de sorteos.
          </p>

          {/* Sala Rápida Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 max-w-2xl mx-auto shadow-xl flex flex-wrap items-center justify-between gap-3 text-left">
            <div>
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-zinc-500">
                Enlace para Participantes:
              </div>
              <div className="font-mono text-xs font-bold text-pink-600 dark:text-purple-400 truncate max-w-xs sm:max-w-sm">
                {shortPlayUrl}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(publicPlayUrl, 'link')}
                className="btn-pro-primary px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? '¡Copiado!' : 'Copiar Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-slate-700 dark:text-zinc-300 cursor-pointer"
                title="Mostrar Código QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Value Checks de AppSorteos */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Ranking con Podio en Vivo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Link Público & Código QR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Filtro Anti-Fraude & CSV</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pase a Ruleta / Bombo SHA-256</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('leaderboard');
                if (gameSectionRef.current) {
                  gameSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-pro-primary px-7 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-pink-500/20 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Ver Podio & Ranking en Vivo</span>
            </button>
            <button
              onClick={() => setShowLiveStageFullscreen(true)}
              className="px-6 py-3.5 rounded-full text-sm font-bold border border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Radio className="w-4 h-4 text-purple-500 animate-pulse" />
              <span>Modo Proyector / Live Stage</span>
            </button>
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="px-6 py-3.5 rounded-full text-sm font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Cómo Funciona</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 pt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span>Usado por 11,362 marcas y creadores en 87 países</span>
          </div>
        </div>
      </section>

      {/* ─── WORKSPACE / MAIN INTERACTIVE APPLICATION ───────────────────── */}
      <div ref={gameSectionRef} />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Tabs (Con Podio & Ranking en Vivo) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-200/80 dark:bg-white/5 rounded-2xl border border-slate-300/60 dark:border-white/10 mb-8">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Podio & Ranking en Vivo</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black">
                {leaderboard.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('play')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'play'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Jugar Demo Local</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span>Creador & Editor</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black">
                {questions.length}Q
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Base de Datos ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('embed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'embed'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Link & Embed</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowLiveStageFullscreen(true)}
              className="px-3 py-1.5 rounded-xl font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Stage</span>
            </button>
          </div>
        </div>

        {/* ─── TAB ESTELAR: PODIO & RANKING EN VIVO (KAHOOT STYLE) ─────────── */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            
            {/* Cabecera de la Sala & Enlace de Invitación */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Sala en Vivo Activa: {roomPin}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Clasificación en Tiempo Real
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Los participantes se unen en su móvil usando el enlace y sus puntuaciones se actualizan aquí automáticamente.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => copyToClipboard(publicPlayUrl, 'link')}
                  className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Link de Juego'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLiveStageFullscreen(true)}
                  className="px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2 hover:bg-purple-100 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Pantalla Completa</span>
                </button>

                <button
                  type="button"
                  onClick={() => transferToDraw('/herramientas/lista', 'podium')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sortear Podio en Lista</span>
                </button>

                <button
                  type="button"
                  onClick={() => transferToDraw('/herramientas/ruleta', 'all')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2 cursor-pointer"
                >
                  <span>Girar Ruleta</span>
                </button>
              </div>
            </div>

            {/* ─── PODIO 3D ANIMADO (1º, 2º, 3º LUGAR KAHOOT) ──────────────── */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-950/20 via-pink-950/10 to-transparent border border-slate-200 dark:border-white/10 text-center space-y-6 shadow-xl">
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                  Podio de Honor
                </h4>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Los 3 Mejores Puntuados
                </h2>
              </div>

              {/* 3 Podio Columns */}
              <div className="flex items-end justify-center gap-3 sm:gap-6 pt-6 max-w-2xl mx-auto min-h-[300px]">
                
                {/* 2º LUGAR (Plata) */}
                <div className="flex-1 flex flex-col items-center space-y-2">
                  {secondPlace ? (
                    <>
                      <div className="text-3xl animate-bounce">{secondPlace.avatar}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                        {secondPlace.name}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                        {secondPlace.kahootPoints} pts
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-400">Esperando...</div>
                  )}
                  <div className="w-full h-36 rounded-t-3xl bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-t-4 border-slate-400 flex flex-col items-center justify-center text-slate-700 dark:text-zinc-200 shadow-lg">
                    <Medal className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-2xl font-black font-mono">2º</span>
                  </div>
                </div>

                {/* 1º LUGAR (Oro) */}
                <div className="flex-1 flex flex-col items-center space-y-2 relative -top-4">
                  {firstPlace ? (
                    <>
                      <Crown className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
                      <div className="text-4xl animate-bounce">{firstPlace.avatar}</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">
                        {firstPlace.name}
                      </div>
                      <div className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
                        {firstPlace.kahootPoints} pts
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-400">Esperando...</div>
                  )}
                  <div className="w-full h-48 rounded-t-3xl bg-gradient-to-t from-amber-400 via-amber-300 to-yellow-200 dark:from-amber-600 dark:to-amber-500 border-t-4 border-amber-300 flex flex-col items-center justify-center text-amber-950 dark:text-white shadow-2xl">
                    <Trophy className="w-10 h-10 text-amber-800 dark:text-amber-100 mb-1" />
                    <span className="text-3xl font-black font-mono">1º</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Campeón</span>
                  </div>
                </div>

                {/* 3º LUGAR (Bronce) */}
                <div className="flex-1 flex flex-col items-center space-y-2">
                  {thirdPlace ? (
                    <>
                      <div className="text-3xl animate-bounce">{thirdPlace.avatar}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                        {thirdPlace.name}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                        {thirdPlace.kahootPoints} pts
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-400">Esperando...</div>
                  )}
                  <div className="w-full h-28 rounded-t-3xl bg-gradient-to-t from-amber-700/60 to-amber-600/40 dark:from-amber-900 dark:to-amber-800 border-t-4 border-amber-600 flex flex-col items-center justify-center text-amber-900 dark:text-amber-200 shadow-md">
                    <Medal className="w-7 h-7 text-amber-600 mb-1" />
                    <span className="text-2xl font-black font-mono">3º</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── TABLA COMPLETA DE POSICIONES EN TIEMPO REAL ─────────────── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-600" />
                  <span>Todos los Participantes Registrados ({leaderboard.length})</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  Ordenado por Puntos Kahoot & Rapidez
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-500 font-mono uppercase">
                      <th className="py-3 px-3">Puesto</th>
                      <th className="py-3 px-4">Jugador</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-right">Puntos Kahoot</th>
                      <th className="py-3 px-4 text-center">Aciertos</th>
                      <th className="py-3 px-4 text-center">Tiempo</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {leaderboard.map((player, idx) => (
                      <tr key={player.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-black text-sm">
                          {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                          <span className="text-xl">{player.avatar}</span>
                          <span>{player.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-zinc-400 text-[11px]">
                          {player.email}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-pink-600 dark:text-purple-400 text-sm text-right">
                          {player.kahootPoints} pts
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-center text-slate-700 dark:text-zinc-300">
                          {player.score} / {player.total}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-center text-slate-500 dark:text-zinc-400">
                          {player.timeSeconds}s
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                            player.approved
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}>
                            {player.approved ? 'Aprobado' : 'Participó'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: JUGAR DEMO LOCAL ────────────────────────────────────── */}
        {activeTab === 'play' && (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-xl space-y-8">
            
            {!isFinished ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {triviaTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Pregunta {currentIdx + 1} de {questions.length} • Aciertos: {score}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {timerSeconds > 0 && (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-xs ${
                        timeLeft <= 5 
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 animate-pulse' 
                          : 'bg-slate-100 dark:bg-white/5 text-pink-600 dark:text-pink-400'
                      }`}>
                        <Timer className="w-3.5 h-3.5" />
                        <span>{timeLeft}s</span>
                      </div>
                    )}
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      Meta: {approvalThreshold}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <div className="py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    const isSurvey = activePresetId === 'survey';

                    let btnClasses = 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200';
                    if (isAnswered) {
                      if (isSurvey && isSelected) {
                        btnClasses = 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-200 font-bold ring-2 ring-pink-500/30';
                      } else if (isCorrect) {
                        btnClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30';
                      } else if (isSelected) {
                        btnClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold ring-2 ring-rose-500/30';
                      } else {
                        btnClasses = 'opacity-40 border-transparent';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-white/80 dark:bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm font-medium">{opt}</span>
                        </div>
                        {isAnswered && (isCorrect || isSurvey) && isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && !isSurvey && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && currentQ.explanation && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-bold">Dato clave: </span>
                    <span>{currentQ.explanation}</span>
                  </div>
                )}

                {isAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="btn-pro-primary px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-pink-500/20 hover:scale-102 transition-transform"
                    >
                      <span>{currentIdx + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultados'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6 py-6 max-w-xl mx-auto">
                {(() => {
                  const finalScore = activePresetId === 'survey' ? questions.length : score;
                  const pct = Math.round((finalScore / questions.length) * 100);
                  const approved = pct >= approvalThreshold;

                  return (
                    <>
                      <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                        approved 
                          ? 'bg-gradient-to-tr from-amber-400 to-pink-600 text-white' 
                          : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-zinc-400'
                      }`}>
                        {approved ? <Trophy className="w-10 h-10 animate-bounce" /> : <RotateCcw className="w-10 h-10" />}
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                          {approved ? '¡Felicidades, Aprobaste la Trivia!' : '¡Buen intento! Estuviste muy cerca'}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-zinc-400">
                          Respondiste correctamente <strong className="text-slate-900 dark:text-white">{finalScore}</strong> de <strong className="text-slate-900 dark:text-white">{questions.length}</strong> preguntas ({pct}% de aciertos).
                        </p>
                      </div>

                      {approved && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/30 space-y-3">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-purple-400">
                            Tu Cupón de Recompensa
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-slate-900 dark:text-white px-4 py-1.5 rounded-xl bg-white dark:bg-[#070a12] border border-pink-500/40">
                              {rewardCode}
                            </span>
                            <button
                              onClick={() => copyToClipboard(rewardCode, 'link')}
                              className="p-2.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors cursor-pointer"
                              title="Copiar cupón"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleRestart}
                          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 text-slate-700 dark:text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Volver a Jugar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('leaderboard')}
                          className="btn-pro-primary px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-pink-500/20"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Ver Podio de la Sala</span>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: CREADOR & EDITOR ────────────────────────────────────── */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Configuración de Sala & Reglas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Ajusta el PIN de la sala, cupón y reglas para tus participantes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    PIN / Código de Sala Pública
                  </label>
                  <input
                    type="text"
                    value={roomPin}
                    onChange={(e) => setRoomPin(e.target.value.toUpperCase().replace(/\s+/g, '-'))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-mono font-bold text-pink-600 dark:text-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Título de la Trivia
                  </label>
                  <input
                    type="text"
                    value={triviaTitle}
                    onChange={(e) => setTriviaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Cupón de Descuento
                  </label>
                  <input
                    type="text"
                    value={rewardCode}
                    onChange={(e) => setRewardCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Tiempo por Pregunta
                  </label>
                  <select
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={10}>10 segundos (Rápido estilo Kahoot)</option>
                    <option value={15}>15 segundos (Recomendado)</option>
                    <option value={30}>30 segundos (Tranquilo)</option>
                    <option value={0}>Sin límite de tiempo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of Questions */}
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Preguntas de la Trivia ({questions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Agrega preguntas interactivas o impórtalas con archivo CSV.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCsvModal(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-pink-600" />
                  <span>Importar CSV</span>
                </button>
              </div>

              <div className="space-y-3">
                {questions.map((q, qIndex) => (
                  <div 
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-mono font-bold">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {q.question}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className={`px-2 py-1 rounded-md border truncate ${
                              oIdx === q.correctIndex 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-30 cursor-pointer"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Question Form */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-zinc-400">
                  + Agregar Nueva Pregunta Manual
                </h4>

                <input
                  type="text"
                  placeholder="Escribe el enunciado de la pregunta..."
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070a12] text-sm text-slate-900 dark:text-white"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newQOpts.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQCorrect === idx}
                        onChange={() => setNewQCorrect(idx)}
                        className="accent-pink-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewQOpts((prev) => {
                            const updated = [...prev];
                            updated[idx] = val;
                            return updated;
                          });
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-[#070a12] text-slate-900 dark:text-white ${
                          newQCorrect === idx ? 'border-pink-500 ring-1 ring-pink-500' : 'border-slate-200 dark:border-white/10'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn-pro-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar Pregunta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: LEADS / PARTICIPANTES ───────────────────────────────── */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Base de Datos & Leads de Jugadores ({leads.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Registros protegidos con validación Anti-Fraude.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={exportLeadsCSV}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-pink-600" />
                  <span>Exportar .CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => transferToDraw('/herramientas/lista', 'all')}
                  className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Sortear Todos</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <th className="py-3 px-4">Participante</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Aciertos</th>
                    <th className="py-3 px-4">Porcentaje</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-purple-950 text-pink-600 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                          {l.name[0]}
                        </div>
                        <span>{l.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-zinc-400">{l.email}</td>
                      <td className="py-3 px-4 font-mono font-bold">{l.score} / {l.total}</td>
                      <td className="py-3 px-4 font-mono font-bold">{l.percentage}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                          l.approved 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}>
                          {l.approved ? 'Aprobado' : 'Participó'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 5: LINK & EMBED ────────────────────────────────────────── */}
        {activeTab === 'embed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-pink-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enlace Público Directo para Jugadores
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Comparte este link en historias de Instagram, transmisiones en vivo, TikTok o WhatsApp.
              </p>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <input
                  type="text"
                  readOnly
                  value={publicPlayUrl}
                  className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-zinc-300 px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(publicPlayUrl, 'link')}
                  className="btn-pro-primary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {copiedLink ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              {/* Botón QR */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-pink-600" />
                  <span>Ver Código QR para Proyectar en Pantalla</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-pink-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Widget Iframe para tu Sitio Web o E-Commerce
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Inserta este código en Shopify, WordPress, WooCommerce, Squarespace o Wix para embeber la trivia.
              </p>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <input
                  type="text"
                  readOnly
                  value={embedCode}
                  className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-zinc-300 px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(embedCode, 'embed')}
                  className="btn-pro-primary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {copiedEmbed ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── MODAL PROYECTOR / LIVE STAGE ARENA ───────────────────────────── */}
      {showLiveStageFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#070a13] text-white flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white">
                  Sorteos Pro Live Arena • PIN: {roomPin}
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Únete en tu móvil: <span className="text-pink-400 font-bold">{shortPlayUrl}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => transferToDraw('/herramientas/lista', 'podium')}
                className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Sortear Podio en Bombo</span>
              </button>
              <button
                onClick={() => setShowLiveStageFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Podio Gigante Proyectable */}
          <div className="my-auto py-10 max-w-4xl mx-auto w-full text-center space-y-8">
            <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400">
              ¡PODIO FINAL EN VIVO!
            </h1>

            <div className="flex items-end justify-center gap-6 sm:gap-10 pt-10 min-h-[360px]">
              {/* 2º Lugar */}
              <div className="flex-1 flex flex-col items-center space-y-2">
                {secondPlace ? (
                  <>
                    <div className="text-5xl animate-bounce">{secondPlace.avatar}</div>
                    <div className="text-base font-bold text-white truncate max-w-[140px]">{secondPlace.name}</div>
                    <div className="text-sm font-mono font-bold text-zinc-400">{secondPlace.kahootPoints} pts</div>
                  </>
                ) : <div className="text-zinc-600">Esperando...</div>}
                <div className="w-full h-44 rounded-t-3xl bg-gradient-to-t from-slate-800 to-slate-700 border-t-4 border-slate-400 flex flex-col items-center justify-center shadow-xl">
                  <span className="text-4xl font-black font-mono">2º</span>
                </div>
              </div>

              {/* 1º Lugar */}
              <div className="flex-1 flex flex-col items-center space-y-2 relative -top-6">
                {firstPlace ? (
                  <>
                    <Crown className="w-10 h-10 text-amber-400 fill-amber-400 animate-pulse" />
                    <div className="text-6xl animate-bounce">{firstPlace.avatar}</div>
                    <div className="text-lg font-black text-white truncate max-w-[160px]">{firstPlace.name}</div>
                    <div className="text-base font-mono font-bold text-pink-400">{firstPlace.kahootPoints} pts</div>
                  </>
                ) : <div className="text-zinc-600">Esperando...</div>}
                <div className="w-full h-60 rounded-t-3xl bg-gradient-to-t from-amber-600 to-amber-500 border-t-4 border-amber-300 flex flex-col items-center justify-center text-white shadow-2xl">
                  <Trophy className="w-12 h-12 text-amber-200 mb-1" />
                  <span className="text-5xl font-black font-mono">1º</span>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="flex-1 flex flex-col items-center space-y-2">
                {thirdPlace ? (
                  <>
                    <div className="text-5xl animate-bounce">{thirdPlace.avatar}</div>
                    <div className="text-base font-bold text-white truncate max-w-[140px]">{thirdPlace.name}</div>
                    <div className="text-sm font-mono font-bold text-zinc-400">{thirdPlace.kahootPoints} pts</div>
                  </>
                ) : <div className="text-zinc-600">Esperando...</div>}
                <div className="w-full h-32 rounded-t-3xl bg-gradient-to-t from-amber-900 to-amber-800 border-t-4 border-amber-600 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-4xl font-black font-mono">3º</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono border-t border-white/10 pt-4">
            <span>Sorteos Pro • Live Kahoot Engine</span>
            <span>Total Jugadores: {leaderboard.length}</span>
          </div>
        </div>
      )}

      {/* ─── MODAL QR GIGANTE ────────────────────────────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-sm w-full p-6 text-center space-y-5 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-pink-600 dark:text-purple-400">
                Escanear para Jugar
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Código QR de la Sala
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Apunta con la cámara de tu smartphone para unirte a la partida al instante.
              </p>
            </div>

            {/* QR Mockup Visual SVG High Quality */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-inner flex flex-col items-center justify-center space-y-3">
              <QrCode className="w-44 h-44 text-slate-900" />
              <div className="font-mono text-xs font-black text-slate-900 bg-pink-100 px-3 py-1 rounded-full">
                PIN: {roomPin}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 truncate">
              {shortPlayUrl}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL CSV IMPORTER ─────────────────────────────────────────── */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowCsvModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Importar Preguntas desde .CSV
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Sube tu archivo .CSV o pega las líneas directamente:
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-zinc-300">
              Formato: Pregunta,Opción 1,Opción 2,Opción 3,Opción 4,ÍndiceCorrecto(0-3)
            </div>

            <textarea
              rows={5}
              placeholder={`¿Cuál es la capital de Italia?,Roma,Milán,Nápoles,0\n¿Cuántos días tiene un año bisiesto?,364,365,366,2`}
              value={csvRawText}
              onChange={(e) => setCsvRawText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070a12] text-xs font-mono text-slate-900 dark:text-white"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div>
                <input
                  type="file"
                  ref={csvFileInputRef}
                  accept=".csv,.txt"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => csvFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 cursor-pointer"
                >
                  Subir Archivo .CSV
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleProcessCsv(csvRawText)}
                className="btn-pro-primary px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Procesar e Importar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL MIRA CÓMO FUNCIONA ───────────────────────────────────── */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowHowItWorksModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-pink-600 dark:text-pink-400">
                Guía de Uso Profesional
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cómo Organizar tu Trivia Tipo Kahoot
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">1</span>
                  <span>Configura tu Sala y Preguntas</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Elige las preguntas, el cupón de premio y define el PIN de tu sala (ej: TRIVIA-PRO).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">2</span>
                  <span>Comparte el Enlace o Código QR</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Pasa el link a tus seguidores en redes, alumnos o proyecta el QR en tu tienda o stream.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">3</span>
                  <span>Los Participantes Juegan en su Móvil</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Eligen avatar, responden a contrarreloj y suman puntos Kahoot por velocidad y rachas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">4</span>
                  <span>Proyecta el Podio y Sortea</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  El 1º, 2º y 3º lugar se coronan en el podio gigante y puedes pasarlos con 1 clic al bombo SHA-256.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHowItWorksModal(false);
                setActiveTab('leaderboard');
              }}
              className="w-full py-3 rounded-full btn-pro-primary text-xs font-bold cursor-pointer"
            >
              ¡Ver Podio en Vivo!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
