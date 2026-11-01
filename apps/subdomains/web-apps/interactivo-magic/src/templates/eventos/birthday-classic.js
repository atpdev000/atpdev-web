export const BIRTHDAY_TEMPLATE_CLASSIC = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Feliz Cumpleaños, {{name}}!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; background: #05020a; color: white; font-family: 'Outfit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); padding: 2.5rem; border-radius: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.1); width: 90%; max-width: 450px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); z-index: 10; }
        h1 { background: linear-gradient(135deg, #ff4d94, #ffeead); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
        p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.8); }
        .sender { margin-top: 2rem; font-weight: bold; color: #ff4d94; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }
        
        .photo-result { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 1.5rem auto; display: {{image_display}}; overflow: hidden; border: 4px solid #ff4d94; box-shadow: 0 0 20px rgba(255, 77, 148, 0.4); background: #222; }
        .photo-result img { width: 100%; height: 100%; object-fit: cover; }

        /* Premium Audio HUD */
        .audio-controls {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            width: 85%; max-width: 350px; background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 15px;
            z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: white; opacity: 0;
            transition: 0.5s; pointer-events: none;
        }
        .audio-controls.visible { opacity: 1; pointer-events: all; }
        .play-btn { width: 40px; height: 40px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; flex-shrink: 0; color: white !important; font-size: 1rem; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; }
        .song-title { position: absolute; top: -20px; left: 20px; font-size: 10px; font-weight: 800; color: #ff4d94; letter-spacing: 1px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="card">
        <div class="photo-result"><img src="{{image_src}}" alt="Foto" onerror="this.parentElement.style.display='none'"></div>
        <h1 style="color: #ff4d94; font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem;">¡Feliz Cumpleaños!</h1>
        <div style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem; color: #ffeead;">{{name}}</div>
        <div style="color: #fff; font-size: 1.2rem; margin-bottom: 1rem;">{{extra_text}}</div>
        <p>{{message}}</p>
        <div class="sender">DE PARTE DE: {{sender}}</div>
    </div>

    <!-- Audio HUD -->
    <div class="audio-controls" id="audio-ui" style="display: {{audio_display}};">
        <span class="song-title">MAGIC AUDIO</span>
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

        window.startApp = function() {
            document.getElementById('audio-ui').classList.add('visible');
            if (hasAudio) {
                try {
                    if (activePlatform === 'youtube') {
                        if (ytReady) window.ytPlayer.playVideo();
                        else playOnReady = true;
                    } else {
                        audio.play().catch(() => {});
                    }
                } catch (e) {}
            }
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ff4d94', '#ffeead'] });
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
                if (audio.paused) audio.play(); else audio.pause();
            }
        };

        audio.onplay = () => updateUI(true);
        audio.onpause = () => updateUI(false);
        audio.ontimeupdate = () => {
            document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration) * 100 + '%';
        };
    </script>
</body>
</html>`;
