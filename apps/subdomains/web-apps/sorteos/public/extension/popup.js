document.addEventListener('DOMContentLoaded', async () => {
  const badge = document.getElementById('badge');
  const tabInfo = document.getElementById('tab-info');
  const btn = document.getElementById('extract-btn');

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let detectedPlatform = null;
  let extractorScript = 'x-extractor.js';

  if (activeTab && activeTab.url) {
    if (activeTab.url.includes('x.com') || activeTab.url.includes('twitter.com')) {
      detectedPlatform = 'x';
      extractorScript = 'x-extractor.js';
      badge.innerText = 'Pestaña de X Detectada';
      badge.style.background = 'rgba(59, 130, 246, 0.2)';
      badge.style.color = '#60a5fa';
      badge.style.borderColor = 'rgba(59, 130, 246, 0.3)';
      tabInfo.innerText = 'Estás en una publicación de X. Pulsa el botón para extraer todos los comentarios reales y enviarlos a Sorteos Pro.';
      btn.innerText = '⚡ Extraer Comentarios de X';
      btn.disabled = false;
    } else if (activeTab.url.includes('instagram.com')) {
      detectedPlatform = 'instagram';
      extractorScript = 'ig-extractor.js';
      badge.innerText = 'Pestaña de Instagram Detectada';
      badge.style.background = 'rgba(236, 72, 153, 0.2)';
      badge.style.color = '#f472b6';
      badge.style.borderColor = 'rgba(236, 72, 153, 0.3)';
      tabInfo.innerText = 'Estás en una publicación o Reel de Instagram. Pulsa el botón para extraer los comentarios reales directamente.';
      btn.innerText = '⚡ Extraer Comentarios de Instagram';
      btn.disabled = false;
    } else if (activeTab.url.includes('tiktok.com')) {
      detectedPlatform = 'tiktok';
      extractorScript = 'tiktok-extractor.js';
      badge.innerText = 'Pestaña de TikTok Detectada';
      badge.style.background = 'rgba(37, 244, 238, 0.2)';
      badge.style.color = '#25f4ee';
      badge.style.borderColor = 'rgba(37, 244, 238, 0.3)';
      tabInfo.innerText = 'Estás en un video de TikTok. Pulsa el botón para extraer los comentarios reales en vivo.';
      btn.innerText = '⚡ Extraer Comentarios de TikTok';
      btn.disabled = false;
    } else if (activeTab.url.includes('localhost:3006') || activeTab.url.includes('sorteos.pro')) {
      badge.innerText = 'Sorteos Pro Activo';
      tabInfo.innerText = 'La extensión está vinculada con Sorteos Pro. Puedes usar el botón «Extraer en 1 Clic» directamente desde la web.';
      btn.innerText = '✅ Extensión Conectada';
      btn.disabled = true;
    } else {
      badge.innerText = 'Pestaña no compatible';
      badge.style.background = 'rgba(239, 68, 68, 0.2)';
      badge.style.color = '#f87171';
      badge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      tabInfo.innerText = 'Abre una publicación de X, Instagram o TikTok para extraer sus comentarios en 1 clic.';
      btn.disabled = true;
    }
  }

  btn.addEventListener('click', async () => {
    if (!activeTab || !activeTab.id || !detectedPlatform) return;
    btn.disabled = true;
    btn.innerText = '⏳ Extrayendo respuestas...';

    try {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: [extractorScript],
      });

      const response = await chrome.tabs.sendMessage(activeTab.id, {
        action: 'EXTRACT_NOW',
        options: { platform: detectedPlatform },
      });

      if (response && response.success) {
        btn.innerText = `✅ ¡${response.count} Comentarios Extraídos!`;
        tabInfo.innerText = `Se han extraído ${response.count} respuestas reales de ${detectedPlatform.toUpperCase()} y enviado a Sorteos Pro. Vuelve a tu pestaña de sorteo.`;
      } else {
        btn.innerText = '❌ Error al extraer';
        tabInfo.innerText = response?.error || 'No se pudieron extraer los comentarios.';
      }
    } catch (err) {
      btn.innerText = '❌ Error';
      tabInfo.innerText = 'Error: ' + err.message;
    }
  });
});
