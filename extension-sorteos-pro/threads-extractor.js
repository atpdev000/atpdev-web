// threads-extractor.js — Extractor de alta precisión para Threads (Meta)
(function () {
  async function performExtraction(options = {}) {
    const expectedCount = options.expectedCount || 0;

    let banner = document.getElementById('sorteos-pro-live-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sorteos-pro-live-banner';
      banner.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 2147483647;
        background: linear-gradient(135deg, #000000, #333333);
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
      <span>⚡ Sorteos Pro: Sincronizando respuestas de Threads...</span>
    `;

    // Detectar autor principal
    let authorHandle = '';
    const mainAuthorMatch = location.pathname.match(/@([a-zA-Z0-9_.]+)/);
    if (mainAuthorMatch) {
      authorHandle = mainAuthorMatch[1].toLowerCase();
    }

    const list = [];
    const seen = new Set();
    let stagnation = 0;
    let lastSize = 0;
    const maxScrolls = 40;

    for (let s = 0; s < maxScrolls; s++) {
      // 1. Extraer del DOM de Threads
      const items = document.querySelectorAll('div[data-pressable-container="true"], article, div[data-testid*="thread"]');
      items.forEach((item) => {
        const userLink = item.querySelector('a[href^="/@"], a[role="link"][href*="/@"]');
        if (!userLink) return;

        const rawHref = userLink.getAttribute('href') || '';
        const userMatch = rawHref.match(/@([a-zA-Z0-9_.]+)/) || (userLink.innerText || '').match(/@([a-zA-Z0-9_.]+)/);
        const username = userMatch ? userMatch[1] : userLink.innerText.replace(/^@/, '').trim();

        if (!username || username.length > 30 || username.toLowerCase() === authorHandle) return;

        const spans = Array.from(item.querySelectorAll('span[dir="auto"], span'));
        let text = '';
        for (const sp of spans) {
          const t = (sp.innerText || '').trim();
          if (
            t &&
            t !== username &&
            !t.startsWith('@') &&
            !/^\d+[dshwm]$/i.test(t) &&
            !t.toLowerCase().includes('responder') &&
            !t.toLowerCase().includes('reply')
          ) {
            text = t;
            break;
          }
        }

        const key = `${username.toLowerCase()}:${text.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            id: `threads-ext-${Date.now()}-${list.length + 1}`,
            username,
            commentText: text || 'Respuesta en Threads',
            timestamp: new Date().toISOString(),
            isEligible: true,
            network: 'threads',
          });
        }
      });

      // Notificar progreso
      banner.innerHTML = `
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff;"></div>
        <span>⚡ Sorteos Pro: ${list.length} respuestas de Threads...</span>
      `;

      try {
        chrome.runtime.sendMessage({
          action: 'EXTRACTION_PROGRESS',
          count: list.length,
          platform: 'threads',
        });
      } catch {
        // noop
      }

      if (expectedCount > 0 && list.length >= expectedCount) break;

      if (list.length === lastSize) {
        stagnation++;
        if (stagnation >= 5) break;
      } else {
        stagnation = 0;
        lastSize = list.length;
      }

      window.scrollBy(0, 900);
      await new Promise((r) => setTimeout(r, 450));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Enviar lote al backend
    try {
      await fetch('http://localhost:3006/api/v1/social/import-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postUrl: location.href,
          comments: list,
          count: list.length,
          platform: 'threads',
        }),
      });

      banner.style.background = '#059669';
      banner.innerHTML = `<span>✅ ¡${list.length} respuestas de Threads sincronizadas!</span>`;
      setTimeout(() => { if (banner) banner.remove(); }, 4000);
    } catch {
      banner.style.background = '#059669';
      banner.innerHTML = `<span>✅ ¡${list.length} respuestas de Threads listas!</span>`;
      setTimeout(() => { if (banner) banner.remove(); }, 4000);
    }

    return {
      success: true,
      comments: list,
      count: list.length,
    };
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.action === 'EXTRACT_NOW') {
      performExtraction(msg.options || {})
        .then((res) => sendResponse(res))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
  });

  window.__extractThreadsComments = performExtraction;
})();
