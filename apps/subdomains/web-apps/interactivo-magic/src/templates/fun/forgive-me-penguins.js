export const FORGIVE_ME_PENGUINS_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Me perdonas? 🐧💔 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff85a1;
            --secondary: #0080ff;
            --bg: #ffeef2;
            --card-bg: #ffffff;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
        }

        .container {
            width: 90%;
            max-width: 400px;
            text-align: center;
            z-index: 10;
        }

        .main-title {
            font-size: 1.8rem;
            font-weight: 900;
            color: #333;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 40px;
            box-shadow: 0 20px 45px rgba(255, 133, 161, 0.12);
            position: relative;
            transition: transform 0.3s ease;
        }

        /* Dual Photo Styling */
        .photo-container {
            position: relative;
            width: 100%;
            max-width: 250px;
            margin: 0 auto 1.5rem;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            background: #fdfdfd;
        }
        
        .img-block {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            display: block;
        }

        .message {
            color: var(--primary);
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 2rem;
            line-height: 1.4;
        }

        .btns {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            height: 100px;
        }

        button {
            padding: 14px 40px;
            border-radius: 30px;
            border: none;
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #yesBtn {
            background-color: var(--primary);
            color: white;
            box-shadow: 0 10px 25px rgba(255, 133, 161, 0.3);
            min-width: 110px;
            justify-content: center;
            z-index: 100;
        }

        #noBtn {
            background-color: white;
            color: #ff4d4d;
            border: 2px solid #ffeded;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            white-space: nowrap;
        }

        /* Success Screen */
        .success-screen {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .success-screen.active { display: flex; }

        .victory-photo-circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 8px solid white;
            box-shadow: 0 15px 40px rgba(255, 133, 161, 0.25);
            margin-bottom: 2rem;
            object-fit: cover;
            animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounceIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }

        .victory-msg {
            font-size: 2.2rem;
            font-weight: 900;
            color: var(--primary);
            margin-bottom: 1rem;
            letter-spacing: -1px;
        }

        .sender-tag {
            font-size: 0.85rem;
            font-weight: 900;
            color: rgba(0,0,0,0.3);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 0.5rem;
        }

        /* Hearts background */
        .hearts-bg {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
        .heart-bit {
            position: absolute;
            animation: float-up linear forwards;
        }
        @keyframes float-up {
            from { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.7; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        /* Audio HUD */
        .audio-hud {
            position: fixed;
            bottom: 30px;
            width: 85%;
            max-width: 400px;
            background: white;
            padding: 12px 25px;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
        }
        .play-btn {
            width: 45px; height: 45px;
            background: var(--primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer;
        }
        .progress { flex: 1; height: 5px; background: #f5f5f5; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--primary); width: 0%; }

        /* Intro wall */
        #wall {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: opacity 1s ease;
        }
        #wall.hide { opacity: 0; pointer-events: none; }
    </style>
</head>
<body>
    <div id="wall" onclick="startApp()">
        <div style="font-size: 100px; animation: bounce 2s infinite;">🐧</div>
        <h2 style="font-weight: 900; margin-top: 1.5rem; font-size: 2rem;">¿Me perdonas?</h2>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 5px; margin-top: 1.5rem; font-size: 0.8rem;">TOCA PARA ABRIR</div>
    </div>

    <div class="hearts-bg" id="hearts-box"></div>

    <div class="container" id="game-ui">
        <h1 class="main-title">¿Me perdonas mi Amor? 💔</h1>
        <div class="card" id="main-card">
            <!-- Cover Photo Area -->
            <div class="photo-container" id="cover-area">
                <img id="cover-photo" src="{{image_src}}" class="img-block" onerror="this.src='https://media.tenor.com/XU684T4zQ_4AAAAC/penguin-crying.gif'">
            </div>
            
            <div class="message">Dame otra oportunidad 💐</div>
            <div class="btns">
                <button id="noBtn">No 💔</button>
                <button id="yesBtn">Sí 💖</button>
            </div>
        </div>
    </div>

    <div class="container success-screen" id="success-ui">
        <div class="card">
            <div class="sender-tag">De: {{sender}}</div>
            <h2 class="victory-msg">¡GRACIAS! ❤️</h2>
            
            <!-- Result Photo Area -->
            <img src="{{img2}}" class="victory-photo-circle" id="result-photo" onerror="this.src='{{image_src}}'; this.onerror=function(){this.src='https://media.tenor.com/_q1fJ7eXRE8AAAAd/love-penguin.gif'}">
            
            <div class="message" style="color: #333; margin-top: 1.5rem;">{{extra_text}}</div>
            <p style="color: rgba(0,0,0,0.5); font-style: italic; max-width: 300px; margin: 0 auto;">{{message}}</p>
            <div style="font-size: 3rem; margin-top: 2rem;">🐧💖✨</div>
        </div>
    </div>

    <div class="audio-hud" id="audio-panel" style="display: none;">
        <div class="play-btn" id="audio-trigger">▶</div>
        <div class="progress"><div class="progress-bar" id="p-bar"></div></div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const penguinGifs = {
            sad: "https://media.tenor.com/XU684T4zQ_4AAAAC/penguin-crying.gif",
            crying: "https://media.tenor.com/yO8_M8W_pBAAAAAC/penguin-cry.gif",
            happy: "https://media.tenor.com/_q1fJ7eXRE8AAAAd/love-penguin.gif"
        };

        const noBtn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const coverImg = document.getElementById('cover-photo');

        let level = 0;
        let scale = 1;

        function moveNo() {
            level++;
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 80);
            
            noBtn.style.position = 'fixed';
            noBtn.style.left = x + 'px';
            noBtn.style.top = y + 'px';
            noBtn.style.zIndex = '9999';

            scale += 0.2;
            yesBtn.style.transform = "scale(" + scale + ")";

            // If user didn't upload a cover photo, we swap between sad penguin states
            if(!'{{image_src}}' || '{{image_src}}'.includes('{{')) {
                if(level > 4) coverImg.src = penguinGifs.crying;
                else if(level > 1) coverImg.src = penguinGifs.sad;
            }
        }

        noBtn.addEventListener('mouseenter', moveNo);
        noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });

        yesBtn.onclick = () => {
            document.getElementById('game-ui').style.display = 'none';
            document.getElementById('success-ui').classList.add('active');
            
            const duration = 12 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const pc = 45 * (timeLeft / duration);
                confetti({...defaults, particleCount: pc, origin: { x: Math.random(), y: Math.random() - 0.2 }});
            }, 250);

            toggleMusic(true);
        };

        const player = document.getElementById('player');
        let ytPlayer = null;

        function startApp() {
            document.getElementById('wall').classList.add('hide');
            if('{{has_audio}}' === 'true') {
                document.getElementById('audio-panel').style.display = 'flex';
                initializeAudio();
            }
        }

        function initializeAudio() {
            const yId = "{{youtube_id}}";
            if(yId) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = () => {
                    window.ytPlayer = new YT.Player('yt-player', {
                        videoId: yId, height: '0', width: '0',
                        playerVars: { autoplay: 1, loop: 1, playlist: yId },
                        events: { 'onReady': () => toggleMusic(true) }
                    });
                };
            } else {
                player.play().catch(() => {});
                toggleMusic(true);
            }
        }

        function toggleMusic(play) {
            const btn = document.getElementById('audio-trigger');
            if(play) {
                btn.textContent = '||';
                if(window.ytPlayer) window.ytPlayer.playVideo(); else player.play();
            } else {
                btn.textContent = '▶';
                if(window.ytPlayer) window.ytPlayer.pauseVideo(); else player.pause();
            }
        }

        document.getElementById('audio-trigger').onclick = () => {
            const cur = document.getElementById('audio-trigger').textContent === '||';
            toggleMusic(!cur);
        };

        if(!("{{youtube_id}}")) {
            player.ontimeupdate = () => {
                const p = (player.currentTime / player.duration) * 100;
                document.getElementById('p-bar').style.width = p + "%";
            };
        }

        setInterval(() => {
            const h = document.createElement('div');
            h.className = 'heart-bit';
            h.innerHTML = ['❤️', '💖', '✨', '🐧'][Math.floor(Math.random() * 4)];
            h.style.left = Math.random() * 100 + 'vw';
            h.style.fontSize = (Math.random() * 20 + 20) + 'px';
            h.style.animationDuration = (Math.random() * 3 + 3) + 's';
            document.getElementById('hearts-box').appendChild(h);
            setTimeout(() => h.remove(), 5000);
        }, 600);
    </script>
</body>
</html>`;
