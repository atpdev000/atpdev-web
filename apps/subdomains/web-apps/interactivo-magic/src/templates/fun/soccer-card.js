export const SOCCER_CARD_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tarjeta FIFA - {{sc_name}}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"/>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Outfit', sans-serif;
            background: #000;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            color: #1a1a1a;
        }

        .bg-gradient {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #111 0%, #000 100%);
            z-index: 0;
        }

        /* The FIFA Card (Rounded Rectangle as per reference) */
        .fut-card {
            position: relative;
            width: 340px;
            height: 480px;
            background: linear-gradient(135deg, #f0d78c 0%, #d9b65d 40%, #b8923a 100%);
            border-radius: 40px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 40px 80px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,255,255,0.3);
            z-index: 10;
            animation: cardEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes cardEntrance {
            from { transform: scale(0.8) translateY(50px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* Rating & Position (Top Left) */
        .header-left {
            position: absolute;
            top: 35px;
            left: 35px;
            text-align: left;
            z-index: 5;
        }
        .rating { font-size: 3rem; font-weight: 900; line-height: 1; }
        .position { font-size: 1.5rem; font-weight: 700; opacity: 0.8; text-transform: uppercase; }

        /* Player Image (Circle Frame) */
        .player-frame {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: #fff;
            margin-top: 10px;
            border: 6px solid #e5c36a;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            z-index: 2;
        }
        .player-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Player Info */
        .info-section {
            width: 100%;
            text-align: center;
            margin-top: 20px;
        }
        .player-name {
            font-size: 2.2rem;
            font-weight: 900;
            margin-bottom: 2px;
            color: #1a1a1a;
        }
        .club-subtitle {
            font-size: 0.95rem;
            font-weight: 600;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .flag-container {
            width: 35px;
            height: 25px;
            display: flex;
            align-items: center;
            overflow: hidden;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .fi {
            transform: scale(1.5);
        }

        /* Stats Section (Horizontal Layout) */
        .stats-row {
            width: 100%;
            margin-top: 25px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 2px;
            text-align: center;
        }
        .stat-item {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
        }
        .stat-label { font-size: 0.75rem; font-weight: 900; opacity: 0.6; text-transform: uppercase; margin-bottom: 2px; }
        .stat-val { font-size: 1.35rem; font-weight: 900; color: #1a1a1a; }

        /* Audio Controls */
        .audio-controls {
            position: fixed;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            padding: 15px 25px;
            border-radius: 40px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            color: #1a1a1a;
            border: 1px solid #e5c36a;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .play-btn {
            width: 45px;
            height: 45px;
            background: #1a1a1a;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: #f0c903 !important;
            font-size: 1.2rem;
        }
        .progress-bar-container {
            flex-grow: 1;
            height: 8px;
            background: rgba(240, 201, 3, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar {
            width: 0%;
            height: 100%;
            background: #f0c903;
        }

        @media print {
            .btn-save, .audio-controls { display: none !important; }
            body { background: white; padding: 0; }
        }
    </style>
</head>
<body>
    <div class="bg-gradient"></div>

    <div class="fut-card" id="card">
        <div class="header-left">
            <div class="rating">{{sc_rating}}</div>
            <div class="position">{{sc_pos}}</div>
        </div>

        <div class="player-frame">
            <img src="{{sc_img}}" class="player-img" alt="Jugador" onerror="this.src='https://via.placeholder.com/300?text=+'">
        </div>

        <div class="info-section">
            <h1 class="player-name">{{sc_name}}</h1>
            <div class="club-subtitle">
                <div class="flag-container">
                    <span class="fi fi-{{sc_flag}}"></span>
                </div>
                <span>{{sc_info}}</span>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-item">
                <span class="stat-label">PAC</span>
                <span class="stat-val">{{sc_pac}}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">SHO</span>
                <span class="stat-val">{{sc_sho}}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">PAS</span>
                <span class="stat-val">{{sc_pas}}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">DRI</span>
                <span class="stat-val">{{sc_dri}}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">DEF</span>
                <span class="stat-val">{{sc_def}}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">PHY</span>
                <span class="stat-val">{{sc_phy}}</span>
            </div>
        </div>
    </div>

    <div class="controls">
        <button class="btn-save" onclick="window.print()">Guardar Tarjeta 📁</button>
    </div>

    <!-- Audio Player HUD -->
    <div class="audio-controls" style="display: {{audio_display}};" id="audio-ui">
        <div class="play-btn" id="play-btn">
            <span id="play-icon">▶</span><span id="pause-icon" style="display:none">||</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop preload="auto"></audio>
    <div id="yt-player" style="position:fixed; opacity:0; pointer-events:none;"></div>

    <script>
        // Audio logic
        const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
        const hasAudio = '{{has_audio}}' === 'true';
        let audio = document.getElementById('bg-audio');
        let activePlatform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';
        let ytReady = false;
        let playOnReady = false;

        // Start function called by the magic gift reveal
        window.startApp = function() {
            if (!hasAudio) return;
            try {
                if (activePlatform === 'youtube') {
                    if (ytReady) window.ytPlayer.playVideo();
                    else playOnReady = true;
                } else {
                    audio.play().catch(e => console.log("Audio play blocked", e));
                }
            } catch (e) {
                console.error("Error starting audio:", e);
            }
        };

        // YouTube API Loading
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
                        'onReady': () => { 
                            ytReady = true; 
                            if(playOnReady) window.ytPlayer.playVideo(); 
                        },
                        'onStateChange': (e) => updateUI(e.data === 1)
                    }
                });
            }
        };

        function updateUI(playing) {
            document.getElementById('play-icon').style.display = playing ? 'none' : 'inline';
            document.getElementById('pause-icon').style.display = playing ? 'inline' : 'none';
        }

        audio.onplay = () => updateUI(true);
        audio.onpause = () => updateUI(false);

        document.getElementById('play-btn').onclick = (e) => {
            e.stopPropagation();
            if (activePlatform === 'youtube' && window.ytPlayer) {
                if (window.ytPlayer.getPlayerState() === 1) window.ytPlayer.pauseVideo();
                else window.ytPlayer.playVideo();
            } else {
                if (audio.paused) audio.play();
                else audio.pause();
            }
        };

        if (audio) {
            audio.ontimeupdate = () => {
                const progress = (audio.currentTime / audio.duration) * 100;
                document.getElementById('progress-bar').style.width = (progress || 0) + '%';
            };
        }
    </script>
</body>
</html>`;
