export const CHRISTMAS_TREE_PHOTOS_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feliz Navidad 🎄 - {{name}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --christmas-red: #c41e3a;
            --christmas-green: #2e7d32;
            --christmas-gold: #ffd700;
            --bg: #f5f5f0;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: var(--bg);
            font-family: 'Outfit', sans-serif;
            color: #333;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-x: hidden;
            padding: 20px 0 160px 0;
        }

        /* Particles - Ornaments */
        #particles {
            position: fixed; inset: 0; pointer-events: none; z-index: 1;
        }
        .ornament {
            position: absolute; width: 12px; height: 12px; border-radius: 50%;
            opacity: 0.7; animation: float 3s infinite ease-in-out;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 30px;
            z-index: 10;
        }

        .header h1 {
            font-family: 'Mountains of Christmas', cursive;
            font-size: clamp(2rem, 8vw, 3.5rem);
            color: var(--christmas-red);
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            margin-bottom: 10px;
        }

        /* Star at the top */
        .star-top {
            font-size: 60px;
            filter: drop-shadow(0 0 15px var(--christmas-gold));
            animation: rotateStar 4s infinite linear;
            display: inline-block;
            margin-bottom: 20px;
        }
        @keyframes rotateStar {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
        }

        /* Tree Container */
        .tree-container {
            position: relative;
            width: 380px;
            height: 550px;
            margin-top: 20px;
            z-index: 10;
        }

        .tree-item {
            position: absolute;
            border-radius: 12px;
            overflow: hidden;
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
            background: #ddd;
        }
        .tree-item:hover {
            transform: scale(1.08);
            z-index: 100;
            box-shadow: 0 8px 25px rgba(196, 30, 58, 0.4);
        }
        .tree-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .tree-item img.loaded { opacity: 1; }

        /* Info Panel */
        .info-panel {
            margin-top: 60px;
            text-align: center;
            z-index: 10;
            max-width: 90%;
        }
        .recipient {
            font-size: 2.2rem;
            font-weight: 900;
            color: var(--christmas-green);
            margin-bottom: 10px;
            text-shadow: 0 0 15px rgba(46, 125, 50, 0.3);
        }
        .message-box {
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(10px);
            padding: 15px 25px;
            border-radius: 20px;
            border: 2px solid var(--christmas-red);
            font-size: 1.1rem;
            line-height: 1.5;
            color: #333;
        }

        /* Audio Player */
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
            border: 2.5px solid var(--christmas-red);
            display: none;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 1000;
        }

        .audio-play-btn {
            width: 44px; height: 44px;
            background: var(--christmas-red);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; cursor: pointer; flex-shrink: 0;
            font-size: 1.2rem;
        }
        .audio-progress { flex-grow: 1; height: 5px; background: #ffe6e6; border-radius: 10px; position: relative; cursor: pointer; }
        .audio-bar { position: absolute; left: 0; top: 0; height: 100%; background: var(--christmas-red); border-radius: 10px; width: 0%; }
        .audio-time { color: var(--christmas-red); font-weight: 900; font-size: 0.85rem; min-width: 35px; text-align: right; }

        /* Intro Wall */
        #wall {
            position: fixed; inset: 0; background: var(--christmas-green); z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; transition: opacity 1s ease;
        }
        #wall.hide { opacity: 0; pointer-events: none; }
        .gift-icon { font-size: 80px; animation: bounce 1.5s infinite; }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }

        /* Drive Section */
        #drive-section {
            display: none;
            margin-top: 15px;
        }
        #drive-section a {
            color: var(--christmas-green);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: bold;
            border: 2px solid var(--christmas-green);
            padding: 8px 15px;
            border-radius: 50px;
            display: inline-block;
            transition: all 0.3s ease;
        }
        #drive-section a:hover {
            background: var(--christmas-green);
            color: white;
        }

        .sender-info {
            margin-top: 40px;
            margin-bottom: 20px;
        }
        .sender-label {
            font-size: 0.8rem;
            color: rgba(0,0,0,0.5);
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .sender-name {
            font-size: 1.8rem;
            color: var(--christmas-red);
            font-weight: 900;
            text-shadow: 0 0 12px rgba(196, 30, 58, 0.3);
        }
    </style>
</head>
<body>
    <div id="wall" onclick="initApp()">
        <div class="gift-icon">🎁</div>
        <h2 style="margin-top: 2rem; font-weight: 900; color: white; font-family: 'Mountains of Christmas', cursive;">ABRIR REGALO</h2>
        <div style="margin-top: 1rem; color: rgba(255,255,255,0.8); letter-spacing: 5px; font-size: 0.8rem;">TOCA PARA COMENZAR</div>
    </div>

    <div id="particles"></div>

    <div class="header">
        <div class="star-top">⭐</div>
        <h1>🎄 Feliz Navidad, mi amor ❤️</h1>
    </div>

    <div class="tree-container" id="tree-photos">
        <!-- Photos will be injected here -->
    </div>

    <div class="info-panel">
        <div class="recipient">{{name}}</div>
        <div class="message-box">{{message}}</div>
        
        <div id="drive-section">
            <a href="{{drive_folder}}" target="_blank">
                📂 Ver Galería Completa
            </a>
        </div>

        <div class="sender-info">
            <div class="sender-label">Enviado por:</div>
            <div class="sender-name">{{sender}}</div>
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
            
            // === PHOTO CONFIGURATION ===
            const PHOTOS_IN_TREE = 16; // Christmas tree shape + trunk
            const treeData = [
                // Row 1 - Top (star position, 1 photo)
                { t: 0, l: 155, w: 70, h: 70 },
                // Row 2 - (2 photos)
                { t: 80, l: 90, w: 75, h: 75 },  { t: 80, l: 215, w: 75, h: 75 },
                // Row 3 - (3 photos)
                { t: 170, l: 45, w: 80, h: 80 },  { t: 170, l: 150, w: 80, h: 80 },  { t: 170, l: 255, w: 80, h: 80 },
                // Row 4 - (4 photos)
                { t: 270, l: 10, w: 75, h: 75 },  { t: 270, l: 100, w: 75, h: 75 },  { t: 270, l: 190, w: 75, h: 75 },  { t: 270, l: 280, w: 75, h: 75 },
                // Row 5 - Bottom (4 photos)
                { t: 370, l: 10, w: 80, h: 80 },  { t: 370, l: 105, w: 80, h: 80 },  { t: 370, l: 200, w: 80, h: 80 },  { t: 370, l: 295, w: 80, h: 80 },
                // Row 6 - Trunk (2 photos)
                { t: 465, l: 110, w: 75, h: 75 }, { t: 465, l: 195, w: 75, h: 75 }
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

            const hasPhotos = availablePhotos.length > 0;

            // Generate tree photos
            const container = document.getElementById('tree-photos');
            for(let i=0; i<PHOTOS_IN_TREE; i++) {
                const config = treeData[i];
                const div = document.createElement('div');
                div.className = 'tree-item';
                div.style.top = config.t + 'px';
                div.style.left = config.l + 'px';
                div.style.width = config.w + 'px';
                div.style.height = config.h + 'px';
                div.style.transitionDelay = (i * 0.05) + 's';
                
                if (hasPhotos) {
                    const img = document.createElement('img');
                    const photoIdx = i % availablePhotos.length;
                    img.src = availablePhotos[photoIdx];
                    img.onload = () => img.classList.add('loaded');
                    div.appendChild(img);
                } else {
                    div.style.background = "rgba(196, 30, 58, 0.2)";
                }
                
                container.appendChild(div);
            }

            // === ORNAMENTS (Particles) ===
            const partBox = document.getElementById('particles');
            const colors = ['#c41e3a', '#ffd700', '#2e7d32', '#ff6b6b', '#4ecdc4'];
            for(let i=0; i<50; i++) {
                const ornament = document.createElement('div');
                ornament.className = 'ornament';
                ornament.style.left = Math.random() * 100 + 'vw';
                ornament.style.top = Math.random() * 100 + 'vh';
                ornament.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                ornament.style.animationDelay = Math.random() * 3 + 's';
                partBox.appendChild(ornament);
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

            console.log('[CHRISTMAS 🎄 AUDIO] ======== Audio Config ========');
            console.log('  hasAudio:', hasAudio);
            console.log('  hasYt:', hasYt);
            console.log('  ytId:', ytId);
            console.log('  hasNativeAudio:', hasNativeAudio);
            console.log('[CHRISTMAS 🎄 AUDIO] ============================');

            // === YOUTUBE PLAYER SETUP ===
            if (hasYt && hasAudio) {
                console.log('[CHRISTMAS 🎄 AUDIO] YouTube configuration detected');
                
                function createYouTubePlayer() {
                    console.log('[CHRISTMAS 🎄 AUDIO] Creating YouTube player...');
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
                                    console.log('[CHRISTMAS 🎄 AUDIO] YT Player Ready!');
                                    isYtReady = true;
                                    if (toggle) toggle.textContent = '▶';
                                },
                                'onStateChange': function(event) {
                                    if (!toggle) return;
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        toggle.textContent = '⏸';
                                        isPlaying = true;
                                    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                                        toggle.textContent = '▶';
                                        isPlaying = false;
                                    }
                                },
                                'onError': function(event) {
                                    console.error('[CHRISTMAS 🎄 AUDIO] YT Player Error:', event.data);
                                }
                            }
                        });
                    } catch (err) {
                        console.error('[CHRISTMAS 🎄 AUDIO] Error creating YT player:', err);
                    }
                }
                
                // Check if YouTube API is already loaded
                if (typeof YT !== 'undefined' && YT.Player) {
                    console.log('[CHRISTMAS 🎄 AUDIO] YT API already loaded, creating player immediately');
                    createYouTubePlayer();
                } else {
                    console.log('[CHRISTMAS 🎄 AUDIO] YT API not loaded yet, setting up callback');
                    window.onYouTubeIframeAPIReady = function() {
                        console.log('[CHRISTMAS 🎄 AUDIO] YouTube API Ready callback fired');
                        createYouTubePlayer();
                    };
                }
            }

            // === WALL CLICK / APP INITIALIZATION ===
            window.initApp = function() {
                console.log('[CHRISTMAS 🎄 AUDIO] initApp() called');
                
                const wall = document.getElementById('wall');
                if (wall) wall.classList.add('hide');

                // Confetti
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#c41e3a', '#ffd700', '#2e7d32', '#ff6b6b']
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
                        console.log('[CHRISTMAS 🎄 AUDIO] YouTube detected, attempting playback...');
                        
                        if (isYtReady && ytPlayer && ytPlayer.playVideo) {
                            console.log('[CHRISTMAS 🎄 AUDIO] YT Player ready, starting playback now');
                            try {
                                ytPlayer.playVideo();
                                isPlaying = true;
                                if (toggle) toggle.textContent = '⏸';
                            } catch (err) {
                                console.error('[CHRISTMAS 🎄 AUDIO] Error playing YouTube:', err);
                            }
                        } else {
                            console.log('[CHRISTMAS 🎄 AUDIO] YT Player not ready yet, waiting...');
                            
                            let attempts = 0;
                            const maxAttempts = 20;
                            const retryInterval = setInterval(function() {
                                attempts++;
                                console.log('[CHRISTMAS 🎄 AUDIO] Retry attempt', attempts, '- isYtReady:', isYtReady);
                                
                                if (isYtReady && ytPlayer && ytPlayer.playVideo) {
                                    console.log('[CHRISTMAS 🎄 AUDIO] YT Player NOW ready! Starting playback');
                                    clearInterval(retryInterval);
                                    try {
                                        ytPlayer.playVideo();
                                        isPlaying = true;
                                        if (toggle) toggle.textContent = '⏸';
                                    } catch (err) {
                                        console.error('[CHRISTMAS 🎄 AUDIO] Error playing YouTube after retry:', err);
                                    }
                                } else if (attempts >= maxAttempts) {
                                    console.error('[CHRISTMAS 🎄 AUDIO] YouTube player failed to load after', maxAttempts, 'attempts');
                                    clearInterval(retryInterval);
                                }
                            }, 500);
                        }
                    }
                    // Try Native Audio
                    else if (hasNativeAudio && player && player.src) {
                        console.log('[CHRISTMAS 🎄 AUDIO] Starting native audio playback...');
                        player.play()
                            .then(() => {
                                console.log('[CHRISTMAS 🎄 AUDIO] Native audio playing');
                                isPlaying = true;
                                if (toggle) toggle.textContent = '⏸';
                            })
                            .catch(err => {
                                console.log('[CHRISTMAS 🎄 AUDIO] Native audio blocked:', err.message);
                            });
                    }
                }
            };

            // === PLAY/PAUSE TOGGLE ===
            if (toggle) {
                toggle.onclick = function() {
                    console.log('[CHRISTMAS 🎄 AUDIO] Toggle clicked');
                    
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
                                toggle.textContent = '⏸';
                            }
                        } catch (err) {
                            console.error('[CHRISTMAS 🎄 AUDIO] Error toggling YT:', err);
                        }
                    } else if (player) {
                        if (player.paused) {
                            player.play()
                                .then(() => {
                                    isPlaying = true;
                                    toggle.textContent = '⏸';
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
                            console.error('[CHRISTMAS 🎄 AUDIO] Seek error:', err);
                        }
                    } else if (player) {
                        player.currentTime = pct * player.duration;
                    }
                };
            }

            console.log('[CHRISTMAS 🎄 AUDIO] Script initialized. Click the gift to start!');
        })();
    </script>
</body>
</html>`;
