export const PHOTO_HEART_COLLAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corazón Mágico 💫 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: #ff4d94;
            --neon-green: #39ff14;
            --neon-red: #ff3131;
            --bg: #050510;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            font-family: 'Outfit', sans-serif;
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-x: hidden;
            padding: 20px 0 160px 0; /* Extra bottom padding for fixed player */
            background-image: 
                radial-gradient(circle at 20% 20%, rgba(255, 77, 148, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(57, 255, 20, 0.05) 0%, transparent 40%);
        }

        /* Particles container */
        #particles {
            position: fixed; inset: 0; pointer-events: none; z-index: 1;
        }
        .dot {
            position: absolute; width: 4px; height: 4px; border-radius: 50%;
            opacity: 0.6; animation: blink 2s infinite ease-in-out;
        }
        @keyframes blink { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.2); } }

        /* Header Text Clip */
        .text-header {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap; /* Allow wrapping on small screens */
            gap: 10px 25px; /* Vertical gap 10px, Horizontal 25px */
            margin-bottom: 40px;
            z-index: 10;
            width: 100%;
            padding: 0 10px;
        }

        .letter {
            font-size: clamp(50px, 12vw, 85px);
            font-weight: 900;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: cover;
            background-position: center;
            filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.4));
            position: relative;
            line-height: normal;
        }
        .letter::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
            border-radius: 10px;
            opacity: 0; /* Pure text clip */
        }

        /* Heart Mosaic Container */
        .heart-container {
            position: relative;
            width: 350px;
            height: 350px;
            margin-top: 20px;
            z-index: 10;
        }

        .mosaic-item {
            position: absolute;
            border-radius: 5px;
            overflow: hidden;
            border: 2px solid white;
            box-shadow: 0 0 15px rgba(255, 49, 49, 0.5);
            transition: transform 0.3s ease;
            background: #222;
        }
        .mosaic-item:hover {
            transform: scale(1.1);
            z-index: 100;
            box-shadow: 0 0 25px var(--neon-red);
        }
        .mosaic-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .mosaic-item img.loaded { opacity: 1; }

        /* Names & Messages */
        .info-panel {
            margin-top: 60px;
            text-align: center;
            z-index: 10;
            max-width: 90%;
        }
        .recipient {
            font-size: 2.2rem;
            font-weight: 900;
            color: #fff;
            margin-bottom: 10px;
            text-shadow: 0 0 15px var(--primary);
        }
        .message-box {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            padding: 15px 25px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            font-size: 1.1rem;
            line-height: 1.5;
            color: rgba(255,255,255,0.8);
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
            border: 2.5px solid var(--primary);
            display: none;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 1000;
        }

        .audio-play-btn {
            width: 44px; height: 44px;
            background: var(--primary);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer; flex-shrink: 0;
        }
        .audio-progress { flex-grow: 1; height: 5px; background: #ffe6f0; border-radius: 10px; position: relative; cursor: pointer; }
        .audio-bar { position: absolute; left: 0; top: 0; height: 100%; background: var(--primary); border-radius: 10px; width: 0%; }
        .audio-time { color: var(--primary); font-weight: 900; font-size: 0.85rem; min-width: 35px; text-align: right; }

        /* Intro wall */
        #wall {
            position: fixed; inset: 0; background: #000; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; transition: opacity 1s ease;
        }
        #wall.hide { opacity: 0; pointer-events: none; }
        .gift-icon { font-size: 80px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    </style>
</head>
<body>
    <div id="wall" onclick="initApp()">
        <div class="gift-icon">💖</div>
        <h2 style="margin-top: 2rem; font-weight: 900; color: var(--primary);">ABRIR CORAZÓN</h2>
        <div style="margin-top: 1rem; color: #666; letter-spacing: 5px; font-size: 0.8rem;">TOCA PARA COMENZAR</div>
    </div>

    <div id="particles"></div>

    <div class="text-header">
        <div style="display:flex; gap:8px;">
            <div class="letter" id="l-t">T</div>
            <div class="letter" id="l-e">E</div>
        </div>
        <div style="display:flex; gap:8px;">
            <div class="letter" id="l-a">A</div>
            <div class="letter" id="l-m">M</div>
            <div class="letter" id="l-o">O</div>
        </div>
    </div>

    <div class="heart-container" id="heart-mosaic">
        <!-- Mosaic items will be injected -->
    </div>

    <div class="info-panel">
        <div class="recipient">{{name}}</div>
        <div class="message-box">{{message}}</div>
        
        <div id="drive-section" style="display:none; margin-top: 15px;">
            <a href="{{drive_folder}}" target="_blank" style="color: var(--neon-green); text-decoration: none; font-size: 0.9rem; font-weight: bold; border: 1px solid var(--neon-green); padding: 8px 15px; border-radius: 50px; display: inline-block;">
                📂 Ver Galería Completa
            </a>
        </div>

        <div style="margin-top: 40px; margin-bottom: 20px;">
            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase;">Enviado por:</div>
            <div style="font-size: 1.8rem; color: var(--primary); font-weight: 900; text-shadow: 0 0 12px rgba(255, 77, 148, 0.6);">{{sender}}</div>
        </div>
    </div>

    <div id="audio-controls">
        <div class="audio-play-btn" id="audio-toggle">▶</div>
        <div class="audio-progress" id="progress-area"><div class="audio-bar" id="audio-bar"></div></div>
        <div class="audio-time" id="time-display">0:00</div>
    </div>

    <audio id="player" src="{{audio_src}}" loop></audio>
    <div id="yt-wrap" style="display:none"><div id="yt-player"></div></div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        (function() {
            const PHOTOS_IN_HEART = 20; // 5..24
            const heartData = [
                { t: 0, l: 60, w: 90, h: 90 },    { t: 0, l: 200, w: 90, h: 90 }, 
                { t: 30, l: 10, w: 80, h: 80 },   { t: 40, l: 110, w: 130, h: 90 }, { t: 30, l: 260, w: 80, h: 80 },
                { t: 90, l: 0, w: 110, h: 110 },  { t: 110, l: 120, w: 90, h: 120 }, { t: 90, l: 240, w: 110, h: 110 },
                { t: 160, l: 30, w: 90, h: 90 },  { t: 200, l: 130, w: 100, h: 100 }, { t: 160, l: 230, w: 90, h: 90 },
                { t: 230, l: 70, w: 70, h: 70 },  { t: 270, l: 150, w: 60, h: 60 },  { t: 230, l: 210, w: 70, h: 70 },
                { t: 300, l: 110, w: 50, h: 50 }, { t: 310, l: 170, w: 50, h: 50 }, 
                { t: 80, l: 70, w: 50, h: 50 },   { t: 140, l: 180, w: 60, h: 60 },
                { t: 200, l: 30, w: 40, h: 40 },   { t: 150, l: 300, w: 60, h: 60 }
            ];

            function idxToUrl(idx) {
                const placeholders = [
                    '{{item_0_url}}','{{item_1_url}}','{{item_2_url}}','{{item_3_url}}','{{item_4_url}}',
                    '{{item_5_url}}','{{item_6_url}}','{{item_7_url}}','{{item_8_url}}','{{item_9_url}}',
                    '{{item_10_url}}','{{item_11_url}}','{{item_12_url}}','{{item_13_url}}','{{item_14_url}}',
                    '{{item_15_url}}','{{item_16_url}}','{{item_17_url}}','{{item_18_url}}','{{item_19_url}}',
                    '{{item_20_url}}','{{item_21_url}}','{{item_22_url}}','{{item_23_url}}','{{item_24_url}}'
                ];
                const val = placeholders[idx];
                if (!val || val.includes('{{')) return null;
                return val;
            }

            // Collect available photos
            const availablePhotos = [];
            for(let i=0; i<25; i++) {
                const url = idxToUrl(i);
                if(url && url.length > 5) availablePhotos.push(url);
            }

            // Fallback visuals if no photos uploaded
            const hasPhotos = availablePhotos.length > 0;
            if(!hasPhotos) {
                // If empty, we can't do modulo, so we add a transparent pixel or similar
                // But it's better to just use a background color in CSS
            }

            // Setup Header Letters backgrounds
            const letters = ['l-t', 'l-e', 'l-a', 'l-m', 'l-o'];
            letters.forEach((id, i) => {
                const el = document.getElementById(id);
                if(el && hasPhotos) {
                    el.style.backgroundImage = "url('" + availablePhotos[i % availablePhotos.length] + "')";
                    el.style.webkitTextFillColor = "transparent";
                } else if(el) {
                    el.style.backgroundImage = "none";
                    el.style.webkitTextFillColor = "white"; // Solid white if no photo
                }
            });

            // Generate heart items
            const container = document.getElementById('heart-mosaic');
            for(let i=0; i<PHOTOS_IN_HEART; i++) {
                const config = heartData[i] || { t: Math.random()*300, l: Math.random()*300, w: 50, h: 50 };
                const div = document.createElement('div');
                div.className = 'mosaic-item';
                div.style.top = config.t + 'px';
                div.style.left = config.l + 'px';
                div.style.width = config.w + 'px';
                div.style.height = config.h + 'px';
                div.style.transitionDelay = (i * 0.05) + 's';
                
                if (hasPhotos) {
                    const img = document.createElement('img');
                    const photoIdx = (i + 5) % availablePhotos.length;
                    img.src = availablePhotos[photoIdx];
                    img.onload = () => img.classList.add('loaded');
                    div.appendChild(img);
                } else {
                    div.style.background = "rgba(255, 77, 148, 0.2)";
                }
                
                container.appendChild(div);
            }

            // Particles
            const partBox = document.getElementById('particles');
            for(let i=0; i<40; i++) {
                const d = document.createElement('div');
                d.className = 'dot';
                d.style.left = Math.random() * 100 + 'vw';
                d.style.top = Math.random() * 100 + 'vh';
                d.style.backgroundColor = ['#ff4d94', '#39ff14', '#ffffff', '#ff3131'][Math.floor(Math.random()*4)];
                d.style.animationDelay = Math.random() * 2 + 's';
                partBox.appendChild(d);
            }

            // === AUDIO SYSTEM ===
            const player = document.getElementById('player');
            const controls = document.getElementById('audio-controls');
            const toggle = document.getElementById('audio-toggle');
            const audioBar = document.getElementById('audio-bar');
            const timeDisplay = document.getElementById('time-display');
            const progressArea = document.getElementById('progress-area');
            
            const ytId = "{{youtube_id}}";
            const hasYt = ytId && !ytId.includes('{{');
            const audioSrc = "{{audio_src}}";
            const hasNativeAudio = audioSrc && !audioSrc.includes('{{') && !audioSrc.includes('undefined');
            const hasAudio = '{{has_audio}}' === 'true';
            
            let ytPlayer = null;
            let isYtReady = false;
            let isPlaying = false;

            console.log('[HEART 💫 AUDIO] ======== Audio Config ========');
            console.log('  hasAudio:', hasAudio);
            console.log('  hasYt:', hasYt);
            console.log('  ytId:', ytId);
            console.log('  hasNativeAudio:', hasNativeAudio);
            console.log('[HEART 💫 AUDIO] ============================');

            // === YOUTUBE PLAYER SETUP ===
            if (hasYt && hasAudio) {
                console.log('[HEART 💫 AUDIO] YouTube configuration detected');
                
                function createYouTubePlayer() {
                    console.log('[HEART 💫 AUDIO] Creating YouTube player...');
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
                                    console.log('[HEART 💫 AUDIO] YT Player Ready!');
                                    isYtReady = true;
                                    if (toggle) toggle.textContent = '▶';
                                },
                                'onStateChange': function(event) {
                                    if (!toggle) return;
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        toggle.textContent = '||';
                                        isPlaying = true;
                                    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                                        toggle.textContent = '▶';
                                        isPlaying = false;
                                    }
                                },
                                'onError': function(event) {
                                    console.error('[HEART 💫 AUDIO] YT Player Error:', event.data);
                                }
                            }
                        });
                    } catch (err) {
                        console.error('[HEART 💫 AUDIO] Error creating YT player:', err);
                    }
                }
                
                // Check if YouTube API is already loaded
                if (typeof YT !== 'undefined' && YT.Player) {
                    console.log('[HEART 💫 AUDIO] YT API already loaded, creating player immediately');
                    createYouTubePlayer();
                } else {
                    console.log('[HEART 💫 AUDIO] YT API not loaded yet, setting up callback');
                    const tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(tag);
                    
                    window.onYouTubeIframeAPIReady = function() {
                        console.log('[HEART 💫 AUDIO] YouTube API Ready callback fired');
                        createYouTubePlayer();
                    };
                }
            }

            // === WALL CLICK / APP INITIALIZATION ===
            window.initApp = function() {
                console.log('[HEART 💫 AUDIO] initApp() called');
                
                const wall = document.getElementById('wall');
                if (wall) wall.classList.add('hide');

                // Confetti
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#ff4d94', '#ff00ff', '#ffd700']
                    });
                }

                // Show Drive link if available
                const driveUrl = "{{drive_folder}}";
                if (driveUrl && !driveUrl.includes('{{') && driveUrl.length > 5) {
                    const driveSection = document.getElementById('drive-section');
                    if (driveSection) driveSection.style.display = 'block';
                }

                // Setup audio if enabled
                if (hasAudio) {
                    if (controls) controls.style.display = 'flex';
                    
                    // Try YouTube
                    if (hasYt) {
                        console.log('[HEART 💫 AUDIO] YouTube detected, attempting playback...');
                        
                        if (isYtReady && ytPlayer && ytPlayer.playVideo) {
                            console.log('[HEART 💫 AUDIO] YT Player ready, starting playback now');
                            try {
                                ytPlayer.playVideo();
                                isPlaying = true;
                                if (toggle) toggle.textContent = '||';
                            } catch (err) {
                                console.error('[HEART 💫 AUDIO] Error playing YouTube:', err);
                            }
                        } else {
                            console.log('[HEART 💫 AUDIO] YT Player not ready yet, waiting...');
                            
                            let attempts = 0;
                            const maxAttempts = 20;
                            const retryInterval = setInterval(function() {
                                attempts++;
                                console.log('[HEART 💫 AUDIO] Retry attempt', attempts, '- isYtReady:', isYtReady);
                                
                                if (isYtReady && ytPlayer && ytPlayer.playVideo) {
                                    console.log('[HEART 💫 AUDIO] YT Player NOW ready! Starting playback');
                                    clearInterval(retryInterval);
                                    try {
                                        ytPlayer.playVideo();
                                        isPlaying = true;
                                        if (toggle) toggle.textContent = '||';
                                    } catch (err) {
                                        console.error('[HEART 💫 AUDIO] Error playing YouTube after retry:', err);
                                    }
                                } else if (attempts >= maxAttempts) {
                                    console.error('[HEART 💫 AUDIO] YouTube player failed to load after', maxAttempts, 'attempts');
                                    clearInterval(retryInterval);
                                }
                            }, 500);
                        }
                    }
                    // Try Native Audio
                    else if (hasNativeAudio && player && player.src) {
                        console.log('[HEART 💫 AUDIO] Starting native audio playback...');
                        player.play()
                            .then(() => {
                                console.log('[HEART 💫 AUDIO] Native audio playing');
                                isPlaying = true;
                                if (toggle) toggle.textContent = '||';
                            })
                            .catch(err => {
                                console.log('[HEART 💫 AUDIO] Native audio blocked:', err.message);
                            });
                    }
                }
            };

            // === PLAY/PAUSE TOGGLE ===
            if (toggle) {
                toggle.onclick = function() {
                    console.log('[HEART 💫 AUDIO] Toggle clicked');
                    
                    if (hasYt && ytPlayer && isYtReady) {
                        try {
                            const state = ytPlayer.getPlayerState();
                            if (state === YT.PlayerState.PLAYING) {
                                ytPlayer.pauseVideo();
                                isPlaying = false;
                                toggle.textContent = '▶';
                            } else {
                                ytPlayer.playVideo();
                                isPlaying = true;
                                toggle.textContent = '||';
                            }
                        } catch (err) {
                            console.error('[HEART 💫 AUDIO] Error toggling YT:', err);
                        }
                    } else if (player) {
                        if (player.paused) {
                            player.play()
                                .then(() => {
                                    isPlaying = true;
                                    toggle.textContent = '||';
                                })
                                .catch(err => console.log('Play error:', err));
                        } else {
                            player.pause();
                            isPlaying = false;
                            toggle.textContent = '▶';
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
                    timeDisplay.textContent = min + ':' + (sec < 10 ? '0' + sec : sec);
                };
            }

            // === YOUTUBE PROGRESS UPDATE ===
            setInterval(function() {
                if (hasYt && ytPlayer && isYtReady && ytPlayer.getCurrentTime && isPlaying) {
                    try {
                        const curr = ytPlayer.getCurrentTime();
                        const dur = ytPlayer.getDuration();
                        if (audioBar && timeDisplay && dur > 0) {
                            const progress = (curr / dur) * 100;
                            audioBar.style.width = progress + '%';
                            const min = Math.floor(curr / 60);
                            const sec = Math.floor(curr % 60);
                            timeDisplay.textContent = min + ':' + (sec < 10 ? '0' + sec : sec);
                        }
                    } catch (err) {
                        // Ignore errors if player not ready
                    }
                }
            }, 1000);

            // === PROGRESS BAR CLICK (SEEK) ===
            if (progressArea) {
                progressArea.onclick = function(e) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    
                    if (hasYt && ytPlayer && isYtReady) {
                        try {
                            ytPlayer.seekTo(pct * ytPlayer.getDuration());
                        } catch (err) {
                            console.error('[HEART 💫 AUDIO] Seek error:', err);
                        }
                    } else if (player) {
                        player.currentTime = pct * player.duration;
                    }
                };
            }

            console.log('[HEART 💫 AUDIO] Script initialized. Click the heart to start!');
        })();
    </script>
</body>
</html>`;
