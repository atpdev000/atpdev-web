export const LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tengo algo que decirte, {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: #05020a; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow-y: auto; overflow-x: hidden; perspective: 1000px; }
        
        .romantic-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #05020a 100%); }
        .nebula { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at 20% 30%, rgba(255, 77, 148, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(112, 0, 255, 0.1) 0%, transparent 50%); filter: blur(30px); }
        .hearts-bg { position: absolute; width: 100%; height: 100%; pointer-events: none; }

        .card { 
            position: relative; 
            background: rgba(15, 10, 25, 0.7); 
            backdrop-filter: blur(25px); 
            padding: 3rem 2rem; 
            border-radius: 35px; 
            text-align: center; 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            width: 90%; 
            max-width: 450px; 
            box-shadow: 0 25px 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(255, 77, 148, 0.1); 
            z-index: 10;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        h1 { color: #ff4d94; font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem; text-shadow: 0 0 20px rgba(255, 77, 148, 0.4); }
        .proposal-msg { font-size: 1.25rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem; font-weight: 300; }
        
        .btns { display: flex; gap: 1.5rem; justify-content: center; margin-top: 2rem; position: relative; }
        button { 
            padding: 14px 40px; 
            border-radius: 50px; 
            border: none; 
            font-size: 1.15rem; 
            font-weight: 800; 
            cursor: pointer; 
            transition: all 0.3s ease; 
            font-family: 'Outfit', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        #yesBtn { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; box-shadow: 0 10px 25px rgba(255, 65, 108, 0.4); }
        #yesBtn:hover { transform: scale(1.05); box-shadow: 0 15px 35px rgba(255, 65, 108, 0.6); }
        #noBtn { background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); }
        
        .sender { margin-top: 2.5rem; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); font-weight: 600; }
        .sender-name { color: #ffcc00; display: block; font-size: 1.2rem; margin-top: 5px; font-weight: 800; }

        #success { display: none; opacity: 0; transform: scale(0.9) translateY(20px); transition: all 0.8s ease; }
        #success.visible { display: block; opacity: 1; transform: scale(1) translateY(0); }

        .photo-frame {
            position: relative;
            width: 180px;
            height: 180px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            padding: 8px;
            background: linear-gradient(45deg, #ff416c, #7000ff);
            box-shadow: 0 0 30px rgba(255, 65, 108, 0.4);
            animation: borderRotate 4s linear infinite;
        }
        @keyframes borderRotate {
            from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        .photo-inner {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            background: #000;
            border: 4px solid #05020a;
            transform: rotate(-10deg); /* Counter-rotate slightly */
        }
        .photo-inner img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.1); transition: transform 0.5s; }
        .photo-inner:hover img { transform: scale(1.25); }

        .success-title { font-size: 2.5rem; font-weight: 900; background: linear-gradient(to bottom, #fff, #ff416c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1.5rem; animation: pulse-title 2s infinite ease-in-out; }
        @keyframes pulse-title { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 65, 108, 0.3)); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(255, 65, 108, 0.6)); } }
        
        .extra-msg { font-size: 1.6rem; font-weight: 800; color: #ffcc00; line-height: 1.3; margin-bottom: 1rem; text-shadow: 0 0 10px rgba(255, 204, 0, 0.3); }
        .final-p { font-size: 1.1rem; color: rgba(255,255,255,0.7); font-style: italic; }

        /* Unified Overlay & Player */
        #intro-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:#05020a; z-index:10000; display:flex; justify-content:center; align-items:center; transition: opacity 0.8s ease; }
        .box-emoji { font-size: 100px; animation: boxHeartbeat 1.5s infinite; filter: drop-shadow(0 0 30px rgba(255, 65, 108, 0.5)); }
        @keyframes boxHeartbeat { 0%, 100% { transform: scale(1.1); } 50% { transform: scale(1.35); } }

        .audio-controls { position: fixed; bottom: 30px; width: 85%; max-width: 400px; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(15px); padding: 15px 25px; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 15px; z-index: 1000; }
        .play-btn { width: 45px; height: 45px; background: #ff416c; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; border: none; font-size: 1.2rem; }
    </style>
</head>
<body>
    <div class="romantic-bg">
        <div class="nebula"></div>
        <div class="hearts-bg" id="hearts-container"></div>
    </div>

    <div id="intro-overlay" onclick="openBox()">
        <div class="box-container">
            <div class="box-emoji">❤️</div>
            <div class="box-text" style="margin-top:20px; color:white; font-weight:800; font-size:1.8rem;">DALE CLIC</div>
            <div class="tap-to-open" style="color:rgba(255,255,255,0.5); letter-spacing:3px; margin-top:10px;">PARA ABRIR TÚ SORPRESA</div>
        </div>
    </div>

    <div class="card" id="mainCard">
        <h1>Para: {{name}}</h1>
        <div class="proposal-msg">{{message}}</div>
        <div class="btns">
            <button id="yesBtn">SÍ ❤️</button>
            <button id="noBtn">NO 😢</button>
        </div>
        <div class="sender">Enviado con Amor por: <span class="sender-name">{{sender}}</span></div>
    </div>

    <div class="card" id="success">
        <div class="photo-frame" style="display: {{image_display}}">
            <div class="photo-inner">
                <img src="{{image_src}}" alt="Foto especial" onerror="this.closest('.photo-frame').style.display='none'">
            </div>
        </div>
        <h2 class="success-title">¡SÍ, ACEPTO! 💍</h2>
        <div class="extra-msg text-glow">{{extra_text}}</div>
        <p class="final-p">Te quiero muchísimo, {{name}}.</p>
        <a href="/" style="display:inline-block; margin-top:2rem; color:rgba(255,255,255,0.4); text-decoration:none; font-size:0.8rem; border:1px solid rgba(255,255,255,0.1); padding:8px 15px; border-radius:20px;">Crea tu propio mensaje ✨</a>
    </div>

    <div class="audio-controls" id="audio-ui" style="display: none;">
        <div class="song-title">Audio Mágico</div>
        <div class="play-btn" id="play-btn">
            <div id="play-icon">▶</div>
            <div id="pause-icon" style="display:none">||</div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div class="time-display time-text" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player-container" style="position:fixed; top:0; left:0; width:1px; height:1px; opacity:0.01; pointer-events:none;">
        <div id="youtube-player"></div>
    </div>

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        let ytReady = false;
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        // Background Hearts
        function createBackgroundHeart() {
            const container = document.getElementById('hearts-container');
            const h = document.createElement('div');
            h.innerHTML = '❤️';
            h.style.position = 'absolute';
            h.style.left = Math.random() * 100 + '%';
            h.style.top = '105%';
            h.style.fontSize = (Math.random() * 20 + 10) + 'px';
            h.style.opacity = Math.random() * 0.3 + 0.1;
            h.style.filter = 'blur(' + (Math.random() * 2) + 'px)';
            h.style.transition = 'transform ' + (Math.random() * 5 + 5) + 's linear';
            container.appendChild(h);

            setTimeout(() => {
                h.style.transform = 'translateY(-120vh) translateX(' + (Math.random() * 100 - 50) + 'px) rotate(' + (Math.random() * 360) + 'deg)';
            }, 10);

            setTimeout(() => h.remove(), 10000);
        }
        setInterval(createBackgroundHeart, 800);

        if (activePlatform === 'youtube') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        function onYouTubeIframeAPIReady() {
            if (youtubeId) {
                ytPlayer = new YT.Player('youtube-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: { 'onReady': () => { ytReady = true; console.log("YT Ready"); } }
                });
            }
        }

        function openBox() {
            document.getElementById('intro-overlay').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('intro-overlay').style.display = 'none';
                const hasAudio = '{{has_audio}}' === 'true';
                if (hasAudio) {
                    document.getElementById('audio-ui').style.display = 'flex';
                    if (activePlatform === 'youtube' && ytPlayer && ytReady) ytPlayer.playVideo();
                    else audio.play().catch(() => {});
                    updateUI(true);
                }
            }, 800);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
        }

        document.getElementById('play-btn').onclick = () => {
            if (activePlatform === 'youtube') {
                if (isPlaying) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
            } else {
                if (audio.paused) audio.play(); else audio.pause();
            }
            updateUI(!isPlaying);
        };

        if (activePlatform === 'native') {
            audio.ontimeupdate = () => {
                const progress = (audio.currentTime / audio.duration) * 100;
                document.getElementById('progress-bar').style.width = progress + '%';
                const mins = Math.floor(audio.currentTime / 60);
                const secs = Math.floor(audio.currentTime % 60);
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        // Proposal Logic
        const noBtn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const mainCard = document.getElementById('mainCard');
        const success = document.getElementById('success');

        const moveNo = () => {
            // Instant hide to prevent clicks
            noBtn.style.opacity = '0';
            noBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
                const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 100);
                noBtn.style.position = 'fixed';
                noBtn.style.left = x + 'px';
                noBtn.style.top = y + 'px';
                noBtn.style.zIndex = '9999';
                noBtn.style.opacity = '1';
                noBtn.style.pointerEvents = 'auto';
            }, 50); // Very fast teleport
        };
        noBtn.addEventListener('mouseenter', moveNo);
        noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });
        noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNo(); });

        yesBtn.addEventListener('click', () => {
            mainCard.style.opacity = '0';
            mainCard.style.transform = 'scale(0.8) translateY(-50px)';
            
            setTimeout(() => {
                mainCard.style.display = 'none';
                success.classList.add('visible');
                for(let i=0; i<100; i++) setTimeout(createConfetti, i * 15);
            }, 500);
        });

        function createConfetti() {
            const isHeart = Math.random() > 0.3;
            const c = document.createElement('div');
            c.style.position = 'fixed';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.top = '-25px';
            c.style.zIndex = '1000';
            
            let duration;
            if (isHeart) {
                c.innerHTML = ['❤️','💖','✨','💕'][Math.floor(Math.random()*4)];
                c.style.fontSize = (Math.random() * 15 + 15) + 'px';
                duration = Math.random() * 3000 + 3000;
            } else {
                c.style.width = '12px';
                c.style.height = '12px';
                c.style.background = ['#ff4d94','#ffcc00','#ff416c','#fff'][Math.floor(Math.random()*4)];
                c.style.borderRadius = '50%';
                duration = Math.random() * 2000 + 2000;
            }
            
            c.style.pointerEvents = 'none';
            document.body.appendChild(c);
            
            const spin = Math.random() * 1440 - 720;
            const drift = (Math.random() - 0.5) * 400;
            
            c.animate([
                { transform: 'translateY(0) translateX(0) rotate(0)', opacity: 1 }, 
                { transform: 'translateY(110vh) translateX(' + drift + 'px) rotate(' + spin + 'deg)', opacity: 0 }
            ], { 
                duration: duration,
                easing: 'cubic-bezier(.17,.67,.83,.67)'
            }).onfinish = () => c.remove();
        }
    </script>
</body>
</html>`;
