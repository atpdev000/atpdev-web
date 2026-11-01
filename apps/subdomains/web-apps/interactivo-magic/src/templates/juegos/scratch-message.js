export const SCRATCH_MESSAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raspa y Gana - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #0a0514; color: white; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
        .scratch-container { position: relative; width: 320px; height: 400px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        canvas { position: absolute; top: 0; left: 0; cursor: crosshair; z-index: 10; }
        .message-bg { width: 100%; height: 100%; background: #ff4d94; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; box-sizing: border-box; }

        .photo-result {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            margin-bottom: 1.5rem;
            display: {{image_display}};
            overflow: hidden;
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.2); 
            min-height: 50px;
        }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }

        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 2000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; }
        #intro-overlay.hidden { opacity: 0; pointer-events: none; }

        /* Unified Audio Styles */
        .audio-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-weight: bold; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255, 255, 255, 0.5); min-width: 35px; font-family: monospace; }
        .song-title { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #ff4d94; white-space: nowrap; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div onclick="openBox()" style="text-align: center; cursor: pointer;">
            <div style="font-size: 80px;">🎟️</div>
            <div style="color: white; font-size: 24px; font-weight: bold; margin-top: 20px;">¡Raspa tu Regalo!</div>
            <div style="color: rgba(255,255,255,0.6); margin-top: 10px;">TOCA PARA EMPEZAR</div>
        </div>
    </div>

    <h2 style="margin-bottom: 2rem; color: #ff4d94; text-shadow: 0 0 10px rgba(255,77,148,0.3);">¡Regalo a la vista! 🎰</h2>

    <div class="scratch-container">
        <div class="message-bg">
            <div class="photo-result">
                <img src="{{image_src}}" alt="Nuestra Foto" onerror="this.parentElement.style.display='none'">
            </div>
            <div style="font-weight: 900; font-size: 1.4rem;">{{message}}</div>
            <div style="margin-top: 1rem; opacity: 0.8; font-size: 0.9rem;">- {{sender}}</div>
        </div>
        <canvas id="scratchCanvas"></canvas>
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
        let ytPlayer = null;
        let activePlatform = youtubeId ? 'youtube' : 'native';
        let isPlaying = false;

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
                    events: { 'onReady': () => console.log("YT Ready") }
                });
            }
        }

        function openBox() {
            document.getElementById('intro-overlay').classList.add('hidden');
            const hasAudio = '{{has_audio}}' === 'true';
            setTimeout(() => {
                if (hasAudio) {
                    document.getElementById('audio-ui').style.display = 'flex';
                }
                if (activePlatform === 'youtube' && ytPlayer) ytPlayer.playVideo();
                else audio.play().catch(() => { });
                updateUI(true);
            }, 500);
        }

        function updateUI(playing) {
            isPlaying = playing;
            document.getElementById('play-icon').style.display = playing ? 'none' : 'block';
            document.getElementById('pause-icon').style.display = playing ? 'block' : 'none';
        }

        document.getElementById('play-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                if (activePlatform === 'youtube') ytPlayer.pauseVideo();
                else audio.pause();
            } else {
                if (activePlatform === 'youtube') ytPlayer.playVideo();
                else audio.play();
            }
            updateUI(!isPlaying);
        });

        if (activePlatform === 'native') {
            audio.ontimeupdate = () => {
                const progress = (audio.currentTime / audio.duration) * 100;
                document.getElementById('progress-bar').style.width = progress + '%';
                const mins = Math.floor(audio.currentTime / 60);
                const secs = Math.floor(audio.currentTime % 60);
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        const canvas = document.getElementById('scratchCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 320;
        canvas.height = 400;

        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#888';
        ctx.font = '900 30px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('RASPA AQUÍ', 160, 180);

        let isDrawing = false;
        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 35, 0, Math.PI * 2);
            ctx.fill();
        }

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); });
    </script>
</body>
</html>`;
