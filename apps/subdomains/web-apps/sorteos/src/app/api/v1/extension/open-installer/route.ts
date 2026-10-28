import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  let extensionPath = 'D:\\PROYECTOS\\atpdev-web\\extension-sorteos-pro';
  if (!fs.existsSync(extensionPath)) {
    extensionPath = path.resolve(process.cwd(), '../../../../extension-sorteos-pro');
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const reqBrowser = typeof body.browser === 'string' ? body.browser.toLowerCase() : '';

  const userAgent = req.headers.get('user-agent') || '';
  const isEdge = reqBrowser.includes('edge') || (!reqBrowser && /Edg\//i.test(userAgent));
  const isOpera = reqBrowser.includes('opera') || (!reqBrowser && /OPR\/|Opera/i.test(userAgent));
  const isBrave = reqBrowser.includes('brave') || (!reqBrowser && /Brave/i.test(userAgent));
  const isFirefox = reqBrowser.includes('firefox') || (!reqBrowser && /Firefox\//i.test(userAgent));
  const isSafari = reqBrowser.includes('safari') || (!reqBrowser && /Safari/i.test(userAgent) && !/Chrome|Chromium|Edg|OPR/i.test(userAgent));

  let browserCmd = 'chrome \'chrome://extensions\'';
  let browserName = 'Google Chrome';

  if (isEdge) {
    browserCmd = 'msedge \'edge://extensions\'';
    browserName = 'Microsoft Edge';
  } else if (isOpera) {
    browserCmd = 'opera \'opera://extensions\'';
    browserName = 'Opera';
  } else if (isBrave) {
    browserCmd = 'brave \'brave://extensions\'';
    browserName = 'Brave';
  } else if (isFirefox) {
    browserCmd = 'firefox \'about:debugging#/runtime/this-firefox\'';
    browserName = 'Mozilla Firefox';
  } else if (isSafari) {
    browserCmd = 'start ""';
    browserName = 'Safari';
  }

  // 1. Abrir la página de extensiones del navegador actual vía PowerShell
  try {
    exec(`powershell -Command "Start-Process ${browserCmd}"`, (err) => {
      if (err) console.warn(`No se pudo abrir ${browserName} automáticamente:`, err);
    });
  } catch {
    // noop
  }

  // 2. Abrir el explorador de archivos con la carpeta de la extensión
  try {
    exec(`explorer.exe /select,"${extensionPath}\\manifest.json"`, (err) => {
      if (err) {
        exec(`start "" "${extensionPath}"`);
      }
    });
  } catch {
    // noop
  }

  return NextResponse.json({
    success: true,
    browser: browserName,
    extensionPath,
    message: `Se ha abierto ${browserName} en su pestaña de extensiones y la carpeta en el Explorador de Windows.`,
  });
}

