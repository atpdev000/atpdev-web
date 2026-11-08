"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Sparkles, Shuffle, Copy, Check, ShieldAlert, 
  Trophy, ShieldCheck, Volume2, VolumeX, Maximize2, Minimize2, Share2, Tv,
  Crown, Edit2, Download, Plus, Minus, ArrowRight, Layers, FileSpreadsheet, RefreshCw
} from 'lucide-react';
import { divideIntoTeams, generateSha256Hash } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { 
  playCardFlip, playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';
import { AdBanner } from '@/components/AdBanner';
import { ListFileImporter } from '@/components/ListFileImporter';
import { ExportResultHub } from '@/components/ExportResultHub';

interface TeamResult {
  teamNumber: number;
  name: string;
  members: string[];
  captain?: string;
}

interface NamingPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  generator: (index: number) => string;
}

const NAMING_PRESETS: NamingPreset[] = [
  {
    id: 'alphabet',
    name: '🔤 Abecedario (Equipo A, B, C...)',
    description: 'Nomenclatura limpia y universal por letras',
    icon: '🔤',
    generator: (i) => {
      const letter = String.fromCharCode(65 + (i % 26));
      const round = i >= 26 ? `-${Math.floor(i / 26) + 1}` : '';
      return `Equipo ${letter}${round}`;
    }
  },
  {
    id: 'numbers',
    name: '🔢 Números (Equipo 1, 2, 3...)',
    description: 'Secuencia numérica directa y ordenada',
    icon: '🔢',
    generator: (i) => `Equipo ${i + 1}`
  },
  {
    id: 'colors',
    name: '🎨 Colores (Rojo, Azul, Verde...)',
    description: 'Colores llamativos con distintivo visual',
    icon: '🎨',
    generator: (i) => {
      const colors = [
        '🔴 Equipo Rojo', '🔵 Equipo Azul', '🟢 Equipo Verde', '🟡 Equipo Amarillo', 
        '🟣 Equipo Morado', '🟠 Equipo Naranja', '⚪ Equipo Blanco', '⚫ Equipo Negro', 
        '🟤 Equipo Marrón', '💖 Equipo Rosa', '🩵 Equipo Celeste', '🪙 Equipo Dorado', 
        '🩶 Equipo Plateado', '🌿 Equipo Esmeralda', '🍇 Equipo Violeta', '🌊 Equipo Turquesa',
        '🔥 Equipo Carmesí', '🍋 Equipo Lima', '🍫 Equipo Bronce', '🌌 Equipo Índigo'
      ];
      return colors[i % colors.length] || `Equipo Color ${i + 1}`;
    }
  },
  {
    id: 'epic',
    name: '🛡️ Épico & Mitológico (Titanes, Fénix...)',
    description: 'Nombres legendarios para torneos o dinámicas',
    icon: '🛡️',
    generator: (i) => {
      const epicNames = [
        '🛡️ Titanes', '🦅 Fénix', '🐉 Dragones', '⚔️ Centinelas', 
        '⚡ Espartanos', '🛡️ Valkirias', '🏹 Gladiadores', '🐺 Vikingos', 
        '🗡️ Samuráis', '🏛️ Olimpo', '🏹 Amazonas', '🐎 Centauros', 
        '🦁 Quimeras', '🔥 Pegasos', '👑 Paladines', '🌑 Sombras',
        '⚡ Trueno', '🦁 Bestias Indomables'
      ];
      return epicNames[i % epicNames.length] || `Guerreros ${i + 1}`;
    }
  },
  {
    id: 'elements',
    name: '⚡ Elementos Naturales (Fuego, Relámpago...)',
    description: 'Fuerzas de la naturaleza y fenómenos climáticos',
    icon: '⚡',
    generator: (i) => {
      const elements = [
        '⚡ Relámpago', '🔥 Fuego', '🌊 Tsunami', '🌪️ Tormenta', 
        '🌋 Volcán', '☄️ Meteoro', '❄️ Ventisca', '☀️ Rayo Solar', 
        '🌱 Terremoto', '🌪️ Ciclón', '🧊 Glaciar', '⚡ Trueno', 
        '🌊 Marea Alta', '🌪️ Huracán', '🌌 Aurora', '🪨 Roca Firme'
      ];
      return elements[i % elements.length] || `Elemento ${i + 1}`;
    }
  },
  {
    id: 'animals',
    name: '🦁 Animales Salvajes (Leones, Tigres...)',
    description: 'Especies veloces y depredadores de la selva',
    icon: '🦁',
    generator: (i) => {
      const animals = [
        '🦁 Leones', '🐯 Tigres', '🦅 Águilas', '🐺 Lobos', 
        '🐆 Panteras', '🦈 Tiburones', '🐻 Osos', '🦊 Zorros', 
        '🐍 Cobras', '🦏 Rinocerontes', '🦅 Halcones', '🐊 Cocodrilos', 
        '🦍 Gorilas', '🐆 Jaguares', '🐂 Toros', '🦇 Murciélagos'
      ];
      return animals[i % animals.length] || `Animales ${i + 1}`;
    }
  },
  {
    id: 'space',
    name: '🪐 Galaxias & Planetas (Cosmos, Saturno...)',
    description: 'Cuerpos celestes, constelaciones y el universo',
    icon: '🪐',
    generator: (i) => {
      const space = [
        '🪐 Saturno', '🚀 Orión', '🌌 Vía Láctea', '☄️ Andrómeda', 
        '🌑 Eclipse', '☀️ Solaris', '🌍 Neptuno', '🛸 Cosmos', 
        '🌕 Lunar', '✨ Nebula', '🔴 Marte', '⚡ Júpiter', 
        '☄️ Cometa Halley', '🌌 Supernova', '🔭 Pulsar', '🌠 Quasar'
      ];
      return space[i % space.length] || `Planeta ${i + 1}`;
    }
  },
  {
    id: 'nato',
    name: '📻 Alfabeto Militar OTAN (Alfa, Bravo...)',
    description: 'Código fonético internacional aeronáutico',
    icon: '📻',
    generator: (i) => {
      const nato = [
        'Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 
        'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 
        'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 
        'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'
      ];
      return `Equipo ${nato[i % nato.length] || i + 1}`;
    }
  },
  {
    id: 'heroes',
    name: '🦸 Superhéroes (Vengadores, Guardianes...)',
    description: 'Equipos de cómics, justicieros y defensores',
    icon: '🦸',
    generator: (i) => {
      const heroes = [
        '🦸 Vengadores', '🛡️ Guardianes', '⚡ Justicieros', '🦇 Vigilantes', 
        '🔮 Hechiceros', '🏹 Titanes', '⚔️ Paladines', '💥 Defensores', 
        '🌟 Campeones', '🔥 Centellas', '⚡ Relámpagos', '🚀 Pioneros'
      ];
      return heroes[i % heroes.length] || `Superhéroes ${i + 1}`;
    }
  },
  {
    id: 'cities',
    name: '🌍 Ciudades del Mundo (Tokio, París...)',
    description: 'Metrópolis globales e icónicas para competencias',
    icon: '🌍',
    generator: (i) => {
      const cities = [
        '🗼 París', '🗽 Nueva York', '⛩️ Tokio', '🏛️ Roma', 
        '🎡 Londres', '🏜️ El Cairo', '🏰 Madrid', '🌉 San Francisco', 
        '🕌 Estambul', '🇦🇷 Buenos Aires', '🇵🇪 Cusco', '🇧🇷 Río', 
        '🇨🇴 Medellín', '🇲🇽 CDMX'
      ];
      return cities[i % cities.length] || `Ciudad ${i + 1}`;
    }
  },
  {
    id: 'custom',
    name: '✏️ Prefijo Personalizado (Grupo, Sala, Mesa...)',
    description: 'Escribe tu propio prefijo y se numerará en orden',
    icon: '✏️',
    generator: (i) => `Grupo ${i + 1}`
  }
];

export default function EquiposPage() {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState<string>(
    "Alejandro\nBeatriz\nCarlos\nDaniela\nEduardo\nFernanda\nGabriel\nHelena\nIgnacio\nJimena\nKevin\nLaura"
  );
  
  // Modos de división: por número de equipos vs integrantes por equipo
  const [splitMode, setSplitMode] = useState<'by_teams' | 'by_members'>('by_teams');
  const [teamCount, setTeamCount] = useState<number>(3);
  const [membersPerTeam, setMembersPerTeam] = useState<number>(3);

  // Estilo de nombres
  const [selectedPresetId, setSelectedPresetId] = useState<string>('alphabet');
  const [customPrefix, setCustomPrefix] = useState<string>('Grupo');

  // Resultados
  const [teams, setTeams] = useState<TeamResult[]>([]);
  const [editingTeamIdx, setEditingTeamIdx] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>('');

  // Estados visuales y de control
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [copiedTeam, setCopiedTeam] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggleSound = () => {
    setMuted(toggleAudioMute());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const participantsList = useMemo(() => {
    return inputText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [inputText]);

  // Cálculo del número efectivo de equipos a crear
  const effectiveTeamCount = useMemo(() => {
    if (splitMode === 'by_teams') {
      return Math.max(2, teamCount);
    }
    const count = participantsList.length;
    if (count <= 1 || membersPerTeam <= 0) return 2;
    return Math.max(2, Math.ceil(count / membersPerTeam));
  }, [splitMode, teamCount, membersPerTeam, participantsList.length]);

  // Cálculo de distribución prevista
  const distributionSummary = useMemo(() => {
    const total = participantsList.length;
    if (total < 2) return null;
    const n = Math.min(effectiveTeamCount, total);
    if (n < 2) return null;
    const base = Math.floor(total / n);
    const remainder = total % n;
    if (remainder === 0) {
      return `${n} equipos de ${base} integrantes cada uno (100% equilibrado)`;
    }
    return `${remainder} equipo${remainder > 1 ? 's' : ''} de ${base + 1} y ${n - remainder} de ${base} integrantes`;
  }, [participantsList.length, effectiveTeamCount]);

  const handleStartDraw = () => {
    setError('');
    if (participantsList.length < 2) {
      setError('Ingresa al menos 2 participantes para poder armar equipos.');
      return;
    }
    if (effectiveTeamCount < 2) {
      setError('Debes formar al menos 2 equipos.');
      return;
    }
    if (effectiveTeamCount > participantsList.length) {
      setError(`No puedes crear ${effectiveTeamCount} equipos con solo ${participantsList.length} participantes.`);
      return;
    }

    setShowCountdown(true);
  };

  const executeGeneration = async () => {
    setShowCountdown(false);
    setIsGenerating(true);
    setShowConfetti(false);

    try {
      const rawTeams = divideIntoTeams(participantsList, effectiveTeamCount);
      const activePreset = NAMING_PRESETS.find((p) => p.id === selectedPresetId) || NAMING_PRESETS[0];

      const formatted: TeamResult[] = rawTeams.map((t, idx) => {
        let name: string;
        if (selectedPresetId === 'custom') {
          name = `${customPrefix.trim() || 'Equipo'} ${idx + 1}`;
        } else {
          name = activePreset.generator(idx);
        }
        return {
          teamNumber: t.teamNumber,
          name,
          members: t.members
        };
      });

      setTeams(formatted);
      const hash = await generateSha256Hash(`teams-${Date.now()}-${participantsList.join(',')}`);
      setAuditHash(hash);
      setShowConfetti(true);
      playCardFlip();
      playWinnerFanfare();
    } catch (err: any) {
      setError(err.message || 'Error al armar equipos');
    } finally {
      setIsGenerating(false);
    }
  };

  // Asignar Capitán al azar a un equipo específico
  const handleAssignCaptain = (teamIdx: number) => {
    setTeams((prev) =>
      prev.map((team, idx) => {
        if (idx !== teamIdx) return team;
        if (team.members.length === 0) return team;
        const randomMember = team.members[Math.floor(Math.random() * team.members.length)];
        return { ...team, captain: randomMember };
      })
    );
  };

  // Asignar Capitán a todos los equipos
  const handleAssignAllCaptains = () => {
    setTeams((prev) =>
      prev.map((team) => {
        if (team.members.length === 0) return team;
        const randomMember = team.members[Math.floor(Math.random() * team.members.length)];
        return { ...team, captain: randomMember };
      })
    );
  };

  // Renombrar equipo inline
  const handleSaveTeamName = (idx: number) => {
    if (!editingNameValue.trim()) {
      setEditingTeamIdx(null);
      return;
    }
    setTeams((prev) =>
      prev.map((team, i) => (i === idx ? { ...team, name: editingNameValue.trim() } : team))
    );
    setEditingTeamIdx(null);
    setEditingNameValue('');
  };

  const handleCopyTeam = (idx: number, team: TeamResult) => {
    const text = `${team.name} (${team.members.length} integrantes):\n` +
      team.members.map((m) => (m === team.captain ? `⭐ ${m} (Capitán)` : `• ${m}`)).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedTeam(idx);
    setTimeout(() => setCopiedTeam(null), 2000);
  };

  const handleCopyAll = () => {
    const header = `🏆 SORTEO DE EQUIPOS EQUILIBRADOS\nGenerado con Sorteos Pro (${teams.length} equipos)\n\n`;
    const body = teams
      .map(
        (t) =>
          `${t.name} (${t.members.length} integrantes):\n` +
          t.members.map((m) => (m === t.captain ? `⭐ ${m} (Capitán)` : `• ${m}`)).join('\n')
      )
      .join('\n\n');
    const footer = auditHash ? `\n\n🔒 Certificado SHA-256: ${auditHash}` : '';
    navigator.clipboard.writeText(header + body + footer);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Exportar a CSV
  const handleDownloadCsv = () => {
    const rows = [['Equipo', 'Nro', 'Participante', 'Capitán']];
    teams.forEach((t) => {
      t.members.forEach((m, idx) => {
        rows.push([t.name, String(idx + 1), m, m === t.captain ? 'SÍ' : 'NO']);
      });
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `equipos-sorteopro-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportedNames = (newNames: string[], mode: 'replace' | 'append', fileName: string) => {
    if (mode === 'append' && inputText.trim()) {
      setInputText((prev) => `${prev.trim()}\n${newNames.join('\n')}`);
    } else {
      setInputText(newNames.join('\n'));
    }
    playCardFlip();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Barra de Navegación de Herramientas (100% Responsiva con Scroll y Flechas) */}
      <ToolSwitcher />
      {showConfetti && <ConfettiEffect />}

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title={t('countdown_shuffling_teams')}
        onComplete={executeGeneration}
      />

      {/* Hero Header Estilo Pro */}
      <div className="text-center pt-2 sm:pt-4 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-300 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          <span>Generador Aleatorio Criptográfico CSPRNG</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
          Generador de <span className="text-pink-600 dark:text-purple-400">Equipos al Azar</span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Divide listas de participantes en grupos equitativos y balanceados. Elige estilo de nombres por 
          <strong> abecedario, números, colores o temáticas</strong> y exporta al instante.
        </p>

        {/* Small Audio & Screen Controls */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shadow-xs"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-600 dark:text-purple-400" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shadow-xs"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-pink-600 dark:text-purple-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {teams.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="py-2 px-3.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-pink-200 dark:border-pink-900/30 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('btn_export')}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLiveStream(true)}
                className="py-2 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200 dark:border-purple-900/30 shadow-xs"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Modo Pantalla Gigante</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Form Configuration Container */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Participants Textarea (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="equipos-textarea" className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                <span>Participantes ({participantsList.length})</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInputText("Alejandro\nBeatriz\nCarlos\nDaniela\nEduardo\nFernanda\nGabriel\nHelena\nIgnacio\nJimena\nKevin\nLaura\nMartín\nNatalia\nOscar\nPatricia")}
                  className="text-xs text-pink-600 hover:text-pink-700 dark:text-purple-400 hover:underline transition-colors font-medium cursor-pointer"
                >
                  Cargar Demo
                </button>
                <span className="text-slate-300 dark:text-zinc-700">•</span>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-xs text-slate-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors font-medium cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <textarea
              id="equipos-textarea"
              name="equiposTextarea"
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ingresa un nombre por línea:&#10;Carlos&#10;María&#10;Juan..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:border-pink-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-pink-500/10 resize-none transition-all shadow-inner font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 px-1 font-mono">
              <span>{participantsList.length} participantes detectados</span>
              <span>1 nombre por línea</span>
            </div>

            {/* Zona de Subida y Conversión Inteligente (Word, Excel, PDF, CSV, Imagen OCR) */}
            <ListFileImporter onImport={handleImportedNames} currentCount={participantsList.length} />
          </div>

          {/* Right Column: Configuration & Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Selector de Modo de División (Pestañas Segmentadas) */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  Modo de División:
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setSplitMode('by_teams')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      splitMode === 'by_teams'
                        ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-white/10'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-pink-600 dark:text-purple-400" />
                    <span>Por Cantidad de Equipos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('by_members')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      splitMode === 'by_members'
                        ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-white/10'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-pink-600 dark:text-purple-400" />
                    <span>Por Integrantes por Equipo</span>
                  </button>
                </div>
              </div>

              {/* Selector de Cantidad según el Modo */}
              {splitMode === 'by_teams' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                      Número de Equipos a Formar:
                    </label>
                    <span className="text-xs font-mono font-bold text-pink-600 dark:text-purple-400">
                      {teamCount} equipos
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-6 gap-1.5 flex-1">
                      {[2, 3, 4, 5, 6, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTeamCount(num)}
                          className={`py-2 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer border ${
                            teamCount === num
                              ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    {/* Stepper para valores personalizados */}
                    <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setTeamCount((prev) => Math.max(2, prev - 1))}
                        disabled={teamCount <= 2}
                        aria-label="Disminuir equipos"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {teamCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTeamCount((prev) => Math.min(Math.max(2, participantsList.length), prev + 1))}
                        disabled={teamCount >= Math.max(2, participantsList.length)}
                        aria-label="Aumentar equipos"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                      Integrantes por Cada Grupo:
                    </label>
                    <span className="text-xs font-mono font-bold text-pink-600 dark:text-purple-400">
                      {membersPerTeam} por equipo ({effectiveTeamCount} equipos resultantes)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-5 gap-1.5 flex-1">
                      {[2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setMembersPerTeam(num)}
                          className={`py-2 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer border ${
                            membersPerTeam === num
                              ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {num} pers.
                        </button>
                      ))}
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setMembersPerTeam((prev) => Math.max(1, prev - 1))}
                        disabled={membersPerTeam <= 1}
                        aria-label="Disminuir integrantes"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {membersPerTeam}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMembersPerTeam((prev) => prev + 1)}
                        aria-label="Aumentar integrantes"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selector de Estilo de Nombres (Abecedario, Números, Colores, etc.) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  Estilo de Nombres para los Equipos:
                </label>
                
                <div className="relative">
                  <select
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                    aria-label="Estilo de nombres para los equipos"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-pink-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-pink-500/10 shadow-xs cursor-pointer appearance-none"
                  >
                    {NAMING_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>

                {/* Si elige estilo personalizado, mostrar input de prefijo */}
                {selectedPresetId === 'custom' && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-mono">Prefijo:</span>
                    <input
                      type="text"
                      value={customPrefix}
                      onChange={(e) => setCustomPrefix(e.target.value)}
                      placeholder="Ej. Sala, Mesa, Cuadrilla, Proyecto..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}
              </div>

              {/* Resumen del Reparto */}
              {distributionSummary && (
                <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-800/30 flex items-center gap-2.5 text-xs text-pink-900 dark:text-pink-200 font-medium">
                  <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                  <span>{distributionSummary}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Button: ¡Armar Equipos Ahora! */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleStartDraw}
              className="w-full py-4 px-6 text-base sm:text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 active:scale-[0.99] disabled:opacity-50 text-white font-black rounded-2xl shadow-lg hover:shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all uppercase tracking-wider font-display"
            >
              <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generando Equipos...' : '¡Armar Equipos Ahora!'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teams Results Display Container */}
      {teams.length > 0 && (
        <div className="space-y-6 animate-fade-in pt-2">
          {/* Header de Resultados con Botones de Acción Rápida */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  Equipos Formados ({teams.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  {participantsList.length} participantes distribuidos aleatoriamente
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAssignAllCaptains}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-900/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Elegir un capitán aleatorio por cada equipo"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Asignar Capitanes</span>
              </button>

              {/* Botón Hub de Exportación: PDF, Word, Excel, Imagen */}
              <ExportResultHub 
                teams={teams}
                drawTitle="División de Equipos al Azar"
                auditHash={auditHash}
                captureElementId="teams-results-container"
                onCopyAll={handleCopyAll}
                copiedAll={copiedAll}
              />

              <button
                type="button"
                onClick={handleStartDraw}
                className="px-3.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-pink-900/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Volver a sortear con la misma lista"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-sortear</span>
              </button>
            </div>
          </div>

          {/* Grid de Tarjetas de Equipos (Capturable para Imagen HD) */}
          <div id="teams-results-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((team, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-pink-300 dark:hover:border-purple-500/40 transition-all space-y-4 relative group"
              >
                {/* Cabecera del Equipo con Edición y Copia */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                  {editingTeamIdx === idx ? (
                    <div className="flex items-center gap-1 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingNameValue}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveTeamName(idx)}
                        autoFocus
                        className="w-full px-2 py-1 text-sm font-bold rounded-lg border border-pink-500 bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveTeamName(idx)}
                        className="p-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display truncate">
                        {team.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeamIdx(idx);
                          setEditingNameValue(team.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-opacity p-0.5"
                        title="Editar nombre de este equipo"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAssignCaptain(idx)}
                      className="p-1.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                      title="Elegir capitán al azar para este equipo"
                    >
                      <Crown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyTeam(idx, team)}
                      className="p-1.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                      title="Copiar lista de este equipo"
                    >
                      {copiedTeam === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lista de Integrantes */}
                <div className="space-y-2">
                  {team.members.map((member, mIdx) => {
                    const isCaptain = member === team.captain;
                    return (
                      <div
                        key={mIdx}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                          isCaptain
                            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/40 text-amber-950 dark:text-amber-100 font-bold'
                            : 'bg-slate-50 dark:bg-[#1e293b]/60 border-slate-100 dark:border-white/5 text-slate-800 dark:text-zinc-200 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0 ${
                            isCaptain 
                              ? 'bg-amber-500 text-white shadow-xs' 
                              : 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300'
                          }`}>
                            {mIdx + 1}
                          </span>
                          <span className="truncate">{member}</span>
                        </div>

                        {isCaptain && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full shrink-0">
                            <Crown className="w-3 h-3" />
                            <span>Capitán</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pie de tarjeta con conteo */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-white/5 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                  <span>Equipo #{team.teamNumber}</span>
                  <span className="font-semibold text-slate-600 dark:text-zinc-300">{team.members.length} miembros</span>
                </div>
              </div>
            ))}
          </div>

          {/* Audit Hash Cryptographic Guarantee */}
          {auditHash && (
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-3 text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold">Huella Criptográfica SHA-256 (Inmutable):</span>
              </div>
              <span className="text-slate-500 dark:text-zinc-400 break-all bg-white dark:bg-black/30 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 select-all">
                {auditHash}
              </span>
            </div>
          )}
        </div>
      )}

      {/* AdSense Ad Placement */}
      <div className="pt-4">
        <AdBanner format="horizontal" />
      </div>

      {/* Live Stream Stage Modal */}
      {teams.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="División de Equipos"
          winner={`Formados: ${teams.map((t) => t.name).join(', ')}`}
          auditHash={auditHash}
          platform="Generador de Equipos"
          onReroll={handleStartDraw}
        />
      )}

      {/* Winner Export Modal */}
      {teams.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={`Equipos: ${teams.map((t) => `${t.name} (${t.members.length})`).join(' vs ')}`}
          drawTitle="División de Equipos"
          auditHash={auditHash}
          platform="Equipos Equilibrados"
        />
      )}
    </div>
  );
}
