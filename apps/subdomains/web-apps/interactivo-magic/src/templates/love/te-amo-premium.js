export const TE_AMO_PREMIUM_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Te Amo 💞</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
        
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

        #particle-canvas {
            position: absolute;
            inset: 0;
            z-index: 5;
            background: #000;
        }

        /* Intro Overlay - Pink theme as requested */
        #intro-overlay {
            position: fixed;
            inset: 0;
            background: #d84373; /* Vibrant pink from reference */
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
            overflow: hidden;
        }

        .floating-hearts-intro {
            position: absolute;
            inset: 0;
            pointer-events: none;
        }

        .btn-open {
            background: #000;
            color: #fff;
            padding: 20px 45px;
            border-radius: 20px;
            font-size: 1.4rem;
            font-weight: 800;
            border: none;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-open:active { transform: scale(0.92); }

        /* Background Effects */
        .nebula {
            position: absolute;
            inset: 0;
            background: 
                radial-gradient(circle at 30% 20%, rgba(216, 67, 115, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, rgba(142, 68, 173, 0.2) 0%, transparent 40%);
            filter: blur(50px);
            z-index: 2;
            opacity: 0;
            transition: opacity 2s ease;
        }

        /* Overlay Content (Final Message) */
        .ui-overlay {
            position: absolute;
            bottom: 20vh;
            left: 0;
            width: 100%;
            text-align: center;
            z-index: 20;
            pointer-events: none;
            opacity: 0;
            transform: translateY(30px);
            transition: all 1.5s ease 1s;
        }
        .ui-overlay.visible { opacity: 1; transform: translateY(0); }

        .message-box {
            display: inline-block;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px 40px;
            border-radius: 100px;
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .name-heading {
            color: #fff;
            font-size: 2.2rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 15px rgba(255, 77, 148, 0.5);
        }

        .subtitle-text {
            color: #ffcc00;
            font-size: 1.2rem;
            font-weight: 800;
            margin-top: 10px;
            font-style: italic;
        }

        .sender-tag {
            margin-top: 15px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.85rem;
            letter-spacing: 2px;
            font-weight: 600;
            text-transform: uppercase;
        }

        /* Audio Player UI - Standard Magic Player */
        #audio-controls {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 400px;
            background: #fff;
            padding: 8px 15px;
            border-radius: 100px;
            border: 2.5px solid #ff4d94;
            display: none; /* Shown via JS */
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 1000;
        }

        .audio-play-btn {
            width: 44px;
            height: 44px;
            background: #ff4d94;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 77, 148, 0.4);
            flex-shrink: 0;
            transition: transform 0.2s;
        }
        .audio-play-btn:active { transform: scale(0.9); }

        .audio-progress-container {
            flex-grow: 1;
            height: 5px;
            background: #ffe6f0;
            border-radius: 10px;
            position: relative;
            cursor: pointer;
        }

        .audio-progress-bar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: #ff4d94;
            border-radius: 10px;
            width: 0%;
            transition: width 0.1s linear;
        }

        .audio-time {
            color: #d84373;
            font-weight: 900;
            font-size: 0.9rem;
            min-width: 35px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="floating-hearts-intro" id="hearts-bg"></div>
        <button class="btn-open" onclick="initExperience()">💖 Abre la sorpresa 💖</button>
    </div>

    <div class="nebula" id="nebula"></div>
    <canvas id="particle-canvas"></canvas>

    <div class="ui-overlay" id="ui-overlay">
        <h2 class="name-heading">{{name}}</h2>
        <div class="message-box">{{message}}</div>
        <div class="subtitle-text">{{extra_text}}</div>
        <div class="sender-tag">Con amor: {{sender}}</div>
    </div>

    <div id="audio-controls">
        <div class="audio-play-btn" id="audio-toggle">
            <svg id="play-svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg id="pause-svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </div>
        <div class="audio-progress-container" id="progress-area">
            <div class="audio-progress-bar" id="progress-bar"></div>
        </div>
        <div class="audio-time" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; top:-100px; opacity:0; pointer-events:none;"></div>

    <script>
        (function() {
            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas.getContext('2d');
            const particles = [];
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            let width, height;
            let mouse = { x: -1000, y: -1000, radius: isMobile ? 60 : 100 };
            let animationStarted = false;

            // Configuration
            const particleCount = isMobile ? 800 : 1500;
            const particleSize = isMobile ? 1.5 : 2;
            const returnForce = 0.08;
            const friction = 0.95;

            class Particle {
                constructor(x, y, color) {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.destX = x;
                    this.destY = y;
                    this.color = color;
                    this.vx = (Math.random() - 0.5) * 5;
                    this.vy = (Math.random() - 0.5) * 5;
                    this.size = Math.random() * particleSize + 1;
                    this.alpha = Math.random() * 0.5 + 0.5;
                }

                update() {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let angle = Math.atan2(dy, dx);
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.vx -= Math.cos(angle) * force * 5;
                        this.vy -= Math.sin(angle) * force * 5;
                    }

                    this.vx += (this.destX - this.x) * returnForce;
                    this.vy += (this.destY - this.y) * returnForce;
                    this.vx *= friction;
                    this.vy *= friction;
                    this.x += this.vx;
                    this.y += this.vy;
                }

                draw() {
                    ctx.globalAlpha = this.alpha;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            function resize() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                if (animationStarted) createParticles();
            }

            function createParticles() {
                particles.length = 0;
                const textCtx = document.createElement('canvas').getContext('2d');
                textCtx.canvas.width = 600;
                textCtx.canvas.height = 400;
                textCtx.fillStyle = "white";
                textCtx.font = "bold 150px Arial";
                textCtx.textAlign = "center";
                
                const centerX = 300;
                const centerY = 180;
                textCtx.beginPath();
                for (let t = 0; t < Math.PI * 2; t += 0.01) {
                    const x = 16 * Math.pow(Math.sin(t), 3);
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    const px = centerX + x * 10;
                    const py = centerY + y * 10;
                    if (t === 0) textCtx.moveTo(px, py);
                    else textCtx.lineTo(px, py);
                }
                textCtx.fill();
                textCtx.font = "900 80px Outfit";
                textCtx.fillText("TE AMO", 300, 210);

                const imageData = textCtx.getImageData(0, 0, 600, 400).data;
                const step = isMobile ? 6 : 4;
                const colors = ["#ff4d94", "#ff75a0", "#ffacc5", "#ffffff"];

                for (let y = 0; y < 400; y += step) {
                    for (let x = 0; x < 600; x += step) {
                        const index = (y * 600 + x) * 4;
                        if (imageData[index + 3] > 128) {
                            const posX = x + (width / 2 - 300);
                            const posY = y + (height / 2 - 260); // Moved up by 60px
                            const color = colors[Math.floor(Math.random() * colors.length)];
                            particles.push(new Particle(posX, posY, color));
                        }
                    }
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

            function createIntroHearts() {
                const container = document.getElementById('hearts-bg');
                for(let i=0; i<25; i++) {
                    const h = document.createElement('div');
                    h.innerHTML = "❤️";
                    h.style.position = 'absolute';
                    h.style.left = Math.random() * 100 + '%';
                    h.style.top = Math.random() * 100 + '%';
                    h.style.fontSize = (Math.random() * 40 + 20) + 'px';
                    h.style.opacity = Math.random() * 0.4 + 0.1;
                    h.style.filter = 'blur(' + (Math.random()*4) + 'px)';
                    h.style.animation = 'floatIntro ' + (Math.random() * 10 + 5) + 's infinite ease-in-out';
                    h.style.animationDelay = (Math.random() * 5) + 's';
                    container.appendChild(h);
                }
            }

            // Handle Audio
            const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
            const hasAudio = '{{has_audio}}' === 'true' || ("{{audio_src}}" && !"{{audio_src}}".includes("{{")) || (youtubeId && youtubeId.length > 2);
            const audio = document.getElementById('bg-audio');
            const audioBtn = document.getElementById('audio-toggle');
            const playSvg = document.getElementById('play-svg');
            const pauseSvg = document.getElementById('pause-svg');
            let ytPlayer = null;
            let isPlaying = false;
            let platform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

            function toggleAudio(play) {
                if (play === undefined) play = !isPlaying;
                if (platform === 'youtube' && ytPlayer) {
                    if (play) ytPlayer.playVideo(); else ytPlayer.pauseVideo();
                } else {
                    if (play) audio.play().catch(() => {}); else audio.pause();
                }
                updateAudioUI(play);
            }

            function updateAudioUI(playing) {
                isPlaying = playing;
                playSvg.style.display = playing ? 'none' : 'block';
                pauseSvg.style.display = playing ? 'block' : 'none';
                if (playing) startProgressLoop();
            }

            let progressInterval = null;
            function startProgressLoop() {
                if (progressInterval) return;
                progressInterval = setInterval(() => {
                    if (!isPlaying) return;
                    let current, duration;
                    if (platform === 'youtube' && ytPlayer && ytPlayer.getCurrentTime) {
                        current = ytPlayer.getCurrentTime();
                        duration = ytPlayer.getDuration();
                    } else {
                        current = audio.currentTime;
                        duration = audio.duration;
                    }
                    if (duration) {
                        const pct = (current / duration) * 100;
                        document.getElementById('progress-bar').style.width = pct + '%';
                        document.getElementById('time-display').innerText = formatTime(current);
                    }
                }, 500);
            }

            function formatTime(s) {
                const min = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return min + ":" + (sec < 10 ? '0' : '') + sec;
            }

            if (platform === 'youtube') {
                const script = document.createElement('script');
                script.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(script);
                window.onYouTubeIframeAPIReady = () => {
                    ytPlayer = new YT.Player('yt-player', {
                        videoId: youtubeId,
                        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: youtubeId },
                        events: { 
                            onStateChange: (e) => { 
                                updateAudioUI(e.data === 1); 
                            } 
                        }
                    });
                };
            }

            window.initExperience = function() {
                const intro = document.getElementById('intro-overlay');
                intro.style.opacity = '0';
                intro.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    intro.style.display = 'none';
                    document.getElementById('nebula').style.opacity = '1';
                    document.getElementById('ui-overlay').classList.add('visible');
                    if (hasAudio) {
                        document.getElementById('audio-controls').style.display = 'flex';
                        toggleAudio(true);
                    }
                    animationStarted = true;
                    createParticles();
                }, 1000);
            };

            window.addEventListener('resize', resize);
            const moveHandler = (e) => {
                const pos = e.touches ? e.touches[0] : e;
                mouse.x = pos.clientX;
                mouse.y = pos.clientY;
            };
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('touchstart', moveHandler);
            window.addEventListener('touchmove', moveHandler);
            window.addEventListener('touchend', () => { mouse.x = -1000; mouse.y = -1000; });
            
            audioBtn.onclick = () => toggleAudio();

            document.getElementById('progress-area').onclick = (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = x / rect.width;
                if (platform === 'youtube' && ytPlayer) {
                    ytPlayer.seekTo(pct * ytPlayer.getDuration());
                } else {
                    audio.currentTime = pct * audio.duration;
                }
            };
            
            createIntroHearts();
            resize();
            animate();
        })();
    </script>
</body>
</html>`;
