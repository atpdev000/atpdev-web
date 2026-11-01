export const MUSICAL_SPHERE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}} - Esfera Musical 🎵</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; background: #05020a; min-height: 100vh; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; perspective: 1500px; }
    .nebula { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 87, 108, 0.15) 0%, transparent 50%); z-index: 0; }
    .stars-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 100px 150px, #fff, rgba(0,0,0,0)); background-size: 200px 200px; opacity: 0.3; z-index: 1; animation: starsMove 100s linear infinite; }
    @keyframes starsMove { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }

    #welcome-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 2, 10, 0.95); backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10000; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
    .start-btn { background: linear-gradient(135deg, #00f2ff, #0066ff); color: white; border: none; padding: 1.2rem 3rem; border-radius: 50px; font-size: 1.2rem; font-weight: 800; box-shadow: 0 0 30px rgba(0, 242, 255, 0.4); text-transform: uppercase; letter-spacing: 2px; margin-top: 2rem; }
    
    .main-container { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 600px; padding: 20px 0; }
    
    .scene { width: 320px; height: 320px; position: relative; margin-bottom: 20px; transform-style: preserve-3d; flex-shrink: 0; }
    .sphere-wrapper { width: 100%; height: 100%; transform-style: preserve-3d; animation: sphereFloat 6s ease-in-out infinite; }
    @keyframes sphereFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
    .sphere { width: 100%; height: 100%; border-radius: 50%; position: relative; overflow: hidden; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.8) 100%); box-shadow: 0 0 80px rgba(0, 242, 255, 0.3), inset 0 0 50px rgba(0, 242, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; }
    #intro-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
        transition: opacity 0.8s ease;
    }

    .box-container {
        text-align: center;
        animation: boxBounce 2s infinite ease-in-out;
    }

    @keyframes boxBounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.05); }
    }

    .box-emoji {
        font-size: 7rem;
        filter: drop-shadow(0 0 30px rgba(0, 242, 255, 0.5));
        margin-bottom: 20px;
    }

    .box-text {
        color: white;
        font-size: 1.8rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 10px;
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }

    .tap-to-open {
        color: #00f2ff;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        opacity: 0.8;
    }

    .glow-bg { position: fixed; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 0; }
    .glow-circle { position: absolute; border-radius: 50%; background: rgba(80, 0, 150, 0.15); filter: blur(40px); }
    .glow-1 { width: 600px; height: 600px; }
    .glow-2 { width: 400px; height: 400px; background: rgba(80, 0, 150, 0.25); }

    .main-sphere { position: relative; width: 320px; height: 320px; border-radius: 50%; background: #000; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 0 50px rgba(0,0,0,1); }
    .photo-core { width: 85%; height: 85%; object-fit: cover; border-radius: 50%; box-shadow: 0 0 20px rgba(255,255,255,0.1); }
    
    .particles-container { position: fixed; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
    .particle { position: absolute; background: #fff; border-radius: 50%; opacity: 0.5; }

    .player-container { position: relative; width: 90%; max-width: 400px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px; z-index: 1000; margin-top: 20px; }
    .control-btn { font-size: 24px; color: white; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; min-width: 30px; }
    .control-btn:hover { opacity: 1; }
    .progress-wrap { flex-grow: 1; position: relative; }
    .progress-bar-bg { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative; }
    .progress-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, #ff4b2b, #ff416c); border-radius: 3px; width: 0%; }
    .time-info { color: white; font-size: 14px; font-family: monospace; opacity: 0.8; min-width: 80px; text-align: right; }

    .result-card { 
        width: 90%; 
        max-width: 450px; 
        background: rgba(10, 5, 20, 0.8); 
        backdrop-filter: blur(20px); 
        border: 1px solid rgba(255, 255, 255, 0.1); 
        border-radius: 30px; 
        padding: 30px; 
        margin-top: 30px; 
        text-align: center; 
        z-index: 100;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .message-title { color: white; font-size: 2rem; font-weight: 800; margin-bottom: 20px; letter-spacing: 1px; }
    .sent-by { color: rgba(255, 255, 255, 0.6); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
    .sender-name { color: #ffcc00; font-size: 1.4rem; font-weight: 800; text-transform: capitalize; margin-bottom: 25px; text-shadow: 0 0 10px rgba(255, 204, 0, 0.3); }
    .create-link { 
        display: inline-block; 
        background: rgba(255, 255, 255, 0.05); 
        border: 1px solid rgba(255, 255, 255, 0.2); 
        color: white; 
        padding: 12px 30px; 
        border-radius: 50px; 
        text-decoration: none; 
        font-weight: 600; 
        font-size: 0.95rem;
        transition: all 0.3s ease;
    }
    .create-link:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="neon-border"></div>
  <div class="glow-bg"><div class="glow-circle glow-1"></div><div class="glow-circle glow-2"></div></div>
  <div class="particles-container" id="particles"></div>

  <div id="intro-overlay" onclick="openBox()">
    <div class="box-container">
      <div class="box-emoji">🎵</div>
      <div class="box-text">Sintonía Especial</div>
      <div class="tap-to-open">Haz clic para abrir la sorpresa</div>
    </div>
  </div>

  <div class="main-container">
    <div class="scene">
      <div class="sphere-wrapper">
        <div class="sphere" id="sphere">
          <img id="sphere-photo" class="photo-core" style="display: none;">
          <div id="sphere-text" style="display: none; color: white; font-weight: 800; font-size: 1.8rem; text-align: center; padding: 25px; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 15px rgba(0, 242, 255, 0.8);">{{extra_text}}</div>
        </div>
      </div>
    </div>

    <div id="result-content" style="display: none; flex-direction: column; align-items: center; width: 100%; position: relative;">
      <div class="player-container" id="player-ui">
        <div class="control-btn" id="play-btn">⏸</div>
        <div class="progress-wrap">
          <div class="progress-bar-bg"><div class="progress-fill" id="progress-fill"></div></div>
        </div>
        <div class="time-info" id="time-display">0:00 / 0:00</div>
      </div>

      <div class="result-card">
          <div class="message-title">{{message}}</div>
          <div class="sent-by">Enviado con ❤️ por:</div>
          <div class="sender-name">{{sender}}</div>
          <a href="/" class="create-link">Crea tu propio mensaje ✨</a>
      </div>
    </div>
  </div>

  <audio id="bg-audio" src="{{audio_src}}" loop></audio>
  <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

  <script>
    const hasAudio = '{{has_audio}}' === 'true';
    const youtubeId = "{{ youtube_id }}".replace(/[{}]/g, '').trim();
    let audio = document.getElementById('bg-audio');
    let ytPlayer = null;
    let ytReady = false;
    let isPlaying = false;
    let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

    // Particle System
    function createParticles() {
        const container = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            container.appendChild(p);
            animateParticle(p);
        }
    }
    function animateParticle(p) {
        const duration = Math.random() * 10000 + 5000;
        p.animate([
            { transform: 'translateY(0)', opacity: 0.5 },
            { transform: 'translateY(-100vh)', opacity: 0 }
        ], { duration, iterations: Infinity });
    }
    createParticles();

    if (activePlatform === 'youtube') {
        const tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('yt-player', {
            height: '0', width: '0', videoId: youtubeId,
            playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': youtubeId },
            events: {
                'onReady': () => { ytReady = true; },
                'onStateChange': (e) => {
                    if (e.data === 1) startProgressLoop();
                    updateUI(e.data === 1);
                }
            }
        });
    };

    function startProgressLoop() {
        setInterval(() => {
            if (!isPlaying) return;
            let current, duration;
            if (activePlatform === 'youtube') {
                current = ytPlayer.getCurrentTime();
                duration = ytPlayer.getDuration();
            } else {
                current = audio.currentTime;
                duration = audio.duration;
            }
            if (duration) {
                const pct = (current / duration) * 100;
                document.getElementById('progress-fill').style.width = pct + '%';
                document.getElementById('time-display').innerText = formatTime(current) + ' / ' + formatTime(duration);
            }
        }, 500);
    }

    function formatTime(s) {
        const min = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return min + ":" + (sec < 10 ? '0' : '') + sec;
    }

    function updateUI(playing) {
        isPlaying = playing;
        document.getElementById('play-btn').innerText = playing ? "⏸" : "▶";
    }

    window.openBox = function() {
        const overlay = document.getElementById('intro-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 800);

        if (hasAudio) {
            document.getElementById('result-content').style.display = 'flex';
            if (activePlatform === 'youtube') {
                if (ytReady && ytPlayer) {
                    ytPlayer.playVideo();
                } else {
                    // Fallback if not ready yet
                    let checkReady = setInterval(() => {
                        if (ytReady && ytPlayer) {
                            ytPlayer.playVideo();
                            clearInterval(checkReady);
                        }
                    }, 500);
                    setTimeout(() => clearInterval(checkReady), 5000);
                }
            } else {
                audio.play().catch(e => console.log("Audio play failed:", e));
                startProgressLoop();
            }
        }
    };

    function showFallback() {
        const photo = document.getElementById('sphere-photo');
        const textDiv = document.getElementById('sphere-text');
        if (photo) photo.style.display = 'none';
        if (textDiv) {
            textDiv.style.display = 'block';
            // Only use hardcoded text if the user didn't provide any extra_text (already replaced by engine)
            const currentContent = textDiv.innerText.trim();
            if (!currentContent || currentContent === "" || currentContent.includes("Ej:") || currentContent.includes("{" + "{extra_text}}")) {
                textDiv.innerText = "¡SINTONÍA DE AMOR! ✨";
            }
        }
    }

    // Initial check
    let rawSrc = "{{image_src}}".trim();
    const photoEl = document.getElementById('sphere-photo');
    const textDiv = document.getElementById('sphere-text');
    
    // Auto-fix Google Drive links
    if (rawSrc.includes("drive.google.com/file/d/")) {
        const fileId = rawSrc.split("/d/")[1]?.split("/")[0];
        if (fileId) rawSrc = "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
    }

    if (rawSrc && (rawSrc.startsWith("http") || rawSrc.startsWith("data:"))) {
        photoEl.onload = () => {
            photoEl.style.display = 'block';
            if (textDiv) textDiv.style.display = 'none';
        };
        photoEl.onerror = () => {
            console.error("Sphere image failed to load");
            showFallback();
        };
        photoEl.src = rawSrc;
        // In case it's fast or cached
        if (photoEl.complete) {
            photoEl.style.display = 'block';
            if (textDiv) textDiv.style.display = 'none';
        }
    } else {
        showFallback();
    }

    document.getElementById('play-btn').onclick = () => {
        if (activePlatform === 'youtube') {
            if (isPlaying) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
        } else {
            if (audio.paused) audio.play(); else audio.pause();
            updateUI(!audio.paused);
        }
    };
  </script>
</body>
</html>`;
