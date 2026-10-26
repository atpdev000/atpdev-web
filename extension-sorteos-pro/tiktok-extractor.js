// tiktok-extractor.js — Extractor de alta precisión para TikTok (Videos)
(function () {
  async function performExtraction(options = {}) {
    const expectedCount = options.expectedCount || 0;

    // Crear banner visual flotante en la pestaña de TikTok
    let banner = document.getElementById('sorteos-pro-live-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sorteos-pro-live-banner';
      banner.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 2147483647;
        background: linear-gradient(135deg, #000000, #25f4ee, #fe2c55);
        color: #ffffff;
        padding: 16px 22px;
        border-radius: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 14px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <div style="width: 10px; height: 10px; border-radius: 50%; background: #25f4ee; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <span>⚡ Sorteos Pro: Sincronizando comentarios de TikTok...</span>
    `;

    const list = [];
    const seen = new Set();

    // 0. Método Ultra-Rápido: Extracción directa vía API interna autenticada desde la pestaña de TikTok
    const idMatch = location.pathname.match(/(?:video|photo)\/(\d+)/) || location.href.match(/\/(\d{15,})/);
    const awemeId = idMatch ? idMatch[1] : null;

    if (awemeId) {
      try {
        let cursor = 0;
        let hasMore = true;
        let apiSuccess = false;
        const pendingReplies = [];

        for (let p = 0; p < 60 && hasMore; p++) {
          const apiUrl = `/api/comment/list/?aid=1988&aweme_id=${encodeURIComponent(awemeId)}&count=50&cursor=${cursor}`;
          const res = await fetch(apiUrl, { credentials: 'include' });
          if (!res.ok) break;
          const data = await res.json();
          const comments = Array.isArray(data.comments) ? data.comments : [];
          if (comments.length > 0) apiSuccess = true;

          for (const c of comments) {
            const cid = c.cid || c.aweme_id;
            const user = (c.user?.unique_id || c.user?.nickname || 'usuario_tiktok').replace(/^@/, '');
            const text = c.text || '';
            const key = `${user.toLowerCase()}:${text.toLowerCase()}`;
            if (!seen.has(key)) {
              seen.add(key);
              list.push({
                id: `tt-ext-${cid}-${list.length + 1}`,
                username: user,
                commentText: text,
                timestamp: c.create_time ? new Date(c.create_time * 1000).toISOString() : new Date().toISOString(),
                isEligible: true,
                network: 'tiktok',
              });
            }

            // Respuestas incrustadas
            const replies = Array.isArray(c.reply_comment) ? c.reply_comment : [];
            for (const r of replies) {
              const rUser = (r.user?.unique_id || r.user?.nickname || 'usuario_tiktok').replace(/^@/, '');
              const rText = r.text || '';
              const rKey = `${rUser.toLowerCase()}:${rText.toLowerCase()}`;
              if (!seen.has(rKey)) {
                seen.add(rKey);
                list.push({
                  id: `tt-ext-rep-${r.cid || list.length + 1}`,
                  username: rUser,
                  commentText: rText,
                  timestamp: r.create_time ? new Date(r.create_time * 1000).toISOString() : new Date().toISOString(),
                  isEligible: true,
                  network: 'tiktok',
                });
              }
            }

            const repTot = c.reply_comment_total || c.reply_count || 0;
            if (repTot > replies.length && cid) {
              pendingReplies.push(String(cid));
            }
          }

          banner.innerHTML = `
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #25f4ee;"></div>
            <span>⚡ Sorteos Pro: ${list.length} comentarios reales de TikTok...</span>
          `;

          try {
            chrome.runtime.sendMessage({
              action: 'EXTRACTION_PROGRESS',
              count: list.length,
              platform: 'tiktok',
            });
          } catch {}

          if (!data.has_more || comments.length === 0) {
            hasMore = false;
            break;
          }
          cursor = data.cursor || (cursor + 50);
        }

        // Sub-hilos de respuestas
        if (pendingReplies.length > 0) {
          const batch = pendingReplies.slice(0, 60);
          await Promise.allSettled(
            batch.map(async (cid) => {
              try {
                let rCursor = 0;
                let rHasMore = true;
                for (let rp = 0; rp < 4 && rHasMore; rp++) {
                  const rUrl = `/api/comment/list/reply/?aid=1988&comment_id=${encodeURIComponent(cid)}&item_id=${encodeURIComponent(awemeId)}&count=50&cursor=${rCursor}`;
                  const rRes = await fetch(rUrl, { credentials: 'include' });
                  if (!rRes.ok) break;
                  const rData = await rRes.json();
                  const rList = Array.isArray(rData.comments) ? rData.comments : [];
                  for (const r of rList) {
                    const rUser = (r.user?.unique_id || r.user?.nickname || 'usuario_tiktok').replace(/^@/, '');
                    const rText = r.text || '';
                    const rKey = `${rUser.toLowerCase()}:${rText.toLowerCase()}`;
                    if (!seen.has(rKey)) {
                      seen.add(rKey);
                      list.push({
                        id: `tt-ext-rep-${r.cid || list.length + 1}`,
                        username: rUser,
                        commentText: rText,
                        timestamp: r.create_time ? new Date(r.create_time * 1000).toISOString() : new Date().toISOString(),
                        isEligible: true,
                        network: 'tiktok',
                      });
                    }
                  }
                  if (!rData.has_more || rList.length === 0) break;
                  rCursor = rData.cursor || (rCursor + 50);
                }
              } catch {}
            })
          );
        }

        if (apiSuccess && list.length > 0) {
          try {
            await fetch('http://localhost:3006/api/v1/social/import-live', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postUrl: location.href,
                comments: list,
                count: list.length,
                platform: 'tiktok',
              }),
            });
          } catch {}

          banner.style.background = '#059669';
          banner.innerHTML = `<span>✅ ¡${list.length} comentarios reales de TikTok sincronizados!</span>`;
          setTimeout(() => { if (banner) banner.remove(); }, 3500);

          return { success: true, comments: list, count: list.length };
        }
      } catch (err) {
        console.warn('API fetch inside TikTok failed, continuing to DOM scroll:', err);
      }
    }

    let stagnation = 0;
    let lastSize = 0;
    const maxScrolls = expectedCount > 0 ? Math.max(150, Math.ceil(expectedCount / 5)) : 300;

    // Buscar contenedor con scroll de comentarios en TikTok
    const findScrollContainer = () => {
      const candidates = document.querySelectorAll('div[class*="CommentListContainer"], div[class*="DivCommentListContainer"], div[tabindex="0"]');
      for (const c of candidates) {
        if (c.scrollHeight > c.clientHeight && c.querySelectorAll('[data-e2e*="comment"]').length > 0) {
          return c;
        }
      }
      return null;
    };

    for (let s = 0; s < maxScrolls; s++) {
      // 1. Clic en "Ver respuestas" para desplegar hilos anidados
      const replyButtons = document.querySelectorAll('p[data-e2e="view-more-replies"], div[data-e2e="view-more-replies"]');
      replyButtons.forEach((btn) => {
        try {
          btn.click();
        } catch {
          // noop
        }
      });

      // 2. Extraer comentarios
      const commentItems = document.querySelectorAll('[data-e2e="comment-level-1"], [data-e2e="comment-level-2"], div[class*="DivCommentItemContainer"]');
      commentItems.forEach((item) => {
        const userEl = item.querySelector('[data-e2e*="comment-username"], a[href*="/@"], span[class*="SpanUserName"]');
        const textEl = item.querySelector('p[data-e2e*="comment-level"], span[class*="SpanCommentText"], p[class*="PCommentText"]');
        const timeEl = item.querySelector('span[data-e2e="comment-time"], span[class*="SpanTime"]');

        if (!userEl) return;

        const rawUser = userEl.innerText.replace(/^@/, '').trim();
        if (!rawUser || rawUser.includes('\n') || rawUser.length > 40) return;

        const text = textEl ? textEl.innerText.trim() : 'Comentario en TikTok';
        const key = `${rawUser.toLowerCase()}:${text.toLowerCase()}`;

        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            id: `tt-ext-${Date.now()}-${list.length + 1}`,
            username: rawUser,
            commentText: text,
            timestamp: timeEl ? timeEl.innerText.trim() : new Date().toISOString(),
            isEligible: true,
            network: 'tiktok',
          });
        }
      });

      // Actualizar banner en vivo
      banner.innerHTML = `
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #25f4ee;"></div>
        <span>⚡ Sorteos Pro: ${list.length} comentarios reales de TikTok...</span>
      `;

      // Notificar progreso a Sorteos Pro
      try {
        chrome.runtime.sendMessage({
          action: 'EXTRACTION_PROGRESS',
          count: list.length,
          platform: 'tiktok',
        });
      } catch {
        // noop
      }

      if (expectedCount > 0 && list.length >= expectedCount) {
        break;
      }

      if (list.length === lastSize) {
        stagnation++;
        if (stagnation >= 5) break;
      } else {
        stagnation = 0;
        lastSize = list.length;
      }

      // Desplazar contenedor o ventana
      const container = findScrollContainer();
      if (container) {
        container.scrollTop += 900;
      } else {
        window.scrollBy(0, 800);
      }

      await new Promise((r) => setTimeout(r, 450));
    }

    // Scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Enviar lote al backend local
    try {
      await fetch('http://localhost:3006/api/v1/social/import-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postUrl: location.href,
          comments: list,
          count: list.length,
          platform: 'tiktok',
        }),
      });

      banner.style.background = '#059669';
      banner.innerHTML = `
        <span>✅ ¡${list.length} comentarios reales de TikTok sincronizados!</span>
      `;
      setTimeout(() => {
        if (banner) banner.remove();
      }, 4000);

      return {
        success: true,
        comments: list,
        count: list.length,
      };
    } catch {
      banner.style.background = '#059669';
      banner.innerHTML = `
        <span>✅ ¡${list.length} comentarios de TikTok listos!</span>
      `;
      setTimeout(() => {
        if (banner) banner.remove();
      }, 4000);

      return {
        success: true,
        comments: list,
        count: list.length,
      };
    }
  }

  // Escuchar mensaje directo desde background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.action === 'EXTRACT_NOW') {
      performExtraction(msg.options || {})
        .then((res) => sendResponse(res))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
  });

  window.__extractTikTokComments = performExtraction;
})();
