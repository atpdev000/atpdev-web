export const ENOJONA_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Para mi Enojona Favorita 😠 ❤️</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@400;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #0a0514; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            overflow: hidden; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            transition: background 1.5s ease;
        }

        body.happy { background: radial-gradient(circle at center, #2d0a1a 0%, #05020a 100%); }

        .backdrop {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #210505 0%, #000 100%);
            z-index: 0;
            transition: opacity 1.5s ease;
        }
        body.happy .backdrop { opacity: 0.3; }

        .scene {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 20px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 1s ease;
        }
        body.happy .scene { opacity: 1; pointer-events: auto; }

        /* Interaction Zone (Angry Face) */
        #angry-zone {
            position: fixed;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
            cursor: pointer;
            transition: all 1s ease;
        }
        #angry-zone.calmed { opacity: 0; pointer-events: none; transform: scale(1.5); }

        .angry-face {
            font-size: 140px;
            filter: drop-shadow(0 0 40px #f44336);
            animation: move-angry 0.1s infinite;
            position: relative;
        }
        @keyframes move-angry {
            0% { transform: translate(0, 0); }
            25% { transform: translate(3px, 3px); }
            50% { transform: translate(-3px, -3px); }
            75% { transform: translate(-3px, 3px); }
            100% { transform: translate(3px, -3px); }
        }

        .calm-meter {
            width: 250px;
            height: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            margin-top: 3rem;
            border: 2px solid rgba(255,255,255,0.2);
            overflow: hidden;
            position: relative;
        }
        .calm-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(to right, #f44336, #ff80ab);
            transition: width 0.3s ease;
        }
        .calm-hint {
            color: #f44336;
            font-weight: 900;
            letter-spacing: 5px;
            margin-top: 1.5rem;
            font-size: 0.9rem;
            height: 20px;
        }

        /* 3D Envelope */
        .envelope-wrapper {
            position: relative;
            cursor: pointer;
            perspective: 2000px;
        }

        .envelope {
            width: 320px;
            height: 220px;
            background: #d32f2f;
            position: relative;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            border-radius: 12px;
            transition: transform 0.8s;
            border: 1px solid rgba(255,255,255,0.1);
            background-image: linear-gradient(135deg, #f44336 50%, #d32f2f 50%);
        }

        .envelope-flap {
            position: absolute;
            top: 0; left: 0; width: 0; height: 0;
            border-left: 160px solid transparent;
            border-right: 160px solid transparent;
            border-top: 120px solid #c62828;
            transform-origin: top;
            transition: transform 0.6s 0.2s;
            z-index: 5;
            filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .envelope.open .envelope-flap { transform: rotateX(170deg); z-index: 0; }
        
        .envelope-flap::after {
            content: "❤️";
            position: absolute;
            top: -100px; left: -15px;
            font-size: 1.8rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .letter-container {
            position: absolute;
            top: 5px;
            left: 5px;
            width: 310px; height: 210px;
            background: rgba(255, 255, 255, 0.98);
            z-index: 2;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .envelope.open .letter-container {
            position: fixed; /* Guarantee viewport center */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.1);
            height: auto;
            max-height: 85vh; 
            width: 350px;
            z-index: 5000;
            box-shadow: 0 50px 200px rgba(0,0,0,0.9);
            margin: 0;
            padding: 25px;
            overflow-y: auto;
        }

        /* Content Styling (Similar to Flowers) */
        .letter-header { font-family: 'Dancing Script', cursive; color: #d32f2f; font-size: 2rem; border-bottom: 1px solid #ffebee; margin-bottom: 15px; text-align: center; }
        .letter-body { line-height: 1.6; font-weight: 600; color: #444; text-align: center; margin-bottom: 20px; font-size: 1.1rem; }
        .letter-image { width: 100%; border-radius: 12px; margin-bottom: 15px; border: 4px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .letter-extra { margin-top: 10px; color: #f44336; font-weight: 900; text-align: center; font-style: italic; }
        .letter-sender { text-align: right; margin-top: 20px; font-weight: 900; color: rgba(0,0,0,0.3); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }

        /* Magic Items */
        .magic-float { position: fixed; pointer-events: none; z-index: 5; animation: magic-down linear forwards; opacity: 0.6; }
        @keyframes magic-down {
            from { transform: translateY(-10vh) rotate(0deg); }
            to { transform: translateY(110vh) rotate(360deg); }
        }

        .heart-float { position: fixed; pointer-events: none; z-index: 50; animation: heart-up linear forwards; }
        @keyframes heart-up {
            from { transform: translateY(0) scale(1); opacity: 1; }
            to { transform: translateY(-300px) scale(0); opacity: 0; }
        }

        /* HUD */
        .audio-hud { position: fixed; bottom: 30px; width: 90%; max-width: 350px; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 15px; z-index: 1000; color: white; opacity: 0; transition: opacity 2s; }
        body.happy .audio-hud { opacity: 1; }
        .play-btn { width: 45px; height: 45px; background: #f44336; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .hud-bar-bg { flex: 1; height: 5px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; }
        .hud-bar { height: 100%; background: #f44336; width: 0%; transition: width 0.1s linear; }

        @media (max-width: 500px) {
            .envelope { width: 280px; height: 190px; }
            .envelope-flap { border-left-width: 140px; border-right-width: 140px; border-top-width: 105px; }
            .letter-container { width: 270px; height: 180px; }
            .envelope.open .letter-container { 
                position: fixed;
                width: 92%; 
                max-width: 340px;
                transform: translate(-50%, -50%) scale(1); 
            }
            .angry-face { font-size: 100px; }
        }
    </style>
</head>
<body>
    <div id="angry-zone" onclick="calmDown(event)">
        <div class="angry-face" id="angry-emoji">😠</div>
        <div class="calm-meter">
            <div class="calm-bar" id="calm-bar"></div>
        </div>
        <div class="calm-hint" id="calm-hint">¡HAZLE CARIÑITOS! ❤️</div>
    </div>

    <div class="backdrop"></div>
    
    <div class="scene">
        <div class="envelope-wrapper" onclick="toggleLetter()">
            <div class="envelope" id="envelope">
                <div class="envelope-flap"></div>
                <div class="letter-container">
                    <div class="letter-header">Para: {{name}}</div>
                    <div class="letter-body">{{message}}</div>
                    <img src="{{image_src}}" class="letter-image" onerror="this.style.display='none'">
                    <div class="letter-extra">{{extra_text}}</div>
                    <div class="letter-sender">De: {{sender}} ❤️</div>
                </div>
            </div>
        </div>
    </div>

    <div class="audio-hud" id="audio-ui">
        <div class="play-btn" id="play-toggle">▶</div>
        <div class="hud-bar-bg"><div class="hud-bar" id="hud-bar"></div></div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '');
        
        let clicks = 0;
        const targetClicks = 15;
        let isCalmed = false;
        let rainInterval;

        function startRain(emoji) {
            if(rainInterval) clearInterval(rainInterval);
            rainInterval = setInterval(() => {
                const h = document.createElement('div');
                h.className = 'magic-float';
                h.style.left = Math.random() * 100 + 'vw';
                h.style.fontSize = (15 + Math.random() * 20) + 'px';
                h.innerText = emoji;
                h.style.animationDuration = (3 + Math.random() * 3) + 's';
                document.body.appendChild(h);
                setTimeout(() => h.remove(), 6000);
            }, 400);
        }

        // Start with angry rain
        startRain('😠');

        function calmDown(e) {
            if(isCalmed) return;
            clicks++;
            
            const pct = (clicks / targetClicks) * 100;
            document.getElementById('calm-bar').style.width = pct + '%';
            
            // Interaction Feedback
            const h = document.createElement('div');
            h.className = 'heart-float';
            h.innerHTML = '❤️';
            h.style.left = e.clientX + 'px';
            h.style.top = e.clientY + 'px';
            document.body.appendChild(h);
            setTimeout(() => h.remove(), 1000);

            // Clicks progress
            if(clicks === 5) document.getElementById('calm-hint').innerText = '¡UN POQUITO MÁS! 😠';
            if(clicks === 10) document.getElementById('calm-hint').innerText = '¡YA CASI SE CALMA! 🤭';

            if(clicks >= targetClicks) {
                isCalmed = true;
                clearInterval(rainInterval);
                const zone = document.getElementById('angry-zone');
                document.getElementById('angry-emoji').innerText = '😍';
                document.getElementById('angry-emoji').style.animation = 'none';
                document.getElementById('calm-hint').innerText = '¡LISTO! ❤️✨';
                
                setTimeout(() => {
                    zone.classList.add('calmed');
                    document.body.classList.add('happy');
                    startHappyFlow();
                }, 1000);
            }
        }

        function startHappyFlow() {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            
            if(hasAudio) initializeAudio();

            // Switch to happy rain
            startRain(['❤️', '💖', '✨', '🌸'][Math.floor(Math.random()*4)]);
            // Re-randomize items in the interval
            clearInterval(rainInterval);
            rainInterval = setInterval(() => {
                const h = document.createElement('div');
                h.className = 'magic-float';
                h.style.left = Math.random() * 100 + 'vw';
                h.style.fontSize = (10 + Math.random() * 25) + 'px';
                h.innerText = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random()*4)];
                h.style.animationDuration = (3 + Math.random() * 3) + 's';
                document.body.appendChild(h);
                setTimeout(() => h.remove(), 6000);
            }, 400);

            // Open envelope automatically after delay
            setTimeout(() => {
                document.getElementById('envelope').classList.add('open');
            }, 1500);
        }

        // Letter Logic
        function toggleLetter() {
            document.getElementById('envelope').classList.toggle('open');
        }

        // Audio System
        const player = document.getElementById('player');
        let ytPlayer = null;

        function initializeAudio() {
            if(youtubeId && youtubeId.length > 5) {
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
            } else {
                player.play().catch(() => {});
                toggleMusic(true);
            }
        }

        function toggleMusic(play) {
            const btn = document.getElementById('play-toggle');
            if(play) {
                btn.textContent = '||';
                if(ytPlayer) ytPlayer.playVideo(); else player.play();
            } else {
                btn.textContent = '▶';
                if(ytPlayer) ytPlayer.pauseVideo(); else player.pause();
            }
        }

        document.getElementById('play-toggle').onclick = (e) => {
            e.stopPropagation();
            const btn = document.getElementById('play-toggle');
            toggleMusic(btn.textContent === '▶');
        };

        if(!youtubeId || youtubeId.length < 5) {
            player.ontimeupdate = () => {
                document.getElementById('hud-bar').style.width = (player.currentTime / player.duration) * 100 + "%";
            };
        }
    </script>
</body>
</html>`;
