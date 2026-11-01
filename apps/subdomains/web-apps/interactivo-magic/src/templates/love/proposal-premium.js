export const PROPOSAL_PREMIUM_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Quieres ser mi novi@? 💞</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: #0a0514; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .stage { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #0a0514 100%); z-index: 1; }
        .nebula { position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, rgba(255, 77, 148, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(112, 0, 255, 0.15) 0%, transparent 50%); filter: blur(40px); z-index: 2; }
        .hearts-container { position: fixed; inset: 0; pointer-events: none; z-index: 3; }
        .heart { position: absolute; bottom: -50px; color: rgba(255, 107, 157, 0.4); animation: float linear forwards; }
        @keyframes float { 0% { transform: translateY(0) rotate(0) scale(1); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-110vh) rotate(360deg) scale(0.5); opacity: 0; } }
        .card { position: relative; z-index: 10; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 3rem 2rem; border-radius: 40px; text-align: center; width: 90%; max-width: 450px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        h1 { color: #fff; font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; text-shadow: 0 0 20px rgba(255, 77, 148, 0.5); }
        .proposal-msg { color: rgba(255, 255, 255, 0.8); font-size: 1.2rem; line-height: 1.6; margin-bottom: 2.5rem; }
        .btns-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; position: relative; }
        .btn { padding: 16px; border-radius: 50px; border: none; font-size: 1.2rem; font-weight: 800; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
        #yesBtn { background: linear-gradient(45deg, #ff416c, #ff4b2b); color: white; box-shadow: 0 10px 20px rgba(255, 65, 108, 0.3); }
        #yesBtn:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(255, 65, 108, 0.5); }
        #noBtn { background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); }
        #success { display: none; opacity: 0; transform: scale(0.9); transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        #success.visible { display: block; opacity: 1; transform: scale(1); }
        .photo-frame { width: 220px; height: 220px; margin: 0 auto 2rem; border-radius: 30px; padding: 10px; background: linear-gradient(45deg, #ff416c, #ffcc00); box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4); transform: rotate(-3deg); }
        .photo-inner { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: #000; }
        .photo-inner img { width: 100%; height: 100%; object-fit: cover; }
        .success-title { font-size: 3rem; font-weight: 900; background: linear-gradient(to bottom, #fff, #ff416c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
        .extra-msg { color: #ffcc00; font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; font-style: italic; }
        #intro { position: fixed; inset: 0; background: #0a0514; z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.8s ease; }
        .pulsing-heart { font-size: 80px; animation: pulse 1.5s infinite; cursor: pointer; filter: drop-shadow(0 0 30px rgba(255, 65, 108, 0.5)); }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .play-hint { color: #fff; margin-top: 20px; font-weight: 800; letter-spacing: 2px; opacity: 0.7; }
        .audio-player { position: fixed; bottom: 30px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); padding: 10px 20px; border-radius: 50px; display: flex; align-items: center; gap: 15px; z-index: 100; border: 1px solid rgba(255,255,255,0.1); }
        .play-pause { width: 40px; height: 40px; background: #ff416c; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; }
    </style>
</head>
<body>
    <div class="stage"></div>
    <div class="nebula"></div>
    <div class="hearts-container" id="hearts"></div>
    <div id="intro" onclick="startSurprise()"><div class="pulsing-heart">❤️</div><div class="play-hint">TOCA PARA ABRIR</div></div>
    <div class="card" id="mainCard">
        <h1>Para: {{name}}</h1>
        <div class="proposal-msg">{{message}}</div>
        <div class="btns-container">
            <button class="btn" id="yesBtn">SÍ ❤️</button>
            <button class="btn" id="noBtn">NO 😢</button>
        </div>
        <div style="margin-top: 2.5rem; opacity: 0.4; font-size: 0.8rem; letter-spacing: 2px;">ENVIADO POR: <br><span style="color: #ffcc00; font-weight: 900; font-size: 1.1rem;">{{sender}}</span></div>
    </div>
    <div class="card" id="success">
        <div class="photo-frame" style="display: {{image_display}}"><div class="photo-inner"><img src="{{image_src}}" alt="Amor"></div></div>
        <h2 class="success-title">¡Dijo que SÍ! 💍</h2>
        <div class="extra-msg">{{extra_text}}</div>
        <p style="color: rgba(255,255,255,0.6);">Te quiero más que a nada, {{name}} ❤️</p>
    </div>
    <div class="audio-player" id="audio-ui" style="display: none;"><div class="play-pause" id="audio-toggle">▶</div><div style="color: white; font-size: 0.8rem; font-weight: 600;">Audio Mágico</div></div>
    <audio id="native-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; top:-100px; opacity:0;"></div>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        (function() {
            const hasAudio = '{{has_audio}}' === 'true';
            const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
            const audio = document.getElementById('native-audio');
            const audioToggle = document.getElementById('audio-toggle');
            let ytPlayer = null;
            let isPlaying = false;
            let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';
            const escapeMsgs = ["¡Ni lo pienses! 🏃‍♀️","¡Error 404! ❌","¡Ese botón no! 🙈","¿Estás segur@? 🤔","¡Ups, se movió! 💨","¡Inténtalo de nuevo! 😂","¡Misión imposible! 🕵️‍♀️"];
            function createHeart() {
                const container = document.getElementById('hearts');
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = ['❤️','💖','💕','💗'][Math.floor(Math.random()*4)];
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
                heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 7000);
            }
            setInterval(createHeart, 600);
            window.startSurprise = function() {
                document.getElementById('intro').style.opacity = '0';
                setTimeout(() => { document.getElementById('intro').style.display = 'none'; if (hasAudio) { document.getElementById('audio-ui').style.display = 'flex'; toggleAudio(); } }, 800);
            };
            function toggleAudio() {
                if (activePlatform === 'youtube') { if (isPlaying) ytPlayer.pauseVideo(); else ytPlayer.playVideo(); } else { if (audio.paused) audio.play(); else audio.pause(); }
                updateAudioUI(!isPlaying);
            }
            function updateAudioUI(playing) { isPlaying = playing; audioToggle.innerHTML = playing ? '||' : '▶'; }
            if (activePlatform === 'youtube') {
                const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(tag);
                window.onYouTubeIframeAPIReady = function() {
                    ytPlayer = new YT.Player('yt-player', { height: '0', width: '0', videoId: youtubeId, playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId }, events: { 'onReady': () => {}, 'onStateChange': (e) => { updateAudioUI(e.data === 1); } } });
                };
            }
            audioToggle.onclick = toggleAudio;
            const noBtn = document.getElementById('noBtn');
            const moveNo = () => {
                const x = Math.random() * (window.innerWidth - 150);
                const y = Math.random() * (window.innerHeight - 50);
                noBtn.style.position = 'fixed'; noBtn.style.left = x + 'px'; noBtn.style.top = y + 'px'; noBtn.style.zIndex = '1000'; noBtn.innerHTML = escapeMsgs[Math.floor(Math.random() * escapeMsgs.length)];
            };
            noBtn.onmouseover = moveNo; noBtn.ontouchstart = (e) => { e.preventDefault(); moveNo(); };
            document.getElementById('yesBtn').onclick = function() {
                document.getElementById('mainCard').style.display = 'none'; document.getElementById('success').classList.add('visible');
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff416c', '#ff4b2b', '#ffcc00'] });
            };
        })();
    </script>
</body>
</html>`;
