export const HIDDEN_MESSAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Mensaje Oculto 🤭</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&family=Dancing+Script:wght@700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Outfit', sans-serif; 
            background: #000; 
            height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
            position: relative;
            touch-action: none;
        }

        /* Background Photo (The Reveal) */
        .reveal-background {
            position: absolute;
            inset: 0;
            z-index: 1;
            background-size: cover;
            background-position: center;
            background-image: url('{{image_src}}');
            filter: brightness(0.7);
            opacity: 1;
        }

        /* Interactive Canvas */
        #interactive-canvas {
            position: absolute;
            inset: 0;
            z-index: 5;
            cursor: pointer;
        }

        /* Intro Overlay */
        #intro-overlay {
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 1s ease;
        }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        .btn-open {
            background: #ff4d94;
            color: #fff;
            padding: 20px 45px;
            border-radius: 50px;
            font-size: 1.4rem;
            font-weight: 800;
            border: none;
            cursor: pointer;
            box-shadow: 0 0 30px rgba(255, 77, 148, 0.5);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: pulse-btn 2s infinite;
        }
        @keyframes pulse-btn {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 77, 148, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(255, 77, 148, 0.8); }
        }

        /* Neon Message Circle Frame */
        .neon-content {
            position: absolute;
            z-index: 3;
            text-align: center;
            width: 85vw;
            height: 85vw;
            max-width: 350px;
            max-height: 350px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            opacity: 0;
            border: 2px solid rgba(255, 255, 255, 0.4);
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
            box-shadow: 0 0 50px rgba(255, 77, 148, 0.6), inset 0 0 30px rgba(255, 77, 148, 0.4);
            padding: 20px;
            transition: opacity 1s ease;
        }

        .neon-text {
            font-size: clamp(1.8rem, 8vw, 2.6rem);
            font-weight: 900;
            color: #fff;
            text-transform: uppercase;
            line-height: 1.1;
            margin-bottom: 10px;
            text-shadow: 0 0 15px #ff4d94, 0 0 30px #ff4d94;
        }

        .special-message {
            color: #ff4d94;
            font-size: 1.1rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            max-width: 90%;
            margin-bottom: 15px;
        }

        .sender-info {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.7);
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 700;
        }

        /* Spotify HUD */
        .music-hud {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 380px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 100;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            transition: all 0.5s ease;
            opacity: 0;
            pointer-events: none;
        }
        .music-hud.visible { opacity: 1; pointer-events: all; }

        .album-art {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff4d94, #ff9d00);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: spin 3s linear infinite;
            flex-shrink: 0;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .hud-controls { flex-grow: 1; }
        .hud-track { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 5px; position: relative; }
        .hud-progress { height: 100%; background: #ff4d94; border-radius: 2px; width: 0%; box-shadow: 0 0 10px #ff4d94; }
        
        .hud-info { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: rgba(255,255,255,0.6); }
        .hud-btn { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .song-name { font-size: 11px; font-weight: 800; color: #ff4d94; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 1px; }

    </style>
</head>
<body>

    <div id="intro-overlay">
        <button class="btn-open" onclick="startExperience()">Abre la sorpresa 🤭</button>
    </div>

    <div class="reveal-background" id="reveal-bg"></div>
    
    <div class="neon-content" id="neon-content">
        <div class="neon-text">{{extra_text}}</div>
        <div class="special-message">{{message}}</div>
        <div class="sender-info">CON AMOR: {{sender}}</div>
    </div>

    <canvas id="interactive-canvas"></canvas>

    <div class="music-hud" id="music-hud">
        <div class="album-art">🎵</div>
        <div class="hud-controls">
            <div class="hud-info">
                <span class="song-name">Mensaje Mágico</span>
                <button class="hud-btn" id="play-toggle">▶</button>
            </div>
            <div class="hud-track">
                <div class="hud-progress" id="hud-progress"></div>
            </div>
            <div class="hud-info" style="margin-top: 4px;">
                <span id="time-current">0:00</span>
                <span id="time-total">0:00</span>
            </div>
        </div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; top:-100px; opacity:0; pointer-events:none;"></div>

    <script>
        const canvas = document.getElementById('interactive-canvas');
        const ctx = canvas.getContext('2d');
        const particles = [];
        const mouse = { x: -1000, y: -1000, radius: 100 };
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        let width, height;
        let isStarted = false;

        class Heart {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.destX = this.x;
                this.destY = this.y;
                // Maximum size for zero-gap coverage
                this.size = Math.random() * 8 + 4;
                this.vx = 0;
                this.vy = 0;
                this.acc = 0.05;
                this.friction = 0.95;
                // Solid vivid colors
                const colors = ['#ffffff', '#ff4d94', '#ffacce', '#ff0066', '#ff80bf'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = 1.0; // Total opacity to block everything
            }

            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.vx -= Math.cos(angle) * force * 15;
                    this.vy -= Math.sin(angle) * force * 15;
                }

                // Drag back to original pos
                this.vx += (this.destX - this.x) * this.acc;
                this.vy += (this.destY - this.y) * this.acc;
                
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            if (isMobile) mouse.radius = 80;
            initParticles();
        }

        function initParticles() {
            particles.length = 0;
            // Doubled density again as requested: 20k for desktop, 7k for mobile
            const density = isMobile ? 7000 : 20000;
            for (let i = 0; i < density; i++) {
                particles.push(new Heart());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        // --- Audio Logic ---
        const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
        const audio = document.getElementById('bg-audio');
        let ytPlayer = null;
        let platform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        function updateAudioUI(playing) {
            isPlaying = playing;
            document.getElementById('play-toggle').innerText = playing ? '||' : '▶';
        }

        if (platform === 'youtube') {
            const script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
            window.onYouTubeIframeAPIReady = () => {
                ytPlayer = new YT.Player('yt-player', {
                    videoId: youtubeId,
                    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: youtubeId },
                    events: { onStateChange: (e) => updateAudioUI(e.data === 1) }
                });
            };
        }

        function toggleAudio() {
            if (platform === 'youtube' && ytPlayer) {
                if (isPlaying) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
            } else {
                if (isPlaying) audio.pause(); else audio.play().catch(() => {});
            }
            updateAudioUI(!isPlaying);
        }

        document.getElementById('play-toggle').onclick = toggleAudio;

        setInterval(() => {
            if (!isPlaying) return;
            let current, duration;
            if (platform === 'youtube' && ytPlayer?.getCurrentTime) {
                current = ytPlayer.getCurrentTime();
                duration = ytPlayer.getDuration();
            } else {
                current = audio.currentTime;
                duration = audio.duration;
            }
            if (duration) {
                const pct = (current / duration) * 100;
                document.getElementById('hud-progress').style.width = pct + '%';
                document.getElementById('time-current').innerText = formatTime(current);
                document.getElementById('time-total').innerText = formatTime(duration);
            }
        }, 500);

        function formatTime(s) {
            const min = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }

        // --- Experience Trigger ---
        window.startExperience = function() {
            document.getElementById('intro-overlay').classList.add('hidden');
            document.getElementById('music-hud').classList.add('visible');
            document.getElementById('neon-content').style.opacity = 1;
            
            if ('{{has_audio}}' === 'true') {
                toggleAudio();
            }

            isStarted = true;
        };

        const handleInput = (e) => {
            if(!isStarted) return;
            const pos = e.touches ? e.touches[0] : e;
            mouse.x = pos.clientX;
            mouse.y = pos.clientY;
        };

        window.addEventListener('mousemove', handleInput);
        window.addEventListener('touchstart', handleInput);
        window.addEventListener('touchmove', handleInput);
        window.addEventListener('touchend', () => { mouse.x = -1000; mouse.y = -1000; });
        
        window.addEventListener('resize', resize);
        resize();
        animate();
    </script>
</body>
</html>`;
