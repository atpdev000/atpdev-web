export const ENCHANTED_LETTER_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carta Encantada - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: linear-gradient(to bottom, #d38312, #a83279, #1a0a2e); 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center;
            overflow: hidden;
        }

        .title {
            font-family: 'Dancing Script', cursive;
            font-size: 2.2rem;
            color: #ffcc00;
            text-shadow: 0 0 15px rgba(255, 204, 0, 0.6);
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10;
            transition: opacity 0.5s, transform 0.5s;
        }

        body.envelope-open .title {
            opacity: 0;
            transform: translateY(-20px);
            pointer-events: none;
        }

        /* Envelope Design */
        .envelope-wrapper {
            position: relative;
            width: 320px;
            height: 220px;
            background: #f39c12;
            cursor: pointer;
            transition: 0.5s;
            z-index: 5;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            border-radius: 5px;
        }

        .envelope-wrapper::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 160px solid transparent;
            border-right: 160px solid transparent;
            border-top: 110px solid #e67e22;
            z-index: 10;
            transition: 0.5s;
            transform-origin: top;
        }

        .envelope-wrapper.open::before {
            transform: rotateX(180deg);
            z-index: 0;
        }

        /* The Seal */
        .seal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: #d35400;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            z-index: 15;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            transition: 0.5s;
        }

        .envelope-wrapper.open .seal {
            opacity: 0;
            pointer-events: none;
        }

        /* The Letter Content */
        .letter {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background: white;
            color: #2c3e50;
            padding: 1.5rem;
            border-radius: 10px;
            transition: 0.8s;
            transform: translateY(0);
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            opacity: 0;
        }

        .envelope-wrapper.open .letter {
            transform: translateY(-110px);
            opacity: 1;
            z-index: 20;
            width: 320px;
            height: auto;
            max-height: 80vh;
            overflow-y: auto;
            left: 0;
            right: 0;
            margin: auto;
            padding: 2.5rem 1.5rem;
        }

        .letter h2 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #d35400;
        }

        .letter p {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }

        .photo-result {
            width: 100%;
            padding: 2rem 2rem 1rem;
            display: {{image_display}};
            text-align: center;
        }

        .photo-result img {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            border: 3px solid #f39c12;
            box-shadow: 0 0 25px rgba(243, 156, 18, 0.5);
            object-fit: cover;
        }

        /* Floating Decorations */
        .floating-element {
            position: absolute;
            pointer-events: none;
            z-index: 2;
            animation: float-up var(--duration) linear infinite;
        }

        @keyframes float-up {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }

        /* Intro Overlay */
        #intro-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #1a0a2e; z-index: 1000;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            cursor: pointer; transition: 0.5s;
        }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .audio-controls { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 350px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 30px; display: flex; align-items: center; gap: 15px; z-index: 1000; color: #f39c12; border: 1px solid rgba(255, 255, 255, 0.1); }
        .play-btn { width: 40px; height: 40px; background: #f39c12; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white !important; }
        .progress-bar-container { flex-grow: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #f39c12; }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div style="font-size: 80px; margin-bottom: 2rem; filter: drop-shadow(0 0 20px #f39c12);">🎃</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: white; text-align: center; padding: 0 20px;">Has recibido una carta encantada</div>
        <div style="color: #f39c12; margin-top: 1.5rem; font-weight: 800; letter-spacing: 3px; animation: pulse 1.5s infinite;">TOCAR PARA ABRIR</div>
    </div>

    <div class="title">
        ✉️ Ábrela sin miedo 🎃
    </div>

    <div class="envelope-wrapper" id="envelope" onclick="toggleEnvelope()">
        <div class="seal">🎃</div>
        <div class="letter">
            <div class="photo-result">
                <img src="{{image_src}}" alt="Foto" onerror="this.parentElement.style.display='none'">
            </div>
            <h2 id="letter-title">{{extra_text}}</h2>
            <p>{{message}}</p>
            <div style="font-family: 'Dancing Script', cursive; font-weight: 700; color: #d35400; font-size: 1.2rem;">
                Con cariño, <br> {{sender}}
            </div>
        </div>
    </div>

    <div class="audio-controls" style="display: none;" id="audio-ui">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶️</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop preload="auto"></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{youtube_id}}";
        let audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let ytReady = false;
        let playOnReady = false;
        let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

        if (activePlatform === 'youtube' && !window.YT_API_LOADED) {
            const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag); window.YT_API_LOADED = true;
        }

        window.onYouTubeIframeAPIReady = function() {
            if (activePlatform === 'youtube') {
                ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { ytReady = true; if(playOnReady) ytPlayer.playVideo(); },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        function updateUI(playing) {
            document.getElementById('play-icon').style.display = playing ? 'none' : 'inline';
            document.getElementById('pause-icon').style.display = playing ? 'inline' : 'none';
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            if (hasAudio) {
                document.getElementById('audio-ui').style.display = 'flex';
                if (activePlatform === 'youtube') {
                    if (ytReady) ytPlayer.playVideo(); else playOnReady = true;
                } else if (audio) {
                    audio.play().catch(() => {});
                }
            }
            startMagic();
        }

        function toggleEnvelope() {
            const envelope = document.getElementById('envelope');
            envelope.classList.toggle('open');
            document.body.classList.toggle('envelope-open', envelope.classList.contains('open'));
        }

        // Initialize Title Fallback
        const lt = document.getElementById('letter-title');
        if (lt && !lt.innerText.trim()) lt.innerText = "Mi pequeña bruja encantadora ✨";

        function startMagic() {
            const icons = ['🎃', '✨', '👻', '🕸️', '🕯️', '🦇', '🔥'];
            setInterval(() => {
                const h = document.createElement('div');
                h.className = 'floating-element';
                h.innerHTML = icons[Math.floor(Math.random() * icons.length)];
                h.style.left = Math.random() * 100 + 'vw';
                const duration = 4 + Math.random() * 4;
                h.style.setProperty('--duration', duration + 's');
                h.style.fontSize = (20 + Math.random() * 20) + 'px';
                document.body.appendChild(h);
                setTimeout(() => h.remove(), duration * 1000);
            }, 500);
        }

        document.getElementById('play-btn').onclick = (e) => {
            e.stopPropagation();
            if (activePlatform === 'youtube' && ytPlayer) {
                if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
            } else if (audio) {
                if (audio.paused) audio.play(); else audio.pause();
            }
        };

        if (audio) {
            audio.onplay = () => updateUI(true);
            audio.onpause = () => updateUI(false);
            audio.ontimeupdate = () => { document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%'; };
        }
    </script>
</body>
</html>`;
