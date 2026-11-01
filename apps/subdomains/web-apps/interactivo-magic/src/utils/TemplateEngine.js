import { saveAs } from 'file-saver';

const TemplateEngine = {
    render: (templateHtml, data) => {
        let finalHtml = templateHtml;
        
        // Dark Mode / White Screen Fix: Force dark color-scheme and background
        const darkModeFix = `
    <meta name="color-scheme" content="dark only">
    <style>
        :root { color-scheme: dark only; }
        html, body { background-color: #000 !important; color: white !important; }
    </style>
        `;
        
        if (finalHtml.includes('</head>')) {
            finalHtml = finalHtml.replace('</head>', darkModeFix + '</head>');
        } else if (finalHtml.includes('<head>')) {
            finalHtml = finalHtml.replace('<head>', '<head>' + darkModeFix);
        }

        // Specific image URL fixing logic
        const fixImageUrl = (url) => {
            if (!url) return '';

            // Google Drive - improved pattern matching
            if (url.includes('drive.google.com')) {
                // Match /d/FILE_ID/view or /d/FILE_ID/edit or /file/d/FILE_ID/
                const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                    url.match(/id=([a-zA-Z0-9_-]+)/);
                if (match) {
                    const fileId = match[1];
                    console.log('[TemplateEngine] Google Drive detected, ID:', fileId);
                    // thumbnail works best for mixed content, but uc is also common
                    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                }
            }

            // Imgur
            if (url.includes('imgur.com') && !url.includes('i.imgur.com') && !url.endsWith('.jpg') && !url.endsWith('.png')) {
                const id = url.split('/').pop();
                if (id) return `https://i.imgur.com/${id}.jpg`;
            }

            // Pinterest
            if (url.includes('pinterest.com/pin/')) {
                // Pinterest direct images are harder, but often we can guess the format
                // For now, if we can't easily fix it, let it be, but many direct links work.
            }

            // Google Search Image result (redirects)
            if (url.includes('google.com/imgres')) {
                const match = url.match(/imgurl=(.+?)&/);
                if (match) return decodeURIComponent(match[1]);
            }

            // OneDrive
            if (url.includes('onedrive.live.com') && url.includes('embed')) {
                return url.replace('embed', 'download');
            }

            // Google Photos (basic share links are hard to fix, but some work)
            if (url.includes('photos.app.goo.gl')) {
                // These are redirects, can't easily fix without a head request
            }

            return url;
        };

        const extractId = (url, type) => {
            if (!url) return '';
            if (type === 'youtube') {
                if (url.length === 11 && !url.includes('/') && !url.includes('=')) return url;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : '';
            }
            return url;
        };

        const imageSrc = fixImageUrl(data.img || data.imageSrc || '');

        console.log('[TemplateEngine DEBUG] Image data:', {
            dataImg: data.img ? data.img.substring(0, 80) + '...' : 'NONE',
            dataImageSrc: data.imageSrc ? data.imageSrc.substring(0, 80) + '...' : 'NONE',
            finalImageSrc: imageSrc ? imageSrc : 'NONE'
        });

        // Specific audio logic
        const audioSrc = data.audioOption === 'default'
            ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            : (data.audioSrc || data.asrc || '');

        const ytId = (data.audioOption === 'youtube' || data.yt)
            ? (data.yt || extractId(data.youtubeUrl, 'youtube'))
            : '';

        // Audio Debug Logging
        console.log('[TemplateEngine 🎵 AUDIO DEBUG] ========');
        console.log('  hasAudio:', data.hasAudio || data.audio);
        console.log('  audioOption:', data.audioOption);
        console.log('  audioSrc:', audioSrc ? `PRESENT (${audioSrc.substring(0, 50)}...)` : 'MISSING');
        console.log('  ytId:', ytId || 'NONE');
        console.log('  youtubeUrl:', data.youtubeUrl || 'NONE');
        console.log('  rawYt:', data.yt || 'NONE');
        console.log('[TemplateEngine 🎵 AUDIO DEBUG] ========');

        // Standard variable replacement
        finalHtml = finalHtml
            .replace(/{{name}}/g, data.name || '')
            .replace(/{{sender}}/g, data.sender || '')
            .replace(/{{message}}/g, data.message || '');

        console.log('[TemplateEngine] === IMAGE DEBUG START ===');
        console.log('[TemplateEngine] data.img:', data.img);
        console.log('[TemplateEngine] data.imageSrc:', data.imageSrc);
        console.log('[TemplateEngine] data.hasImage:', data.hasImage);
        console.log('[TemplateEngine] Final imageSrc:', imageSrc);
        console.log('[TemplateEngine] === IMAGE DEBUG END ===');

        finalHtml = finalHtml
            .replace(/{{\s*audio_src\s*}}/g, audioSrc)
            .replace(/{{\s*youtube_id\s*}}/g, ytId || '')
            .replace(/{{\s*audio_display\s*}}/g, (data.hasAudio || data.audio) ? 'block' : 'none')
            .replace(/{{\s*imagen_src\s*}}/g, imageSrc)
            .replace(/{{\s*image_src\s*}}/g, imageSrc)
            .replace(/{{\s*image_display\s*}}/g, (imageSrc || data.img) ? 'block' : 'none')
            .replace(/{{\s*has_audio\s*}}/g, (data.hasAudio || data.audio) ? 'true' : 'false')
            .replace(/{{extra_text}}/g, data.extraText || data.et || '')
            .replace(/{{extra}}/g, data.extraText || data.et || '')
            .replace(/{{extra_text_2}}/g, data.extraText2 || data.et2 || '')
            .replace(/{{extra_display}}/g, (data.extraText || data.et) ? 'block' : 'none')
            .replace(/{{start_date}}/g, data.startDate || data.sd || '')
            // Variables de Vitaminas Amor
            .replace(/{{vitamina_a_text}}/g, data.vitamina_a_text || data.va_text || data.va_t || '')
            .replace(/{{vitamina_a_msg}}/g, data.vitamina_a_msg || data.va_msg || data.va_m || '')
            .replace(/{{vitamina_a_emoji}}/g, data.vitamina_a_emoji || data.va_emoji || data.va_e || '')
            .replace(/{{vitamina_a_img}}/g, fixImageUrl(data.vitamina_a_img || data.va_img || data.va_i || ''))
            .replace(/{{vitamina_a_img_display}}/g, (data.vitamina_a_img || data.va_img || data.va_i) ? 'block' : 'none')

            .replace(/{{vitamina_b_text}}/g, data.vitamina_b_text || data.vb_text || data.vb_t || '')
            .replace(/{{vitamina_b_msg}}/g, data.vitamina_b_msg || data.vb_msg || data.vb_m || '')
            .replace(/{{vitamina_b_emoji}}/g, data.vitamina_b_emoji || data.vb_emoji || data.vb_e || '')
            .replace(/{{vitamina_b_img}}/g, fixImageUrl(data.vitamina_b_img || data.vb_img || data.vb_i || ''))
            .replace(/{{vitamina_b_img_display}}/g, (data.vitamina_b_img || data.vb_img || data.vb_i) ? 'block' : 'none')

            .replace(/{{vitamina_c_text}}/g, data.vitamina_c_text || data.vc_text || data.vc_t || '')
            .replace(/{{vitamina_c_msg}}/g, data.vitamina_c_msg || data.vc_msg || data.vc_m || '')
            .replace(/{{vitamina_c_emoji}}/g, data.vitamina_c_emoji || data.vc_emoji || data.vc_e || '')
            .replace(/{{vitamina_c_img}}/g, fixImageUrl(data.vitamina_c_img || data.vc_img || data.vc_i || ''))
            .replace(/{{vitamina_c_img_display}}/g, (data.vitamina_c_img || data.vc_img || data.vc_i) ? 'block' : 'none')

            .replace(/{{vitamina_d_text}}/g, data.vitamina_d_text || data.vd_text || data.vd_t || '')
            .replace(/{{vitamina_d_msg}}/g, data.vitamina_d_msg || data.vd_msg || data.vd_m || '')
            .replace(/{{vitamina_d_emoji}}/g, data.vitamina_d_emoji || data.vd_emoji || data.vd_e || '')
            .replace(/{{vitamina_d_img}}/g, fixImageUrl(data.vitamina_d_img || data.vd_img || data.vd_i || ''))
            .replace(/{{vitamina_d_img_display}}/g, (data.vitamina_d_img || data.vd_img || data.vd_i) ? 'block' : 'none')

            // Tarjeta Futbolista ⚽
            .replace(/{{sc_rating}}/g, data.soccer_rating || data.sr || '82')
            .replace(/{{sc_pos}}/g, data.soccer_pos || data.sp || 'ST')
            .replace(/{{sc_name}}/g, data.soccer_name || data.sn || 'Messi')
            .replace(/{{sc_info}}/g, data.soccer_info || data.si || '')
            .replace(/{{sc_flag}}/g, data.soccer_flag || data.sf || '')
            .replace(/{{sc_pac}}/g, data.soccer_pac || data.sa || '0')
            .replace(/{{sc_sho}}/g, data.soccer_sho || data.ss || '0')
            .replace(/{{sc_pas}}/g, data.soccer_pas || data.sl || '0')
            .replace(/{{sc_dri}}/g, data.soccer_dri || data.sdr || '0')
            .replace(/{{sc_def}}/g, data.soccer_def || data.se || '0')
            .replace(/{{sc_phy}}/g, data.soccer_phy || data.sy || '0')
            .replace(/{{sc_img}}/g, fixImageUrl(data.img || data.imageSrc || ''))
            .replace(/{{drive_folder}}/g, data.driveFolderUrl || '');

        // Dynamic Items logic (for books and mosaics)
        const itemsList = data.items || data.it;
        console.log('[TemplateEngine 📸 ITEMS DEBUG]', {
            hasItems: !!itemsList,
            itemsCount: itemsList?.length || 0,
            firstItemType: itemsList?.[0]?.type,
            firstItemPreview: itemsList?.[0]?.content?.substring(0, 50)
        });

        if (itemsList && Array.isArray(itemsList)) {
            itemsList.forEach((item, idx) => {
                const url = fixImageUrl(item.content || '');
                console.log(`[TemplateEngine 📸] Replacing {{item_${idx}_url}} with: ${url.substring(0, 60)}...`);
                const itemRegex = new RegExp(`{{item_${idx}_url}}`, 'g');
                finalHtml = finalHtml.replace(itemRegex, url);

                // Fallback for generic item_N
                const genericRegex = new RegExp(`{{item_${idx}}}`, 'g');
                finalHtml = finalHtml.replace(genericRegex, url);
            });
        }

        const tid = data.t || data.templateId;
        const isBookWithStatic = (tid === 'marvel-book' || tid === 'book-love');
        let itemsOffset = data.pageOffset ? parseInt(data.pageOffset) : (isBookWithStatic ? 3 : 2);

        // Book Love now has 4 fixed faces separated into 4 physical pages
        if (tid === 'book-love' && !data.pageOffset) {
            itemsOffset = 5;
        }

        if (data.items && Array.isArray(data.items)) {
            let dynamicHtml = '';
            let firstItemHtml = '';

            data.items.forEach((item, index) => {
                let itemHtml = '';
                if (item.type === 'image') {
                    const frameClass = (data.t === 'marvel-book' || data.templateId === 'marvel-book') ? 'pixel-frame' : 'photo-frame';
                    const processedItemSrc = fixImageUrl(item.content || '');
                    itemHtml = `
                        <div class="${frameClass}">
                            <img src="${processedItemSrc || 'https://i.imgur.com/rN7Yv4T.png'}" alt="Foto ${index + 1}">
                        </div>
                    `;
                } else {
                    if (data.t === 'marvel-book' || data.templateId === 'marvel-book') {
                        itemHtml = `<div class="comic-text" style="font-size: 1.3rem; padding: 15px 25px; max-width: 85%; margin: 0 auto;">${item.content || '...'}</div>`;
                    } else {
                        itemHtml = `<p style="font-size: 1.3rem; line-height: 1.6; text-align: center; max-width: 90%; color: #333; margin: 0 auto;">${item.content || '...'}</p>`;
                    }
                }

                if (index === 0 && !isBookWithStatic && !data.pageOffset) {
                    firstItemHtml = itemHtml;
                } else {
                    const actualPageNum = isBookWithStatic || data.pageOffset ? (index + itemsOffset) : (index + 2);

                    dynamicHtml += `
                        <div class="page page${actualPageNum}" id="page${actualPageNum}">
                            <div class="front inner-page">${itemHtml}</div>
                            <div class="back inner-page decorative-back">
                                <div class="logo-back">❤️</div>
                            </div>
                        </div>
                    `;
                }
            });

            finalHtml = finalHtml
                .replace(/{{item_1_content}}/g, firstItemHtml)
                .replace(/{{dynamic_pages}}/g, dynamicHtml);
        } else {
            finalHtml = finalHtml
                .replace(/{{item_1_content}}/g, '')
                .replace(/{{dynamic_pages}}/g, '');
        }

        // Check if we should wrap with Gift Box
        const needsGiftWrap = !finalHtml.includes('id="intro-overlay"') &&
            !finalHtml.includes('id="wall"') &&
            !finalHtml.includes('id="splash-wall"') &&
            !finalHtml.includes('id="welcome-overlay"');

        if (needsGiftWrap) {
            const giftStyle = `
    <style>
        #magic-gift-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            z-index: 99999; display: flex; flex-direction: column;
            justify-content: center; align-items: center; cursor: pointer;
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            color: white; font-family: 'Outfit', sans-serif;
        }
        #magic-gift-overlay.hidden { opacity: 0; pointer-events: none; }
        .gift-emoji { 
            font-size: clamp(5rem, 15vw, 8rem); 
            filter: drop-shadow(0 0 20px rgba(255, 77, 148, 0.5));
            animation: giftBounce 2s infinite ease-in-out;
            display: flex; justify-content: center; align-items: center;
        }
        @keyframes giftBounce {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        .gift-title {
            margin-top: 2rem; font-size: 1.8rem; font-weight: 800;
            background: linear-gradient(135deg, #fff, #ff4d94);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-align: center; padding: 0 20px;
        }
        .gift-hint {
            margin-top: 1rem; color: rgba(255,255,255,0.6);
            letter-spacing: 4px; font-size: 0.9rem; font-weight: 700;
            animation: giftPulse 1.5s infinite;
        }
        @keyframes giftPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
    </style>`;

            const introMap = {
                'birthday': { emoji: '🎂', title: '¡Feliz Cumpleaños!' },
                'birthday-classic': { emoji: '🎂', title: '¡Feliz Cumpleaños!' },
                'christmas-tree': { emoji: '🎄', title: '¡Feliz Navidad!' },
                'new-year': { emoji: '🥂', title: '¡Feliz Año Nuevo!' },
                'pocoyo': { emoji: '🕺', title: '¡A Bailar!' },
                'soccer-card': { emoji: '⚽', title: '¡Tu Ficha Pro!' }
            };

            const config = introMap[data.t] || { emoji: '🎁', title: '¡Tienes un regalo especial!' };
            const introEmoji = config.emoji;
            const introTitle = config.title;

            const giftHtml = `
    <div id="magic-gift-overlay" onclick="openMagicGift()">
        <div class="gift-emoji">${introEmoji}</div>
        <h2 class="gift-title">${introTitle}</h2>
        <div class="gift-hint">TOCA PARA ABRIR ✨</div>
    </div>`;

            finalHtml = finalHtml.replace(/{{template_title}}/g, config.title.toUpperCase());

            const giftScript = `
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        function openMagicGift() {
            const overlay = document.getElementById('magic-gift-overlay');
            if (!overlay) return;
            
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4d94', '#ff00ff', '#ffd700']
            });

            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 1000);

            // 1. Handle specialized template triggers
            if (typeof startApp === 'function') startApp();
            if (typeof openBox === 'function') openBox();
            if (typeof ignite === 'function') ignite();
            
            // 2. Comprehensive Audio Trigger (Native + YouTube)
            const hasAudioSetting = ${(data.hasAudio || data.audio) ? 'true' : 'false'};
            
            const tryPlay = () => {
                if (!hasAudioSetting) return;

                // Try YouTube Global Player (common in project)
                if (window.ytPlayer && typeof window.ytPlayer.playVideo === 'function') {
                    window.ytPlayer.playVideo();
                }
                
                // Try Native Audio Elements
                const audios = [
                    document.getElementById('bg-audio'),
                    document.getElementById('player'),
                    document.getElementById('core-player'),
                    document.querySelector('audio')
                ].filter(Boolean);
                
                audios.forEach(a => {
                    if (a.paused) a.play().catch(e => console.log("Audio play blocked", e));
                });
            };

            tryPlay();
            // Retry once after transition for late-loading players
            setTimeout(tryPlay, 500);
            setTimeout(tryPlay, 1500); // Third attempt for slow networks
        }
    </script>`;

            finalHtml = finalHtml
                .replace('</head>', giftStyle + '</head>')
                .replace('<body>', '<body>' + giftHtml)
                .replace('</body>', giftScript + '</body>');
        }

        // Replace other placeholders
        // Generic replacement for any other variables passed in data
        Object.keys(data).forEach(key => {
            // Skip large/internal keys to avoid performance issues or data corruption
            if (['audioSrc', 'audioFile', 'hasAudio', 'audioOption', 'items', 'it', 'asrc', 'img', 'img2', 'et', 'et2', 'html'].includes(key)) return;
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, data[key]);
        });

        return finalHtml;
    },

    generate: (shareUrl, data) => {
        const redirectorHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mensaje Mágico para ${data.name}</title>
    
    <!-- Open Graph / Meta Social -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="InteractivoMagic | Un mensaje para ${data.name}" />
    <meta property="og:description" content="Haz clic para abrir tu sorpresa interactiva de parte de ${data.sender} ✨" />
    <meta property="og:image" content="https://interactivomagic.ftydownloader.com/og-image.jpg" />

    <style>
        body { 
            background: #0a0514; 
            color: white; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0; 
            text-align: center;
        }
        .container {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            max-width: 400px;
            width: 90%;
        }
        h1 { color: #ff4d94; margin-bottom: 0.5rem; }
        p { color: rgba(255,255,255,0.7); line-height: 1.6; }
        .btn {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 12px 24px;
            background: #ff4d94;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:active { transform: scale(0.95); }
        .loader {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.1);
            border-left-color: #ff4d94;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 1.5rem auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
    <script>
        // Redirect after a short delay to show the nice UI
        setTimeout(() => {
            window.location.href = "${shareUrl}";
        }, 1500);
    </script>
</head>
<body>
    <div class="container">
        <h1>✨ InteractivoMagic ✨</h1>
        <p>Preparando tu sorpresa de parte de <strong>${data.sender}</strong>...</p>
        <div class="loader"></div>
        <p style="font-size: 0.9rem; margin-top: 1rem;">Si no eres redirigido, haz clic en el botón:</p>
        <a href="${shareUrl}" class="btn">Abrir Sorpresa ❤️</a>
    </div>
</body>
</html>`;

        const blob = new Blob([redirectorHtml], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `mensaje-magico-${data.name.replace(/\s+/g, '-').toLowerCase()}.html`);
    }
};

export default TemplateEngine;
