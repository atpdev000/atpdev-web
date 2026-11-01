export const FRIENDS_REQUEST_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>¿Amig@s? 👥✨ - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff4d94;
            --secondary: #ff85a1;
            --bg: #fff0f5;
            --card-bg: #ffffff;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
            position: relative;
        }

        /* Floating particles */
        .particles {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1;
        }
        .particle {
            position: absolute;
            animation: floatUp linear forwards;
            opacity: 0.6;
        }
        @keyframes floatUp {
            from { transform: translateY(110vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            to { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        .container {
            width: 90%;
            max-width: 420px;
            text-align: center;
            z-index: 10;
            transition: all 0.5s ease;
        }

        .card {
            background: var(--card-bg);
            padding: 2.5rem 1.5rem;
            border-radius: 40px;
            box-shadow: 0 20px 60px rgba(255, 77, 148, 0.15);
            position: relative;
            border: 4px solid #fff;
        }

        .photo-area {
            width: 100%;
            aspect-ratio: 1/1;
            border-radius: 30px;
            overflow: hidden;
            margin-bottom: 1.5rem;
            background: #fdfdfd;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            position: relative;
        }
        .photo-area img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .question {
            color: var(--primary);
            font-size: 1.8rem;
            font-weight: 900;
            margin-bottom: 2rem;
            line-height: 1.2;
            text-shadow: 2px 2px 0 rgba(255, 77, 148, 0.1);
        }

        .btns {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            height: 120px;
            position: relative;
        }

        button {
            padding: 15px 35px;
            border-radius: 50px;
            border: none;
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        #yesBtn {
            background: linear-gradient(135deg, #ff4d94, #ff85a1);
            color: white;
            box-shadow: 0 8px 20px rgba(255, 77, 148, 0.3);
            min-width: 120px;
            z-index: 100;
        }
        #yesBtn:active { transform: scale(0.95); }

        #noBtn {
            background: #fff;
            color: #888;
            border: 2px solid #eee;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            white-space: nowrap;
        }

        /* Success State */
        .success-overlay {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: fadeIn 1s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .victory-img {
            width: 220px;
            height: 220px;
            border-radius: 50%;
            border: 8px solid white;
            box-shadow: 0 15px 45px rgba(255, 77, 148, 0.25);
            margin-bottom: 2rem;
            object-fit: cover;
            animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounceIn {
            0% { transform: scale(0); }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .success-title {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--primary);
            margin-bottom: 1rem;
        }

        .sender-tag {
            font-size: 0.8rem;
            font-weight: 900;
            color: rgba(0,0,0,0.25);
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 1rem;
        }

        /* Intro wall */
        #intro {
            position: fixed; inset: 0; background: var(--bg); z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; transition: opacity 0.8s ease;
        }
        #intro.hide { opacity: 0; pointer-events: none; }
        
        .intro-icon { font-size: 100px; animation: bounceLong 2s infinite; }
        @keyframes bounceLong { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }

        /* Magic Audio Player */
        #audio-controls {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 400px;
            background: #fff;
            padding: 8px 15px;
            border-radius: 100px;
            border: 2.5px solid var(--primary);
            display: none;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            z-index: 1000;
        }

        .audio-play-btn {
            width: 40px; height: 40px;
            background: var(--primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer; flex-shrink: 0;
        }

        .audio-progress { flex-grow: 1; height: 5px; background: #ffe6f0; border-radius: 10px; position: relative; }
        .audio-bar { position: absolute; left: 0; top: 0; height: 100%; background: var(--primary); border-radius: 10px; width: 0%; }
        .audio-time { color: var(--primary); font-weight: 900; font-size: 0.8rem; min-width: 35px; text-align: right; }
    </style>
</head>
<body>
    <div id="intro" onclick="startSurprise()">
        <div class="intro-icon">🐱</div>
        <h2 style="font-weight: 900; margin-top: 2rem; color: #333;">¿Amig@s?</h2>
        <div style="color: var(--primary); font-weight: 900; letter-spacing: 5px; margin-top: 1.5rem; font-size: 0.85rem;">TOCA PARA ABRIR ✨</div>
    </div>

    <div class="particles" id="particles-container"></div>

    <div class="container" id="main-ui">
        <div class="card">
            <h1 class="question">¿Podemos volver a ser amig@s? 🥺💖</h1>
            <div class="photo-area">
                <img id="main-photo" src="{{image_src}}" onerror="this.src='https://media.tenor.com/XU684T4zQ_4AAAAC/penguin-crying.gif'">
            </div>
            <div class="btns">
                <button id="noBtn">No 😢</button>
                <button id="yesBtn">Sí 🌸</button>
            </div>
        </div>
    </div>

    <div class="container success-overlay" id="success-ui">
        <div class="card">
            <div class="sender-tag">De: {{sender}}</div>
            <h2 class="success-title">¡SIII! ✨💖</h2>
            <img id="success-photo" src="{{img2}}" class="victory-img" onerror="this.src='{{image_src}}'; this.onerror=function(){this.src='https://media.tenor.com/_q1fJ7eXRE8AAAAd/love-penguin.gif'}">
            <div style="color: var(--primary); font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">{{extra_text}}</div>
            <p style="color: #666; font-weight: 500; line-height: 1.5;">{{message}}</p>
            <div style="font-size: 3rem; margin-top: 1.5rem;">🐱✨🎈</div>
        </div>
    </div>

    <div id="audio-controls">
        <div class="audio-play-btn" id="audio-toggle">▶</div>
        <div class="audio-progress"><div class="audio-bar" id="audio-bar"></div></div>
        <div class="audio-time" id="time-display">0:00</div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        (function() {
            const noBtn = document.getElementById('noBtn');
            const yesBtn = document.getElementById('yesBtn');
            const mainImg = document.getElementById('main-photo');
            const fallbackGifs = {
                sad: "https://media.tenor.com/v8tT9L3NksUAAAAC/sad-hamster-hamster.gif",
                crying: "https://media.tenor.com/2X87W6w_S0kAAAAd/puss-in-boots-puss-in-boots-eyes.gif",
                happy: "https://media.tenor.com/9v_69DkXWToAAAAC/happy-cat-jumping.gif"
            };

            // Fix photo paths if empty
            const hasInitialImg = '{{image_src}}' && !'{{image_src}}'.includes('{{');
            if(!hasInitialImg) mainImg.src = fallbackGifs.sad;

            let level = 0;
            let scale = 1;
            const escapeMsgs = ["¿En serio? 🥺", "¡No lo hagas! ❌", "¡Ups! 💨", "Pincha el Sí 👉", "¡Ni lo pienses! 🙈", "Error 404 🚫"];

            function moveNo() {
                level++;
                const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
                const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 100);
                
                noBtn.style.position = 'fixed';
                noBtn.style.left = x + 'px';
                noBtn.style.top = y + 'px';
                noBtn.style.zIndex = '9999';
                noBtn.innerText = escapeMsgs[Math.floor(Math.random() * escapeMsgs.length)];

                scale += 0.25;
                yesBtn.style.transform = "scale(" + scale + ")";

                if(!hasInitialImg) {
                    if(level > 4) mainImg.src = fallbackGifs.crying;
                }
            }

            noBtn.addEventListener('mouseenter', moveNo);
            noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });

            yesBtn.onclick = () => {
                document.getElementById('main-ui').style.display = 'none';
                document.getElementById('success-ui').style.display = 'flex';
                
                // Set success kitten GIF
                document.getElementById('success-photo').src = fallbackGifs.happy;

                // Celebration
                const end = Date.now() + (10 * 1000);
                const colors = ['#ff4d94', '#ff85a1', '#ffffff'];

                (function frame() {
                    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
                    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());

                toggleMusic(true);
            };

            // Particles
            function createParticle() {
                const container = document.getElementById('particles-container');
                const p = document.createElement('div');
                p.className = 'particle';
                p.innerHTML = ['🐱','✨','🌸','❤️','🎈'][Math.floor(Math.random()*5)];
                p.style.left = Math.random() * 100 + 'vw';
                p.style.fontSize = (Math.random() * 20 + 20) + 'px';
                p.style.animationDuration = (Math.random() * 3 + 4) + 's';
                container.appendChild(p);
                setTimeout(() => p.remove(), 7000);
            }
            setInterval(createParticle, 500);

            // Audio
            const player = document.getElementById('player');
            const youtubeId = "{{youtube_id}}".replace(/[{}]/g, '');
            let ytPlayer = null;
            let isPlaying = false;
            let platform = (youtubeId && youtubeId.length > 2) ? 'youtube' : 'native';

            window.startSurprise = function() {
                document.getElementById('intro').classList.add('hide');
                if('{{has_audio}}' === 'true') {
                    document.getElementById('audio-controls').style.display = 'flex';
                    initializeAudio();
                }
            };

            function initializeAudio() {
                if(platform === 'youtube') {
                    const tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(tag);
                    window.onYouTubeIframeAPIReady = () => {
                        window.ytPlayer = new YT.Player('yt-player', {
                            videoId: youtubeId, height: '0', width: '0',
                            playerVars: { autoplay: 1, loop: 1, playlist: youtubeId },
                            events: { 'onReady': () => toggleMusic(true), 'onStateChange': (e) => { updateAudioUI(e.data === 1); } }
                        });
                    };
                } else {
                    player.play().catch(() => {});
                    toggleMusic(true);
                }
            }

            function toggleMusic(play) {
                const btn = document.getElementById('audio-toggle');
                if(play) {
                    btn.textContent = '||';
                    if(window.ytPlayer) window.ytPlayer.playVideo(); else player.play();
                } else {
                    btn.textContent = '▶';
                    if(window.ytPlayer) window.ytPlayer.pauseVideo(); else player.pause();
                }
                updateAudioUI(play);
            }

            function updateAudioUI(playing) {
                isPlaying = playing;
                document.getElementById('audio-toggle').textContent = playing ? '||' : '▶';
                if(playing) startProgressLoop();
            }

            function startProgressLoop() {
                setInterval(() => {
                    if(!isPlaying) return;
                    let cur, dur;
                    if(platform === 'youtube' && window.ytPlayer && window.ytPlayer.getCurrentTime) {
                        cur = window.ytPlayer.getCurrentTime();
                        dur = window.ytPlayer.getDuration();
                    } else {
                        cur = player.currentTime;
                        dur = player.duration;
                    }
                    if(dur) {
                        const pct = (cur / dur) * 100;
                        document.getElementById('audio-bar').style.width = pct + "%";
                        document.getElementById('time-display').innerText = formatTime(cur);
                    }
                }, 500);
            }

            function formatTime(s) {
                const min = Math.floor(s/60);
                const sec = Math.floor(s%60);
                return min + ":" + (sec < 10 ? '0' : '') + sec;
            }

            document.getElementById('audio-toggle').onclick = () => toggleMusic(!isPlaying);
        })();
    </script>
</body>
</html>`;
