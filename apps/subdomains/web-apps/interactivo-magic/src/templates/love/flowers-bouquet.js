export const FLOWERS_BOUQUET_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ramo Origami de Amor 🌸 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@400;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: #000; 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            overflow: hidden; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
        }

        .backdrop {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #0a0514 0%, #000 100%);
            z-index: 0;
        }

        /* Fireworks Canvas */
        #fireworks-canvas {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        .main-scene {
            position: relative;
            width: 100%;
            max-width: 500px;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            z-index: 10;
        }

        .top-banner {
            position: absolute;
            top: 10%;
            text-align: center;
            z-index: 50;
            animation: glow-pulse 2s infinite alternate;
        }

        .top-banner h1 {
            font-size: 2.5rem;
            font-weight: 900;
            color: #fff;
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 0, 255, 0.5);
            letter-spacing: 4px;
        }

        @keyframes glow-pulse {
            from { opacity: 0.8; transform: scale(1); }
            to { opacity: 1; transform: scale(1.05); }
        }

        /* Origami Flower Styling */
        .flowers-box {
            position: relative;
            width: 100%;
            height: 70vh;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            z-index: 20;
        }

        .flower {
            position: absolute;
            bottom: 0px;
            left: 50%;
            transform-origin: bottom center;
            transform: translate(-50%, 0) rotate(var(--angle)) scale(var(--scale));
            animation: sway 5s ease-in-out infinite alternate;
            animation-delay: var(--delay);
        }

        @keyframes sway {
            0% { transform: translate(-50%, 0) rotate(calc(var(--angle) - 3deg)) scale(var(--scale)); }
            100% { transform: translate(-50%, 0) rotate(calc(var(--angle) + 3deg)) scale(var(--scale)); }
        }

        .flower-head {
            width: 90px; height: 90px;
            position: relative;
            background: var(--color);
            /* Origami-style jagged edges */
            clip-path: polygon(50% 0%, 65% 15%, 85% 10%, 80% 30%, 100% 40%, 85% 55%, 90% 75%, 70% 70%, 55% 90%, 45% 90%, 30% 70%, 10% 75%, 15% 55%, 0% 40%, 20% 30%, 15% 10%, 35% 15%);
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.4));
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .flower-head::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 100%);
            pointer-events: none;
        }

        .flower-heart {
            width: 35px; height: 35px;
            fill: #e91e63;
            filter: drop-shadow(0 0 10px rgba(233, 30, 99, 0.5));
            z-index: 5;
        }

        .stem {
            width: 8px;
            background: linear-gradient(to right, #2d5a27, #3e8e41, #2d5a27);
            margin: 0 auto;
            border-radius: 4px;
        }

        .leaf {
            position: absolute;
            width: 35px; height: 18px;
            background: #3e8e41;
            border-radius: 50% 0;
            z-index: -1;
        }

        /* Letter Styling OVER the bouquet */
        .card-container {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            perspective: 1200px;
        }

        .envelope {
            width: 250px;
            height: 160px;
            background: #d32f2f; /* Deep Red */
            position: relative;
            cursor: pointer;
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 40px 100px rgba(0,0,0,0.8);
            border-radius: 4px;
            background-image: 
                linear-gradient(135deg, #f44336 50%, #d32f2f 50%);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .envelope-flap {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #e53935;
            clip-path: polygon(0 0, 50% 50%, 100% 0);
            z-index: 10;
            transition: transform 0.6s ease;
            transform-origin: top;
            border-bottom: 2px solid rgba(0,0,0,0.1);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .envelope-flap::after {
            content: "❤️";
            position: absolute;
            top: 30%;
            font-size: 1.5rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            transition: opacity 0.3s;
        }
        
        .envelope.open .envelope-flap::after { opacity: 0; }

        .envelope.open .envelope-flap {
            transform: rotateX(160deg);
            z-index: 0;
        }

        .letter-content {
            position: absolute;
            top: 10px; left: 10px;
            width: 230px;
            padding: 20px;
            background: #fff;
            color: #333;
            font-size: 0.9rem;
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 5;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 2px;
            max-height: 140px;
            overflow: hidden;
            pointer-events: none;
        }

        .envelope.open .letter-content {
            transform: translateY(-120px) scale(1.3);
            max-height: 480px;
            height: auto;
            width: 280px;
            left: -15px;
            z-index: 200;
            box-shadow: 0 50px 120px rgba(0,0,0,0.9);
            pointer-events: auto;
            overflow-y: auto;
        }

        .letter-header { font-family: 'Dancing Script', cursive; color: #ff1a7d; font-size: 1.8rem; border-bottom: 1px solid #ffebee; margin-bottom: 12px; }
        .letter-body { line-height: 1.6; font-weight: 500; color: #444; }
        .letter-image { width: 100%; border-radius: 8px; margin-top: 15px; border: 3px solid #fff1f5; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .letter-extra { margin-top: 10px; color: #ff1a7d; font-weight: 900; text-align: center; }
        .letter-sender { text-align: right; margin-top: 15px; font-weight: 900; color: rgba(0,0,0,0.3); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; }

        /* Intro wall */
        #intro-wall {
            position: fixed; inset: 0; background: #000; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; transition: opacity 1s ease;
        }
        #intro-wall.hide { opacity: 0; pointer-events: none; }

        /* Audio HUD */
        .audio-hud {
            position: fixed; bottom: 30px; width: 85%; max-width: 380px;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
            padding: 10px 20px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1);
            display: flex; align-items: center; gap: 15px; z-index: 1000;
        }
        .hud-btn {
            width: 40px; height: 40px; background: #ff1a7d; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;
        }
        .hud-progress { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .hud-bar { height: 100%; background: #ff1a7d; width: 0%; transition: width 0.1s; }

        @media (max-width: 500px) {
            .top-banner h1 { font-size: 1.8rem; }
            .flower-head { width: 75px; height: 75px; }
        }
    </style>
</head>
<body>
    <div id="intro-wall" onclick="startSurprise()">
        <div style="font-size: 100px; animation: bounce 3s infinite;">🌸</div>
        <h2 style="font-weight: 900; margin-top: 2rem; color: #fff;">Un Ramo Especial</h2>
        <div style="color: #ff1a7d; font-weight: 900; letter-spacing: 5px; margin-top: 1.5rem; font-size: 0.9rem;">TOCA PARA RECIBIR ❤️</div>
    </div>

    <div class="backdrop"></div>
    <canvas id="fireworks-canvas"></canvas>

    <div class="main-scene">
        <div class="top-banner">
            <h1>TE AMO 😍💖</h1>
        </div>

        <div class="card-container">
            <div class="envelope" id="main-envelope" onclick="this.classList.toggle('open')">
                <div class="envelope-flap"></div>
                <div class="letter-content">
                    <div class="letter-header">Para: {{name}}</div>
                    <div class="letter-body">{{message}}</div>
                    <img src="{{image_src}}" class="letter-image" onerror="this.style.display='none'">
                    <div class="letter-extra">{{extra_text}}</div>
                    <div class="letter-sender">De: {{sender}} ❤️</div>
                </div>
            </div>
        </div>

        <div class="flowers-box" id="bouquet-area"></div>
    </div>

    <div class="audio-hud" id="audio-ui" style="display: none;">
        <div class="hud-btn" id="audio-toggle">▶</div>
        <div class="hud-progress"><div class="hud-bar" id="hud-bar"></div></div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script>
        // Bouquet Setup
        function createBouquet() {
            const container = document.getElementById('bouquet-area');
            const colors = ['#ff85a1', '#ffd93d', '#6bf1ff', '#b4ff9f', '#d789ff', '#ffffff'];
            const count = 35;

            for (let i = 0; i < count; i++) {
                const f = document.createElement('div');
                f.className = 'flower';
                
                const angle = (i / count) * 160 - 80;
                const dist = 350 + Math.random() * 300;
                const scale = 0.5 + Math.random() * 0.6;
                const delay = (Math.random() * -5) + 's';
                const color = colors[Math.floor(Math.random() * colors.length)];

                f.style.setProperty('--angle', angle + 'deg');
                f.style.setProperty('--scale', scale);
                f.style.setProperty('--delay', delay);
                f.style.setProperty('--color', color);

                let html = \`
                    <div class="stem" style="height: \${dist}px; position: relative;">
                        <div class="leaf" style="top: 20%; left: 0; transform: rotate(-45deg)"></div>
                        <div class="leaf" style="top: 40%; right: 0; transform: scaleX(-1) rotate(-45deg)"></div>
                    </div>
                    <div class="flower-head" style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%)">
                        <svg class="flower-heart" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                \`;
                f.innerHTML = html;
                container.appendChild(f);
            }
        }

        // Fireworks Engine
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.onresize = resize;
        resize();

        class Particle {
            constructor(x, y, color) {
                this.x = x; this.y = y; this.color = color;
                this.vel = { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 };
                this.life = 1;
                this.decay = 0.01 + Math.random() * 0.02;
            }
            draw() {
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                this.x += this.vel.x;
                this.y += this.vel.y;
                this.vel.y += 0.05; // gravity
                this.life -= this.decay;
            }
        }

        function spawnFirework() {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.6);
            const color = \`hsl(\${Math.random() * 360}, 100%, 60%)\`;
            for (let i = 0; i < 40; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(p => p.life > 0);
            particles.forEach(p => { p.update(); p.draw(); });
            if (Math.random() < 0.03) spawnFirework();
            requestAnimationFrame(animate);
        }

        // Main Control
        function startSurprise() {
            document.getElementById('intro-wall').classList.add('hide');
            createBouquet();
            animate();
            if('{{has_audio}}' === 'true') {
                document.getElementById('audio-ui').style.display = 'flex';
                initializeAudio();
            }
        }

        // Audio Logic
        const player = document.getElementById('player');
        let ytPlayer = null;

        function initializeAudio() {
            const yId = "{{youtube_id}}".replace(/[{}]/g, '');
            if(yId) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
                window.onYouTubeIframeAPIReady = () => {
                    ytPlayer = new YT.Player('yt-player', {
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
            const btn = document.getElementById('audio-toggle');
            if(play) {
                btn.textContent = '||';
                if(ytPlayer) ytPlayer.playVideo(); else player.play();
            } else {
                btn.textContent = '▶';
                if(ytPlayer) ytPlayer.pauseVideo(); else player.pause();
            }
        }

        document.getElementById('audio-toggle').onclick = () => {
            const active = document.getElementById('audio-toggle').textContent === '||';
            toggleMusic(!active);
        };

        if(!("{{youtube_id}}")) {
            player.ontimeupdate = () => {
                document.getElementById('hud-bar').style.width = (player.currentTime / player.duration) * 100 + "%";
            };
        }
    </script>
</body>
</html>`;
