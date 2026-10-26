// bridge.js — Conecta Sorteos Pro (localhost:3006 / sorteos.pro) con la extensión
(function () {
  // Inyectar marca global en la página
  const injectScript = () => {
    try {
      const script = document.createElement('script');
      script.textContent = `
        window.__SORTEOS_PRO_EXTENSION__ = { version: '1.0.0', ready: true };
        window.dispatchEvent(new CustomEvent('sorteos_pro_extension_loaded', { detail: { version: '1.0.0' } }));
      `;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
    } catch {
      // Ignorar si CSP restringe inline scripts; el atributo en el DOM y postMessage funcionarán
    }
    document.documentElement.setAttribute('data-sorteos-pro-extension', '1.0.0');
    window.postMessage({ type: 'SORTEOS_PRO_PONG', version: '1.0.0' }, '*');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
  } else {
    injectScript();
  }

  // Escuchar mensajes provenientes del background service worker (ej. progreso en vivo)
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.action === 'EXTRACTION_PROGRESS') {
      window.postMessage(
        {
          type: 'SORTEOS_PRO_EXTRACT_PROGRESS',
          count: msg.count || 0,
        },
        '*'
      );
    }
  });

  // Escuchar peticiones desde la web de Sorteos Pro
  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data) return;

    if (event.data.type === 'SORTEOS_PRO_PING') {
      document.documentElement.setAttribute('data-sorteos-pro-extension', '1.0.0');
      window.postMessage({ type: 'SORTEOS_PRO_PONG', version: '1.0.0' }, '*');
      return;
    }

    if (event.data.type === 'SORTEOS_PRO_EXTRACT_REQUEST') {
      const { platform, postUrl, expectedCount } = event.data;
      chrome.runtime.sendMessage(
        {
          action: 'EXTRACT_COMMENTS',
          platform: platform || 'x',
          postUrl: postUrl || '',
          expectedCount: expectedCount || 34,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            window.postMessage(
              {
                type: 'SORTEOS_PRO_EXTRACT_RESPONSE',
                success: false,
                error: chrome.runtime.lastError.message,
              },
              '*'
            );
            return;
          }

          window.postMessage(
            {
              type: 'SORTEOS_PRO_EXTRACT_RESPONSE',
              ...(response || { success: false, error: 'Sin respuesta del extractor' }),
            },
            '*'
          );
        }
      );
    }
  });
})();
