export const GALAXY_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Un mensaje especial para {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        body { 
            margin: 0; 
            background: #05020a; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            overflow: hidden; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            perspective: 1000px;
        }

        /* Space Background with Nebulas */
        .universe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 50% 50%, rgba(255, 100, 50, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 20% 30%, rgba(100, 50, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 50, 150, 0.1) 0%, transparent 50%);
            z-index: -1;
        }

        .stars {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 90px 40px, #ddd, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            opacity: 0.5;
            animation: move-stars 100s linear infinite;
        }

        @keyframes move-stars {
            from { transform: translateY(0); }
            to { transform: translateY(-1000px); }
        }

        /* Galaxy Core */
        .galaxy-center {
            position: relative;
            width: 300px;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }

        .core-glow {
            position: absolute;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(255,100,0,0.4) 0%, rgba(255,50,0,0.1) 50%, transparent 70%);
            border-radius: 50%;
            filter: blur(20px);
            animation: pulse-glow 4s ease-in-out infinite;
        }

        .hearts-origin {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 5;
        }

        .sun-core {
            position: absolute;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle, #ffcc00 0%, #ff6600 60%, #ff0000 100%);
            border-radius: 50%;
            box-shadow: 0 0 80px rgba(255, 100, 0, 0.9), inset 0 0 40px rgba(255, 200, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            animation: sun-pulse 4s ease-in-out infinite;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes sun-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(255, 100, 0, 0.7); }
            50% { transform: scale(1.1); box-shadow: 0 0 110px rgba(255, 100, 0, 1); }
        }

        .heart-wrapper {
            position: relative;
            width: 110px;
            height: 110px;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: heart-beat 1.5s ease-in-out infinite;
        }

        @keyframes heart-beat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }

        .css-heart {
            position: absolute;
            width: 90px;
            height: 90px;
            background: #ff0055;
            transform: rotate(-45deg);
            box-shadow: 0 0 30px rgba(255, 0, 85, 0.6);
        }

        .css-heart::before,
        .css-heart::after {
            content: '';
            position: absolute;
            width: 90px;
            height: 90px;
            background: #ff0055;
            border-radius: 50%;
        }

        .css-heart::before { top: -45px; left: 0; }
        .css-heart::after { top: 0; left: 45px; }

        .name-container {
            position: relative;
            z-index: 15;
            color: white;
            font-size: 1.2rem;
            font-weight: 900;
            text-align: center;
            width: 130px;
            text-shadow: 0 2px 8px rgba(0,0,0,0.6);
            text-transform: uppercase;
            padding-bottom: 5px;
            line-height: 1.1;
            word-wrap: break-word;
        }

        @keyframes pulse-glow {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.3); opacity: 0.9; }
        }

        .crown {
            position: absolute;
            top: -60px;
            font-size: 3.5rem;
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
            animation: float-crown 3s ease-in-out infinite;
            z-index: 30;
        }

        @keyframes float-crown {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
        }

        .content {
            text-align: center;
            z-index: 20;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        h1 {
            font-size: 2.5rem;
            margin: 0;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            background: linear-gradient(to bottom, #fff, #ffcc00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .message-card {
            position: fixed;
            bottom: 110px;
            width: 90%;
            max-width: 450px;
            background: rgba(10, 5, 20, 0.85);
            backdrop-filter: blur(20px);
            padding: 1.5rem 2rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            z-index: 100;
        }

        .message-text {
            font-size: 1.25rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
            color: #fff;
        }

        .sender-name {
            font-size: 0.95rem;
            color: #ff9d00;
            font-weight: 800;
            letter-spacing: 2px;
            margin-bottom: 1rem;
            text-shadow: 0 0 10px rgba(255, 157, 0, 0.4);
        }

        .sender-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 0.2rem;
        }

        .create-btn {
            display: inline-block;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            padding: 8px 20px;
            border-radius: 20px;
            color: #fff;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
        }

        .create-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }

        /* Intro Surprise Box Styles */
        #intro-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #05020a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            transition: opacity 1s ease, visibility 1s;
        }

        .box-container {
            cursor: pointer;
            text-align: center;
            animation: box-float 3s ease-in-out infinite;
        }

        .box-emoji {
            font-size: 8rem;
            filter: drop-shadow(0 0 30px rgba(255, 77, 148, 0.6));
        }

        .box-text {
            margin-top: 2rem;
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 2px;
            color: #ff4d94;
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(255, 77, 148, 0.4);
        }

        @keyframes box-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
        }

        .tap-to-open {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 4px;
            text-transform: uppercase;
            animation: pulse-text 2s infinite;
        }

        @keyframes pulse-text {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        .hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        /* Orbiting Words */
        .orbit-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        .word {
            position: absolute;
            font-size: 1rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.7);
            white-space: nowrap;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            animation: float-word var(--duration) linear infinite;
        }

        @keyframes float-word {
            from { transform: translate(var(--start-x), var(--start-y)) scale(var(--scale)); opacity: 0; }
            10% { opacity: var(--opacity); }
            90% { opacity: var(--opacity); }
            to { transform: translate(var(--end-x), var(--end-y)) scale(var(--scale)); opacity: 0; }
        }

        /* Player Bar Mockup */
        .audio-controls {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 350px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex; /* Updated flex logic */
            align-items: center;
            gap: 15px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .play-btn {
            width: 40px;
            height: 40px;
            background: #ff9d00;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            flex-shrink: 0;
            box-shadow: 0 0 15px rgba(255, 157, 0, 0.4);
        }

        .play-icon, .pause-icon {
            color: #000;
            font-size: 18px;
            font-weight: bold;
        }

        .progress-bar-container {
            flex-grow: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }

        .progress-bar {
            width: 0%;
            height: 100%;
            background: #ff9d00;
            border-radius: 2px;
            box-shadow: 0 0 10px #ff9d00;
        }

        .time-display {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            min-width: 35px;
            text-align: right;
        }

        .song-title {
            position: absolute;
            top: -22px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 11px;
            font-weight: 800;
            color: #ff9d00;
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .photo-result {
            margin: 1rem auto;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 3px solid #ff9d00;
            overflow: hidden;
            display: {{image_display}};
            box-shadow: 0 0 20px rgba(255, 157, 0, 0.5);
            background: radial-gradient(circle, rgba(255,157,0,0.2) 0%, rgba(10,5,20,1) 100%);
            min-height: 60px;
        }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="box-container" onclick="openBox()">
            <div class="box-emoji">🎁</div>
            <div class="box-text">¡Tienes una sorpresa!</div>
            <div class="tap-to-open">Haz clic para abrir</div>
        </div>
    </div>

    <div class="universe">
        <div class="stars"></div>
    </div>

    <div class="galaxy-center">
        <div class="core-glow"></div>
        <div class="hearts-origin" id="hearts-container"></div>
        <div class="sun-core">
            <div class="heart-wrapper">
                <div class="css-heart"></div>
                <div class="name-container">
                    {{name}}
                </div>
            </div>
        </div>
        <div class="message-card">
            <div class="photo-result">
                <img src="{{image_src}}" alt="Foto" onerror="this.parentElement.style.display='none'">
            </div>
            <div class="message-text">{{message}}</div>
            <div class="sender-label">Enviado con ❤️ por:</div>
            <div class="sender-name">{{sender}}</div>
            <a href="/" class="create-btn">Crea tu propio mensaje ✨</a>
        </div>
    </div>

    <div class="orbit-container" id="orbit"></div>

    <div class="audio-controls" id="audio-ui" style="display: none;">
        <div class="song-title" id="song-title">Cargando Audio...</div>
        <div class="play-btn" id="play-btn">
            <div id="play-icon">▶️</div>
            <div id="pause-icon" style="display:none">||</div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div class="time-display time-text" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player-container" style="position:fixed; top:0; left:0; width:1px; height:1px; opacity:0.01; pointer-events:none;">
        <div id="youtube-player"></div>
    </div>

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        const songTitle = document.getElementById('song-title');
        
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function onYouTubeIframeAPIReady() {
            if (youtubeId) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 'onReady': () => console.log("YT Ready") }
                });
            }
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            const hasAudio = '{{has_audio}}' === 'true';
            setTimeout(() => {
                if (hasAudio) {
                    document.getElementById('audio-ui').style.display = 'flex';
                }
                if (activePlatform === 'youtube' && ytPlayer) ytPlayer.playVideo();
                else audio.play().catch(() => {});
                updateUI(true);
                
                // Initial burst of orbiting elements
                for (let i = 0; i < 50; i++) setTimeout(createFloatingElement, i * 50);
                // Continuous creation of center hearts
                setInterval(createCenterHeart, 300);
            }, 500);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
            if (playing && songTitle) songTitle.textContent = "Audio Mágico";
        }

        document.getElementById('play-btn').addEventListener('click', () => {
            if (isPlaying) {
                if (activePlatform === 'youtube') ytPlayer.pauseVideo();
                else audio.pause();
            } else {
                if (activePlatform === 'youtube') ytPlayer.playVideo();
                else audio.play();
            }
            updateUI(!isPlaying);
        });

        if (activePlatform === 'native') {
            audio.ontimeupdate = () => {
                const progress = (audio.currentTime / audio.duration) * 100;
                document.getElementById('progress-bar').style.width = progress + '%';
                const mins = Math.floor(audio.currentTime / 60);
                const secs = Math.floor(audio.currentTime % 60);
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

const heartsContainer = document.getElementById('hearts-container');
const orbit = document.getElementById('orbit');

// Parse custom words from user input
const customWordsRaw = '{{extra_text}}'.trim();
const customWords = customWordsRaw ? customWordsRaw.split(',').map(w => w.trim()).filter(w => w) : [];

// Default elements if no custom words provided
const defaultElements = [
    '❤️', '✨', '💖', '🌟', '✨', '💘', '💝', '💎', '💫', '🌹', '✨', '🔥', '🌈', '🌠', '🛸', '🚀',
    'Pasión', 'Libertad', 'Magia', 'Eres todo', 'Contigo',
    'Eternidad', 'Felicidad', 'Gracias', 'Mi mundo', 'Sueños',
    'Mi fortuna', 'Amor eterno', 'Mi paz', 'Mi luz', 'Cariño',
    'Mi estrella', 'Inspiración', 'Mi razón', 'Mi vida', 'Mi cielo',
    'Corazón', 'Destino', 'Ternura', 'Abrazos', 'Sonrisas', 'Tesoro',
    'Mágico', 'Siempre', 'Infinito', 'Tú y Yo', 'Pasión', 'Delirio',
    'Adoración', 'Encanto', 'Ensueño', 'Hechizo', 'Latido', 'Pasión',
    'Mi Vida', 'Mi Rey', 'Mi Reina', 'Para Siempre', 'Inolvidable', 'Dicha',
    'Lealtad', 'Confianza', 'Alma Gemela', 'Destino', 'Pasión'
];

// Mix custom words with emojis for visual variety
const emojis = ['❤️', '✨', '💖', '🌟', '💘', '💝', '💎', '💫', '🌹'];
const elements = customWords.length > 0 
    ? [...customWords, ...emojis, ...customWords, ...emojis]  // Repeat custom words with emojis
    : defaultElements;

function createFloatingElement() {
    const el = document.createElement('div');
    el.className = 'word';
    const content = elements[Math.floor(Math.random() * elements.length)];
    el.textContent = content;

    if (content.length <= 2) {
        el.style.fontSize = (Math.random() * 30 + 15) + 'px';
    } else {
        el.style.fontSize = (Math.random() * 12 + 14) + 'px';
    }

    const startX = Math.random() * 100 + 'vw';
    const startY = Math.random() * 100 + 'vh';
    const endX = (Math.random() * 200 - 50) + 'vw';
    const endY = (Math.random() * 200 - 50) + 'vh';

    el.style.setProperty('--start-x', startX);
    el.style.setProperty('--start-y', startY);
    el.style.setProperty('--end-x', endX);
    el.style.setProperty('--end-y', endY);
    el.style.setProperty('--duration', (Math.random() * 12 + 8) + 's');
    el.style.setProperty('--opacity', (Math.random() * 0.7 + 0.3));
    el.style.setProperty('--scale', (Math.random() * 1.5 + 0.5));

    orbit.appendChild(el);
    setTimeout(() => el.remove(), 20000);
}

function createCenterHeart() {
    const heart = document.createElement('div');
    const icons = ['❤️', '✨', '💖', '🌟', '💕'];
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 30 + 15 + 'px';
    heart.style.opacity = '1';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '5';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 200 + 150;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    heartsContainer.appendChild(heart);

    const anim = heart.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: "translate(calc(-50% + " + vx + "px), calc(-50% + " + vy + "px)) scale(2.5)", opacity: 0 }
    ], {
        duration: Math.random() * 2500 + 1500,
        easing: 'ease-out'
    });

    anim.onfinish = () => heart.remove();
}

// Expanded Initial burst for immediate impact
for (let i = 0; i < 120; i++) {
    setTimeout(createFloatingElement, Math.random() * 8000);
}

setInterval(createFloatingElement, 200); // Super frequent elements
setInterval(createCenterHeart, 300); // More frequent hearts
    </script>
</body>
</html>`;
