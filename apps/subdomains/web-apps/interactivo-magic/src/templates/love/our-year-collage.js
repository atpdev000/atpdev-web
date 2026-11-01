export const OUR_YEAR_COLLAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuestro Año 💫 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
        
        :root {
            --primary: #ff4d94;
            --accent: #ff9a3d;
            --bg-start: #fff9e6;
            --bg-end: #ff7e5f;
            --text-dark: #4a3400;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: linear-gradient(to bottom, var(--bg-start), var(--bg-end));
            font-family: 'Outfit', sans-serif;
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-x: hidden;
            padding: 40px 15px 160px 15px;
            position: relative;
        }

        /* Confetti dots background */
        .confetti-overlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1;
            background-image: 
                radial-gradient(circle at 10% 10%, #ff007f 2px, transparent 2px),
                radial-gradient(circle at 30% 20%, #00d2ff 2px, transparent 2px),
                radial-gradient(circle at 50% 15%, #39ff14 2px, transparent 2px),
                radial-gradient(circle at 70% 25%, #ffcc00 2px, transparent 2px),
                radial-gradient(circle at 90% 10%, #ff00ff 2px, transparent 2px),
                radial-gradient(circle at 20% 40%, #ff007f 3px, transparent 3px),
                radial-gradient(circle at 80% 50%, #00d2ff 3px, transparent 3px),
                radial-gradient(circle at 40% 60%, #39ff14 3px, transparent 3px),
                radial-gradient(circle at 60% 70%, #ffcc00 3px, transparent 3px),
                radial-gradient(circle at 15% 85%, #ff00ff 3px, transparent 3px);
            background-size: 200px 200px;
            opacity: 0.6;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            z-index: 10;
        }

        .header h1 {
            font-family: 'Dancing Script', cursive;
            font-size: clamp(2.5rem, 8vw, 4rem);
            color: var(--text-dark);
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .heart-icon {
            color: #ff4d94;
            font-size: 1.2em;
            filter: drop-shadow(0 0 10px rgba(255, 77, 148, 0.5));
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Grid Layout */
        .year-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            width: 100%;
            max-width: 600px;
            z-index: 10;
        }

        @media (max-width: 480px) {
            .year-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .month-item {
            position: relative;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            aspect-ratio: 1 / 1;
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
            border: 4px solid white;
        }

        .month-item:hover {
            transform: scale(1.05);
            z-index: 20;
        }

        .month-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .month-label {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 6px 20px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.9rem;
            color: #4a3400;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            white-space: nowrap;
        }

        /* Names & Messages */
        .info-panel {
            margin-top: 50px;
            text-align: center;
            z-index: 10;
            max-width: 90%;
        }
        .recipient {
            font-size: 2rem;
            font-weight: 900;
            color: var(--text-dark);
            margin-bottom: 10px;
        }
        .message-box {
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 25px;
            border: 2px solid white;
            font-size: 1.1rem;
            line-height: 1.5;
            color: var(--text-dark);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        /* Audio Player UI */
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
            border: 2.5px solid #ff4d94;
            display: none;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 1000;
        }

        .audio-play-btn {
            width: 44px; height: 44px;
            background: #ff4d94;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer; flex-shrink: 0;
        }
        .audio-progress { flex-grow: 1; height: 5px; background: #ffe6f0; border-radius: 10px; position: relative; cursor: pointer; }
        .audio-bar { position: absolute; left: 0; top: 0; height: 100%; background: #ff4d94; border-radius: 10px; width: 0%; }
        .audio-time { color: #ff4d94; font-weight: 900; font-size: 0.85rem; min-width: 35px; text-align: right; }

        /* Intro wall */
        #wall {
            position: fixed; inset: 0; background: #000; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; transition: opacity 1s ease;
        }
        #wall.hide { opacity: 0; pointer-events: none; }
        .gift-icon { font-size: 80px; animation: pulse 2s infinite; }

        .footer-info {
            margin-top: 40px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="wall" onclick="initApp()">
        <div class="gift-icon">📅</div>
        <h2 style="margin-top: 2rem; font-weight: 900; color: #ff4d94; font-family: 'Dancing Script', cursive; font-size: 2.5rem;">NUESTRO AÑO</h2>
        <div style="margin-top: 1rem; color: #666; letter-spacing: 5px; font-size: 0.8rem;">TOCA PARA REPASAR</div>
    </div>

    <div class="confetti-overlay"></div>

    <header class="header">
        <h1>Nuestro Año <span class="heart-icon">💖</span> {{extra_text}}</h1>
    </header>

    <div class="year-grid" id="year-grid">
        <!-- 12 months -->
        <div class="month-item"><img id="img-0" src="{{item_0_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Enero'"><div class="month-label">Enero</div></div>
        <div class="month-item"><img id="img-1" src="{{item_1_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Febrero'"><div class="month-label">Febrero</div></div>
        <div class="month-item"><img id="img-2" src="{{item_2_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Marzo'"><div class="month-label">Marzo</div></div>
        <div class="month-item"><img id="img-3" src="{{item_3_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Abril'"><div class="month-label">Abril</div></div>
        <div class="month-item"><img id="img-4" src="{{item_4_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Mayo'"><div class="month-label">Mayo</div></div>
        <div class="month-item"><img id="img-5" src="{{item_5_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Junio'"><div class="month-label">Junio</div></div>
        <div class="month-item"><img id="img-6" src="{{item_6_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Julio'"><div class="month-label">Julio</div></div>
        <div class="month-item"><img id="img-7" src="{{item_7_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Agosto'"><div class="month-label">Agosto</div></div>
        <div class="month-item"><img id="img-8" src="{{item_8_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Septiembre'"><div class="month-label">Septiembre</div></div>
        <div class="month-item"><img id="img-9" src="{{item_9_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Octubre'"><div class="month-label">Octubre</div></div>
        <div class="month-item"><img id="img-10" src="{{item_10_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Noviembre'"><div class="month-label">Noviembre</div></div>
        <div class="month-item"><img id="img-11" src="{{item_11_url}}" onerror="this.src='https://placehold.co/400x400/ff4d94/white?text=Diciembre'"><div class="month-label">Diciembre</div></div>
    </div>

    <div class="info-panel">
        <div class="recipient">{{name}}</div>
        <div class="message-box">{{message}}</div>
        
        <div id="drive-section" style="display:none; margin-top: 15px;">
            <a href="{{drive_folder}}" target="_blank" style="color: #4a3400; text-decoration: none; font-size: 0.9rem; font-weight: bold; background: white; border: 1px solid #4a3400; padding: 8px 15px; border-radius: 50px; display: inline-block;">
                📂 Ver Galería Completa
            </a>
        </div>

        <div class="footer-info">
            <div style="font-size: 0.8rem; color: rgba(0,0,0,0.5); letter-spacing: 2px; text-transform: uppercase;">Enviado por:</div>
            <div style="font-size: 1.8rem; color: #ff4d94; font-weight: 900; font-family: 'Dancing Script', cursive;">{{sender}}</div>
        </div>
    </div>

    <div id="audio-controls">
        <div class="audio-play-btn" id="audio-toggle">▶</div>
        <div class="audio-progress" id="progress-area"><div class="audio-bar" id="audio-bar"></div></div>
        <div class="audio-time" id="time-display">0:00</div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none; position: fixed; pointer-events: none; opacity: 0;"><div id="yt-player"></div></div>

    <script src="https://www.youtube.com/iframe_api"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        (function() {
            'use strict';
            
            // === PHOTO INITIALIZATION ===
            const photos = [
                '{{item_0_url}}', '{{item_1_url}}', '{{item_2_url}}', '{{item_3_url}}', '{{item_4_url}}',
                '{{item_5_url}}', '{{item_6_url}}', '{{item_7_url}}', '{{item_8_url}}', '{{item_9_url}}',
                '{{item_10_url}}', '{{item_11_url}}'
            ];

            function initPhotos() {
                photos.forEach((url, i) => {
                    const img = document.getElementById('img-' + i);
                    if (img && url && !url.includes('{{')) {
                        img.src = url;
                    }
                });
            }

            // === DRIVE FOLDER LINK ===
            if ('{{drive_folder}}' && !'{{drive_folder}}'.includes('{{')) {
                const driveSection = document.getElementById('drive-section');
                if (driveSection) driveSection.style.display = 'block';
            }

            // === AUDIO SYSTEM INITIALIZATION ===
            const ytId = '{{youtube_id}}';
            const hasYt = ytId && !ytId.includes('{{');
            const audioSrc = '{{audio_src}}';
            const hasNativeAudio = audioSrc && !audioSrc.includes('{{') && !audioSrc.includes('undefined');
            
            let ytPlayer = null;
            let isYtReady = false;
            
            // Get DOM elements
            const player = document.getElementById('player');
            const controls = document.getElementById('audio-controls');
            const toggle = document.getElementById('audio-toggle');
            const audioBar = document.getElementById('audio-bar');
            const timeDisplay = document.getElementById('time-display');

            console.log('[OUR YEAR 🎵] ======== Audio Config ========');
            console.log('  hasYt:', hasYt);
            console.log('  ytId:', ytId);
            console.log('  hasNativeAudio:', hasNativeAudio);
            console.log('  audioSrc:', audioSrc);
            console.log('  playerElement:', !!player);
            console.log('  controlsElement:', !!controls);
            console.log('  toggleElement:', !!toggle);
            console.log('[OUR YEAR 🎵] ============================');

            // === YOUTUBE PLAYER SETUP ===
            if (hasYt) {
                console.log('[OUR YEAR 🎵] YouTube configuration detected');
                
                // Function to create the YouTube player
                function createYouTubePlayer() {
                    console.log('[OUR YEAR 🎵] Creating YouTube player...');
                    try {
                        ytPlayer = new YT.Player('yt-player', {
                            height: '0',
                            width: '0',
                            videoId: ytId,
                            playerVars: {
                                'autoplay': 0,
                                'controls': 0,
                                'loop': 1,
                                'playlist': ytId
                            },
                            events: {
                                'onReady': function(event) {
                                    console.log('[OUR YEAR 🎵] YT Player Ready!');
                                    isYtReady = true;
                                    if (toggle) toggle.innerText = '▶';
                                },
                                'onStateChange': function(event) {
                                    if (!toggle) return;
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        toggle.innerText = '⏸';
                                    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                                        toggle.innerText = '▶';
                                    }
                                },
                                'onError': function(event) {
                                    console.error('[OUR YEAR 🎵] YT Player Error:', event.data);
                                }
                            }
                        });
                    } catch (err) {
                        console.error('[OUR YEAR 🎵] Error creating YT player:', err);
                    }
                }
                
                // Check if YouTube API is already loaded
                if (typeof YT !== 'undefined' && YT.Player) {
                    console.log('[OUR YEAR 🎵] YT API already loaded, creating player immediately');
                    createYouTubePlayer();
                } else {
                    console.log('[OUR YEAR 🎵] YT API not loaded yet, setting up callback');
                    // Set up callback for when API loads
                    window.onYouTubeIframeAPIReady = function() {
                        console.log('[OUR YEAR 🎵] YouTube API Ready callback fired');
                        createYouTubePlayer();
                    };
                }
            }

            // === WALL CLICK / APP INITIALIZATION ===
            window.initApp = function() {
                console.log('[OUR YEAR 🎵] initApp() called');
                console.log('[OUR YEAR 🎵] YouTube ready status: isYtReady =', isYtReady, ', ytPlayer =', !!ytPlayer);
                
                const wall = document.getElementById('wall');
                if (wall) wall.classList.add('hide');

                // Try YouTube First
                if (hasYt) {
                    console.log('[OUR YEAR 🎵] YouTube detected, attempting playback...');
                    
                    // If player is ready, play immediately
                    if (isYtReady && ytPlayer && ytPlayer.playVideo) {
                        console.log('[OUR YEAR 🎵] YT Player ready, starting playback now');
                        try {
                            ytPlayer.playVideo();
                            if (controls) controls.style.display = 'flex';
                            if (toggle) toggle.innerText = '⏸';
                        } catch (err) {
                            console.error('[OUR YEAR 🎵] Error playing YouTube:', err);
                        }
                    } else {
                        // Player not ready yet, show controls and wait
                        console.log('[OUR YEAR 🎵] YT Player not ready yet, showing controls and waiting...');
                        if (controls) controls.style.display = 'flex';
                        
                        // Retry every 500ms until player is ready (max 10 seconds)
                        let attempts = 0;
                        const maxAttempts = 20;
                        const retryInterval = setInterval(function() {
                            attempts++;
                            console.log('[OUR YEAR 🎵] Retry attempt', attempts, '- isYtReady:', isYtReady);
                            
                            if (isYtReady && ytPlayer && ytPlayer.playVideo) {
                                console.log('[OUR YEAR 🎵] YT Player NOW ready! Starting playback');
                                clearInterval(retryInterval);
                                try {
                                    ytPlayer.playVideo();
                                    if (toggle) toggle.innerText = '⏸';
                                } catch (err) {
                                    console.error('[OUR YEAR 🎵] Error playing YouTube after retry:', err);
                                }
                            } else if (attempts >= maxAttempts) {
                                console.error('[OUR YEAR 🎵] YouTube player failed to load after', maxAttempts, 'attempts');
                                clearInterval(retryInterval);
                            }
                        }, 500);
                    }
                }
                // Try Native Audio
                else if (hasNativeAudio && player && player.src) {
                    console.log('[OUR YEAR 🎵] Starting native audio playback...');
                    player.play()
                        .then(() => {
                            console.log('[OUR YEAR 🎵] Native audio playing');
                            if (controls) controls.style.display = 'flex';
                            if (toggle) toggle.innerText = '⏸';
                        })
                        .catch(err => {
                            console.log('[OUR YEAR 🎵] Native audio blocked:', err.message);
                            // Still show controls so user can click play
                            if (controls) controls.style.display = 'flex';
                        });
                } else {
                    console.warn('[OUR YEAR 🎵] No audio source available');
                }

                // Confetti
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#ff4d94', '#ffcc00', '#39ff14', '#00d2ff', '#ff00ff']
                    });
                }
            };

            // === PLAY/PAUSE TOGGLE ===
            if (toggle) {
                toggle.onclick = function() {
                    console.log('[OUR YEAR 🎵] Toggle clicked');
                    
                    if (hasYt && ytPlayer && isYtReady) {
                        try {
                            const state = ytPlayer.getPlayerState();
                            if (state === YT.PlayerState.PLAYING) {
                                ytPlayer.pauseVideo();
                            } else {
                                ytPlayer.playVideo();
                            }
                        } catch (err) {
                            console.error('[OUR YEAR 🎵] Error toggling YT:', err);
                        }
                    } else if (player) {
                        if (player.paused) {
                            player.play()
                                .then(() => { toggle.innerText = '⏸'; })
                                .catch(err => console.log('Play error:', err));
                        } else {
                            player.pause();
                            toggle.innerText = '▶';
                        }
                    }
                };
            }

            // === NATIVE AUDIO PROGRESS ===
            if (player) {
                player.ontimeupdate = function() {
                    if (!audioBar || !timeDisplay) return;
                    const progress = (player.currentTime / player.duration) * 100;
                    audioBar.style.width = progress + '%';
                    const min = Math.floor(player.currentTime / 60);
                    const sec = Math.floor(player.currentTime % 60);
                    timeDisplay.innerText = min + ':' + (sec < 10 ? '0' + sec : sec);
                };
            }

            // === YOUTUBE PROGRESS UPDATE ===
            setInterval(function() {
                if (hasYt && ytPlayer && isYtReady && ytPlayer.getCurrentTime) {
                    try {
                        const curr = ytPlayer.getCurrentTime();
                        const dur = ytPlayer.getDuration();
                        if (audioBar && timeDisplay && dur > 0) {
                            const progress = (curr / dur) * 100;
                            audioBar.style.width = progress + '%';
                            const min = Math.floor(curr / 60);
                            const sec = Math.floor(curr % 60);
                            timeDisplay.innerText = min + ':' + (sec < 10 ? '0' + sec : sec);
                        }
                    } catch (err) {
                        // Ignore errors if player not ready
                    }
                }
            }, 1000);

            // === INITIALIZE ===
            initPhotos();
            console.log('[OUR YEAR 🎵] Script initialized. Click the gift to start!');
        })();
    </script>
</body>
</html>`;
