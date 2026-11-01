export const DEDICATE_SONG_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}} - Te la Dedico 🎶</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Montserrat:wght@700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: #000; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; overflow: hidden; position: relative; }
        .bg-container { position: fixed; inset: 0; z-index: -1; }
        .bg-image { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6) saturate(1.2); transition: transform 1s ease; }
        .bg-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%); }
        .hearts-container { position: fixed; inset: 0; pointer-events: none; z-index: 1; }
        .heart { position: absolute; bottom: -50px; color: rgba(255, 107, 157, 0.6); font-size: 20px; animation: heartFloat linear forwards; }
        @keyframes heartFloat { 0% { transform: translateY(0) rotate(0); opacity: 0.8; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        .player-content { width: 100%; max-width: 450px; padding: 30px; z-index: 10; text-align: center; animation: slideUp 1s ease-out; }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .header-title { font-family: 'Montserrat', sans-serif; font-size: 2.8rem; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 5px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .header-subtitle { font-size: 1.1rem; color: #ffcc00; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 40px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .player-controls { margin-bottom: 40px; }
        .progress-container { width: 100%; margin-bottom: 10px; }
        .time-labels { display: flex; justify-content: space-between; color: rgba(255,255,255,0.7); font-size: 0.8rem; margin-top: 5px; }
        .progress-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; cursor: pointer; position: relative; }
        .progress-fill { height: 100%; background: #fff; border-radius: 2px; width: 0%; position: relative; }
        .progress-dot { position: absolute; right: -6px; top: -4px; width: 12px; height: 12px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
        .main-controls { display: flex; align-items: center; justify-content: center; gap: 30px; margin-top: 20px; }
        .btn-control { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
        .btn-control:active { transform: scale(0.9); }
        .btn-play { width: 65px; height: 65px; background: #fff; color: #000; border-radius: 50%; font-size: 1.5rem; }
        .lyrics-container { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 30px; padding: 30px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.15); text-align: left; position: relative; overflow: hidden; }
        .lyrics-label { font-size: 0.8rem; font-weight: 800; color: white; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; display: block; }
        .lyrics-text { font-size: 1.6rem; font-weight: 700; color: white; line-height: 1.3; animation: lyricsFade 0.5s ease; }
        @keyframes lyricsFade { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        #bg-audio { display: none; }
        #yt-player { position: absolute; visibility: hidden; pointer-events: none; }
    </style>
</head>
<body>
    <div class="bg-container">
        <img class="bg-image" src="{{image_src}}" id="main-bg" alt="Fondo" onerror="this.src='https://images.unsplash.com/photo-1514525253361-bee8d48700ef?q=80&w=2071&auto=format&fit=crop'">
        <div class="bg-overlay"></div>
    </div>
    <div class="hearts-container" id="hearts"></div>
    <div class="player-content">
        <h1 class="header-title" id="display-name">{{name}}</h1>
        <div class="header-subtitle"><span id="display-extra">{{extra_text}}</span> ❤️</div>
        <div class="player-controls">
            <div class="progress-container">
                <div class="progress-bar" id="progress-container">
                    <div class="progress-fill" id="progress-fill"><div class="progress-dot"></div></div>
                </div>
                <div class="time-labels">
                    <span id="time-current">0:00</span>
                    <span id="time-total">0:00</span>
                </div>
            </div>
            <div class="main-controls">
                <button class="btn-control"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6L18 6v12z"/></svg></button>
                <button class="btn-control btn-play" id="play-btn">
                    <span id="play-icon">▶</span>
                    <span id="pause-icon" style="display:none">||</span>
                </button>
                <button class="btn-control"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z"/></svg></button>
            </div>
        </div>
        <div class="lyrics-container">
            <span class="lyrics-label">Lyrics</span>
            <div class="lyrics-text" id="lyrics-display">MIRA LO QUE PREPARÉ PARA TI... ✨</div>
        </div>
    </div>
    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player"></div>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        (function() {
            const hasAudio = '{{has_audio}}' === 'true';
            const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
            const lyricsMsg = "{{message}}";
            let audio = document.getElementById('bg-audio');
            let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';
            let ytPlayer = null;
            let isPlaying = false;
            function createHeart() {
                const container = document.getElementById('hearts');
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = '❤️';
                heart.style.left = (Math.random() * 100) + 'vw';
                heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
                heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 7000);
            }
            setInterval(createHeart, 800);
            window.startApp = function() {
                setTimeout(() => { document.getElementById('lyrics-display').innerText = lyricsMsg || "SINTONÍA DE AMOR... ✨"; }, 1000);
                if (hasAudio) {
                    if (activePlatform === 'youtube') {
                        if (window.ytPlayerReady) window.ytPlayer.playVideo();
                    } else {
                        audio.play().catch(() => {});
                    }
                    updateUI(true);
                }
                document.getElementById('main-bg').style.transform = 'scale(1.1)';
            };
            if (activePlatform === 'youtube') {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(tag);
            }
            window.onYouTubeIframeAPIReady = function() {
                window.ytPlayer = new YT.Player('yt-player', {
                    height: '0', width: '0', videoId: youtubeId,
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
                    events: {
                        'onReady': () => { window.ytPlayerReady = true; },
                        'onStateChange': (e) => {
                            updateUI(e.data === 1);
                            if(e.data === 1) requestAnimationFrame(updateProgress);
                        }
                    }
                });
            };
            function updateUI(playing) {
                isPlaying = playing;
                document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
                document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
            }
            function formatTime(s) {
                const min = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return min + ':' + (sec < 10 ? '0' : '') + sec;
            }
            function updateProgress() {
                if (!isPlaying) return;
                let current = 0, duration = 1;
                if (activePlatform === 'youtube' && window.ytPlayer) {
                    current = window.ytPlayer.getCurrentTime();
                    duration = window.ytPlayer.getDuration();
                } else {
                    current = audio.currentTime;
                    duration = audio.duration || 1;
                }
                const pct = (current / duration) * 100;
                document.getElementById('progress-fill').style.width = pct + '%';
                document.getElementById('time-current').innerText = formatTime(current);
                document.getElementById('time-total').innerText = formatTime(duration);
                requestAnimationFrame(updateProgress);
            }
            document.getElementById('play-btn').onclick = () => {
                if (activePlatform === 'youtube' && window.ytPlayer) {
                    if (isPlaying) window.ytPlayer.pauseVideo();
                    else window.ytPlayer.playVideo();
                } else {
                    if (audio.paused) audio.play(); else audio.pause();
                    updateUI(!audio.paused);
                    if(!audio.paused) updateProgress();
                }
            };
            audio.onplay = () => updateUI(true);
            audio.onpause = () => updateUI(false);
        })();
    </script>
</body>
</html>`;
