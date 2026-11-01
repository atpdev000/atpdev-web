export const PUZZLE_LOVE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puzzle de Amor - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: #0a0514; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; color: white; }
        
        .romantic-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #05020a 100%); }
        .hearts-bg { position: absolute; width: 100%; height: 100%; pointer-events: none; }

        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0514; z-index: 10000; display: flex; justify-content: center; align-items: center; transition: opacity 0.8s ease; cursor: pointer; }
        .box-emoji { font-size: 100px; animation: float 3s ease-in-out infinite; filter: drop-shadow(0 0 30px rgba(255, 77, 148, 0.5)); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

        .game-header { position: relative; z-index: 10; text-align: center; margin-bottom: 1rem; }
        .game-header h1 { font-size: 2.2rem; font-weight: 900; color: #ff4d94; text-shadow: 0 0 20px rgba(255, 77, 148, 0.4); margin-bottom: 0.5rem; }
        .game-header p { color: rgba(255, 255, 255, 0.6); letter-spacing: 1px; }

        .reference-img {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 1.5rem;
            border-radius: 15px;
            overflow: hidden;
            border: 2px solid rgba(255, 77, 148, 0.3);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            opacity: 0.6;
        }
        .reference-img img { width: 100%; height: 100%; object-fit: cover; }
        .reference-label {
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.65rem;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .puzzle-container { 
            position: relative; 
            z-index: 10; 
            background: rgba(255, 255, 255, 0.1); 
            backdrop-filter: blur(20px); 
            padding: 2.5rem 1.5rem; 
            border-radius: 25px; 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            transition: transform 0.8s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .puzzle-board { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 6px; 
            width: 320px; 
            height: 320px; 
            background: #000;
            border-radius: 15px;
            overflow: hidden;
        }

        .puzzle-tile { 
            width: 100%; 
            height: 100%; 
            background-size: 320px 320px; 
            background-repeat: no-repeat; 
            cursor: pointer; 
            border-radius: 4px; 
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        }
        .puzzle-tile.empty { background: transparent !important; box-shadow: none; cursor: default; }
        .puzzle-tile:not(.empty):hover { transform: scale(0.97); filter: brightness(1.2); }

        .message-box { 
            display: none; 
            position: relative; 
            z-index: 20; 
            text-align: center; 
            width: 90%; 
            max-width: 450px; 
            animation: winPop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes winPop { 0% { opacity: 0; transform: scale(0.5) translateY(50px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }

        .photo-reveal {
            width: 220px;
            height: 220px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            padding: 8px;
            background: linear-gradient(45deg, #ff416c, #7000ff);
            box-shadow: 0 0 40px rgba(255, 65, 108, 0.6);
            overflow: hidden;
        }
        .photo-reveal img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 4px solid #0a0514; }

        .win-title { font-size: 2.8rem; font-weight: 900; background: linear-gradient(to bottom, #fff, #ff4d94); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1.5rem; }
        .win-msg { font-size: 1.4rem; color: rgba(255,255,255,0.9); line-height: 1.5; margin-bottom: 2rem; font-weight: 300; }
        .win-sender { color: #ffcc00; font-weight: 800; font-size: 1.2rem; }

        /* Audio Controls */
        .audio-controls { position: fixed; bottom: 30px; width: 85%; max-width: 380px; background: rgba(0,0,0,0.6); backdrop-filter: blur(20px); padding: 12px 25px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px; z-index: 1000; transition: transform 0.5s; }
        .play-btn { width: 42px; height: 42px; background: #ff4d94; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; border: none; }
        .progress-bar-container { flex-grow: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
        .progress-bar { width: 0%; height: 100%; background: #ff4d94; border-radius: 2px; }
        .time-text { font-size: 11px; color: rgba(255,255,255,0.5); min-width: 35px; text-shadow: 0 0 5px rgba(0,0,0,0.5); }
    </style>
</head>
<body>
    <div class="romantic-bg">
        <div class="hearts-bg" id="hearts-container"></div>
    </div>

    <div id="intro-overlay" onclick="openBox()">
        <div class="box-container" style="text-align:center;">
            <div class="box-emoji">🧩</div>
            <div style="margin-top:2rem; color:white; font-weight:900; font-size:1.8rem; letter-spacing:2px;">PUZZLE DEL AMOR</div>
            <div style="color:rgba(255,255,255,0.5); margin-top:0.5rem; letter-spacing:4px;">TOCA PARA ARMAR EL RECUERDO</div>
        </div>
    </div>

    <div id="game-ui">
        <div class="game-header">
            <h1>¡Reconstruye el Momento! 💫</h1>
            <p>Desliza las piezas de tu foto</p>
        </div>
        <div class="puzzle-container" id="p-container">
            <div class="reference-label">REFERENCIA</div>
            <div class="reference-img">
                <img src="{{image_src}}" alt="Imagen de referencia">
            </div>
            <div class="puzzle-board" id="board"></div>
        </div>
    </div>

    <div class="message-box" id="win-ui">
        <div class="photo-reveal">
            <img src="{{image_src}}" alt="Foto Completa">
        </div>
        <h2 class="win-title">¡LO LOGRASTE! 😍</h2>
        <div class="win-msg">{{message}}</div>
        <p style="color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:2px; font-size:0.8rem;">De tu amor:</p>
        <div class="win-sender">{{sender}}</div>
        <a href="/" style="display:inline-block; margin-top:2.5rem; color:rgba(255,255,255,0.3); text-decoration:none; font-size:0.8rem; border:1px solid rgba(255,255,255,0.1); padding:8px 20px; border-radius:20px;">Crea tu propio puzzle ✨</a>
    </div>

    <div class="audio-controls" id="audio-ui" style="display: none;">
        <button class="play-btn" id="play-btn">
            <span id="play-icon">▶</span>
            <span id="pause-icon" style="display:none">||</span>
        </button>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div class="time-text" id="time-display">0:00</div>
    </div>

    <audio id="bg-audio" src="{{audio_src}}" loop></audio>
    <div id="yt-player-container" style="position:fixed; top:0; left:0; width:1px; height:1px; opacity:0; pointer-events:none;">
        <div id="youtube-player"></div>
    </div>

    <script>
        const audio = document.getElementById('bg-audio');
        const youtubeId = "{{youtube_id}}";
        let ytReady = false, ytPlayer = null, isPlaying = false;
        let activePlatform = youtubeId ? 'youtube' : 'native';

        // Hearts Background
        function createHeart() {
            const container = document.getElementById('hearts-container');
            const h = document.createElement('div');
            h.innerHTML = ['❤️','✨','💖','💕'][Math.floor(Math.random()*4)];
            h.style.position = 'absolute';
            h.style.left = Math.random() * 100 + '%';
            h.style.top = '105%';
            h.style.fontSize = (Math.random() * 20 + 10) + 'px';
            h.style.opacity = Math.random() * 0.3 + 0.1;
            h.style.transition = 'transform ' + (Math.random() * 10 + 5) + 's linear';
            container.appendChild(h);
            setTimeout(() => h.style.transform = 'translateY(-120vh) rotate(' + (Math.random() * 360) + 'deg)', 50);
            setTimeout(() => h.remove(), 15000);
        }
        setInterval(createHeart, 1000);

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
                    events: { 'onReady': () => ytReady = true }
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
                const mins = Math.floor(audio.currentTime / 60), secs = Math.floor(audio.currentTime % 60);
                document.getElementById('time-display').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
            };
        }

        // Puzzle Logic
        const board = document.getElementById('board');
        const imgSrc = "{{image_src}}";
        let state = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 8 is the empty one
        
        function shuffle(array) {
            // Fisher-Yates shuffle
            for (let i = array.length - 2; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            
            // Check solvability for 3x3 (inversions must be even)
            let inversions = 0;
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i] === 8) continue;
                for (let j = i + 1; j < array.length - 1; j++) {
                    if (array[j] === 8) continue;
                    if (array[i] > array[j]) inversions++;
                }
            }
            
            if (inversions % 2 !== 0) {
                // If odd, swap two elements (not the blank) to make it even
                [array[0], array[1]] = [array[1], array[0]];
            }
            return array;
        }

        state = shuffle(state);

        function render() {
            board.innerHTML = '';
            state.forEach((tileIdx, currentPos) => {
                const div = document.createElement('div');
                div.className = 'puzzle-tile' + (tileIdx === 8 ? ' empty' : '');
                
                if (tileIdx !== 8) {
                    div.style.backgroundImage = 'url("' + imgSrc + '")';
                    const row = Math.floor(tileIdx / 3);
                    const col = tileIdx % 3;
                    div.style.backgroundPosition = '-' + (col * 106.6) + 'px -' + (row * 106.6) + 'px';
                }
                
                div.onclick = () => move(currentPos);
                board.appendChild(div);
            });
            checkWin();
        }

        function move(pos) {
            const emptyPos = state.indexOf(8);
            const canMove = (
                (pos === emptyPos - 1 && pos % 3 !== 2) ||
                (pos === emptyPos + 1 && pos % 3 !== 0) ||
                (pos === emptyPos - 3) ||
                (pos === emptyPos + 3)
            );

            if (canMove) {
                [state[pos], state[emptyPos]] = [state[emptyPos], state[pos]];
                render();
            }
        }

        function checkWin() {
            const isWin = state.every((val, idx) => val === idx);
            if (isWin) {
                document.getElementById('game-ui').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('game-ui').style.display = 'none';
                    document.getElementById('win-ui').style.display = 'block';
                    document.getElementById('audio-ui').style.transform = 'translateY(100px)';
                }, 800);
            }
        }

        render();
    </script>
</body>
</html>`;
