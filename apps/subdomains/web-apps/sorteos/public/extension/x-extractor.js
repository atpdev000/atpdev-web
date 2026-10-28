// x-extractor.js — Extractor de alta precisión para X (Twitter)
(function () {
  // Función para extraer todos los comentarios reales del DOM de X
  async function performExtraction(options = {}) {
    const expectedCount = options.expectedCount || 0;

    // Crear banner visual flotante en la pestaña de X
    let banner = document.getElementById('sorteos-pro-live-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sorteos-pro-live-banner';
      banner.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 2147483647;
        background: linear-gradient(135deg, #10b981, #059669);
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
      <span>⚡ Sorteos Pro: Sincronizando respuestas reales en vivo...</span>
    `;

    // Detectar el ID del tweet principal para excluirlo de la lista de respuestas
    const mainMatch = location.pathname.match(/(?:status|statuses)\/(\d+)/i);
    const mainTweetId = mainMatch ? mainMatch[1] : null;

    const list = [];
    const seen = new Set();
    let stagnation = 0;
    let lastSize = 0;

    const maxScrolls = 35;

    for (let s = 0; s < maxScrolls; s++) {
      // 1. Intentar hacer clic en cualquier botón de "Mostrar respuestas" o "Show replies"
      const buttons = document.querySelectorAll('div[role="button"], button');
      buttons.forEach((btn) => {
        const txt = btn.innerText || '';
        if (
          txt.includes('Mostrar respuestas') ||
          txt.includes('Mostrar más respuestas') ||
          txt.includes('Show replies') ||
          txt.includes('Show more replies') ||
          txt.includes('Descubrir más')
        ) {
          try {
            btn.click();
          } catch {
            // noop
          }
        }
      });

      // 2. Extraer artículos de respuestas del DOM
      const articles = document.querySelectorAll('article');

      articles.forEach((art) => {
        const userEl = art.querySelector('[data-testid="User-Name"]');
        const textEl = art.querySelector('[data-testid="tweetText"]');
        const timeEl = art.querySelector('time');

        if (!userEl) return;

        // Ignorar el tweet principal de forma infalible
        const timeLink = timeEl ? timeEl.closest('a') : null;
        if (timeLink && mainTweetId && timeLink.getAttribute('href')?.includes(mainTweetId)) {
          return;
        }

        // Extraer nombre de usuario (@handle)
        const matchHandle = userEl.innerText.match(/@([a-zA-Z0-9_]{1,15})\b/);
        const handle = matchHandle ? matchHandle[1] : '';

        // Extraer nombre público
        const lines = userEl.innerText.split('\n').map((l) => l.trim()).filter(Boolean);
        const name = lines.length > 0 && !lines[0].startsWith('@') ? lines[0] : handle;

        const commentText = textEl ? textEl.innerText.trim() : 'Respuesta en X';
        const timestamp = timeEl ? timeEl.getAttribute('datetime') || new Date().toISOString() : new Date().toISOString();

        if (handle) {
          const key = handle.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              id: `x-real-${handle}-${list.length + 1}`,
              username: handle,
              name: name,
              commentText: commentText,
              timestamp: timestamp,
              isEligible: true,
              network: 'x',
            });
          }
        }
      });

      const spanText = banner.querySelector('span');
      if (spanText) {
        spanText.innerText = `⚡ Sorteos Pro: ${list.length}${expectedCount > 0 ? ` / ${expectedCount}` : ''} respuestas reales extraídas...`;
      }

      // Notificar progreso a la extensión y a Sorteos Pro
      try {
        chrome.runtime.sendMessage({
          action: 'EXTRACTION_PROGRESS',
          count: list.length,
        }).catch(() => {});
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

      window.scrollBy(0, 1000);
      await new Promise((r) => setTimeout(r, stagnation > 0 ? 700 : 400));
    }

    // Regresar al inicio suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Enviar también al endpoint de Sorteos Pro en segundo plano
    try {
      const endpoint = `${options.backendOrigin || 'http://localhost:3006'}/api/v1/social/import-live`;
      await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postUrl: location.href,
          comments: list,
          count: list.length,
          handle: '@NACHOAT00',
        }),
      });
    } catch {
      // noop
    }

    banner.style.background = 'linear-gradient(135deg, #059669, #047857)';
    banner.innerHTML = `<span>✅ ¡${list.length} respuestas 100% reales enviadas a Sorteos Pro!</span>`;
    setTimeout(() => {
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 400);
    }, 3500);

    return {
      success: true,
      count: list.length,
      comments: list,
      postUrl: location.href,
    };
  }

  // Escuchar mensajes de background.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'EXTRACT_NOW') {
      performExtraction(request.options || {}).then(sendResponse);
      return true; // Asíncrono
    }
  });

  // Exponer método en window para pruebas
  window.__extractSorteosPro = performExtraction;
})();
