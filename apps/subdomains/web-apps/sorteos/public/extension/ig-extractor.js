// ig-extractor.js — Extractor de alta precisión para Instagram (Posts & Reels)
(function () {
  async function performExtraction(options = {}) {
    const expectedCount = options.expectedCount || 0;

    // Crear banner visual flotante en la pestaña de Instagram
    let banner = document.getElementById('sorteos-pro-live-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sorteos-pro-live-banner';
      banner.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 2147483647;
        background: linear-gradient(135deg, #e1306c, #fd1d1d, #f56040);
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
      <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <span>⚡ Sorteos Pro: Sincronizando comentarios de Instagram...</span>
    `;

    // Detectar autor del post para distinguirlo de las respuestas
    let authorHandle = '';
    const headerUserLink = document.querySelector('header a[href^="/"], article header a');
    if (headerUserLink) {
      authorHandle = headerUserLink.innerText.replace(/^@/, '').trim().toLowerCase();
    }

    const list = [];
    const seen = new Set();
    let stagnation = 0;
    let lastSize = 0;
    const maxScrolls = 40;

    // Buscar el contenedor con scroll de comentarios de Instagram
    const findScrollContainer = () => {
      const allDivs = document.querySelectorAll('article div, div[role="dialog"] div, div[tabindex="-1"] div');
      for (const d of allDivs) {
        const style = window.getComputedStyle(d);
        if (
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          d.scrollHeight > d.clientHeight &&
          d.querySelectorAll('ul, div[role="button"], li').length > 0
        ) {
          return d;
        }
      }
      return null;
    };

    // Si estamos en un Reel y el panel de comentarios aún no está abierto, hacer clic en el botón de comentar
    const commentDrawerBtn = document.querySelector('svg[aria-label="Comentar"], svg[aria-label="Comment"], svg[aria-label="Comentarios"], svg[aria-label="Comments"]')?.closest('button, div[role="button"]');
    if (commentDrawerBtn && !document.querySelector('ul, article li, div[role="dialog"] ul')) {
      try {
        commentDrawerBtn.click();
        await new Promise((r) => setTimeout(r, 1000));
      } catch {
        // noop
      }
    }

    const maxScrolls = 60;

    for (let s = 0; s < maxScrolls; s++) {
      // 1. Clic automático en botones de "Ver más comentarios" o "+" o "Cargar más comentarios"
      const buttons = document.querySelectorAll('div[role="button"], button, span[role="button"]');
      buttons.forEach((btn) => {
        const txt = (btn.innerText || '').toLowerCase();
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        if (
          txt.includes('ver más comentarios') ||
          txt.includes('cargar más comentarios') ||
          txt.includes('view more comments') ||
          txt.includes('load more comments') ||
          txt.includes('ver respuestas') ||
          txt.includes('view replies') ||
          aria.includes('cargar más') ||
          aria.includes('load more')
        ) {
          try {
            btn.click();
          } catch {
            // noop
          }
        }
      });

      // 2. Extraer comentarios del DOM
      // En Instagram cada comentario tiene un autor (enlace al perfil) y un span con el texto
      const commentItems = document.querySelectorAll('ul > div, ul > li, article ul div[role="button"], div[role="dialog"] ul li, div[role="dialog"] ul > div, div[tabindex="-1"] ul li, div[role="dialog"] div[role="button"]');
      commentItems.forEach((item) => {
        const userLink = item.querySelector('h3 a, a[role="link"][href^="/"], a[href^="/"]');
        if (!userLink) return;

        const rawUser = userLink.innerText.replace(/^@/, '').trim();
        if (!rawUser || rawUser.includes('\n') || rawUser.length > 30) return;

        // Extraer texto del comentario (excluyendo el nombre de usuario y 'responder')
        const allSpans = Array.from(item.querySelectorAll('span[dir="auto"], span'));
        let commentText = '';
        for (const sp of allSpans) {
          const t = sp.innerText.trim();
          if (
            t &&
            t !== rawUser &&
            !t.toLowerCase().includes('responder') &&
            !t.toLowerCase().includes('reply') &&
            !t.toLowerCase().includes('ver traducción') &&
            !t.toLowerCase().includes('me gusta') &&
            !/^\d+[dshwm]$/i.test(t)
          ) {
            commentText = t;
            break;
          }
        }

        const key = `${rawUser.toLowerCase()}:${(commentText || '').toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            id: `ig-ext-${Date.now()}-${list.length + 1}`,
            username: rawUser,
            commentText: commentText || 'Comentario en Instagram',
            timestamp: new Date().toISOString(),
            isEligible: true,
            network: 'instagram',
          });
        }
      });

      // Actualizar banner en vivo
      banner.innerHTML = `
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff;"></div>
        <span>⚡ Sorteos Pro: ${list.length} comentarios reales de Instagram...</span>
      `;

      // Notificar progreso a Sorteos Pro
      try {
        chrome.runtime.sendMessage({
          action: 'EXTRACTION_PROGRESS',
          count: list.length,
          platform: 'instagram',
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

      // Desplazar contenedor de comentarios o ventana
      const scrollEl = findScrollContainer();
      if (scrollEl) {
        scrollEl.scrollTop += 900;
      } else {
        window.scrollBy(0, 800);
      }

      await new Promise((r) => setTimeout(r, 450));
    }

    // Scroll arriba suave
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Enviar lote al backend local
    try {
      const response = await fetch('http://localhost:3006/api/v1/social/import-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postUrl: location.href,
          comments: list,
          count: list.length,
          platform: 'instagram',
        }),
      });

      banner.style.background = '#059669';
      banner.innerHTML = `
        <span>✅ ¡${list.length} comentarios reales de Instagram sincronizados!</span>
      `;
      setTimeout(() => {
        if (banner) banner.remove();
      }, 4000);

      return {
        success: true,
        comments: list,
        count: list.length,
      };
    } catch (err) {
      banner.style.background = '#059669';
      banner.innerHTML = `
        <span>✅ ¡${list.length} comentarios de Instagram listos!</span>
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

  // Exponer para ejecuciones por consola o bookmarklet
  window.__extractInstagramComments = performExtraction;
})();
