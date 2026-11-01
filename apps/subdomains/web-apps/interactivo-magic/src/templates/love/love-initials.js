export const LOVE_INITIALS_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuestras Iniciales - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #05020a; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center;
            overflow-x: hidden;
            padding: 20px 20px 120px;
        }

        .header {
            text-align: center;
            margin-bottom: 2rem;
            animation: fadeInDown 0.8s ease-out;
        }

        h1 {
            font-size: 2.2rem;
            font-weight: 900;
            background: linear-gradient(to right, #ff4d94, #ffb3d1, #ff4d94);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(255, 77, 148, 0.3);
        }

        .initials-display {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10;
            animation: fadeIn 1s ease-out;
        }

        .initial-box {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 1.1rem;
        }

        .letter-circle {
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #ff4d94;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            text-shadow: 0 0 10px #ff4d94;
            text-transform: uppercase;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .main-card {
            width: 100%;
            max-width: 450px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(15px);
            border-radius: 40px;
            overflow: hidden;
            border: 2px solid rgba(255, 77, 148, 0.2);
            box-shadow: 0 25px 60px rgba(0,0,0,0.8);
            position: relative;
            padding-bottom: 1.5rem;
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
            border: 3px solid #ff4d94;
            box-shadow: 0 0 25px rgba(255, 77, 148, 0.5);
            object-fit: cover;
        }

        .heart-container {
            width: 100%;
            aspect-ratio: 1/1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 2rem;
        }

        /* The Animated Heart */
        .magic-heart {
            font-size: 15rem;
            color: #ff4d94;
            filter: drop-shadow(0 0 40px rgba(255, 77, 148, 0.8));
            animation: pulse-heart 1.5s infinite ease-in-out;
            user-select: none;
            cursor: pointer;
            position: relative;
        }

        .initials-overlay {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            font-size: 4rem;
            font-weight: 950;
            color: white;
            text-shadow: 0 5px 15px rgba(0,0,0,0.6);
            text-transform: uppercase;
            letter-spacing: -2px;
        }

        .initials-overlay span:nth-child(2) {
            font-size: 2.5rem;
            color: rgba(255,255,255,0.7);
            margin-top: 5px;
        }

        @keyframes pulse-heart {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 30px rgba(255, 77, 148, 0.6)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 60px rgba(255, 77, 148, 1)); }
        }

        .card-footer {
            padding: 1rem 2rem;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 1rem;
        }

        .btn-download {
            padding: 14px 35px;
            background: linear-gradient(135deg, #e91e63, #c2185b);
            color: white;
            border: none;
            border-radius: 20px;
            font-weight: 800;
            font-size: 1.1rem;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            box-shadow: 0 8px 15px rgba(233, 30, 99, 0.3);
            text-decoration: none;
            transition: all 0.3s;
        }
        .btn-download:hover { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(233, 30, 99, 0.4); }

        /* Floating Decoration */
        .floating-elements { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .decor { position: absolute; opacity: 0; animation: floatUp 4s linear infinite; }
        @keyframes floatUp {
            0% { transform: translateY(110vh) scale(0.5); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.6; }
            100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }

        #intro-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #05020a; z-index: 5000;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            cursor: pointer; transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; transform: scale(1.1); }

        .audio-controls { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); padding: 15px 25px; border-radius: 40px; display: flex; align-items: center; gap: 15px; z-index: 1000; color: #ff4d94; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .play-btn { width: 45px; height: 45px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white !important; font-size: 1.2rem; }
        .progress-bar-container { flex-grow: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; }

        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        @media print {
            .btn-download, .audio-controls, #intro-overlay { display: none !important; }
            body { background: white; padding: 0; }
            .main-card { border: none; box-shadow: none; max-width: 100%; background: transparent; }
        }
    </style>
</head>
<body>
    <div id="intro-overlay" onclick="openBox()">
        <div style="font-size: 80px; margin-bottom: 2rem; filter: drop-shadow(0 0 30px #ff4d94);">💝</div>
        <div style="font-size: 2rem; font-weight: 950; color: white; text-align: center; padding: 0 20px;">Toca para descubrir algo especial</div>
        <div style="color: #ff4d94; margin-top: 1.5rem; font-weight: 800; letter-spacing: 5px; animation: pulse 1.5s infinite;">ABRIR SORPRESA ❤️</div>
    </div>

    <div class="header">
        <h1>❤️ {{name}} ❤️</h1>
    </div>

    <div class="initials-display">
        <div class="initial-box">Ella: <div class="letter-circle">{{extra_text}}</div></div>
        <div class="initial-box">Él: <div class="letter-circle">{{extra_text_2}}</div></div>
    </div>

    <div class="main-card">
        <div class="photo-result">
            <img src="{{image_src}}" alt="Foto" onerror="this.parentElement.style.display='none'">
        </div>
        
        <div class="heart-container" onclick="startMagic()">
            <div class="magic-heart">❤️</div>
            <div class="initials-overlay">
                <span>{{extra_text}}</span>
                <span>&</span>
                <span>{{extra_text_2}}</span>
            </div>
        </div>

        <div class="card-footer">
            <p style="margin-bottom: 1.5rem; opacity: 0.8; font-weight: 700; color: #ffb3d1;">{{sender}}</p>
            <button class="btn-download" onclick="window.print()">
                📥 Guardar Recuerdo
            </button>
        </div>
    </div>

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
                        'onReady': () => { ytReady = true; if(playOnReady) { ytPlayer.playVideo(); updateUI(true); } },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        function updateUI(playing) {
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            if (playIcon && pauseIcon) {
                playIcon.style.display = playing ? 'none' : 'inline';
                pauseIcon.style.display = playing ? 'inline' : 'none';
            }
        }

        if (audio) {
            audio.onplay = () => updateUI(true);
            audio.onpause = () => updateUI(false);
            audio.ontimeupdate = () => { 
                const pb = document.getElementById('progress-bar');
                if (pb) pb.style.width = (audio.currentTime / audio.duration) * 100 + '%'; 
            };
        }

        window.openBox = function() {
            document.getElementById('intro-overlay').classList.add('hidden');
            if (hasAudio) {
                const audioUi = document.getElementById('audio-ui');
                if (audioUi) audioUi.style.display = 'flex';
                
                if (activePlatform === 'youtube') {
                    if (ytReady) ytPlayer.playVideo(); else playOnReady = true;
                } else if (audio) {
                    audio.play().catch(() => {});
                }
            }
            startMagic();
        };

        function startMagic() {
            for(let i=0; i<15; i++) {
                setTimeout(() => {
                    const h = document.createElement('div');
                    h.className = 'decor';
                    h.innerHTML = ['❤️', '💖', '✨', '💕', '💝'][Math.floor(Math.random()*5)];
                    h.style.left = Math.random() * 100 + 'vw';
                    const duration = 3 + Math.random() * 3;
                    h.style.animationDuration = duration + 's';
                    h.style.fontSize = (15 + Math.random() * 25) + 'px';
                    document.body.appendChild(h);
                    setTimeout(() => h.remove(), duration * 1000);
                }, i * 200);
            }
        }

        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.onclick = (e) => {
                e.stopPropagation();
                if (activePlatform === 'youtube' && ytPlayer) {
                    if (ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
                } else if (audio) {
                    if (audio.paused) audio.play(); else audio.pause();
                }
            };
        }
        
        // Initial magic element
        setInterval(startMagic, 4500);
    </script>
</body>
</html>`;
