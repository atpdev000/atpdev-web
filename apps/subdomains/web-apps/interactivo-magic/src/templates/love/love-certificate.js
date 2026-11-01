export const LOVE_CERTIFICATE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado del Amor - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@400;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #fdf2f8; 
            color: #1a1a1a; 
            font-family: 'Outfit', sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            overflow-x: hidden;
            padding: 40px 20px 180px; /* Enough space to avoid any overlap */
        }

        .cert-border {
            background: white;
            padding: 12px;
            border-radius: 35px;
            border: 2px dashed #f472b6;
            box-shadow: 0 25px 50px rgba(0,0,0,0.06);
            max-width: 550px;
            width: 100%;
            position: relative;
            margin-bottom: 2rem;
        }

        /* Decorative Static Heart Clusters */
        .cert-border::before, .cert-border::after,
        .cert-container::before, .cert-container::after {
            content: '❤️ ✨';
            position: absolute;
            font-size: 1.4rem;
            z-index: 10;
            white-space: nowrap;
            filter: drop-shadow(0 2px 8px rgba(190, 24, 93, 0.2));
        }
        .cert-border::before { top: -15px; left: 20px; transform: rotate(-10deg); }
        .cert-border::after { top: -15px; right: 20px; transform: rotate(10deg); }
        .cert-container::before { bottom: -15px; left: 20px; transform: rotate(5deg); }
        .cert-container::after { bottom: -15px; right: 20px; transform: rotate(-5deg); }

        .cert-container {
            border: 5px double #f472b6;
            border-radius: 25px;
            padding: 4rem 2.5rem;
            text-align: center;
            position: relative;
            background: white;
        }

        .heart-float { position: fixed; font-size: 2.2rem; pointer-events: none; z-index: 100; opacity: 0; }
        
        .float-up { animation: float-up-anim 4s linear forwards; }
        .float-down { animation: float-down-anim 4s linear forwards; }

        @keyframes float-up-anim { 
            0% { transform: translateY(0) scale(1); opacity: 0; } 
            10% { opacity: 1; } 
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) scale(1.5); opacity: 0; } 
        }
        
        @keyframes float-down-anim { 
            0% { transform: translateY(0) scale(1); opacity: 0; } 
            10% { opacity: 1; } 
            90% { opacity: 1; }
            100% { transform: translateY(100vh) scale(1.5); opacity: 0; } 
        }

        h1 {
            font-family: 'Dancing Script', cursive;
            color: #831843;
            font-size: 3.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
        }

        .bouquet { font-size: 3.5rem; display: block; margin-bottom: 2.5rem; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); }

        .cert-text {
            font-size: 1.25rem;
            line-height: 1.8;
            color: #374151;
            margin-bottom: 2.5rem;
            font-weight: 500;
        }

        .cert-text b { color: #be185d; font-weight: 850; }

        .photo-frame {
            width: 180px;
            height: 200px;
            margin: 0 auto 2.5rem;
            border: 4px solid #be185d;
            border-radius: 15px;
            overflow: hidden;
            padding: 6px;
            background: #fff5f7;
            box-shadow: 0 15px 25px rgba(0,0,0,0.12);
            display: {{image_display}};
            transform: rotate(-2deg);
        }

        .photo-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }

        .proof-text {
            font-size: 1.1rem;
            font-weight: 900;
            color: #1f2937;
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .issuance-date {
            font-style: italic;
            font-size: 0.95rem;
            color: #4b5563;
            line-height: 1.6;
            border-top: 1px solid #f9a8d455;
            padding-top: 20px;
        }

        #intro-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #fdf2f8; z-index: 5000;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            cursor: pointer; transition: 0.5s; /* Faster overlay transition */
        }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .gift-box { font-size: 90px; animation: bounce 2.2s infinite; filter: drop-shadow(0 10px 20px rgba(190, 24, 93, 0.2)); }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }

        .btn-download {
            padding: 18px 40px;
            background: #be185d;
            color: white;
            border: none;
            border-radius: 20px;
            font-weight: 800;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            box-shadow: 0 12px 25px rgba(190, 24, 93, 0.4);
            text-decoration: none;
            transition: all 0.3s;
            margin-bottom: 40px; /* Space above controls */
        }
        .btn-download:hover { transform: scale(1.05); background: #9d174d; }

        .audio-controls { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; background: rgba(255,255,255,0.95); backdrop-filter: blur(15px); padding: 15px 25px; border-radius: 40px; display: flex; align-items: center; gap: 15px; z-index: 1000; color: #be185d; border: 1px solid #fbcfe8; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .play-btn { width: 45px; height: 45px; background: #be185d; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white !important; font-size: 1.2rem; }
        .progress-bar-container { flex-grow: 1; height: 8px; background: #fce7f3; border-radius: 4px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #be185d; }

        @media print {
            .btn-download, .audio-controls, #intro-overlay { display: none !important; }
            body { background: white; padding: 0; }
            .cert-border { box-shadow: none; max-width: 100%; border: 3px dashed #f472b6; }
        }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div class="gift-box">🎁</div>
        <div style="font-size: 2rem; font-weight: 950; color: #831843; margin-top: 2rem; text-align: center; padding: 0 20px;">He emitido un documento oficial...</div>
        <div style="color: #be185d; margin-top: 1.5rem; font-weight: 800; letter-spacing: 5px; animation: pulse 1.5s infinite;">TOCA PARA ABRIR ❤️</div>
    </div>

    <div class="cert-border" id="certificate">
        <div class="cert-container">
            <h1>Certificado del Amor</h1>
            <span class="bouquet">💐</span>
            
            <div class="cert-text">
                <p>Por la presente certifico que nuestros corazones han sido enlazados por el destino 💖.</p>
                <p style="margin-top: 1.5rem; font-weight: 700; color: #831843; font-size: 1.4rem;">{{message}}</p>
                <p style="margin-top: 1.5rem;">Prometo cuidarte, amarte y hacerte feliz en cada día que la vida nos regale. ✨</p>
            </div>

            <div class="photo-frame">
                <img src="{{image_src}}" onerror="this.parentElement.style.display='none'">
            </div>

            <p class="proof-text">Esta es la prueba verdadera de nuestro amor.</p>
            
            <div class="issuance-date">
                Emitido para: <b>{{name}}</b><br>
                Por: <b>{{sender}}</b><br>
                El <span id="current-date"></span> a las <span id="current-time"></span>
            </div>
        </div>
    </div>

    <button class="btn-download" onclick="window.print()">
        📥 Guardar como PDF / Imprimir
    </button>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop preload="auto"></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let ytReady = false;
        let playOnReady = false;
        let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

        // Set Dynamic Date
        const now = new Date();
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        document.getElementById('current-date').textContent = now.getDate() + " de " + months[now.getMonth()] + " de " + now.getFullYear();
        document.getElementById('current-time').textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

        if (activePlatform === 'youtube' && !window.YT_API_LOADED) {
            const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag); window.YT_API_LOADED = true;
        } else if (activePlatform === 'youtube' && window.YT && window.YT.Player) {
            setTimeout(() => { if (typeof window.onYouTubeIframeAPIReady === 'function') window.onYouTubeIframeAPIReady(); }, 500);
        }

        window.onYouTubeIframeAPIReady = function() {
            if (activePlatform === 'youtube') {
                window.ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { ytReady = true; if(playOnReady) { window.ytPlayer.playVideo(); updateUI(true); } },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        function updateUI(playing) {
            document.getElementById('play-icon').style.display = playing ? 'none' : 'inline';
            document.getElementById('pause-icon').style.display = playing ? 'inline' : 'none';
        }

        audio.onplay = () => updateUI(true);
        audio.onpause = () => updateUI(false);

        window.openBox = function() {
            document.getElementById('intro-overlay').classList.add('hidden');
            if (hasAudio) {
                document.getElementById('audio-ui').style.display = 'flex';
                try {
                    if (activePlatform === 'youtube') { if (ytReady) ytPlayer.playVideo(); else playOnReady = true; }
                    else if (audio) { audio.play().catch(() => {}); }
                } catch(e) {}
            }
            startHearts();
        };

        function startHearts() {
            setInterval(() => {
                const h = document.createElement('div');
                const isUp = Math.random() > 0.5;
                h.className = 'heart-float ' + (isUp ? 'float-up' : 'float-down');
                h.innerHTML = ['❤️', '✨', '💖', '💕'][Math.floor(Math.random()*4)];
                h.style.left = Math.random() * 100 + 'vw';
                h.style.top = isUp ? '110vh' : '-10vh';
                const duration = 3 + Math.random() * 3;
                h.style.animationDuration = duration + 's';
                document.body.appendChild(h);
                setTimeout(() => h.remove(), duration * 1000);
            }, 300);
        }

        document.getElementById('play-btn').onclick = (e) => {
            e.stopPropagation();
            if (activePlatform === 'youtube' && window.ytPlayer) {
                if (window.ytPlayer.getPlayerState() === 1) window.ytPlayer.pauseVideo(); else window.ytPlayer.playVideo();
            } else { if (audio.paused) audio.play(); else audio.pause(); }
        };
        if (audio) { audio.ontimeupdate = () => { document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%'; }; }
    </script>
</body>
</html>`;
