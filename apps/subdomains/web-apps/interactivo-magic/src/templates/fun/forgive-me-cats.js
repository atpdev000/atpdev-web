export const FORGIVE_ME_CATS_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Me perdonas? 😳</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: #fff5f8; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow-y: auto; overflow-x: hidden; }
        
        .soft-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; background: radial-gradient(circle at 50% 50%, #fff 0%, #ffe4ec 100%); }
        .decorations { position: absolute; width:100%; height:100%; pointer-events:none; }

        .card { 
            position: relative; 
            background: rgba(255, 255, 255, 0.9); 
            backdrop-filter: blur(10px); 
            padding: 2.5rem 1.5rem; 
            border-radius: 40px; 
            text-align: center; 
            border: 4px solid #ffcada; 
            width: 90%; 
            max-width: 420px; 
            box-shadow: 0 20px 40px rgba(255, 170, 190, 0.3);
            z-index: 10;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .cat-gif { width: 100%; max-width: 250px; border-radius: 25px; margin-bottom: 1.5rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        h1 { color: #ff4d88; font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; }
        .sub-msg { font-size: 1.1rem; color: #888; margin-bottom: 2rem; }
        
        .btns { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; position: relative; }
        button { 
            padding: 12px 35px; 
            border-radius: 50px; 
            border: none; 
            font-size: 1.1rem; 
            font-weight: 800; 
            cursor: pointer; 
            transition: all 0.3s ease; 
            font-family: 'Outfit', sans-serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        #yesBtn { background: #4ecdc4; color: white; }
        #yesBtn:hover { transform: scale(1.1); background: #45b7af; }
        #noBtn { background: #ff6b6b; color: white; }
        
        .sender { margin-top: 2rem; font-size: 0.85rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
        .sender-name { color: #ff4d88; font-weight: 800; display: block; font-size: 1rem; margin-top: 4px; }

        #success { display: none; opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
        #success.visible { display: block; opacity: 1; transform: translateY(0); }

        .photo-result {
            width: 200px;
            height: 200px;
            margin: 0 auto 1.5rem;
            border-radius: 30px;
            border: 5px solid #ffcada;
            overflow: hidden;
            background: #fff;
            transform: rotate(-3deg);
            box-shadow: 0 10px 25px rgba(255, 170, 190, 0.4);
        }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }

        .success-title { font-size: 2.5rem; font-weight: 900; color: #ff4d88; margin-bottom: 1rem; }
        .extra-msg { font-size: 1.3rem; font-weight: 600; color: #555; line-height: 1.4; margin-bottom: 1.5rem; }

        /* Overlay */
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff5f8; z-index: 10000; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: opacity 0.6s ease; cursor: pointer; }
        .box-emoji { font-size: 100px; filter: drop-shadow(0 0 20px rgba(0,0,0,0.1)); animation: wiggle 2s infinite; }
        @keyframes wiggle { 0%, 100% { transform: rotate(-5deg) scale(1); } 50% { transform: rotate(5deg) scale(1.15); } }

        /* Audio UI */
        .audio-controls { position: fixed; bottom: 30px; width: 85%; max-width: 350px; background: white; padding: 12px 20px; border-radius: 50px; display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(255, 170, 190, 0.2); border: 2px solid #ffcada; }
        .play-btn { width: 40px; height: 40px; background: #ff4d88; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; }
        .progress-bar-container { flex-grow: 1; height: 6px; background: #ffe4ec; border-radius: 3px; overflow: hidden; }
        .progress-bar { height: 100%; background: #ff4d88; width: 0%; }
        .time-display { font-size: 10px; color: #888; font-weight: 800; }
    </style>
</head>
<body>
    <div class="soft-bg">
        <div class="decorations" id="decor-container"></div>
    </div>

    <div id="intro-overlay" onclick="openBox()">
        <div class="box-emoji">😿</div>
        <div style="margin-top:20px; color:#ff4d88; font-weight:900; font-size:1.5rem;">ÁBREME</div>
        <div style="color:#888; font-size:0.9rem; margin-top:8px;">Tengo algo que decirte...</div>
    </div>

    <div class="card" id="mainCard">
        <div class="photo-result" style="display: {{image_display}}; margin-bottom: 2rem; transform: rotate(2deg);">
            <img src="{{image_src}}" alt="Foto de arrepentimiento" onerror="this.parentElement.style.display='none'">
        </div>
        <h1>Para: {{name}}</h1>
        <p class="sub-msg">¿Me perdonas? Prometo no hacerlo de nuevo 💗</p>
        <div class="btns">
            <button id="yesBtn">Sí ❤️</button>
            <button id="noBtn">No 😢</button>
        </div>
        <div class="sender">Enviado por: <span class="sender-name">{{sender}}</span></div>
    </div>

    <div class="card" id="success">
        <div class="photo-result" style="display: {{image_display}}">
            <img src="{{image_src}}" alt="Nuestra foto" onerror="this.parentElement.style.display='none'">
        </div>
        <h2 class="success-title">¡GRACIAS! ✨</h2>
        <div class="extra-msg">{{extra_text}}</div>
        <div style="font-size: 50px; margin-bottom: 1.5rem;">😻</div>
        <p style="color:#888;">Te quiero mucho, {{name}}.</p>
        <a href="/" style="display:inline-block; margin-top:2rem; color:#aaa; text-decoration:none; font-size:0.8rem;">Crea tu propio mensaje ✨</a>
    </div>

    <div class="audio-controls" id="audio-ui" style="display: none;">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span>
            <span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div class="time-display" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player-container" style="position:fixed; top:0; left:0; width:1px; height:1px; opacity:0; pointer-events:none;">
        <div id="youtube-player"></div>
    </div>

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        let ytReady = false;
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

        // Soft Decorations (Paws & Hearts)
        function createDecor() {
            const container = document.getElementById('decor-container');
            const d = document.createElement('div');
            d.innerHTML = Math.random() > 0.5 ? '🐾' : '💗';
            d.style.position = 'absolute';
            d.style.left = Math.random() * 100 + '%';
            d.style.top = '105%';
            d.style.fontSize = (Math.random() * 15 + 15) + 'px';
            d.style.opacity = Math.random() * 0.4 + 0.1;
            d.style.transition = 'transform ' + (Math.random() * 8 + 8) + 's linear';
            container.appendChild(d);

            setTimeout(() => {
                d.style.transform = 'translateY(-120vh) rotate(' + (Math.random() * 360) + 'deg)';
            }, 50);

            setTimeout(() => d.remove(), 15000);
        }
        setInterval(createDecor, 1500);

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
                    events: { 'onReady': () => { ytReady = true; } }
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
            }, 600);
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

        // Interactivity
        const noBtn = document.getElementById('noBtn');
        const yesBtn = document.getElementById('yesBtn');
        const mainCard = document.getElementById('mainCard');
        const success = document.getElementById('success');

        const moveNo = () => {
            noBtn.style.opacity = '0';
            setTimeout(() => {
                const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
                const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 100);
                noBtn.style.position = 'fixed';
                noBtn.style.left = x + 'px';
                noBtn.style.top = y + 'px';
                noBtn.style.zIndex = '9999';
                noBtn.style.opacity = '1';
            }, 60);
        };
        noBtn.addEventListener('mouseenter', moveNo);
        noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });
        noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNo(); });

        yesBtn.addEventListener('click', () => {
            mainCard.style.opacity = '0';
            mainCard.style.transform = 'scale(0.8)';
            setTimeout(() => {
                mainCard.style.display = 'none';
                success.classList.add('visible');
                for(let i=0; i<60; i++) setTimeout(createHeart, i * 30);
            }, 500);
        });

        function createHeart() {
            const h = document.createElement('div');
            h.innerHTML = Math.random() > 0.5 ? '💝' : '💕';
            h.style.position = 'fixed';
            h.style.left = Math.random() * 100 + 'vw';
            h.style.top = '100vh';
            h.style.fontSize = (Math.random() * 20 + 20) + 'px';
            document.body.appendChild(h);
            
            h.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateY(-110vh) scale(1.5)', opacity: 0 }
            ], { duration: 3000 + Math.random() * 2000, easing: 'ease-out' }).onfinish = () => h.remove();
        }
    </script>
</body>
</html>`;
