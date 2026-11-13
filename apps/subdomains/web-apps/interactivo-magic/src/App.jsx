import React, { useState, useEffect } from 'react';
import {
  Heart, Send, Gift, Sparkles, Download, ArrowRight, Music, Calendar, User,
  Link as LinkIcon, Check, Menu, X, Star, Zap, Users, Share2, Search,
  Filter, Gamepad, BookOpen, UserPlus, Image, Music2, Camera, Clock,
  Stamp, Shirt, Ghost, Pill, Layers, RefreshCcw, Smile, PartyPopper,
  TreePine, Flame, Eye, Lock, Minus, ChevronUp, ChevronDown, Disc,
  ChevronLeft, ChevronRight, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateEngine from './utils/TemplateEngine';
// Version: 1.2.0 - UI Updates & New Template Previews
import confetti from 'canvas-confetti';
import {
  GALAXY_TEMPLATE, LOVE_TEMPLATE, BIRTHDAY_TEMPLATE,
  BOOK_LOVE_TEMPLATE, MARVEL_BOOK_TEMPLATE, GALAXY_GENERATOR_TEMPLATE,
  MUSICAL_SPHERE_TEMPLATE, PROPOSAL_TEMPLATE, FORGIVE_ME_CATS_TEMPLATE,
  PUZZLE_LOVE_TEMPLATE, RULETA_LOVE_TEMPLATE, FORGIVE_ME_PENGUINS_TEMPLATE,
  FLOWERS_RAMO_TEMPLATE, ENOJONA_TEMPLATE, DATE_COUNTER_TEMPLATE,
  LOVE_CERTIFICATE_TEMPLATE, COUPLE_INITIALS_TEMPLATE, ENCHANTED_LETTER_TEMPLATE,
  LOVE_VITAMINS_TEMPLATE, SCRATCH_MESSAGE_TEMPLATE, SOCCER_CARD_TEMPLATE,
  BIRTHDAY_LAMP_TEMPLATE, DEDICATE_SONG_TEMPLATE,
  BE_MY_BOYFRIEND_TEMPLATE, TE_AMO_TEMPLATE, BE_FRIENDS_TEMPLATE,
  HEART_PHOTO_TEMPLATE, OUR_YEAR_TEMPLATE, CHRISTMAS_TREE_TEMPLATE,
  NEW_YEAR_TEMPLATE, LOVE_CUBE_TEMPLATE, HIDDEN_MESSAGE_TEMPLATE
} from './templates';
import { isNativePlatform, shareContent, shareHTMLFile } from './utils/platformUtils';
import { getBaseUrl, SHORTENER_API } from './config/appConfig';
import { shortenUrl } from './utils/urlShortener';
import { initializeAdMob, showBannerAd, showRewardedAd, showInterstitial, prepareRewardedAd, hideBannerAd } from './utils/admobUtils';
import { getAdSenseClientId } from './config/adsenseConfig';
import UpdateNotification from './components/UpdateNotification';
import { DOWNLOAD_LINKS } from './config/versionConfig';
import './styles/index.css';

const CATEGORIES = [
  { id: 'todos', name: 'Todos', icon: <Layers size={18} /> },
  { id: 'amor', name: 'Amor', icon: <Heart size={18} /> },
  { id: 'juegos', name: 'Juegos', icon: <Gamepad size={18} /> },
  { id: 'eventos', name: 'Eventos', icon: <Calendar size={18} /> },
  { id: 'divertido', name: 'Divertido', icon: <Smile size={18} /> }
];

const TEMPLATES = [
  {
    id: 'love',
    category: 'amor',
    name: 'Galaxia de Amor',
    description: 'Corazones flotantes y estrellas animadas.',
    icon: <Heart />,
    color: '#ff4d94',
    content: GALAXY_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasExtra: false,
    preview: '/previews/1. Galaxia de Amor.jpeg'
  },
  {
    id: 'book-love',
    category: 'amor',
    name: 'Libro del Amor',
    description: 'Carta digital con efecto libro 3D.',
    icon: <BookOpen />,
    color: '#ff4d94',
    content: BOOK_LOVE_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasItems: true,
    pageOffset: 3,
    previews: ['/previews/2. Libro de Amor.jpeg', '/previews/2.1. Libro de Amor.png']
  },
  {
    id: 'marvel-book',
    category: 'divertido',
    name: 'Libro Marvel ❤️',
    description: 'Versión especial de superhéroes.',
    icon: <Zap />,
    color: '#ed1d24',
    content: MARVEL_BOOK_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasItems: true,
    pageOffset: 3,
    previews: ['/previews/3. Libro Marvel.jpeg', '/previews/3.1 Libro Marvel.png']
  },
  {
    id: 'galaxy-gen',
    category: 'amor',
    name: 'Generador de Galaxia ⭐',
    description: 'Escribe nombres y frases estelares.',
    icon: <Star />,
    color: '#7000ff',
    content: GALAXY_GENERATOR_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Palabras flotantes (separadas por comas)',
    hideRecipientName: false
    ,
    preview: '/previews/4. Generador Galaxia.jpeg'
  },
  {
    id: 'musical-sphere',
    category: 'amor',
    name: 'Esfera Musical 🎶',
    description: 'Esfera 3D que vibra con tu música.',
    icon: <Music />,
    color: '#00f2ff',
    content: MUSICAL_SPHERE_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: '✨ Frase en la esfera (si no subes foto)'
    ,
    preview: '/previews/5. Esfera Musical.jpeg'
  },
  {
    id: 'proposal',
    category: 'amor',
    name: 'Propuesta 💖',
    description: 'Dile que sea tu novi@ sin un NO.',
    icon: <Sparkles />,
    color: '#ff00ff',
    content: PROPOSAL_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Frase bajo la propuesta'
    ,
    preview: '/previews/6. Propuesta.jpeg'
  },
  {
    id: 'forgive-cats',
    category: 'divertido',
    name: 'Me Perdonas 😳',
    description: 'Gatitos lindos para pedir perdón.',
    icon: <Smile />,
    color: '#ffa500',
    content: FORGIVE_ME_CATS_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Frase final'
    ,
    preview: '/previews/7. Me perdonas.jpeg'
  },
  {
    id: 'puzzle-love',
    category: 'juegos',
    name: 'Puzzle del Amor 💫',
    description: 'Arma un rompecabezas con tu foto (Obligatoria).',
    icon: <Gamepad />,
    color: '#ff4d94',
    content: PUZZLE_LOVE_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Mensaje al ganar'
    ,
    preview: '/previews/8. Puzzle de Amor.jpeg'
  },
  {
    id: 'ruleta-love',
    category: 'juegos',
    name: 'Ruleta del Amor 💖',
    description: 'Pregunta lo que quieras, ¡el destino dirá que SÍ!',
    icon: <RefreshCcw />,
    color: '#ff007f',
    content: RULETA_LOVE_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Título de Victoria'
    ,
    preview: '/previews/9. Roldeta del amor.jpeg'
  },
  {
    id: 'forgive-penguins',
    category: 'divertido',
    name: 'Perdón Mi Amor 🐧',
    description: 'Divertidos pingüinos para disculparse (Doble Foto - Botón esquivo).',
    icon: <Smile />,
    color: '#0080ff',
    content: FORGIVE_ME_PENGUINS_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasDualImage: true,
    hasExtra: true,
    extraLabel: 'Título de perdón',
    previews: ['/previews/10. Perdon mi Amor.png', '/previews/10.1 Perdon mi Amor.png']
  },
  {
    id: 'be-friends',
    category: 'divertido',
    name: '¿Amig@s? 👥',
    description: 'Pide volver a ser amig@s de forma tierna (Doble Foto - Botón esquivo).',
    icon: <Users />,
    color: '#ff4d94',
    content: BE_FRIENDS_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Mensaje de éxito'
    ,
    preview: '/previews/11. Amigos.jpeg'
  },
  {
    id: 'flowers-ramo',
    category: 'amor',
    name: 'Ramo de Flores 🌸',
    description: 'Regálale un hermoso ramo digital.',
    icon: <Gift />,
    color: '#ff80bf',
    content: FLOWERS_RAMO_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Nota del ramo',
    previews: ['/previews/12. Ramo de Flores.jpeg', '/previews/12.1 Ramo de Flores.png']
  },
  {
    id: 'enojona',
    category: 'divertido',
    name: 'Mi Enojona 😡',
    description: 'Gifs y música para tu enojona.',
    icon: <Flame />,
    color: '#ff4000',
    content: ENOJONA_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Nota final (PD)',
    previews: ['/previews/13. Me enojona.jpeg', '/previews/13.1 Me enojona.png']
  },
  {
    id: 'date-counter',
    category: 'eventos',
    name: 'Contador Especial 📅',
    description: 'Reloj neón para fechas clave.',
    icon: <Clock />,
    color: '#00ffcc',
    content: DATE_COUNTER_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasDate: true,
    hideRecipientName: false,
    hideMessage: true,
    hasExtra: true,
    extraLabel: 'Título del evento'
    ,
    preview: '/previews/14. Contador Especial.jpeg'
  },
  {
    id: 'love-cert',
    category: 'amor',
    name: 'Certificado Amor',
    description: 'Crea tu certificado con huella.',
    icon: <Stamp />,
    color: '#ffd700',
    content: LOVE_CERTIFICATE_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Cargo especial'
    ,
    previews: ['/previews/15. Certificado Amor.jpeg', '/previews/15.1 Certificado Amor.jpeg']
  },
  {
    id: 'initials',
    category: 'amor',
    name: 'Iniciales Pareja 👥',
    description: 'Tus letras en personajes animados.',
    icon: <Shirt />,
    color: '#ff4d94',
    content: COUPLE_INITIALS_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    hasExtra2: true,
    extraLabel: 'Inicial Ella',
    extra2Label: 'Inicial Él'
    ,
    preview: '/previews/16.  Iniciales Pareja.jpeg'
  },
  {
    id: 'enchanted-letter',
    category: 'amor',
    name: 'Carta Encantada 🎃',
    description: 'Especial Halloween para tu amor.',
    icon: <Ghost />,
    color: '#ff8000',
    content: ENCHANTED_LETTER_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Post Data (PD)',
    previews: ['/previews/17. Carta Encantada.jpeg', '/previews/17.1 Carta Encantada.png']
  },
  {
    id: 'vitamins',
    category: 'divertido',
    name: 'Vitaminas Amor 💊',
    description: 'Dile que te falta su vitamina A, B...',
    icon: <Pill />,
    color: '#ff0000',
    content: LOVE_VITAMINS_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasVitamins: true,
    hasExtra: true,
    extraLabel: 'Mensaje final'
    ,
    preview: '/previews/18. Vitaminas Amor.jpeg'
  },
  {
    id: 'scratch',
    category: 'juegos',
    name: 'Mensaje Raspa',
    description: 'Carta creativa de raspa y raspa.',
    icon: <Gamepad />,
    color: '#c0c0c0',
    content: SCRATCH_MESSAGE_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Premio oculto'
    ,
    preview: '/previews/19. Mensaje Raspa.jpeg'
  },
  {
    id: 'soccer-card',
    category: 'divertido',
    name: 'Tarjeta Futbolista ⚽',
    description: 'Tarjeta estilo FIFA para amigos.',
    icon: <Zap />,
    color: '#FFD700',
    content: SOCCER_CARD_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasSoccerStats: true,
    hasExtra: false,
    hideRecipientName: true,
    hideSender: true,
    hideMessage: true,
    previews: ['/previews/20. Tarjeta Futbolista.png', '/previews/20.1 Tarjeta Futbolista.png']
  },
  {
    id: 'birthday',
    category: 'eventos',
    name: 'Feliz Cumpleaños 🎂',
    description: 'Dedicatoria con lámpara creativa.',
    icon: <Gift />,
    color: '#ffeb3b',
    content: BIRTHDAY_LAMP_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Mensaje en tarjeta',
    previews: ['/previews/21. Feliz Cumpleaños.jpeg', '/previews/21.1 Feliz Cumpleaños.png']
  },
  {
    id: 'dedicate-song',
    category: 'amor',
    name: 'Te la Dedico 🎶',
    description: 'Reproductor con letra y fondo.',
    icon: <Music2 />,
    color: '#ff4d94',
    content: DEDICATE_SONG_TEMPLATE,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Dedicado a...'
    ,
    preview: '/previews/22.  Te la Dedico.jpeg'
  },
  {
    id: 'be-my-gf',
    category: 'amor',
    name: '¿Quieres ser novi@? 💞',
    description: 'El NO se mueve sin parar.',
    icon: <Heart />,
    color: '#e91e63',
    content: BE_MY_BOYFRIEND_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Mensaje persuasivo',
    previews: ['/previews/23. Quieres ser Novio.png', '/previews/23.1 Quieres ser Novia.png']
  },
  {
    id: 'te-amo',
    category: 'amor',
    name: 'Te Amo 💞',
    description: 'Corazón mágico que se forma.',
    icon: <Heart />,
    color: '#f44336',
    content: TE_AMO_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Subtítulo'
    ,
    preview: '/previews/24. Te Amo.jpeg'
  },
  {
    id: 'heart-photo',
    category: 'amor',
    name: 'Crear Corazón 💫',
    description: 'Corazón con mosaico de fotos (Mínimo 5).',
    icon: <Camera />,
    color: '#ff4081',
    content: HEART_PHOTO_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasItems: true,
    itemsCount: 25,
    hasExtra: true,
    extraLabel: 'Título del collage'
    ,
    preview: '/previews/25. Crear Corazon.jpeg'
  },
  {
    id: 'our-year',
    category: 'amor',
    name: 'Nuestro Año 💫',
    description: '12 fotos por cada mes juntos (Mosaico Anual).',
    icon: <Calendar />,
    color: '#ff9a3d',
    content: OUR_YEAR_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasItems: true,
    itemsCount: 12,
    hasExtra: true,
    extraLabel: 'Año (ej: 2025)'
    ,
    preview: '/previews/26. Nuestro Año.jpeg'
  },
  {
    id: 'christmas',
    category: 'eventos',
    name: 'Arbol Navidad 🎁',
    description: 'Árbol navideño con tus mejores fotos (16 fotos).',
    icon: <TreePine />,
    color: '#2e7d32',
    content: CHRISTMAS_TREE_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasItems: true,
    itemsCount: 16,
    hasExtra: false,
    preview: '/previews/27. Arbol Navidad.png'
  },
  {
    id: 'new-year',
    category: 'eventos',
    name: 'Feliz Año 💥',
    description: 'Festeja el inicio de un nuevo año.',
    icon: <PartyPopper />,
    color: '#fdd835',
    content: NEW_YEAR_TEMPLATE,
    hasImage: false,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Propósito de año nuevo',
    previews: ['/previews/28. Feliz Año.jpeg', '/previews/28.1 Feliz Año.png']
  },
  {
    id: 'love-cube',
    category: 'amor',
    name: 'Cubo del Amor 💖',
    description: 'Envia este bonito cubo del amor, con las fotos de tu pareja y tu canción favorita (6 fotos).',
    icon: <Disc />,
    color: '#ff4d94',
    content: LOVE_CUBE_TEMPLATE,
    hasName: true,
    hasSender: true,
    hasMessage: true,
    hasImage: false,
    hasAudio: true,
    hasItems: true,
    itemsCount: 6,
    hasExtra: true,
    extraLabel: 'Dedicatoria (ej: Te amo mi amor)'
    ,
    preview: '/previews/29. Cubo del Amor.jpeg'
  },
  {
    id: 'hidden-msg',
    category: 'amor',
    name: 'Mensaje Oculto 🤭',
    description: 'Pasa el dedo para revelar la foto y tu mensaje neon oculto.',
    icon: <Lock />,
    color: '#3f51b5',
    content: HIDDEN_MESSAGE_TEMPLATE,
    hasSender: true,
    hasMessage: true,
    hasImage: true,
    hasAudio: true,
    hasExtra: true,
    extraLabel: 'Mensaje Neon (ej: Te Amo Mi Vida)',
    preview: '/previews/30. Mensaje Oculto..jpeg'
  }
];

const FEATURES = [
  {
    icon: <Sparkles size={32} />,
    title: '100% Real',
    description: 'Mensajes animados e interactivos que funcionan en cualquier dispositivo.'
  },
  {
    icon: <Zap size={32} />,
    title: 'Rápido y fácil',
    description: 'Crea tu mensaje en menos de 2 minutos. Sin registros ni complicaciones.'
  },
  {
    icon: <Users size={32} />,
    title: '100% Seguro',
    description: 'Tus datos son privados. Comparte con confianza por WhatsApp o email.'
  }
];

const STEPS = [
  {
    number: '1',
    title: 'Elige tu plantilla',
    description: 'Selecciona entre nuestras plantillas diseñadas para cada ocasión: amor, cumpleaños, propuestas y más.'
  },
  {
    number: '2',
    title: 'Personaliza',
    description: 'Añade el nombre del destinatario, tu nombre y un mensaje especial. Hazlo único y memorable.'
  },
  {
    number: '3',
    title: 'Comparte',
    description: 'Copia el link o descarga el HTML. Envíalo por WhatsApp, email o cualquier red social. ¡Listo!'
  }
];



const LegalModal = ({ type, onClose }) => {
  const content = {
    privacy: {
      title: 'Política de Privacidad',
      body: `En InteractivoMagic, valoramos tu privacidad. 

1. Información: No recolectamos datos personales identificables. Los nombres y mensajes que ingresas se guardan localmente en la URL generada.
2. Anuncios: Utilizamos Google AdMob para mostrar publicidad. AdMob puede recopilar datos técnicos (ID de publicidad, modelo de dispositivo) para personalizar anuncios.
3. Archivos: Si subes un audio, este se procesa localmente para generar la experiencia, no se almacena en nuestros servidores.
4. Consentimiento: Al usar la app, aceptas esta política.`
    },
    terms: {
      title: 'Términos de Servicio',
      body: `1. Uso: La app es para uso personal y creativo. Queda prohibido generar contenido ofensivo o ilegal.
2. Responsabilidad: El usuario es el único responsable del contenido compartido a través de los links generados.
3. Disponibilidad: No garantizamos el funcionamiento ininterrumpido del servicio debido a factores técnicos externos.
4. Cambios: Nos reservamos el derecho de actualizar estos términos en cualquier momento para mejorar el servicio.`
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass modal-content"
        onClick={e => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '500px', width: '90%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>{content[type].title}</h2>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>
        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{content[type].body}</p>
        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '2rem', width: '100%' }}>Entendido</button>
      </motion.div>
    </motion.div>
  );
};

const PreviewLightbox = ({ template, initialIndex, onClose, onSelect }) => {
  const images = template.previews || [template.preview];
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 10000 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '1.5rem',
          maxWidth: '800px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-light)' }}>{template.name} - Vista Previa</h3>
          <button className="btn-icon" onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)' }}><X /></button>
        </div>

        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '10px',
                zIndex: 10,
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
            >
              <ChevronLeft />
            </button>
          )}

          <img
            src={images[currentIndex]}
            alt={template.name}
            style={{
              maxWidth: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}
          />

          {images.length > 1 && (
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '10px',
                zIndex: 10,
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
            >
              <ChevronRight />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {images.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i === currentIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        )}

        <div style={{ width: '100%', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cerrar</button>
          <button className="btn btn-primary" onClick={() => { onSelect(template); onClose(); }} style={{ flex: 2 }}>
            Comenzar con esta plantilla
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Ultra-aggressive image compression for URL sharing
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Aggressive size reduction - max 400px on longest side
        let width = img.width;
        let height = img.height;
        const maxSize = 400;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Very aggressive quality - 50% (0.5)
        const compressed = canvas.toDataURL('image/jpeg', 0.5);
        resolve(compressed);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};


function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [viewError, setViewError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [legalModal, setLegalModal] = useState(null); // 'privacy', 'terms'
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileApp, setIsMobileApp] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeLightbox, setActiveLightbox] = useState(null); // { template, initialIndex }

  // Dark / Light Mode support
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('magic_theme_mode');
      if (saved) return saved === 'dark';
      return !window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.remove('light-theme');
      body.classList.remove('light-theme');
      root.classList.add('dark-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('magic_theme_mode', 'dark');
    } else {
      root.classList.remove('dark-theme');
      body.classList.remove('dark-theme');
      root.classList.add('light-theme');
      body.classList.add('light-theme');
      localStorage.setItem('magic_theme_mode', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Live CMS Theme Synchronization Listener
  useEffect(() => {
    const handleThemeMessage = (e) => {
      if (!e.data) return;
      if (e.data.type === 'UPDATE_MAGIC_THEME' || e.data.type === 'UPDATE_THEME_PREVIEW') {
        const payload = e.data.payload || {};
        if (payload.accent_color || payload.primary || payload.primary_color) {
          const color = payload.accent_color || payload.primary || payload.primary_color;
          document.documentElement.style.setProperty('--primary', color);
        }
        if (payload.theme_mode || payload.mode) {
          const mode = payload.theme_mode || payload.mode;
          setIsDark(mode === 'dark');
        }
        if (payload.global_background_image !== undefined) {
          if (payload.global_background_image && payload.global_background_image.trim()) {
            document.body.style.backgroundImage = `url("${payload.global_background_image}")`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
          } else {
            document.body.style.backgroundImage = '';
          }
        }
      }
    };
    window.addEventListener('message', handleThemeMessage);
    return () => window.removeEventListener('message', handleThemeMessage);
  }, []);

  const [isGenerating, setIsGenerating] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [searchTermFlag, setSearchTermFlag] = useState('Argentina');
  const [flagPickerOpen, setFlagPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sender: '',
    message: '',
    extraText: '',
    extraText2: '',
    startDate: new Date().toISOString().split('T')[0],
    imageOption: 'url', // 'url', 'upload'
    imageSrc: '',
    imageFile: null,
    hasImage2: false,
    imageOption2: 'url',
    imageSrc2: '',
    imageFile2: null,
    items: [],
    driveFolderUrl: '',
    // Campos para Vitaminas Amor
    vitamina_a_text: '',
    vitamina_a_msg: '',
    vitamina_a_emoji: '',
    vitamina_a_img: '',
    vitamina_a_opt: 'url',
    vitamina_b_text: '',
    vitamina_b_msg: '',
    vitamina_b_emoji: '',
    vitamina_b_img: '',
    vitamina_b_opt: 'url',
    vitamina_c_text: '',
    vitamina_c_msg: '',
    vitamina_c_emoji: '',
    vitamina_c_img: '',
    vitamina_c_opt: 'url',
    vitamina_d_img: '',
    vitamina_d_opt: 'url',
    // Campos para Tarjeta Futbolista
    soccer_rating: '82',
    soccer_pos: 'ST',
    soccer_name: 'Messi',
    soccer_info: 'Inter de Miami',
    soccer_flag: 'ar',
    soccer_pac: '64',
    soccer_sho: '85',
    soccer_pas: '78',
    soccer_dri: '77',
    soccer_def: '41',
    soccer_phy: '75',
    hasAudio: true, // Audio activado por defecto ✨
    audioOption: 'youtube',
    youtubeUrl: '',
    audioFile: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [expandedSections, setExpandedSections] = useState({ text: true, image: true });
  const [extraSlots, setExtraSlots] = useState(0);
  const [isCompressingBatch, setIsCompressingBatch] = useState(false);
  const [isFetchingDrive, setIsFetchingDrive] = useState(false);
  const [driveSynced, setDriveSynced] = useState(false);
  const [vitaminsExpanded, setVitaminsExpanded] = useState(false);
  const BASE_DYNAMIC_LIMIT = 5;

  const fetchDrivePhotos = async () => {
    if (!formData.driveFolderUrl) return;
    setIsFetchingDrive(true);
    try {
      const folderIdMatch = formData.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/) || formData.driveFolderUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (!folderIdMatch) {
        setErrors(prev => ({ ...prev, drive: 'URL de Drive no válida' }));
        setIsFetchingDrive(false);
        return;
      }
      const folderId = folderIdMatch[1];
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent("https://drive.google.com/drive/folders/" + folderId)}`;
      const response = await fetch(proxyUrl);
      const html = await response.text();

      const idRegex = /"([a-zA-Z0-9_-]{32,40})"/g;
      let match;
      const ids = new Set();
      while ((match = idRegex.exec(html)) !== null) {
        const id = match[1];
        // Skip common IDs like folder itself and some UI elements
        if (id !== folderId && !id.startsWith('drive_') && !id.startsWith('folder_')) {
          ids.add(id);
        }
      }

      const extractedIds = Array.from(ids);
      if (extractedIds.length > 0) {
        // DRIVE METADATA FILTERING:
        // Filter by typical Drive ID length (image IDs are usually 33 characters)
        const sortedIds = extractedIds.filter(id => id.length >= 33);

        // Metadata usually appears at the very beginning of the HTML response.
        // If we have many IDs, skip the first ones which are often site assets (icons, etc.)
        const skip = sortedIds.length > (selectedTemplate?.itemsCount || 5) + 5 ? 4 : 0;
        const limit = selectedTemplate?.itemsCount || 25;

        const newItems = sortedIds.slice(skip, skip + limit).map(id => ({
          id: Date.now() + Math.random(),
          type: 'image',
          content: `https://lh3.googleusercontent.com/u/0/d/${id}`
        }));
        setFormData(prev => ({ ...prev, items: newItems }));
        setDriveSynced(true);
        setErrors(prev => { const { drive, ...rest } = prev; return rest; });
      } else {
        setErrors(prev => ({ ...prev, drive: 'No se encontraron fotos públicas. Revisa que el enlace sea correcto y la carpeta sea pública.' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, drive: 'Error al conectar con Drive' }));
    }
    setIsFetchingDrive(false);
  };

  // Reset sync status when drive URL changes
  useEffect(() => {
    setDriveSynced(false);
  }, [formData.driveFolderUrl]);

  // Reset and initialize items when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => {
        // Preserve critical user audio configuration
        const preservedAudio = {
          hasAudio: prev.hasAudio,
          audioOption: prev.audioOption,
          youtubeUrl: prev.youtubeUrl,
          audioFile: prev.audioFile,
          audioSrc: prev.audioSrc
        };

        console.log('[TEMPLATE CHANGE] Preserving audio config:', preservedAudio);

        return {
          ...prev,
          ...preservedAudio, // Explicitly preserve audio
          items: [], // Reset only items
          // Pre-fill template-specific fields
          ...(selectedTemplate.id === 'vitamins' ? {
            vitamina_a_text: 'Abrazos',
            vitamina_a_msg: 'Los más cálidos 🤗',
            vitamina_a_emoji: '🤗',
            vitamina_b_text: 'Besos',
            vitamina_b_msg: 'Dulces y tiernos 😘',
            vitamina_b_emoji: '😘',
            vitamina_c_text: 'Caricias',
            vitamina_c_msg: 'Suaves toda la noche 💕',
            vitamina_c_emoji: '💕',
            vitamina_d_text: 'Delicioso',
            vitamina_d_msg: 'Las veces que tu quieras 😏💘',
            vitamina_d_emoji: '🔥😈'
          } : (selectedTemplate.id === 'our-year' ? {
            extraText: new Date().getFullYear().toString()
          } : {}))
        };
      });
      setExtraSlots(0); // Reset rewards too
    }
  }, [selectedTemplate]);

  // Check platform and viewer mode on load
  useEffect(() => {
    // Detect if running in native mobile app
    const isNative = isNativePlatform();
    setIsMobileApp(isNative);

    // Initialize AdMob and show ads if on mobile
    if (isNative) {
      initializeAdMob().then(() => {
        // Show banner ad at bottom
        showBannerAd();
        // Show startup interstitial ad
        showInterstitial();
        // Pre-load rewarded ad for later
        prepareRewardedAd();
      });
    }
  }, []);

  // Handle incoming data (msg or v parameter)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msgData = params.get('msg');
    const vId = params.get('v');

    const processData = (decodedStringOrObj) => {
      try {
        let decoded;
        if (typeof decodedStringOrObj === 'string') {
          // It's a JSON string (possibly from B64 or direct JSON string)
          decoded = JSON.parse(decodedStringOrObj);
        } else {
          // It's already an object
          decoded = decodedStringOrObj;
        }

        console.log("[App] Processing decoded data:", decoded);
        const tpl = TEMPLATES.find(t => t.id === decoded.t || t.id === decoded.template);
        if (tpl) {
          const normalizedData = {
            ...decoded,
            t: decoded.t || tpl.id,
            n: decoded.n || decoded.name || '',
            s: decoded.s || decoded.sender || '',
            m: decoded.m || decoded.message || '',
            hasAudio: (decoded.a !== undefined) ? (decoded.a === 1) : (decoded.audio !== undefined ? decoded.audio : false),
            // Ensure compatibility with internal shortener fields
            imageSrc: decoded.img || decoded.imageSrc || '',
            yt: decoded.yt || decoded.youtubeId || null,
            et: decoded.et || decoded.extraText || '',
            et2: decoded.et2 || decoded.extraText2 || ''
          };

          const reconstructedAudioOption = normalizedData.yt ? 'youtube' : (normalizedData.src === 'uploaded' ? 'upload' : 'default');

          setViewData({
            ...normalizedData,
            html: tpl.content,
            audioOption: reconstructedAudioOption,
            audioSrc: normalizedData.asrc || '',
            imageSrc: normalizedData.img || normalizedData.imageSrc || '',
            extraText: normalizedData.et || '',
            extraText2: normalizedData.et2 || ''
          });

          // CRITICAL: Ensure view mode is active
          console.log("[App] SUCCESS: viewData set from ID/msg");
        }
      } catch (e) {
        console.error("Error decoding message:", e);
      }
    };

    if (msgData) {
      try {
        // Fix: replace spaces back to '+' — URLSearchParams decodes '+' as space, corrupting base64
        const cleanMsg = msgData.replace(/ /g, '+');
        const decodedString = decodeURIComponent(escape(atob(cleanMsg)));
        processData(decodedString);
      } catch (e) {
        console.error("Error decoding B64 data:", e);
      }
    } else if (vId && SHORTENER_API) {
      console.log(`[App] Loading data by ID: ${vId}`);
      setIsLoadingView(true);
      fetch(`${SHORTENER_API}/api/v1/get/${vId}`)
        .then(res => res.json())
        .then(result => {
          if (result.url) {
            console.log("[App] Data recovered from backend");

            // Try to see if it's a full URL or a JSON payload
            if (typeof result.url === 'string' && result.url.startsWith('http')) {
              try {
                const url = new URL(result.url);
                const urlParams = new URLSearchParams(url.search);
                const nestedData = urlParams.get('msg');
                if (nestedData) {
                  // Fix: replace spaces back to '+' — URLSearchParams decodes '+' as space
                  const cleanMsg = nestedData.replace(/ /g, '+');
                  const decodedString = decodeURIComponent(escape(atob(cleanMsg)));
                  processData(decodedString);
                } else {
                  processData(result.url);
                }
              } catch (e) {
                processData(result.url);
              }
            } else {
              processData(result.url);
            }
          } else {
            // ID not found in database
            console.warn('[App] ID not found in DB:', vId);
            setViewError('expired');
          }
        })
        .catch(err => {
          console.error("Error fetching data by ID:", err);
          setViewError('network');
        })
        .finally(() => setIsLoadingView(false));
    } else if (vId) {
      setViewError('expired');
    }
  }, []);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          // Size based on image count: more photos = smaller size to fit payload
          const max_size = formData.items.length > 20 ? 120 : (formData.items.length > 10 ? 180 : 250);

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Quality based on batch size - even more aggressive for many photos
          const quality = formData.items.length > 20 ? 0.15 : (formData.items.length > 10 ? 0.25 : 0.4);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
      };
    });
  };

  const handleDownload = () => {
    const shareUrl = getShareUrl();
    TemplateEngine.generate(shareUrl, formData);
  };

  const extractSocialId = (url, type) => {
    if (!url) return null;
    if (type === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }
    if (type === 'tiktok') {
      const regExp = /\/video\/(\d+)/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }
    return url; // For facebook, we use the full URL
  };

  const getShareUrl = () => {
    const dataObj = {
      n: formData.name,
      s: formData.sender,
      m: formData.message,
      t: selectedTemplate.id,
      a: formData.hasAudio ? 1 : 0,
    };

    // Add optional properties only if they exist to save space
    if (formData.audioOption === 'upload') dataObj.src = 'uploaded';
    else if (formData.audioOption === 'default') dataObj.src = 'default';

    if (formData.audioOption === 'youtube') dataObj.yt = extractSocialId(formData.youtubeUrl, 'youtube');
    if (formData.imageSrc) dataObj.img = formData.imageSrc;
    if (formData.imageSrc2) dataObj.img2 = formData.imageSrc2;
    if (formData.extraText) dataObj.et = formData.extraText;
    if (formData.extraText2) dataObj.et2 = formData.extraText2;
    if (formData.startDate) dataObj.sd = formData.startDate;
    if (formData.items && formData.items.length > 0) dataObj.it = formData.items;
    if (formData.audioOption === 'upload' && formData.audioSrc) dataObj.asrc = formData.audioSrc;

    // Compact Vitamin Data
    if (formData.vitamina_a_text) dataObj.va_t = formData.vitamina_a_text;
    if (formData.vitamina_a_msg) dataObj.va_m = formData.vitamina_a_msg;
    if (formData.vitamina_a_emoji) dataObj.va_e = formData.vitamina_a_emoji;
    if (formData.vitamina_a_img) dataObj.va_i = formData.vitamina_a_img;

    if (formData.vitamina_b_text) dataObj.vb_t = formData.vitamina_b_text;
    if (formData.vitamina_b_msg) dataObj.vb_m = formData.vitamina_b_msg;
    if (formData.vitamina_b_emoji) dataObj.vb_e = formData.vitamina_b_emoji;
    if (formData.vitamina_b_img) dataObj.vb_i = formData.vitamina_b_img;

    if (formData.vitamina_c_text) dataObj.vc_t = formData.vitamina_c_text;
    if (formData.vitamina_c_msg) dataObj.vc_m = formData.vitamina_c_msg;
    if (formData.vitamina_c_emoji) dataObj.vc_e = formData.vitamina_c_emoji;
    if (formData.vitamina_c_img) dataObj.vc_i = formData.vitamina_c_img;

    if (formData.vitamina_d_img) dataObj.vd_i = formData.vitamina_d_img;

    // Soccer card parameters
    if (selectedTemplate.id === 'soccer-card') {
      dataObj.sr = formData.soccer_rating;
      dataObj.sp = formData.soccer_pos;
      dataObj.sn = formData.soccer_name;
      dataObj.si = formData.soccer_info;
      dataObj.sa = formData.soccer_pac;
      dataObj.ss = formData.soccer_sho;
      dataObj.sl = formData.soccer_pas;
      dataObj.sdr = formData.soccer_dri;
      dataObj.se = formData.soccer_def;
      dataObj.sy = formData.soccer_phy;
      dataObj.sf = formData.soccer_flag;
    }
    const jsonStr = JSON.stringify(dataObj);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const baseUrl = getBaseUrl();
    // IMPORTANT: URL-encode the base64 to prevent '+' being decoded as spaces by URLSearchParams
    return `${baseUrl}/?msg=${encodeURIComponent(encoded)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGenerate = async () => {
    setGiftOpened(false);
    const newErrors = {};
    if (!selectedTemplate.hideRecipientName && (!formData.name || !formData.name.trim())) {
      newErrors.name = '¿Cómo se llama la persona especial?';
    }
    if (!formData.sender.trim()) newErrors.sender = 'Dinos quién envía el mensaje';
    if (!selectedTemplate.hideMessage && !formData.message.trim()) {
      newErrors.message = '¡Escribe unas palabras mágicas!';
    }

    if ((selectedTemplate.id === 'galaxy-gen' || selectedTemplate.id === 'date-counter') && (!formData.extraText || !formData.extraText.trim())) {
      newErrors.extraText = 'Por favor, ingresa un título para tu mensaje.';
    }

    // Validación para Iniciales Pareja - ambas iniciales son obligatorias
    if (selectedTemplate.id === 'initials') {
      if (!formData.extraText || !formData.extraText.trim()) {
        newErrors.extraText = 'Por favor, ingresa la inicial de Ella.';
      }
      if (!formData.extraText2 || !formData.extraText2.trim()) {
        newErrors.extraText2 = 'Por favor, ingresa la inicial de Él.';
      }
    }

    if ((selectedTemplate.id === 'musical-sphere' || selectedTemplate.id === 'dedicate-song')) {
      if (!formData.hasAudio) {
        newErrors.audio = 'Esta plantilla requiere música. Por favor, activa "Música Mágica".';
      } else if (!formData.youtubeUrl.trim() && !formData.audioFile) {
        if (formData.audioOption === 'youtube') {
          newErrors.youtube = 'Esta plantilla requiere música. Por favor, ingresa un link de YouTube.';
        } else {
          newErrors.audio = 'Esta plantilla requiere música. Por favor, sube un archivo de audio.';
        }
      }
    }

    if (formData.hasAudio) {
      if (formData.audioOption === 'upload' && !formData.audioFile) {
        newErrors.audio = 'Por favor, sube un archivo de audio.';
      }
      if (formData.audioOption === 'youtube' && !formData.youtubeUrl.trim()) {
        newErrors.youtube = 'Por favor, ingresa un link de YouTube.';
      }
    }

    if (selectedTemplate.id === 'puzzle-love' && !formData.imageSrc) {
      newErrors.image = '¡Espera! Para armar el rompecabezas necesitamos una foto obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstError)[0] || document.getElementById('audio-section');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setIsGenerating(true);

    try {
      // Show Rewarded Interstitial ad in mobile app before generating result
      if (isMobileApp) {
        try {
          await showRewardedAd();
        } catch (e) {
          console.error("Ad error, proceeding anyway:", e);
        }
      }

      const longUrl = getShareUrl();
      console.log(`[App] Generating link. Long URL length: ${longUrl.length}`);

      try {
        if (!SHORTENER_API) {
          const shortUrl = await shortenUrl(longUrl);
          setGeneratedUrl(shortUrl || longUrl);
        } else {
          const response = await fetch(`${SHORTENER_API}/api/v1/shorten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: longUrl })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.id) {
              // Use the base URL helper to ensure we get the correct production domain
              const base = getBaseUrl();
              const internalLink = `${base}${window.location.pathname}?v=${result.id}`;
              setGeneratedUrl(internalLink);
              console.log("[App] SUCCESS: ID-based link generated:", internalLink);
            } else {
              setGeneratedUrl(result.short_url || result.url);
            }
          } else {
            console.warn("[App] Custom shortener failed, status:", response.status);
            const errorData = await response.json().catch(() => ({}));
            console.error("[App] Shortener Error Detail:", errorData);
            
            const shortUrl = await shortenUrl(longUrl);
            setGeneratedUrl(shortUrl || longUrl);
            
            if (!shortUrl || shortUrl === longUrl) {
              alert("⚠️ El acortador personalizado está en mantenimiento. Se ha generado un link largo, pero podría no funcionar bien en algunas aplicaciones. Por favor, intenta de nuevo en unos minutos.");
            }
          }
        }
      } catch (shortenerErr) {
        console.error("[App] Shortener fetch error:", shortenerErr);
        const shortUrl = await shortenUrl(longUrl);
        setGeneratedUrl(shortUrl || longUrl);
      }

      setShowResult(true);
    } catch (err) {
      console.error("Critical Generation Error:", err);
      // Last resort fallback
      setGeneratedUrl(getShareUrl());
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToTemplates = () => {
    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading screen while fetching from short link
  if (isLoadingView) {
    return (
      <div style={{
        width: '100vw', height: '100vh', background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', color: 'white', fontFamily: 'sans-serif'
      }}>
        <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>🪄</div>
        <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Cargando tu sorpresa mágica...</div>
        <div style={{
          width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'
        }}>
          <div style={{
            width: '60%', height: '100%',
            background: 'linear-gradient(90deg, #ff00ff, #ff4d94)',
            animation: 'slideLoader 1.5s ease-in-out infinite',
            borderRadius: '4px'
          }} />
        </div>
        <style>{`
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
          @keyframes slideLoader { 0%{transform:translateX(-100%)} 100%{transform:translateX(250px)} }
        `}</style>
      </div>
    );
  }

  // Error screen when ID expired or network failed
  if (viewError) {
    const isExpired = viewError === 'expired';
    return (
      <div style={{
        width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0030 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem'
      }}>
        <div style={{ fontSize: '4rem' }}>{isExpired ? '⏳' : '📡'}</div>
        <h1 style={{ fontSize: '1.6rem', margin: 0 }}>
          {isExpired ? 'Esta sorpresa expiró' : 'Error de conexión'}
        </h1>
        <p style={{ opacity: 0.7, maxWidth: '320px', lineHeight: 1.6 }}>
          {isExpired
            ? 'El link mágico que recibiste ya no está disponible (los links duran 30 días). Pídele a quien te lo envió que genere uno nuevo. 💌'
            : 'No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.'}
        </p>
        <button
          onClick={() => { setViewError(null); window.history.replaceState({}, '', window.location.pathname); }}
          style={{
            marginTop: '1rem', padding: '0.8rem 2rem', borderRadius: '2rem',
            background: 'linear-gradient(135deg, #ff00ff, #ff4d94)',
            border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer', fontWeight: '700'
          }}
        >
          Ir al inicio
        </button>
      </div>
    );
  }

  // If in View Mode, show the template inside an iframe
  if (viewData) {
    const finalHtml = TemplateEngine.render(viewData.html, {
      ...viewData,
      pageOffset: selectedTemplate?.pageOffset || viewData.pageOffset,
      hasAudio: viewData.audio || viewData.hasAudio,
      audio: viewData.audio || viewData.hasAudio,
      audioOption: viewData.audioOption,
      audioSrc: viewData.audioSrc || viewData.asrc || (viewData.src !== 'default' && viewData.src !== 'uploaded' ? viewData.src : ''),
      youtubeUrl: viewData.youtubeUrl || (viewData.yt ? `https://youtube.com/watch?v=${viewData.yt}` : ''),
      yt: viewData.yt,
      imageSrc: viewData.imageSrc || viewData.img || '',
      img: viewData.imageSrc || viewData.img || ''
    });

    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
        <button
          onClick={() => setViewData(null)}
          className="glass"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
          title="Cerrar Vista Previa"
        >
          <X size={24} />
        </button>
        <iframe
          title="Mensaje Interactivo"
          srcDoc={finalHtml}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            background: '#000' // Dark mode fix: ensure iframe container is black
          }}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <UpdateNotification />
      <div className="gradient-bg" />

      {/* Header Navigation */}
      <header className="site-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
          <div
            className="logo"
            onClick={() => {
              setSelectedTemplate(null);
              setShowResult(false);
              setViewData(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <Sparkles size={28} color="#ff00ff" />
            <span style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              InteractivoMagic
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#inicio" onClick={(e) => { e.preventDefault(); setSelectedTemplate(null); setShowResult(false); setViewData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>Inicio</a>
            <a href="#plantillas" onClick={(e) => { e.preventDefault(); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>Plantillas</a>
            <a href="#como-funciona" onClick={(e) => { e.preventDefault(); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }), 50); }} style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>Cómo funciona</a>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Alternar tema claro y oscuro"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-light)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              {isDark ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#ec4899" />}
            </button>

            <button className="btn btn-primary" onClick={() => { setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
              Comenzar
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mobile-nav glass"
              style={{ overflow: 'hidden' }}
            >
              <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#inicio" onClick={() => { setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--text-light)', textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', background: 'var(--glass-bg)' }}>Inicio</a>
                <a href="#plantillas" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ color: 'var(--text-light)', textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', background: 'var(--glass-bg)' }}>Plantillas</a>
                <a href="#como-funciona" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }), 50); }} style={{ color: 'var(--text-light)', textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', background: 'var(--glass-bg)' }}>Cómo funciona</a>
                
                {/* Mobile Theme Toggle */}
                <button
                  onClick={() => { toggleTheme(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}
                >
                  <span>{isDark ? '☀️ Cambiar a Modo Claro' : '🌙 Cambiar a Modo Oscuro'}</span>
                  {isDark ? <Sun size={19} color="#f59e0b" /> : <Moon size={19} color="#ec4899" />}
                </button>

                <button className="btn btn-primary" onClick={() => { setMenuOpen(false); setSelectedTemplate(null); setShowResult(false); setViewData(null); setTimeout(scrollToTemplates, 50); }} style={{ width: '100%' }}>
                  Comenzar
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Version Update Notification */}
      <UpdateNotification />

      {/* Hero Section (Web only) */}
      {!selectedTemplate && !isMobileApp && (
        <section className="hero-section container" style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '4rem' }}>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #ff00ff, #ff006f, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900'
            }}>
              Crea mensajes interactivos
              <br />
              <span style={{ color: 'var(--text-light)', fontSize: '0.7em' }}>que enamoren</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              Sorprende a quien más amas con mensajes animados, interactivos y llenos de magia. 100% personalizables y fáciles de compartir.
            </p>
            <button className="btn btn-primary" onClick={scrollToTemplates} style={{ fontSize: '1.2rem', padding: '1.2rem 2.5rem' }}>
              <Sparkles size={24} /> Comenzar ahora
            </button>

            {/* Download Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a
                href={DOWNLOAD_LINKS.apkDirect}
                className="btn btn-secondary"
                style={{
                  fontSize: '1rem',
                  padding: '0.8rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <Download size={20} /> Descargar APK
              </a>
              <a
                href={DOWNLOAD_LINKS.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  fontSize: '1rem',
                  padding: '0.8rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <Download size={20} /> Google Play
              </a>
            </div>
          </motion.div>

          {/* Animated Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}
          >
            {[Heart, Send, Gift].map((Icon, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                className="glass"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${TEMPLATES[idx].color}20, ${TEMPLATES[idx].color}10)`
                }}
              >
                <Icon size={40} color={TEMPLATES[idx].color} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Features Grid (Web only) */}
      {!selectedTemplate && !isMobileApp && (
        <section className="container" style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {FEATURES.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="glass feature-card"
                style={{ padding: '2rem', textAlign: 'center' }}
              >
                <div style={{
                  display: 'inline-flex',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 0, 255, 0.1)',
                  marginBottom: '1rem'
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Templates Section */}
      {!selectedTemplate ? (
        <section id="templates-section" style={{ marginTop: isMobileApp ? '2rem' : '6rem' }}>
          {!isMobileApp && (
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Explora nuestras plantillas mágicas
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Elige la plantilla perfecta para tu ocasión especial y personalízala en segundos
              </p>
            </div>
          )}

          {/* Search and Category Filters */}
          <div className="container" style={{ marginBottom: '3rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '500px' }}>
                  <Search size={20} className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Busca una plantilla... (ej: Marvel, Amor)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{
                      paddingLeft: '45px',
                      borderRadius: '15px',
                      width: '100%'
                    }}
                  />
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                    >
                      {cat.icon}
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            padding: '0 1rem'
          }}>
            {TEMPLATES
              .filter(t => {
                const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = activeCategory === 'todos' || t.category === activeCategory;
                return matchesSearch && matchesCategory;
              })
              .map((tpl, idx) => (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="glass card template-card"
                  onClick={() => {
                    // Seleccionar plantilla y sincronizar flags de formData
                    setSelectedTemplate(tpl);
                    setFormData(prev => ({
                      ...prev,
                      hasImage: tpl.hasImage || false,
                      hasAudio: tpl.hasAudio || false,
                      hasItems: tpl.hasItems || false
                    }));

                    // Pre-load rewarded ad while user fills the form
                    if (isMobileApp) {
                      prepareRewardedAd();
                    }
                  }}
                  style={{ cursor: 'pointer', textAlign: 'left', padding: '2rem', position: 'relative' }}
                >
                  {/* Preview Image(s) in Upper-Right Corner */}
                  {(tpl.preview || tpl.previews) && (
                    <div style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      {/* Support for both single preview and multiple previews */}
                      {(tpl.previews || [tpl.preview]).map((previewSrc, previewIdx) => (
                        <div key={previewIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLightbox({ template: tpl, initialIndex: previewIdx });
                          }}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '2px solid rgba(255,255,255,0.15)',
                            background: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            cursor: 'zoom-in',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={previewSrc}
                            alt={`Preview ${tpl.name} ${previewIdx + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              // Fallback: hide image if it doesn't exist
                              e.target.parentElement.style.display = 'none';
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Eye size={12} color="white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: tpl.color || 'var(--primary)' }}>{tpl.icon}</div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>{tpl.name}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>{tpl.description}</p>
                  <div className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Seleccionar <ArrowRight size={18} />
                  </div>
                </motion.div>
              ))}
          </div>

          {isMobileApp && (
            <div style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.6 }}>
              <button
                onClick={() => window.open('/politica-privacidad.html', '_blank')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Política de Privacidad
              </button>
            </div>
          )}
        </section>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: '2rem',
          alignItems: 'start'
        }} className="form-layout-grid">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass"
            style={{ padding: isMobileApp ? '1.5rem 1.2rem' : '2.5rem', width: '100%' }}
          >
            {!showResult ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    ← Volver
                  </button>
                  <h2>Personalizar: {selectedTemplate.name}</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {!selectedTemplate.hideRecipientName && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre del Destinatario</label>
                      <input
                        name="name"
                        placeholder="Ej: Mi Amor"
                        value={formData.name}
                        onFocus={() => isMobileApp && hideBannerAd()}
                        onBlur={() => isMobileApp && showBannerAd()}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, name: e.target.value }));
                          if (errors.name) setErrors(prevErr => ({ ...prevErr, name: null }));
                        }}
                        style={{
                          borderColor: errors.name ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                          boxShadow: errors.name ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none'
                        }}
                      />
                      {errors.name && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.name}</p>}
                    </div>
                  )}
                  {!selectedTemplate.hideSender && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tu Nombre</label>
                      <input
                        name="sender"
                        placeholder="Tu nombre"
                        value={formData.sender}
                        onFocus={() => isMobileApp && hideBannerAd()}
                        onBlur={() => isMobileApp && showBannerAd()}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, sender: e.target.value }));
                          if (errors.sender) setErrors(prevErr => ({ ...prevErr, sender: null }));
                        }}
                        style={{
                          borderColor: errors.sender ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                          boxShadow: errors.sender ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none'
                        }}
                      />
                      {errors.sender && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.sender}</p>}
                    </div>
                  )}
                  {!selectedTemplate.hideMessage && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mensaje Especial</label>
                      <textarea
                        name="message"
                        rows="4"
                        placeholder="Escribe algo lindo...."
                        value={formData.message}
                        onFocus={() => isMobileApp && hideBannerAd()}
                        onBlur={() => isMobileApp && showBannerAd()}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, message: e.target.value }));
                          if (errors.message) setErrors(prevErr => ({ ...prevErr, message: null }));
                        }}
                        style={{
                          borderColor: errors.message ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                          boxShadow: errors.message ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none',
                          resize: 'none'
                        }}
                      />
                      {errors.message && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.message}</p>}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {selectedTemplate.hasExtra && (
                      <div style={{ flex: selectedTemplate.hasExtra2 ? '1 1 140px' : '1 1 100%' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          {selectedTemplate.extraLabel || 'Texto Secundario'}
                        </label>
                        {selectedTemplate.id === 'initials' ? (
                          <input
                            name="extraText"
                            placeholder="A"
                            maxLength={1}
                            value={formData.extraText}
                            onChange={(e) => {
                              setFormData({ ...formData, extraText: e.target.value });
                              if (errors.extraText) setErrors({ ...errors, extraText: null });
                            }}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            style={{
                              textAlign: 'center',
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              borderColor: errors.extraText ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                              boxShadow: errors.extraText ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none'
                            }}
                          />
                        ) : selectedTemplate.id === 'our-year' ? (
                          <select
                            name="extraText"
                            value={formData.extraText || new Date().getFullYear().toString()}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, extraText: e.target.value }));
                              if (errors.extraText) setErrors(prevErr => ({ ...prevErr, extraText: null }));
                            }}
                            style={{
                              width: '100%',
                              padding: '0.8rem',
                              borderRadius: '12px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'white',
                              border: errors.extraText ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.12)',
                              fontSize: '1rem'
                            }}
                          >
                            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                              <option key={year} value={year} style={{ background: '#1a1a1a' }}>{year}</option>
                            ))}
                          </select>
                        ) : (
                          <textarea
                            name="extraText"
                            rows="3"
                            placeholder={selectedTemplate.id === 'galaxy-gen' ? 'Ej: Amor, Paz, Felicidad, Ternura, Mi Vida, Linda...' : 'Ej: Escribe aquí la frase o nota especial...'}
                            value={formData.extraText}
                            onChange={(e) => {
                              setFormData({ ...formData, extraText: e.target.value });
                              if (errors.extraText) setErrors({ ...errors, extraText: null });
                            }}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            style={{
                              fontSize: '0.9rem',
                              borderColor: errors.extraText ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                              boxShadow: errors.extraText ? '0 0 15px rgba(255, 77, 148, 0.3)' : 'none',
                              resize: 'none'
                            }}
                          />
                        )}
                        {errors.extraText && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{errors.extraText}</p>}
                      </div>
                    )}

                    {selectedTemplate.hasExtra2 && (
                      <div style={{ flex: '1 1 140px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          {selectedTemplate.extra2Label || 'Texto 2'}
                        </label>
                        {selectedTemplate.id === 'initials' ? (
                          <input
                            name="extraText2"
                            placeholder="B"
                            maxLength={1}
                            value={formData.extraText2}
                            onChange={(e) => setFormData({ ...formData, extraText2: e.target.value })}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                          />
                        ) : (
                          <input
                            name="extraText2"
                            value={formData.extraText2}
                            onChange={(e) => setFormData({ ...formData, extraText2: e.target.value })}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {selectedTemplate.hasDate && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Fecha del Evento</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        onFocus={() => isMobileApp && hideBannerAd()}
                        onBlur={() => isMobileApp && showBannerAd()}
                        style={{
                          fontSize: '1rem',
                          padding: '0.9rem',
                          colorScheme: 'dark',
                          width: '100%',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                      />
                    </div>
                  )}

                  {/* Image Section */}
                  {selectedTemplate.hasImage && (
                    <div style={{
                      padding: isMobileApp ? '1rem' : '1.5rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '20px',
                      border: errors.image ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '1rem'
                    }}>
                      {errors.image && (
                        <div style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '500' }}>
                          ⚠️ {errors.image}
                        </div>
                      )}
                      <div
                        onClick={() => setFormData({ ...formData, hasImage: !formData.hasImage })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: formData.hasImage ? '1.2rem' : '0',
                          padding: '1rem',
                          background: formData.hasImage ? 'rgba(77, 148, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '15px',
                          cursor: 'pointer',
                          border: formData.hasImage ? '2px solid #00aaff' : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '12px',
                            background: formData.hasImage ? '#00aaff' : 'rgba(0, 170, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Image size={24} color="white" />
                          </div>
                          <div>
                            <p style={{ fontWeight: '800', fontSize: '1.1rem', margin: 0, color: 'var(--text-light)' }}>Foto de Portada</p>
                          </div>
                        </div>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '2px solid var(--text-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: formData.hasImage ? 'var(--text-light)' : 'transparent'
                        }}>
                          {formData.hasImage && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00aaff' }} />}
                        </div>
                      </div>

                      {formData.hasImage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))',
                            gap: '0.8rem',
                            marginBottom: '1.2rem'
                          }}>
                            {[
                              { id: 'url', label: 'Link Web', help: 'Pinterest/Google' },
                              { id: 'upload', label: 'Sube foto', help: 'Desde galería' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData(prev => ({ ...prev, imageOption: opt.id }))}
                                style={{
                                  padding: '1rem',
                                  borderRadius: '12px',
                                  border: formData.imageOption === opt.id ? '2px solid #00aaff' : '1px solid rgba(255,255,255,0.1)',
                                  background: formData.imageOption === opt.id ? 'rgba(0, 170, 255, 0.1)' : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '65px'
                                }}
                              >
                                <p style={{ fontWeight: '700', fontSize: '1rem', margin: '0 0 2px 0', color: formData.imageOption === opt.id ? 'white' : 'var(--text-muted)' }}>{opt.label}</p>
                                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>{opt.help}</p>
                              </button>
                            ))}
                          </div>
                          <div style={{
                            padding: '0.8rem',
                            background: 'rgba(0, 170, 255, 0.08)',
                            borderRadius: '10px',
                            marginBottom: '1rem',
                            border: '1px solid rgba(0, 170, 255, 0.15)'
                          }}>
                            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.4' }}>
                              💡 <strong>Sube foto:</strong> Se comprime para compartir por link. <strong>Link Web:</strong> Usar para mejores resultados.
                            </p>
                          </div>

                          {formData.imageOption === 'url' ? (
                            <>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Link de la Imagen</label>
                              <input
                                placeholder="https://ejemplo.com/foto.jpg"
                                value={formData.imageSrc}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => {
                                  setFormData(prev => ({ ...prev, imageSrc: e.target.value, hasImage: true }));
                                  if (errors.image) setErrors(prevErr => ({ ...prevErr, image: null }));
                                }}
                                style={{ fontSize: '0.9rem', padding: '0.9rem' }}
                              />
                            </>
                          ) : (
                            <div style={{
                              padding: '1rem',
                              border: '1px dashed rgba(255,255,255,0.2)',
                              borderRadius: '12px',
                              textAlign: 'center'
                            }}>
                              <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Selecciona una foto (Máx 2MB sugerido)</p>
                              <input
                                type="file"
                                accept="image/*"
                                id="image-upload"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const compressed = await compressImage(file);
                                    setFormData({ ...formData, imageFile: file, imageSrc: compressed, hasImage: true });
                                    if (errors.image) setErrors({ ...errors, image: null });
                                  }
                                }}
                              />
                              <label htmlFor="image-upload" className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                                {formData.imageFile ? `📸 ${formData.imageFile.name}` : 'Seleccionar Foto'}
                              </label>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Second Image Section (Dual Image) */}
                  {selectedTemplate.hasDualImage && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '20px',
                      border: errors.image2 ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '1rem'
                    }}>
                      {errors.image2 && (
                        <div style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '500' }}>
                          ⚠️ {errors.image2}
                        </div>
                      )}
                      <div
                        onClick={() => setFormData({ ...formData, hasImage2: !formData.hasImage2 })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: formData.hasImage2 ? '1.2rem' : '0',
                          padding: '1rem',
                          background: formData.hasImage2 ? 'rgba(77, 148, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '15px',
                          cursor: 'pointer',
                          border: formData.hasImage2 ? '2px solid #00aaff' : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '12px',
                            background: formData.hasImage2 ? '#00aaff' : 'rgba(0, 170, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Image size={24} color="white" />
                          </div>
                          <div>
                            <p style={{ fontWeight: '800', fontSize: '1.1rem', margin: 0, color: 'var(--text-light)' }}>Foto de Resultado</p>
                          </div>
                        </div>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '2px solid var(--text-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: formData.hasImage2 ? 'var(--text-light)' : 'transparent'
                        }}>
                          {formData.hasImage2 && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00aaff' }} />}
                        </div>
                      </div>

                      {formData.hasImage2 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                            {[
                              { id: 'url', label: 'Link Web', help: 'Pinterest/Google' },
                              { id: 'upload', label: 'Sube foto', help: 'Desde galería' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setFormData(prev => ({ ...prev, imageOption2: opt.id }))}
                                style={{
                                  padding: '0.8rem',
                                  borderRadius: '12px',
                                  border: formData.imageOption2 === opt.id ? '2px solid #00aaff' : '1px solid rgba(255,255,255,0.1)',
                                  background: formData.imageOption2 === opt.id ? 'rgba(0, 170, 255, 0.1)' : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s'
                                }}
                              >
                                <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: '0 0 2px 0', color: formData.imageOption2 === opt.id ? 'white' : 'var(--text-muted)' }}>{opt.label}</p>
                                <p style={{ fontSize: '0.65rem', margin: 0, color: 'var(--text-muted)' }}>{opt.help}</p>
                              </button>
                            ))}
                          </div>

                          {formData.imageOption2 === 'url' ? (
                            <>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Link de la Imagen</label>
                              <input
                                placeholder="https://ejemplo.com/foto.jpg"
                                value={formData.imageSrc2}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => {
                                  setFormData(prev => ({ ...prev, imageSrc2: e.target.value, hasImage2: true }));
                                  if (errors.image2) setErrors(prevErr => ({ ...prevErr, image2: null }));
                                }}
                                style={{ fontSize: '0.9rem', padding: '0.9rem' }}
                              />
                            </>
                          ) : (
                            <div style={{
                              padding: '1rem',
                              border: '1px dashed rgba(255,255,255,0.2)',
                              borderRadius: '12px',
                              textAlign: 'center'
                            }}>
                              <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Selecciona una foto de resultado (Máx 2MB sugerido)</p>
                              <input
                                type="file"
                                accept="image/*"
                                id="image-upload-2"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const compressed = await compressImage(file);
                                    setFormData(prev => ({ ...prev, imageFile2: file, imageSrc2: compressed, hasImage2: true }));
                                    if (errors.image2) setErrors(prevErr => ({ ...prevErr, image2: null }));
                                  }
                                }}
                              />
                              <label htmlFor="image-upload-2" className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                                {formData.imageFile2 ? `📸 ${formData.imageFile2.name}` : 'Seleccionar Foto'}
                              </label>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Dynamic Items Section */}
                  {selectedTemplate.hasItems && !selectedTemplate.hasDualImage && (
                    <div className="dynamic-content-container">
                      {/* Batch Mosaic Mode (heart-photo, our-year) */}
                      {(selectedTemplate.id === 'heart-photo' || selectedTemplate.id === 'our-year' || selectedTemplate.id === 'christmas' || selectedTemplate.id === 'love-cube') ? (
                        <div style={{
                          padding: '1.5rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          borderRadius: '24px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          marginBottom: '2rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: 40, height: 40, background: '#ff4d94', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Camera color="white" size={24} />
                            </div>
                            <div>
                              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                                {selectedTemplate.id === 'our-year' ? 'Resumen Anual (12 Meses)' :
                                  selectedTemplate.id === 'christmas' ? 'Árbol Mágico (16 Fotos)' :
                                    selectedTemplate.id === 'love-cube' ? 'Cubo 3D (6 Fotos)' :
                                      'Mosaico de Fotos (Min. 5)'}
                              </h3>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {selectedTemplate.id === 'our-year' ? 'Selecciona una foto para cada mes del año' :
                                  selectedTemplate.id === 'christmas' ? 'Selecciona 16 fotos para formar tu árbol' :
                                    selectedTemplate.id === 'love-cube' ? 'Selecciona 6 fotos para las caras del cubo' :
                                      'Sube tus fotos favoritas (Mínimo 5 para mejores resultados)'}
                              </p>
                            </div>
                          </div>


                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Link de Carpeta Drive (Púbica)</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input
                                placeholder="https://drive.google.com/drive/folders/..."
                                value={formData.driveFolderUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, driveFolderUrl: e.target.value }))}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                style={{ fontSize: '0.9rem', padding: '0.9rem', flex: 1 }}
                              />
                              <button
                                onClick={fetchDrivePhotos}
                                disabled={isFetchingDrive || !formData.driveFolderUrl}
                                className="btn glass"
                                style={{ padding: '0 1.2rem', background: 'rgba(57, 255, 20, 0.15)', border: '1px solid rgba(57, 255, 20, 0.3)' }}
                              >
                                {isFetchingDrive ? '⌛' : '✨ Sync'}
                              </button>
                            </div>
                            {errors.drive && <p style={{ fontSize: '0.7rem', color: '#ff4d94', marginTop: '5px' }}>{errors.drive}</p>}
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                              💡 Esto extraerá las primeras {selectedTemplate.itemsCount} fotos de tu carpeta de Drive automáticamente.
                            </p>
                          </div>

                          <div style={{
                            border: '2px dashed rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)'
                          }}>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              id="batch-upload"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const files = Array.from(e.target.files);
                                if (files.length > 0) {
                                  console.log(`[BATCH UPLOAD 📸] Starting upload of ${files.length} files`);
                                  setIsCompressingBatch(true);
                                  const newItems = [];
                                  // Process max allowed
                                  const filesToProcess = files.slice(0, selectedTemplate.itemsCount);
                                  for (const file of filesToProcess) {
                                    const compressed = await compressImage(file);
                                    console.log(`[BATCH UPLOAD 📸] Compressed ${file.name}: ${compressed.substring(0, 50)}...`);
                                    newItems.push({ id: Date.now() + Math.random(), type: 'image', content: compressed });
                                  }
                                  console.log(`[BATCH UPLOAD 📸] Setting ${newItems.length} items to formData`);
                                  setFormData(prev => {
                                    console.log('[BATCH UPLOAD 📸] Previous items:', prev.items?.length || 0);
                                    return { ...prev, items: newItems };
                                  });
                                  setIsCompressingBatch(false);
                                  console.log('[BATCH UPLOAD 📸] Upload complete');
                                }
                              }}
                            />
                            <label htmlFor="batch-upload" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: isCompressingBatch ? 0.7 : 1 }}>
                              {isCompressingBatch ? '⌛ Procesando...' : `📸 Seleccionar Fotos [${formData.items.length || '0'}/${selectedTemplate.itemsCount}]`}
                            </label>
                            <p style={{ fontSize: '0.7rem', marginTop: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                              {selectedTemplate.id === 'our-year'
                                ? 'Selecciona 12 fotos (una para cada mes). Se repetirán si subes menos.'
                                : selectedTemplate.id === 'christmas'
                                  ? 'Selecciona 16 fotos para tu árbol (incluye tallo). Se repetirán si subes menos.'
                                  : selectedTemplate.id === 'love-cube'
                                    ? 'Selecciona 6 fotos para cubrir todas las caras del cubo.'
                                    : 'Selecciona de 5 a 25 fotos de tu galería. Se repetirán automáticamente para llenar el corazón.'
                              }
                            </p>
                          </div>

                          {formData.items.length > 0 && (
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(5, 1fr)',
                              gap: '6px',
                              marginTop: '1.5rem',
                              maxHeight: '180px',
                              overflowY: 'auto',
                              padding: '10px',
                              background: 'rgba(0,0,0,0.2)',
                              borderRadius: '12px'
                            }}>
                              {formData.items.map((it, idx) => (
                                <div key={idx} style={{ aspectRatio: '1/1', background: '#222', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <img src={it.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <div style={{ position: 'absolute', top: 2, left: 2, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '9px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: 'bold' }}>
                                    {idx + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="dynamic-section-group text-accent">
                            <div className={`action-row-card ${expandedSections.text ? 'expanded' : ''}`} onClick={() => {
                              setExpandedSections(prev => ({ ...prev, text: !prev.text }));
                            }}>
                              <div className="flex items-center gap-4">
                                <div className="action-row-icon text-accent">
                                  <BookOpen size={20} />
                                </div>
                                <div className="action-row-body">
                                  <span className="action-row-text">+ Agregar Párrafo</span>
                                  <small className="action-row-hint">Añade un texto o dedicatoria</small>
                                </div>
                              </div>
                              <div className="card-radio-decoration">
                                {expandedSections.text && <div className="inner-dot"></div>}
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedSections.text && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="section-items-expandable"
                                >
                                  <div className="section-actions-bar">
                                    {formData.items.length < BASE_DYNAMIC_LIMIT + extraSlots ? (
                                      <button className="btn-add-inline text-accent" onClick={(e) => {
                                        e.stopPropagation();
                                        const newItem = { id: Date.now(), type: 'text', content: '' };
                                        setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
                                      }}>
                                        + Nuevo Párrafo
                                      </button>
                                    ) : (
                                      <button
                                        className="btn-add-inline text-accent"
                                        style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.03)' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showRewardedAd(() => {
                                            setExtraSlots(prev => prev + 1);
                                          });
                                        }}
                                      >
                                        📺 Desbloquear +1
                                      </button>
                                    )}
                                  </div>

                                  <div className="dynamic-items-display-list">
                                    {formData.items.filter(it => it.type === 'text').map((item, idx) => {
                                      const realIndex = formData.items.findIndex(it => it.id === item.id);
                                      return (
                                        <motion.div
                                          key={item.id}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="dynamic-item-entry"
                                        >
                                          <div className="item-entry-header">
                                            <span className="item-entry-label">Párrafo {idx + 1}</span>
                                            <button
                                              className="item-entry-remove"
                                              onClick={() => {
                                                const newItems = [...formData.items];
                                                newItems.splice(realIndex, 1);
                                                setFormData({ ...formData, items: newItems });
                                              }}
                                            >
                                              <Minus size={14} /> Quitar
                                            </button>
                                          </div>
                                          <textarea
                                            className="item-text-input"
                                            placeholder="Escribe el mensaje..."
                                            value={item.content}
                                            rows={3}
                                            onFocus={() => isMobileApp && hideBannerAd()}
                                            onBlur={() => isMobileApp && showBannerAd()}
                                            onChange={(e) => {
                                              const newItems = [...formData.items];
                                              newItems[realIndex].content = e.target.value;
                                              setFormData({ ...formData, items: newItems });
                                            }}
                                          />
                                        </motion.div>
                                      );
                                    })}
                                    {formData.items.filter(it => it.type === 'text').length === 0 && (
                                      <div className="empty-section-tip">Aún no hay párrafos. Haz clic en "Nuevo Párrafo".</div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Section 2: Photos */}
                          <div className="dynamic-section-group image-accent" style={{ marginTop: '1rem' }}>
                            <div className={`action-row-card ${expandedSections.image ? 'expanded' : ''}`} onClick={() => {
                              setExpandedSections(prev => ({ ...prev, image: !prev.image }));
                            }}>
                              <div className="flex items-center gap-4">
                                <div className="action-row-icon image-accent">
                                  <Camera size={20} />
                                </div>
                                <div className="action-row-body">
                                  <span className="action-row-text">+ Agregar Fotografía</span>
                                  <small className="action-row-hint">Sube una imagen especial</small>
                                </div>
                              </div>
                              <div className="card-radio-decoration">
                                {expandedSections.image && <div className="inner-dot"></div>}
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedSections.image && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="section-items-expandable"
                                >
                                  <div className="section-actions-bar">
                                    {formData.items.length < BASE_DYNAMIC_LIMIT + extraSlots ? (
                                      <button className="btn-add-inline image-accent" onClick={(e) => {
                                        e.stopPropagation();
                                        const newItem = { id: Date.now(), type: 'image', content: '', option: 'url' };
                                        setFormData({ ...formData, items: [...formData.items, newItem] });
                                      }}>
                                        + Nueva Foto
                                      </button>
                                    ) : (
                                      <button
                                        className="btn-add-inline image-accent"
                                        style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.03)' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showRewardedAd(() => {
                                            setExtraSlots(prev => prev + 1);
                                          });
                                        }}
                                      >
                                        📺 Desbloquear +1
                                      </button>
                                    )}
                                  </div>

                                  <div className="dynamic-items-display-list">
                                    {formData.items.filter(it => it.type === 'image').map((item, idx) => {
                                      const realIndex = formData.items.findIndex(it => it.id === item.id);
                                      return (
                                        <motion.div
                                          key={item.id}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          style={{
                                            padding: '1.5rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            marginBottom: '1.5rem',
                                            position: 'relative'
                                          }}
                                        >
                                          <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '1.2rem',
                                            padding: '0.8rem 1rem',
                                            background: 'rgba(77, 148, 255, 0.1)',
                                            borderRadius: '15px'
                                          }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                              <div style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '10px',
                                                background: '#00aaff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                              }}>
                                                <Camera size={18} color="white" />
                                              </div>
                                              <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-light)' }}>Foto {idx + 1}</span>
                                            </div>
                                            <button
                                              onClick={() => {
                                                const newItems = [...formData.items];
                                                newItems.splice(realIndex, 1);
                                                setFormData({ ...formData, items: newItems });
                                              }}
                                              style={{
                                                background: 'rgba(255, 0, 0, 0.1)',
                                                border: 'none',
                                                color: '#ff4d4d',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                              }}
                                            >
                                              <Minus size={12} /> Quitar
                                            </button>
                                          </div>

                                          <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                            gap: '0.8rem',
                                            marginBottom: '1rem'
                                          }}>
                                            {[
                                              { id: 'url', label: 'Link Web', help: 'Pinterest/Google' },
                                              { id: 'upload', label: 'Sube foto', help: 'Desde galería' }
                                            ].map(opt => (
                                              <button
                                                key={opt.id}
                                                onClick={() => {
                                                  const newItems = [...formData.items];
                                                  newItems[realIndex].option = opt.id;
                                                  setFormData({ ...formData, items: newItems });
                                                }}
                                                style={{
                                                  padding: '0.8rem',
                                                  borderRadius: '12px',
                                                  border: item.option === opt.id || (!item.option && opt.id === 'url') ? '2px solid #00aaff' : '1px solid rgba(255,255,255,0.1)',
                                                  background: item.option === opt.id || (!item.option && opt.id === 'url') ? 'rgba(0, 170, 255, 0.1)' : 'transparent',
                                                  cursor: 'pointer',
                                                  transition: 'all 0.3s',
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  minHeight: '60px'
                                                }}
                                              >
                                                <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: '0 0 2px 0', color: item.option === opt.id || (!item.option && opt.id === 'url') ? 'white' : 'var(--text-muted)' }}>{opt.label}</p>
                                                <p style={{ fontSize: '0.7rem', margin: 0, color: 'var(--text-muted)' }}>{opt.help}</p>
                                              </button>
                                            ))}
                                          </div>

                                          {(!item.option || item.option === 'url') ? (
                                            <input
                                              placeholder="Pega link de la foto aquí..."
                                              value={item.content}
                                              onFocus={() => isMobileApp && hideBannerAd()}
                                              onBlur={() => isMobileApp && showBannerAd()}
                                              onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[realIndex].content = e.target.value;
                                                setFormData({ ...formData, items: newItems });
                                              }}
                                              style={{ fontSize: '0.85rem', padding: '0.8rem' }}
                                            />
                                          ) : (
                                            <div style={{
                                              padding: '1rem',
                                              border: '1px dashed rgba(255,255,255,0.2)',
                                              borderRadius: '12px',
                                              textAlign: 'center'
                                            }}>
                                              {item.content ? (
                                                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
                                                  <img src={item.content} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                  <button
                                                    onClick={() => {
                                                      const input = document.createElement('input');
                                                      input.type = 'file';
                                                      input.accept = 'image/*';
                                                      input.onchange = async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                          setIsGenerating(true);
                                                          const compressed = await compressImage(file);
                                                          const newItems = [...formData.items];
                                                          newItems[realIndex].content = compressed;
                                                          setFormData({ ...formData, items: newItems });
                                                          setIsGenerating(false);
                                                        }
                                                      };
                                                      input.click();
                                                    }}
                                                    style={{ position: 'absolute', bottom: -5, right: -5, background: '#00aaff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', color: 'white' }}
                                                  >✎</button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = async (e) => {
                                                      const file = e.target.files[0];
                                                      if (file) {
                                                        setIsGenerating(true);
                                                        const compressed = await compressImage(file);
                                                        const newItems = [...formData.items];
                                                        newItems[realIndex].content = compressed;
                                                        setFormData({ ...formData, items: newItems });
                                                        setIsGenerating(false);
                                                      }
                                                    };
                                                    input.click();
                                                  }}
                                                  className="btn glass"
                                                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
                                                >
                                                  <Camera size={18} /> Seleccionar Foto
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </motion.div>
                                      );
                                    })}
                                    {formData.items.filter(it => it.type === 'image').length === 0 && (
                                      <div className="empty-section-tip">Aún no hay fotos. Haz clic en "Nueva Foto".</div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Audio Selection Section */}
                  <div id="audio-section" style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {(errors.audio || errors.youtube) && (
                      <div style={{
                        color: '#ff4d94',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        fontWeight: '800',
                        padding: '0.8rem',
                        background: 'rgba(255, 77, 148, 0.1)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 77, 148, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Music size={16} /> {errors.audio || errors.youtube}
                      </div>
                    )}

                    <div
                      onClick={() => setFormData(prev => ({ ...prev, hasAudio: !prev.hasAudio }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.2rem',
                        padding: '1rem',
                        background: formData.hasAudio ? 'rgba(255, 77, 148, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        border: formData.hasAudio ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      className="audio-toggle-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '12px',
                          background: formData.hasAudio ? 'var(--primary)' : 'rgba(255, 0, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s'
                        }}>
                          <Music size={24} color="white" />
                        </div>
                        <div>
                          <p style={{ fontWeight: '800', fontSize: '1.1rem', margin: 0, color: 'var(--text-light)' }}>Música Mágica</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{formData.hasAudio ? 'Música activada ✨' : 'Click para añadir música'}</p>
                        </div>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: formData.hasAudio ? 'var(--text-light)' : 'transparent'
                      }}>
                        {formData.hasAudio && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
                      </div>
                    </div>

                    {formData.hasAudio && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                          {[
                            { id: 'youtube', label: 'YouTube', help: 'Video' },
                            { id: 'upload', label: 'Subir audio', help: 'Solo HTML' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setFormData(prev => ({ ...prev, audioOption: opt.id }))}
                              style={{
                                padding: '0.8rem',
                                borderRadius: '12px',
                                border: formData.audioOption === opt.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                background: formData.audioOption === opt.id ? 'rgba(255, 77, 148, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                            >
                              <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: '0 0 2px 0', color: formData.audioOption === opt.id ? 'white' : 'var(--text-muted)' }}>{opt.label}</p>
                              <p style={{ fontSize: '0.65rem', margin: 0, color: 'var(--text-muted)' }}>{opt.help}</p>
                            </button>
                          ))}
                        </div>

                        {formData.audioOption === 'upload' && (
                          <div style={{
                            padding: '1rem',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Sube tu archivo .mp3 o .m4a (Máx 5MB)</p>
                            <input
                              type="file"
                              accept="audio/mp3,audio/mpeg,audio/x-m4a,audio/m4a"
                              id="audio-upload"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setFormData(prev => ({ ...prev, audioFile: file, audioSrc: event.target.result }));
                                    if (errors.audio) setErrors(prevErr => ({ ...prevErr, audio: null }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor="audio-upload" className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                              {formData.audioFile ? `🎶 ${formData.audioFile.name}` : 'Seleccionar Archivo'}
                            </label>
                          </div>
                        )}

                        {formData.audioOption === 'youtube' && (
                          <input
                            name="youtube"
                            placeholder="Link de YouTube (ej. https://youtube.com/...)"
                            value={formData.youtubeUrl}
                            onFocus={() => isMobileApp && hideBannerAd()}
                            onBlur={() => isMobileApp && showBannerAd()}
                            onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                            style={{ fontSize: '0.9rem', padding: '0.9rem' }}
                          />
                        )}

                      </motion.div>
                    )}
                  </div>

                  {/* Tarjeta Futbolista ⚽ Section */}
                  {selectedTemplate?.id === 'soccer-card' && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 215, 0, 0.05)',
                      borderRadius: '20px',
                      border: '2px solid rgba(255, 215, 0, 0.2)',
                      marginTop: '1.5rem',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1.2rem',
                        color: '#FFD700',
                        marginBottom: '1rem'
                      }}>
                        ⚽ Datos del Jugador
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Rating (0-99)</label>
                          <input
                            className="input"
                            type="number"
                            placeholder="82"
                            value={formData.soccer_rating}
                            onChange={(e) => setFormData({ ...formData, soccer_rating: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Posición</label>
                          <input
                            className="input"
                            placeholder="ST"
                            value={formData.soccer_pos}
                            onChange={(e) => setFormData(prev => ({ ...prev, soccer_pos: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Nombre del Jugador</label>
                        <input
                          className="input"
                          placeholder="Messi"
                          value={formData.soccer_name}
                          onChange={(e) => setFormData({ ...formData, soccer_name: e.target.value })}
                        />
                      </div>

                      <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.6rem' }}>Bandera del País</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="🔍 Buscar país..."
                            value={searchTermFlag || ''}
                            onChange={(e) => setSearchTermFlag(e.target.value)}
                            onFocus={() => {
                              setFlagPickerOpen(true);
                              isMobileApp && hideBannerAd();
                            }}
                            onBlur={() => {
                              setTimeout(() => setFlagPickerOpen(false), 200)
                              isMobileApp && showBannerAd();
                            }}
                          />
                          <div style={{ position: 'absolute', top: '10px', right: '15px', height: '32px', display: 'flex', alignItems: 'center' }}>
                            <span className={`fi fi-${formData.soccer_flag}`} style={{ width: '28px', height: '20px', borderRadius: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}></span>
                          </div>

                          {flagPickerOpen && (
                            <div style={{
                              position: 'absolute', top: '100%', left: 0, width: '100%', maxHeight: '200px',
                              overflowY: 'auto', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px', zIndex: 1000, marginTop: '5px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                            }}>
                              {[
                                { n: 'Argentina', c: 'ar' }, { n: 'México', c: 'mx' }, { n: 'España', c: 'es' },
                                { n: 'Colombia', c: 'co' }, { n: 'Chile', c: 'cl' }, { n: 'Perú', c: 'pe' },
                                { n: 'Ecuador', c: 'ec' }, { n: 'Uruguay', c: 'uy' }, { n: 'Brasil', c: 'br' },
                                { n: 'Estados Unidos', c: 'us' }, { n: 'Francia', c: 'fr' }, { n: 'Portugal', c: 'pt' },
                                { n: 'Alemania', c: 'de' }, { n: 'Italia', c: 'it' }, { n: 'Inglaterra', c: 'gb-eng' },
                                { n: 'Venezuela', c: 've' }, { n: 'Bolivia', c: 'bo' }, { n: 'Paraguay', c: 'py' },
                                { n: 'Costa Rica', c: 'cr' }, { n: 'Panamá', c: 'pa' }, { n: 'Guatemala', c: 'gt' },
                                { n: 'Honduras', c: 'hn' }, { n: 'El Salvador', c: 'sv' }, { n: 'Nicaragua', c: 'ni' },
                                { n: 'Rep. Dominicana', c: 'do' }, { n: 'Puerto Rico', c: 'pr' }, { n: 'Canadá', c: 'ca' },
                                { n: 'Marruecos', c: 'ma' }, { n: 'Japón', c: 'jp' }, { n: 'Corea del Sur', c: 'kr' }
                              ].filter(c => c.n.toLowerCase().includes((searchTermFlag || '').toLowerCase()))
                                .map(country => (
                                  <div
                                    key={country.n}
                                    onMouseDown={() => {
                                      setFormData({ ...formData, soccer_flag: country.c });
                                      setSearchTermFlag(country.n);
                                      setFlagPickerOpen(false);
                                    }}
                                    style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', background: formData.soccer_flag === country.c ? 'rgba(255,215,0,0.1)' : 'transparent' }}
                                  >
                                    <span className={`fi fi-${country.c}`} style={{ width: '24px', height: '18px', borderRadius: '2px' }}></span>
                                    <span style={{ color: 'white' }}>{country.n}</span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Club / Info adicional</label>
                        <input
                          className="input"
                          placeholder="Inter de Miami"
                          value={formData.soccer_info}
                          onFocus={() => isMobileApp && hideBannerAd()}
                          onBlur={() => isMobileApp && showBannerAd()}
                          onChange={(e) => setFormData({ ...formData, soccer_info: e.target.value })}
                        />
                      </div>

                      <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Estadísticas</h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                        {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(id => (
                          <div key={id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{id.toUpperCase()}</label>
                              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '0.8rem' }}>{formData[`soccer_${id}`]}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="99"
                              value={formData[`soccer_${id}`]}
                              onChange={(e) => setFormData({ ...formData, [`soccer_${id}`]: e.target.value })}
                              style={{ width: '100%', accentColor: '#FFD700' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vitaminas Amor Section */}
                  {selectedTemplate?.id === 'vitamins' && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 107, 157, 0.1)',
                      borderRadius: '20px',
                      border: '2px solid rgba(255, 107, 157, 0.3)',
                      marginTop: '1.5rem',
                      position: 'relative'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: vitaminsExpanded ? '1.5rem' : '0'
                      }}>
                        <div>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.2rem',
                            color: '#ff6b9d',
                            margin: 0
                          }}>
                            💊 Vitaminas del Amor
                          </h3>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                vitamina_a_text: 'Abrazos',
                                vitamina_a_msg: 'Los más cálidos 🤗',
                                vitamina_a_emoji: '🤗',
                                vitamina_b_text: 'Besos',
                                vitamina_b_msg: 'Dulces y tiernos 😘',
                                vitamina_b_emoji: '😘',
                                vitamina_c_text: 'Caricias',
                                vitamina_c_msg: 'Suaves toda la noche 💕',
                                vitamina_c_emoji: '💕',
                                vitamina_d_text: 'Delicioso',
                                vitamina_d_msg: 'Las veces que tu quieras 😏💘',
                                vitamina_d_emoji: '🔥😈'
                              });
                              setVitaminsExpanded(true);
                            }}
                            className="glass"
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.8rem',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.15)',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              cursor: 'pointer'
                            }}
                          >
                            🪄 Auto-llenar
                          </button>

                          <button
                            onClick={() => setVitaminsExpanded(!vitaminsExpanded)}
                            className="glass"
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.8rem',
                              borderRadius: '10px',
                              background: vitaminsExpanded ? 'var(--primary)' : 'rgba(255, 255, 255, 0.15)',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            {vitaminsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {vitaminsExpanded ? 'Ocultar' : 'Personalizar'}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {vitaminsExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                              Define el significado y mensaje para cada vitamina (A, B, C, D)
                            </p>

                            {/* Vitamina A */}
                            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                              <h4 style={{ color: '#FFD700', fontSize: '1rem', marginBottom: '0.8rem', fontWeight: '700' }}>🟡 Vitamina A</h4>
                              <input
                                className="input"
                                placeholder="Significado (Ej: Abrazos)"
                                value={formData.vitamina_a_text}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_a_text: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Mensaje (Ej: Los más cálidos 🤗)"
                                value={formData.vitamina_a_msg}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_a_msg: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Emoji (Ej: 🤗)"
                                value={formData.vitamina_a_emoji}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_a_emoji: e.target.value })}
                                maxLength={4}
                                style={{ marginBottom: '0.8rem' }}
                              />

                              {/* Photo Options for Vitamina A */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '0.8rem' }}>
                                {[
                                  { id: 'url', label: 'Link Web', help: 'Imagen online' },
                                  { id: 'upload', label: 'Sube foto', help: 'De galería' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setFormData({ ...formData, vitamina_a_opt: opt.id })}
                                    style={{
                                      padding: '0.5rem',
                                      borderRadius: '10px',
                                      border: formData.vitamina_a_opt === opt.id ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                                      background: formData.vitamina_a_opt === opt.id ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s'
                                    }}
                                  >
                                    <p style={{ fontWeight: '700', fontSize: '0.75rem', margin: '0 0 1px 0', color: formData.vitamina_a_opt === opt.id ? 'white' : 'rgba(255,255,255,0.6)' }}>{opt.label}</p>
                                    <p style={{ fontSize: '0.55rem', margin: 0, color: 'rgba(255,255,255,0.4)' }}>{opt.help}</p>
                                  </button>
                                ))}
                              </div>

                              {formData.vitamina_a_opt === 'url' ? (
                                <input
                                  className="input"
                                  placeholder="https://ejemplo.com/foto.jpg"
                                  value={formData.vitamina_a_img}
                                  onFocus={() => isMobileApp && hideBannerAd()}
                                  onBlur={() => isMobileApp && showBannerAd()}
                                  onChange={(e) => setFormData({ ...formData, vitamina_a_img: e.target.value })}
                                  style={{ marginBottom: '0.8rem', fontSize: '0.85rem' }}
                                />
                              ) : (
                                <div style={{ marginBottom: '0.8rem' }}>
                                  {formData.vitamina_a_img && formData.vitamina_a_img.startsWith('data:') ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                      <img src={formData.vitamina_a_img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                      <button
                                        onClick={() => setFormData({ ...formData, vitamina_a_img: '' })}
                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}
                                      >✕</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            setIsGenerating(true);
                                            const compressed = await compressImage(file);
                                            setFormData(prev => ({ ...prev, vitamina_a_img: compressed }));
                                            setIsGenerating(false);
                                          }
                                        };
                                        input.click();
                                      }}
                                      className="btn-upload-small"
                                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(255, 215, 0, 0.2)', border: '1px solid rgba(255, 215, 0, 0.4)' }}
                                    >
                                      <Camera size={14} /> Seleccionar Foto A
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Vitamina B */}
                            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: 'rgba(255, 99, 71, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 99, 71, 0.3)' }}>
                              <h4 style={{ color: '#FF6347', fontSize: '1rem', marginBottom: '0.8rem', fontWeight: '700' }}>🔴 Vitamina B</h4>
                              <input
                                className="input"
                                placeholder="Significado (Ej: Besos)"
                                value={formData.vitamina_b_text}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_b_text: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Mensaje (Ej: Dulces y tiernos 😘)"
                                value={formData.vitamina_b_msg}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_b_msg: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Emoji (Ej: 😘)"
                                value={formData.vitamina_b_emoji}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_b_emoji: e.target.value })}
                                maxLength={4}
                                style={{ marginBottom: '0.8rem' }}
                              />

                              {/* Photo Options for Vitamina B */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '0.8rem' }}>
                                {[
                                  { id: 'url', label: 'Link Web', help: 'Imagen online' },
                                  { id: 'upload', label: 'Sube foto', help: 'De galería' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setFormData({ ...formData, vitamina_b_opt: opt.id })}
                                    style={{
                                      padding: '0.5rem',
                                      borderRadius: '10px',
                                      border: formData.vitamina_b_opt === opt.id ? '2px solid #FF6347' : '1px solid rgba(255,255,255,0.1)',
                                      background: formData.vitamina_b_opt === opt.id ? 'rgba(255, 99, 71, 0.1)' : 'transparent',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s'
                                    }}
                                  >
                                    <p style={{ fontWeight: '700', fontSize: '0.75rem', margin: '0 0 1px 0', color: formData.vitamina_b_opt === opt.id ? 'white' : 'rgba(255,255,255,0.6)' }}>{opt.label}</p>
                                    <p style={{ fontSize: '0.55rem', margin: 0, color: 'rgba(255,255,255,0.4)' }}>{opt.help}</p>
                                  </button>
                                ))}
                              </div>

                              {formData.vitamina_b_opt === 'url' ? (
                                <input
                                  className="input"
                                  placeholder="https://ejemplo.com/foto.jpg"
                                  value={formData.vitamina_b_img}
                                  onFocus={() => isMobileApp && hideBannerAd()}
                                  onBlur={() => isMobileApp && showBannerAd()}
                                  onChange={(e) => setFormData({ ...formData, vitamina_b_img: e.target.value })}
                                  style={{ marginBottom: '0.8rem', fontSize: '0.85rem' }}
                                />
                              ) : (
                                <div style={{ marginBottom: '0.8rem' }}>
                                  {formData.vitamina_b_img && formData.vitamina_b_img.startsWith('data:') ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                      <img src={formData.vitamina_b_img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                      <button
                                        onClick={() => setFormData({ ...formData, vitamina_b_img: '' })}
                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}
                                      >✕</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            setIsGenerating(true);
                                            const compressed = await compressImage(file);
                                            setFormData(prev => ({ ...prev, vitamina_b_img: compressed }));
                                            setIsGenerating(false);
                                          }
                                        };
                                        input.click();
                                      }}
                                      className="btn-upload-small"
                                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(255, 99, 71, 0.2)', border: '1px solid rgba(255, 99, 71, 0.4)' }}
                                    >
                                      <Camera size={14} /> Seleccionar Foto B
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Vitamina C */}
                            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
                              <h4 style={{ color: '#FFA500', fontSize: '1rem', marginBottom: '0.8rem', fontWeight: '700' }}>🟠 Vitamina C</h4>
                              <input
                                className="input"
                                placeholder="Significado (Ej: Caricias)"
                                value={formData.vitamina_c_text}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_c_text: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Mensaje (Ej: Suaves toda la noche 💕)"
                                value={formData.vitamina_c_msg}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_c_msg: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Emoji (Ej: 💕)"
                                value={formData.vitamina_c_emoji}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_c_emoji: e.target.value })}
                                maxLength={4}
                                style={{ marginBottom: '0.8rem' }}
                              />

                              {/* Photo Options for Vitamina C */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '0.8rem' }}>
                                {[
                                  { id: 'url', label: 'Link Web', help: 'Imagen online' },
                                  { id: 'upload', label: 'Sube foto', help: 'De galería' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setFormData({ ...formData, vitamina_c_opt: opt.id })}
                                    style={{
                                      padding: '0.5rem',
                                      borderRadius: '10px',
                                      border: formData.vitamina_c_opt === opt.id ? '2px solid #FFA500' : '1px solid rgba(255,255,255,0.1)',
                                      background: formData.vitamina_c_opt === opt.id ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s'
                                    }}
                                  >
                                    <p style={{ fontWeight: '700', fontSize: '0.75rem', margin: '0 0 1px 0', color: formData.vitamina_c_opt === opt.id ? 'white' : 'rgba(255,255,255,0.6)' }}>{opt.label}</p>
                                    <p style={{ fontSize: '0.55rem', margin: 0, color: 'rgba(255,255,255,0.4)' }}>{opt.help}</p>
                                  </button>
                                ))}
                              </div>

                              {formData.vitamina_c_opt === 'url' ? (
                                <input
                                  className="input"
                                  placeholder="https://ejemplo.com/foto.jpg"
                                  value={formData.vitamina_c_img}
                                  onFocus={() => isMobileApp && hideBannerAd()}
                                  onBlur={() => isMobileApp && showBannerAd()}
                                  onChange={(e) => setFormData({ ...formData, vitamina_c_img: e.target.value })}
                                  style={{ marginBottom: '0.8rem', fontSize: '0.85rem' }}
                                />
                              ) : (
                                <div style={{ marginBottom: '0.8rem' }}>
                                  {formData.vitamina_c_img && formData.vitamina_c_img.startsWith('data:') ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                      <img src={formData.vitamina_c_img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                      <button
                                        onClick={() => setFormData({ ...formData, vitamina_c_img: '' })}
                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}
                                      >✕</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            setIsGenerating(true);
                                            const compressed = await compressImage(file);
                                            setFormData(prev => ({ ...prev, vitamina_c_img: compressed }));
                                            setIsGenerating(false);
                                          }
                                        };
                                        input.click();
                                      }}
                                      className="btn-upload-small"
                                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(255, 165, 0, 0.2)', border: '1px solid rgba(255, 165, 0, 0.4)' }}
                                    >
                                      <Camera size={14} /> Seleccionar Foto C
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Vitamina D */}
                            <div style={{ padding: '1rem', background: 'rgba(0, 191, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 191, 255, 0.3)' }}>
                              <h4 style={{ color: '#00BFFF', fontSize: '1rem', marginBottom: '0.8rem', fontWeight: '700' }}>🔵 Vitamina D</h4>
                              <input
                                className="input"
                                placeholder="Significado (Ej: Delicioso)"
                                value={formData.vitamina_d_text}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_d_text: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Mensaje (Ej: Las veces que quieras 😏💘)"
                                value={formData.vitamina_d_msg}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_d_msg: e.target.value })}
                                style={{ marginBottom: '0.8rem' }}
                              />
                              <input
                                className="input"
                                placeholder="Emoji (Ej: 😏💘 o 🔥😈)"
                                value={formData.vitamina_d_emoji}
                                onFocus={() => isMobileApp && hideBannerAd()}
                                onBlur={() => isMobileApp && showBannerAd()}
                                onChange={(e) => setFormData({ ...formData, vitamina_d_emoji: e.target.value })}
                                maxLength={4}
                                style={{ marginBottom: '0.8rem' }}
                              />

                              {/* Photo Options for Vitamina D */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '0.8rem' }}>
                                {[
                                  { id: 'url', label: 'Link Web', help: 'Imagen online' },
                                  { id: 'upload', label: 'Sube foto', help: 'De galería' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setFormData({ ...formData, vitamina_d_opt: opt.id })}
                                    style={{
                                      padding: '0.5rem',
                                      borderRadius: '10px',
                                      border: formData.vitamina_d_opt === opt.id ? '2px solid #00BFFF' : '1px solid rgba(255,255,255,0.1)',
                                      background: formData.vitamina_d_opt === opt.id ? 'rgba(0, 191, 255, 0.1)' : 'transparent',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s'
                                    }}
                                  >
                                    <p style={{ fontWeight: '700', fontSize: '0.75rem', margin: '0 0 1px 0', color: formData.vitamina_d_opt === opt.id ? 'white' : 'rgba(255,255,255,0.6)' }}>{opt.label}</p>
                                    <p style={{ fontSize: '0.55rem', margin: 0, color: 'rgba(255,255,255,0.4)' }}>{opt.help}</p>
                                  </button>
                                ))}
                              </div>

                              {formData.vitamina_d_opt === 'url' ? (
                                <input
                                  className="input"
                                  placeholder="https://ejemplo.com/foto.jpg"
                                  value={formData.vitamina_d_img}
                                  onFocus={() => isMobileApp && hideBannerAd()}
                                  onBlur={() => isMobileApp && showBannerAd()}
                                  onChange={(e) => setFormData({ ...formData, vitamina_d_img: e.target.value })}
                                  style={{ marginBottom: '0.8rem', fontSize: '0.85rem' }}
                                />
                              ) : (
                                <div style={{ marginBottom: '0.8rem' }}>
                                  {formData.vitamina_d_img && formData.vitamina_d_img.startsWith('data:') ? (
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                      <img src={formData.vitamina_d_img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                      <button
                                        onClick={() => setFormData({ ...formData, vitamina_d_img: '' })}
                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}
                                      >✕</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            setIsGenerating(true);
                                            const compressed = await compressImage(file);
                                            setFormData(prev => ({ ...prev, vitamina_d_img: compressed }));
                                            setIsGenerating(false);
                                          }
                                        };
                                        input.click();
                                      }}
                                      className="btn-upload-small"
                                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(0, 191, 255, 0.2)', border: '1px solid rgba(0, 191, 255, 0.4)' }}
                                    >
                                      <Camera size={14} /> Seleccionar Foto D
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={handleGenerate}
                    disabled={isGenerating || isFetchingDrive || (formData.driveFolderUrl && !driveSynced)}
                    style={{
                      width: '100%',
                      padding: '1.2rem',
                      fontSize: '1.1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.8rem',
                      marginBottom: '1rem',
                      boxShadow: '0 8px 25px rgba(255, 0, 255, 0.3)',
                      opacity: (isGenerating || isFetchingDrive || (formData.driveFolderUrl && !driveSynced)) ? 0.7 : 1,
                      cursor: (isGenerating || isFetchingDrive || (formData.driveFolderUrl && !driveSynced)) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="loader-small" /> Preparando Magia...
                      </>
                    ) : isFetchingDrive ? (
                      <>
                        <div className="loader-small" /> Sincronizando Drive...
                      </>
                    ) : (formData.driveFolderUrl && !driveSynced) ? (
                      <>
                        <Sparkles size={22} /> Pulsa "Sync" para Continuar
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} /> Generar Mensaje Mágico
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  style={{ fontSize: '5rem', marginBottom: '1.5rem' }}
                  animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  ✨🎉✨
                </motion.div>
                <h2 style={{
                  marginBottom: '1rem',
                  fontSize: '2rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '700'
                }}>
                  ¡Tu mensaje mágico está listo!
                </h2>

                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Abre la vista previa, comparte el link por WhatsApp o descarga el archivo HTML para enviarlo directamente.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <button
                    onClick={() => setShowResult(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    ← Volver a editar mensaje
                  </button>

                  <button
                    onClick={() => {
                      const dataToView = { ...formData, html: selectedTemplate.content, t: selectedTemplate.id };
                      console.log('[VIEW DATA 👁️] Setting viewData with items:', dataToView.items?.length || 0);
                      console.log('[VIEW DATA 👁️] First item preview:', dataToView.items?.[0]?.content?.substring(0, 50));
                      setViewData(dataToView);
                    }}
                    className="btn btn-primary"
                    style={{
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      padding: '1.1rem 2rem',
                      boxShadow: '0 8px 25px rgba(255, 77, 148, 0.5)',
                      width: '100%'
                    }}
                  >
                    <Sparkles size={22} /> Ver Vista Previa
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                      className="btn glass"
                      onClick={handleCopyLink}
                      style={{
                        justifyContent: 'center',
                        background: copied ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,0,255,0.15)',
                        border: copied ? '2px solid rgba(76, 175, 80, 0.5)' : '2px solid rgba(255,0,255,0.4)',
                        fontSize: '1rem',
                        padding: '1rem 1.5rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={20} color="#4CAF50" />
                          <span style={{ color: '#4CAF50', fontWeight: '600' }}>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon size={20} color="#ff00ff" />
                          <span>Link</span>
                        </>
                      )}
                    </button>

                    {isMobileApp ? (
                      <button
                        className="btn glass"
                        onClick={async () => {
                          const safeN = (formData.name || 'alguien').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                          const safeS = (formData.sender || 'tu').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                          const fileName = `${selectedTemplate.id}_${safeS}_para_${safeN}.html`;
                          const redHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=${generatedUrl}"><title>Magic ✨</title></head><body><script>window.location.href="${generatedUrl}";</script></body></html>`;
                          await shareHTMLFile({ fileName, htmlContent: redHtml });
                        }}
                        style={{
                          justifyContent: 'center',
                          background: 'rgba(255, 107, 157, 0.15)',
                          border: '2px solid rgba(255, 107, 157, 0.4)',
                          fontSize: '1rem',
                          padding: '1rem 1.5rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Share2 size={20} color="#ff6b9d" />
                        <span>Compartir</span>
                      </button>
                    ) : (
                      <button
                        className="btn glass"
                        onClick={handleDownload}
                        style={{
                          justifyContent: 'center',
                          background: 'rgba(0, 242, 255, 0.15)',
                          border: '2px solid rgba(0, 242, 255, 0.4)',
                          fontSize: '1rem',
                          padding: '1rem 1.5rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Download size={20} color="#00f2ff" />
                        <span>Bajar</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )
      }

      {/* How It Works Section */}
      {
        !selectedTemplate && (
          <section id="como-funciona" style={{ marginTop: '8rem', marginBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ¿Cómo funciona la magia?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Crear mensajes interactivos nunca fue tan fácil. Solo sigue estos 3 simples pasos
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              {STEPS.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="glass"
                  style={{ padding: '2.5rem', position: 'relative', textAlign: 'center' }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${TEMPLATES[idx % 3].color}, ${TEMPLATES[(idx + 1) % 3].color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    margin: '0 auto 1.5rem',
                    boxShadow: `0 8px 25px ${TEMPLATES[idx % 3].color}40`
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )
      }

      {/* Final CTA */}
      {
        !selectedTemplate && (
          <section style={{ marginBottom: '6rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass"
              style={{
                padding: 'clamp(3rem, 6vw, 5rem)',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 242, 255, 0.1))',
                border: '2px solid rgba(255, 0, 255, 0.3)'
              }}
            >
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ¿Listo para crear tu primera experiencia?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                Únete a miles de usuarios que ya están sorprendiendo a sus seres queridos con mensajes únicos e interactivos.
              </p>
              <button className="btn btn-primary" onClick={scrollToTemplates} style={{ fontSize: '1.2rem', padding: '1.3rem 3rem' }}>
                <Sparkles size={24} /> Comenzar Gratis
              </button>
            </motion.div>
          </section>
        )
      }

      {/* Footer */}
      {
        !selectedTemplate && !isMobileApp && (
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '3rem 0', marginTop: '4rem' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Sparkles size={24} color="#ff00ff" />
                    <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>InteractivoMagic</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Transforma mensajes simples en experiencias mágicas e interactivas. Hecho con ❤️ para compartir.
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Producto</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <li><a href="#plantillas" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Plantillas</a></li>
                    <li><a href="#como-funciona" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Cómo funciona</a></li>
                    <li><a href="https://www.atpdev.dev/apps/interactivo-magic" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Ficha Técnica</a></li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Legal</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <li><a href="/politica-privacidad.html" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Política de Privacidad</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setLegalModal('terms'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>Términos de Uso</a></li>
                    <li><a href="https://www.atpdev.dev" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}>ATP Dev Portal</a></li>
                  </ul>
                </div>
              </div>

              <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                © 2026 InteractivoMagic by ATP Dev - Hecho con ❤️ para compartir momentos especiales
              </div>
            </div>
          </footer>
        )
      }

      <AnimatePresence>
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
        {activeLightbox && (
          <PreviewLightbox
            template={activeLightbox.template}
            initialIndex={activeLightbox.initialIndex}
            onClose={() => setActiveLightbox(null)}
            onSelect={(tpl) => {
              setSelectedTemplate(tpl);
              setFormData(prev => ({
                ...prev,
                hasImage: tpl.hasImage || false,
                hasAudio: tpl.hasAudio || false,
                hasItems: tpl.hasItems || false
              }));
              if (isMobileApp) prepareRewardedAd();
            }}
          />
        )}
      </AnimatePresence>
    </div >
  );
}

export default App;





