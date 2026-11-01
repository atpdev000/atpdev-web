export const LOVE_CUBE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cubo del Amor 💖</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
        
        :root {
            --primary: #ff4d94;
            --secondary: #ff00ff;
            --dark: #0a0514;
            --glass: rgba(255, 255, 255, 0.05);
            --neon-border: 0 0 15px rgba(255, 77, 148, 0.5);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            background: var(--dark); 
            color: white; 
            font-family: 'Outfit', sans-serif; 
            height: 100vh; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            overflow: hidden;
            perspective: 1500px;
        }

        /* Particles */
        .particles { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .particle {
            position: absolute;
            font-size: 1.5rem;
            animation: floatParticle 6s linear infinite;
            opacity: 0;
        }
        @keyframes floatParticle {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        /* 3D Scene */
        .scene {
            width: 250px;
            height: 250px;
            margin-top: -50px;
            z-index: 10;
        }

        .cube {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: rotateCube 20s infinite linear;
        }

        @keyframes rotateCube {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        .cube-face {
            position: absolute;
            width: 250px;
            height: 250px;
            border: 2px solid var(--primary);
            box-shadow: inset 0 0 40px rgba(255, 77, 148, 0.2), var(--neon-border);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #1a1a1a;
        }

        .cube-face img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .face-front  { transform: rotateY(  0deg) translateZ(125px); }
        .face-back   { transform: rotateY(180deg) translateZ(125px); }
        .face-right  { transform: rotateY( 90deg) translateZ(125px); }
        .face-left   { transform: rotateY(-90deg) translateZ(125px); }
        .face-top    { transform: rotateX( 90deg) translateZ(125px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(125px); }

        /* Header Text */
        .header {
            position: absolute;
            top: 40px;
            text-align: center;
            z-index: 100;
            width: 100%;
        }
        .header h1 {
            font-family: 'Dancing Script', cursive;
            font-size: 3rem;
            color: var(--primary);
            text-shadow: 0 0 20px rgba(255, 77, 148, 0.8);
            margin-bottom: 5px;
        }
        .sub-header {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 700;
            background: rgba(255, 255, 255, 0.05);
            padding: 5px 20px;
            border-radius: 20px;
            display: inline-block;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 77, 148, 0.2);
        }
        .highlight { color: var(--primary); }

        /* Message Card */
        .message-container {
            position: absolute;
            top: 160px;
            max-width: 80%;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            padding: 15px 25px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            z-index: 50;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: fadeIn 1s ease-out;
        }
        .message-container p {
            font-size: 1.1rem;
            line-height: 1.4;
            color: #fff;
            font-style: italic;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Music Player HUD */
        .music-hud {
            position: fixed;
            bottom: 30px;
            width: 90%;
            max-width: 400px;
            background: rgba(10, 5, 20, 0.8);
            backdrop-filter: blur(20px);
            padding: 20px;
            border-radius: 30px;
            border: 1px solid rgba(255, 77, 148, 0.3);
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 1000;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            transition: 0.5s transform;
        }

        .album-art {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid var(--primary);
            box-shadow: var(--neon-border);
            overflow: hidden;
            animation: spin 6s linear infinite;
            animation-play-state: paused;
            flex-shrink: 0;
        }
        .album-art.playing { animation-play-state: running; }
        .album-art img { width: 100%; height: 100%; object-fit: cover; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .player-info { flex-grow: 1; }
        .progress-container {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 10px 0;
            cursor: pointer;
            position: relative;
        }
        .progress-bar {
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 10px;
            box-shadow: 0 0 10px var(--primary);
        }
        .time-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: rgba(255,255,255,0.6);
            font-weight: 700;
        }

        .controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .play-btn {
            width: 50px;
            height: 50px;
            background: var(--primary);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: var(--neon-border);
            transition: 0.3s;
        }
        .play-btn:active { transform: scale(0.9); }

        /* Mobile Adjustments */
        @media (max-width: 480px) {
            .scene { width: 200px; height: 200px; }
            .cube-face { width: 200px; height: 200px; }
            .face-front  { transform: rotateY(  0deg) translateZ(100px); }
            .face-back   { transform: rotateY(180deg) translateZ(100px); }
            .face-right  { transform: rotateY( 90deg) translateZ(100px); }
            .face-left   { transform: rotateY(-90deg) translateZ(100px); }
            .face-top    { transform: rotateX( 90deg) translateZ(100px); }
            .face-bottom { transform: rotateX(-90deg) translateZ(100px); }
            .header h1 { font-size: 2.2rem; }
        }
    </style>
</head>
<body>
    <div class="particles" id="particles"></div>

    <div class="header">
        <h1>{{extra_text}}</h1>
        <div class="sub-header" id="names-header">
            De: <span class="highlight">{{sender}}</span> para <span class="highlight">{{name}}</span>
        </div>
    </div>

    <div class="message-container" id="message-container">
        <p>{{message}}</p>
    </div>

    <div class="scene">
        <div class="cube">
            <div class="cube-face face-front"><img src="{{item_0_url}}" alt="1"></div>
            <div class="cube-face face-back"><img src="{{item_1_url}}" alt="2"></div>
            <div class="cube-face face-right"><img src="{{item_2_url}}" alt="3"></div>
            <div class="cube-face face-left"><img src="{{item_3_url}}" alt="4"></div>
            <div class="cube-face face-top"><img src="{{item_4_url}}" alt="5"></div>
            <div class="cube-face face-bottom"><img src="{{item_5_url}}" alt="6"></div>
        </div>
    </div>

    <div class="music-hud">
        <div class="album-art" id="album-art">
            <img src="{{item_0_url}}">
        </div>
        <div class="player-info">
            <div class="progress-container" id="progress-container">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <div class="time-info">
                <span id="current-time">0:00</span>
                <span id="duration">3:00</span>
            </div>
        </div>
        <div class="controls">
            <button class="play-btn" id="play-btn">▶</button>
        </div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        const hasAudio = '{{has_audio}}' === 'true';
        const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
        let audio = document.getElementById('bg-audio');
        let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';
        let ytReady = false;
        let playOnReady = false;

        // -- Particles --
        function createParticles() {
            const container = document.getElementById('particles');
            const emojis = ['🌸', '💖', '✨', '💕', '❤️'];
            for(let i=0; i<30; i++) {
                setTimeout(() => {
                    const p = document.createElement('div');
                    p.className = 'particle';
                    p.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                    p.style.left = Math.random() * 100 + 'vw';
                    p.style.animationDuration = (Math.random() * 3 + 4) + 's';
                    p.style.fontSize = (Math.random() * 1 + 1) + 'rem';
                    container.appendChild(p);
                    p.addEventListener('animationiteration', () => {
                        p.style.left = Math.random() * 100 + 'vw';
                    });
                }, i * 200);
            }
        }
        createParticles();

        // -- Data Logic --
        const nameData = "{{name}}";
        const senderData = "{{sender}}";
        const msgData = "{{message}}";

        if (!nameData || nameData.includes('{{')) document.getElementById('names-header').style.display = 'none';
        if (!msgData || msgData.includes('{{')) document.getElementById('message-container').style.display = 'none';

        // -- Audio Logic --
        window.startApp = function() {
            if (hasAudio) {
                try {
                    if (activePlatform === 'youtube') {
                        if (window.ytPlayer && typeof window.ytPlayer.playVideo === 'function') window.ytPlayer.playVideo();
                        else playOnReady = true;
                    } else {
                        audio.play().catch(e => console.log("Audio blocked", e));
                    }
                } catch (e) {}
            }
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

        function formatTime(s) {
            const mins = Math.floor(s / 60);
            const secs = Math.floor(s % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        function updateUI(playing) {
            const btn = document.getElementById('play-btn');
            const art = document.getElementById('album-art');
            btn.innerHTML = playing ? '||' : '▶';
            if (playing) art.classList.add('playing');
            else art.classList.remove('playing');
        }

        document.getElementById('play-btn').onclick = () => {
            if (activePlatform === 'youtube' && window.ytPlayer) {
                if (window.ytPlayer.getPlayerState() === 1) window.ytPlayer.pauseVideo();
                else window.ytPlayer.playVideo();
            } else {
                if (audio.paused) audio.play();
                else audio.pause();
            }
        };

        audio.onplay = () => updateUI(true);
        audio.onpause = () => updateUI(false);
        audio.onloadedmetadata = () => {
            document.getElementById('duration').textContent = formatTime(audio.duration);
        };
        audio.ontimeupdate = () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            document.getElementById('progress-bar').style.width = progress + '%';
            document.getElementById('current-time').textContent = formatTime(audio.currentTime);
        };

        // Progress bar click
        document.getElementById('progress-container').onclick = (e) => {
            const rect = e.target.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (activePlatform === 'native') audio.currentTime = pos * audio.duration;
            else if (activePlatform === 'youtube' && window.ytPlayer) {
                window.ytPlayer.seekTo(pos * window.ytPlayer.getDuration());
            }
        };

        // Sync YouTube duration (poll)
        setInterval(() => {
            if (activePlatform === 'youtube' && window.ytPlayer && window.ytPlayer.getDuration) {
                const cur = window.ytPlayer.getCurrentTime();
                const dur = window.ytPlayer.getDuration();
                if (dur > 0) {
                    document.getElementById('progress-bar').style.width = (cur / dur) * 100 + '%';
                    document.getElementById('current-time').textContent = formatTime(cur);
                    document.getElementById('duration').textContent = formatTime(dur);
                }
            }
        }, 500);

    </script>
</body>
</html>`;
