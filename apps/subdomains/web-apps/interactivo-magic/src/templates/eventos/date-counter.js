export const DATE_COUNTER_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}} - Nuestro Tiempo</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #05020a; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            overflow: hidden;
            position: relative;
        }

        .background-photo {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-size: cover;
            background-position: center;
            filter: brightness(0.4) blur(10px);
            z-index: 0;
            transform: scale(1.1);
        }

        .overlay {
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, #05020a 100%);
            z-index: 1;
        }

        .container {
            position: relative;
            z-index: 10;
            text-align: center;
            width: 90%;
            max-width: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .clock-ring {
            width: 180px; height: 180px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.1);
            margin: 0 auto 1.5rem;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            box-shadow: 0 0 40px rgba(0, 242, 255, 0.2);
        }

        .clock-ring::before {
            content: "";
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            padding: 2px;
            background: linear-gradient(45deg, #00f2ff, #ff4d94, #00f2ff);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: rotate-border 4s linear infinite;
        }
        @keyframes rotate-border { 100% { transform: rotate(360deg); } }

        .clock-photo-container {
            width: 155px; height: 155px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(255,255,255,0.8);
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 2;
            background: #000;
        }

        .clock-photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: none; /* Shown by JS on load */
        }

        .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom center;
            background: white;
            border-radius: 4px;
            z-index: 10;
        }
        .hour { width: 4px; height: 35px; }
        .min { width: 3px; height: 50px; }
        .sec { width: 1.5px; height: 65px; background: #ff4d94; box-shadow: 0 0 10px #ff4d94; }
        .center-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background: white; border-radius: 50%; z-index: 15; box-shadow: 0 0 10px white; }

        .title-neon {
            font-size: 2.2rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 5px;
            margin-bottom: 0.5rem;
            color: #fff;
            text-shadow: 0 0 10px rgba(255,255,255,0.3), 0 0 20px #ff4d94;
        }

        .recipient-name {
            font-family: 'Dancing Script', cursive;
            font-size: 1.8rem;
            color: #ff80bf;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 10px rgba(255, 128, 191, 0.4);
        }

        .counter-grid {
            display: grid;
            grid-template-columns: repeat(2, 2fr);
            gap: 12px;
            width: 100%;
        }

        .counter-item {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(15px);
            padding: 18px 10px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: transform 0.3s;
        }
        .counter-item:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.08); }

        .counter-val { font-size: 2.4rem; font-weight: 900; display: block; color: #fff; line-height: 1; margin-bottom: 5px; }
        .counter-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #ff80bf; letter-spacing: 2px; }

        .sender-tag { margin-top: 2rem; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 3px; font-size: 0.8rem; text-transform: uppercase; }

        #intro-overlay { position: fixed; inset: 0; background: #05020a; z-index: 5000; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: opacity 0.8s ease; }
        
        .music-hud { 
            position: fixed; 
            bottom: 30px; 
            width: 85%; 
            max-width: 400px; 
            background: rgba(0, 0, 0, 0.7); 
            backdrop-filter: blur(15px); 
            padding: 12px 25px; 
            border-radius: 50px; 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            z-index: 1000; 
            opacity: 0;
            transition: opacity 1s;
        }
        body.ready .music-hud { opacity: 1; }
        .play-toggle { width: 45px; height: 45px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; border: none; font-size: 1.2rem; }
        .progress-bg { flex: 1; height: 5px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #00f2ff, #ff4d94); width: 0%; border-radius: 5px; }

        @media (max-width: 400px) {
            .clock-ring { width: 160px; height: 160px; }
            .clock-photo-container { width: 135px; height: 135px; }
            .counter-val { font-size: 2rem; }
            .title-neon { font-size: 1.8rem; }
        }
    </style>
</head>
<body class="loading">
    <div id="intro-overlay" onclick="startExperience()">
        <div style="font-size: 80px; filter: drop-shadow(0 0 20px #00f2ff); margin-bottom: 20px;">📅</div>
        <div style="color: white; font-size: 1.5rem; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; text-align: center;">Nuestro Tiempo Juntos</div>
        <div style="color: #ff4d94; margin-top: 1rem; font-weight: 700; letter-spacing: 3px; font-size: 0.9rem;">TOCA PARA ABRIR ❤️</div>
    </div>

    <div class="background-photo" id="bg-photo"></div>
    <div class="overlay"></div>

    <div class="container">
        <div class="clock-ring">
            <div class="center-dot"></div>
            <div class="hand hour" id="hour"></div>
            <div class="hand min" id="min"></div>
            <div class="hand sec" id="sec"></div>
            <div class="clock-photo-container">
                <img id="main-photo" alt="Foto">
                <div id="clock-fallback" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; background: #111;">🕒</div>
            </div>
        </div>

        <h1 class="title-neon">{{extra_text}}</h1>
        <div class="recipient-name">Para: {{name}}</div>
        
        <div class="counter-grid">
            <div class="counter-item"><span class="counter-val" id="days">0</span><span class="counter-label">Días</span></div>
            <div class="counter-item"><span class="counter-val" id="hours">0</span><span class="counter-label">Horas</span></div>
            <div class="counter-item"><span class="counter-val" id="mins">0</span><span class="counter-label">Minutos</span></div>
            <div class="counter-item"><span class="counter-val" id="secs">0</span><span class="counter-label">Segundos</span></div>
        </div>

        <div class="sender-tag">DE: {{sender}} ❤️</div>
    </div>

    <div class="music-hud" id="music-ui" style="display: {{audio_display}}">
        <div class="play-toggle" id="play-btn">▶</div>
        <div class="progress-bg"><div class="progress-fill" id="progress-bar"></div></div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '').trim();
        const startDateString = '{{startDate}}';
        let rawImageSrc = '{{image_src}}'.trim();
        
        // Google Drive Fix Logic (Client-side safety)
        if (rawImageSrc.includes("drive.google.com/file/d/")) {
            const fileId = rawImageSrc.split("/d/")[1]?.split("/")[0]?.split("?")[0];
            if (fileId) rawImageSrc = "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
        }

        const player = document.getElementById('player');
        let ytPlayer = null;

        // Photo loading logic
        const bgPhoto = document.getElementById('bg-photo');
        const mainPhoto = document.getElementById('main-photo');
        const clockFallback = document.getElementById('clock-fallback');

        if (rawImageSrc && rawImageSrc.length > 10) {
            mainPhoto.onload = () => {
                mainPhoto.style.display = 'block';
                clockFallback.style.display = 'none';
                bgPhoto.style.backgroundImage = 'url("' + rawImageSrc + '")';
            };
            mainPhoto.onerror = () => {
                console.error("Image failed to load");
                clockFallback.style.display = 'flex';
            };
            mainPhoto.src = rawImageSrc;
        }

        // Counter Logic
        let startDate;
        try {
            if (startDateString && startDateString.length > 5) {
                startDate = new Date(startDateString.includes('T') ? startDateString : startDateString + 'T00:00:00');
                if (isNaN(startDate.getTime())) {
                    startDate = new Date(startDateString.replace(/-/g, '/'));
                }
            } else {
                startDate = new Date();
            }
        } catch(e) {
            startDate = new Date();
        }

        function updateTime() {
            const now = new Date();
            let diff = now - startDate;
            const absoluteDiff = Math.abs(diff);
            
            const d = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
            const h = Math.floor((absoluteDiff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((absoluteDiff / (1000 * 60)) % 60);
            const s = Math.floor((absoluteDiff / 1000) % 60);
            
            document.getElementById('days').textContent = d;
            document.getElementById('hours').textContent = h;
            document.getElementById('mins').textContent = m;
            document.getElementById('secs').textContent = s;

            const ch = now.getHours();
            const cm = now.getMinutes();
            const cs = now.getSeconds();
            document.getElementById('hour').style.transform = 'translate(-50%, 0) rotate(' + (ch * 30 + cm/2) + 'deg)';
            document.getElementById('min').style.transform = 'translate(-50%, 0) rotate(' + (cm * 6) + 'deg)';
            document.getElementById('sec').style.transform = 'translate(-50%, 0) rotate(' + (cs * 6) + 'deg)';
        }

        setInterval(updateTime, 1000);
        updateTime();

        function startExperience() {
            const overlay = document.getElementById('intro-overlay');
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                document.body.classList.add('ready');
            }, 800);
            
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00f2ff', '#ff4d94', '#ffffff'] });

            if(hasAudio) {
                if(youtubeId && youtubeId.length > 2) {
                    const tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(tag);
                    window.onYouTubeIframeAPIReady = () => {
                        ytPlayer = new YT.Player('yt-player', {
                            videoId: youtubeId, height: '0', width: '0',
                            playerVars: { autoplay: 1, loop: 1, playlist: youtubeId },
                            events: { 'onReady': () => toggleMusic(true) }
                        });
                    };
                } else if (player.src && player.src.length > 5) {
                    player.play().catch(() => {});
                    toggleMusic(true);
                }
            }
        }

        function toggleMusic(play) {
            const btn = document.getElementById('play-btn');
            if(play) {
                btn.textContent = '||';
                if(ytPlayer) ytPlayer.playVideo(); else player.play();
            } else {
                btn.textContent = '▶';
                if(ytPlayer) ytPlayer.pauseVideo(); else player.pause();
            }
        }

        document.getElementById('play-btn').onclick = () => {
            const btn = document.getElementById('play-btn');
            toggleMusic(btn.textContent === '▶');
        };

        if(!youtubeId || youtubeId.length < 3) {
            player.ontimeupdate = () => {
                const pct = (player.currentTime / player.duration) * 100;
                document.getElementById('progress-bar').style.width = pct + '%';
            };
        }
    </script>
</body>
</html>`;
