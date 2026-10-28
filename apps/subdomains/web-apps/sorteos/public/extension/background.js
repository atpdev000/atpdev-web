// background.js — Service worker de Sorteos Pro Extractor

// Auto-inyectar en pestañas ya abiertas cuando la extensión se instala o recarga
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (!tab.url || !tab.id) continue;
      if (tab.url.includes('localhost:3006') || tab.url.includes('sorteos.pro')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['bridge.js'],
        }).catch(() => {});
      } else if (tab.url.includes('x.com') || tab.url.includes('twitter.com')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['x-extractor.js'],
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('Auto injection on install:', err);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_COMMENTS') {
    handleExtractRequest(request)
      .then(sendResponse)
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Mantener canal asíncrono
  }

  // Retransmitir progreso desde x-extractor a la pestaña de Sorteos Pro
  if (request.action === 'EXTRACTION_PROGRESS') {
    chrome.tabs.query({}).then((tabs) => {
      tabs.forEach((t) => {
        if (t.url && (t.url.includes('localhost:3006') || t.url.includes('127.0.0.1:3006') || t.url.includes('sorteos.pro'))) {
          chrome.tabs.sendMessage(t.id, request).catch(() => {});
        }
      });
    });
  }
});

async function handleExtractRequest(params) {
  const { platform = 'x', postUrl, expectedCount, backendOrigin = 'http://localhost:3006' } = params;

  let scriptFile = 'x-extractor.js';
  let domainCheck = (url) => url.includes('x.com') || url.includes('twitter.com');

  if (platform === 'instagram') {
    scriptFile = 'ig-extractor.js';
    domainCheck = (url) => url.includes('instagram.com');
  } else if (platform === 'threads') {
    scriptFile = 'threads-extractor.js';
    domainCheck = (url) => url.includes('threads.net');
  } else if (platform === 'tiktok') {
    scriptFile = 'tiktok-extractor.js';
    domainCheck = (url) => url.includes('tiktok.com');
  }

  // 1. Extraer cookies de sesión para la plataforma correspondiente
  try {
    if (chrome.cookies) {
      if (platform === 'x') {
        const authTokenCookie = await chrome.cookies.get({ url: 'https://x.com', name: 'auth_token' });
        const ct0Cookie = await chrome.cookies.get({ url: 'https://x.com', name: 'ct0' });
        if (authTokenCookie?.value) {
          fetch(`${backendOrigin}/api/v1/social/import-live`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postUrl,
              cookies: `auth_token=${authTokenCookie.value}; ct0=${ct0Cookie?.value || ''}`,
              authToken: authTokenCookie.value,
              handle: '@NACHOAT00',
              platform: 'x',
            }),
          }).catch(() => {});
        }
      } else if (platform === 'instagram') {
        const sessionCookie = await chrome.cookies.get({ url: 'https://www.instagram.com', name: 'sessionid' });
        const dsUserCookie = await chrome.cookies.get({ url: 'https://www.instagram.com', name: 'ds_user_id' });
        if (sessionCookie?.value) {
          fetch(`${backendOrigin}/api/v1/social/import-live`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postUrl,
              cookies: `sessionid=${sessionCookie.value}; ds_user_id=${dsUserCookie?.value || ''}`,
              authToken: sessionCookie.value,
              platform: 'instagram',
            }),
          }).catch(() => {});
        }
      } else if (platform === 'tiktok') {
        const sessionCookie = await chrome.cookies.get({ url: 'https://www.tiktok.com', name: 'sessionid' });
        const ttwidCookie = await chrome.cookies.get({ url: 'https://www.tiktok.com', name: 'ttwid' });
        if (sessionCookie?.value || ttwidCookie?.value) {
          fetch(`${backendOrigin}/api/v1/social/import-live`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postUrl,
              cookies: `sessionid=${sessionCookie?.value || ''}; ttwid=${ttwidCookie?.value || ''}`,
              authToken: sessionCookie?.value,
              platform: 'tiktok',
            }),
          }).catch(() => {});
        }
      }
    }
  } catch {
    // noop
  }

  // 2. Buscar pestañas abiertas de la plataforma
  const allTabs = await chrome.tabs.query({});
  const cleanUrl = postUrl ? postUrl.replace(/[?#].*$/, '') : '';
  
  let targetTab = cleanUrl
    ? allTabs.find((t) => t.url && t.url.replace(/[?#].*$/, '').includes(cleanUrl))
    : null;

  if (!targetTab) {
    targetTab = allTabs.find((t) => t.url && domainCheck(t.url));
  }

  let createdTabId = null;
  if (!targetTab && postUrl) {
    targetTab = await chrome.tabs.create({ url: postUrl, active: false });
    createdTabId = targetTab.id;
    await waitForTabComplete(targetTab.id);
    await new Promise((r) => setTimeout(r, 2500));
  } else if (targetTab && postUrl && cleanUrl && !targetTab.url.includes(cleanUrl)) {
    targetTab = await chrome.tabs.update(targetTab.id, { url: postUrl });
    await waitForTabComplete(targetTab.id);
    await new Promise((r) => setTimeout(r, 2000));
  }

  if (!targetTab) {
    return { success: false, error: 'No se encontró ninguna pestaña abierta de ' + platform };
  }

  // 3. Ejecutar extracción en la pestaña objetivo
  try {
    const response = await chrome.tabs.sendMessage(targetTab.id, {
      action: 'EXTRACT_NOW',
      options: { expectedCount, platform, backendOrigin },
    });

    if (response) {
      return response;
    }
  } catch {
    // Inyectar el script correspondiente de forma dinámica
    try {
      await chrome.scripting.executeScript({
        target: { tabId: targetTab.id },
        files: [scriptFile],
      });

      const response = await chrome.tabs.sendMessage(targetTab.id, {
        action: 'EXTRACT_NOW',
        options: { expectedCount, platform, backendOrigin },
      });

      return response || { success: true, count: 0 };
    } catch (injErr) {
      return { success: false, error: 'No se pudo comunicar con la pestaña de ' + platform + ': ' + injErr.message };
    }
  }

  return { success: false, error: 'La pestaña de ' + platform + ' no devolvió comentarios.' };
}

function waitForTabComplete(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(id, info) {
      if (id === tabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(null);
      }
    });
  });
}
