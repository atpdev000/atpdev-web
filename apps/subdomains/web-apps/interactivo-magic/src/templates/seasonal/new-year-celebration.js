export const NEW_YEAR_CELEBRATION_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Feliz Año Nuevo, {{name}}!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Montserrat:wght@800;900&display=swap');
        
        :root {
            --neon-orange: #ff6b00;
            --neon-amber: #ffb400;
            --neon-cyan: #00f2ff;
            --dark-bg: #05020a;
            --glass: rgba(26, 26, 26, 0.9);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: var(--dark-bg); 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden;
            perspective: 1200px;
        }

        #fireworks { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

        .hex-bg {
            position: fixed; inset: 0; opacity: 0.15; z-index: 1;
            background-image: 
                radial-gradient(circle at center, transparent 0%, var(--dark-bg) 100%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45v-30L30 0z' fill-opacity='0' stroke='%23ff6b00' stroke-width='1'/%3E%3C/svg%3E");
            background-size: cover, 60px 60px;
        }

        /* Main Card Container */
        .card-container {
            position: relative;
            width: 380px;
            padding: 40px 30px;
            background: var(--glass);
            border-radius: 40px;
            border: 2px solid rgba(255, 107, 0, 0.3);
            box-shadow: 0 40px 100px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,107,0,0.05);
            z-index: 10;
            text-align: center;
            animation: cardEntrance 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(20px);
        }

        /* Side Decorations */
        .side-deco {
            position: absolute;
            font-size: 2.5rem;
            filter: drop-shadow(0 0 15px rgba(255, 107, 0, 0.4));
            animation: decoFloat 3s infinite ease-in-out;
            pointer-events: none;
        }
        .deco-left { left: -50px; top: 10%; animation-delay: 0s; }
        .deco-right { right: -50px; bottom: 10%; animation-delay: 1.5s; }
        
        @keyframes decoFloat {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }

        @keyframes cardEntrance {
            from { transform: scale(0.9) translateY(50px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .main-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 2.3rem;
            font-weight: 900;
            color: var(--neon-orange);
            margin-bottom: 25px;
            text-shadow: 0 0 15px rgba(255,107,0,0.4);
            line-height: 1.1;
            text-transform: uppercase;
            letter-spacing: -1px;
        }

        .photo-frame {
            width: 150px; height: 150px;
            border-radius: 50%;
            border: 5px solid var(--neon-orange);
            margin: 0 auto 30px auto;
            position: relative;
            box-shadow: 0 0 40px rgba(255,107,0,0.4);
            overflow: hidden;
            display: {{image_display}};
            background: #222;
        }
        .photo-frame img { width: 100%; height: 100%; object-fit: cover; }

        .name-banner {
            font-size: 2.4rem;
            font-weight: 900;
            color: white;
            margin-bottom: 12px;
            background: linear-gradient(135deg, white, var(--neon-amber));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -1px;
        }

        .extra-line {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--neon-cyan);
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .message-content {
            font-size: 1.05rem;
            line-height: 1.6;
            color: rgba(255,255,255,0.8);
            margin-bottom: 30px;
            font-style: italic;
        }

        .sender-footer {
            font-weight: 900;
            font-size: 0.85rem;
            color: var(--neon-orange);
            text-transform: uppercase;
            letter-spacing: 3px;
            opacity: 0.9;
        }

        /* Standardized Audio HUD */
        .audio-controls {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            width: 85%; max-width: 350px; background: rgba(0, 242, 255, 0.08);
            backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px;
            border: 1px solid rgba(0, 242, 255, 0.2); display: flex; align-items: center; gap: 15px;
            z-index: 1000; box-shadow: 0 10px 40px rgba(0,0,0,0.5); color: white; opacity: 0;
            transition: 0.6s; pointer-events: none;
        }
        .audio-controls.visible { opacity: 1; pointer-events: all; }
        .play-btn { 
            width: 42px; height: 42px; background: var(--neon-cyan); border-radius: 50%;
            display: flex; justify-content: center; align-items: center; cursor: pointer;
            color: var(--dark-bg) !important; font-size: 1.1rem;
        }
        .progress-bar-container { flex-grow: 1; height: 6px; background: rgba(0, 242, 255, 0.1); border-radius: 3px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: var(--neon-cyan); }
    </style>
</head>
<body>
    <div class="hex-bg"></div>
    <canvas id="fireworks"></canvas>

    <div class="card-container">
        <div class="side-deco deco-left">🥂</div>
        <div class="side-deco deco-right">🎇</div>

        <div class="main-title">¡FELIZ AÑO NUEVO <span id="current-year"></span>!</div>
        
        <div class="photo-frame">
            <img src="{{image_src}}" alt="Foto" onerror="this.parentElement.style.display='none'">
        </div>
        
        <div class="name-banner">{{name}}</div>
        <div class="extra-line">{{extra_text}}</div>
        
        <div class="message-content">{{message}}</div>
        
        <div class="sender-footer">DE: {{sender}}</div>
    </div>

    <!-- Audio HUD -->
    <div class="audio-controls" id="audio-ui" style="display: {{audio_display}};">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
        let audio = document.getElementById('bg-audio');
        let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';
        let ytReady = false;
        let playOnReady = false;

        // --- Dynamic Year ---
        const now = new Date();
        const year = (now.getMonth() === 11 && now.getDate() >= 20) ? now.getFullYear() + 1 : now.getFullYear();
        document.getElementById('current-year').textContent = year;

        window.startApp = function() {
            document.getElementById('audio-ui').classList.add('visible');
            if (hasAudio) {
                try {
                    if (activePlatform === 'youtube') {
                        if (window.ytPlayer && typeof window.ytPlayer.playVideo === 'function') window.ytPlayer.playVideo();
                        else playOnReady = true;
                    } else {
                        audio.play().catch(e => console.log("Audio blocked", e));
                    }
                } catch (e) {}
            }
            startFireworks();
        };

        if (activePlatform === 'youtube' && !window.YT_API_LOADED) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            window.YT_API_LOADED = true;
        }

        window.onYouTubeIframeAPIReady = function() {
            if (activePlatform === 'youtube') {
                window.ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { ytReady = true; if(playOnReady) window.ytPlayer.playVideo(); },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        function updateUI(playing) {
            document.getElementById('play-icon').style.display = playing ? 'none' : 'inline';
            document.getElementById('pause-icon').style.display = playing ? 'inline' : 'none';
        }

        document.getElementById('play-btn').onclick = () => {
            if (activePlatform === 'youtube' && window.ytPlayer) {
                if (window.ytPlayer.getPlayerState() === 1) window.ytPlayer.pauseVideo();
                else window.ytPlayer.playVideo();
            } else {
                if (audio.paused) audio.play();
                else audio.pause();
            }
        };

        audio.onplay = () => updateUI(true);
        audio.onpause = () => updateUI(false);
        audio.ontimeupdate = () => {
            document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%';
        };

        function startFireworks() {
            const canvas = document.getElementById('fireworks');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const particles = [];
            const colors = ['#ff6b00', '#00f2ff', '#ffffff', '#fdd835'];

            function createFirework() {
                const x = Math.random() * canvas.width;
                const y = canvas.height;
                const targetY = Math.random() * (canvas.height * 0.4);
                const color = colors[Math.floor(Math.random() * colors.length)];
                for(let i=0; i<40; i++) {
                    particles.push({
                        x, y: targetY,
                        vx: (Math.random() - 0.5) * 8,
                        vy: (Math.random() - 0.5) * 8,
                        alpha: 1, color, decay: 0.015
                    });
                }
            }

            function animate() {
                ctx.fillStyle = 'rgba(5, 2, 10, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p, i) => {
                    p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
                    ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
                    if(p.alpha <= 0) particles.splice(i, 1);
                });
                if(Math.random() < 0.06) createFirework();
                requestAnimationFrame(animate);
            }
            animate();
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#ff6b00', '#00f2ff', '#fdd835'] });
        }
    </script>
</body>
</html>`;
