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

  const findExe = (candidates: string[]) => candidates.find((c) => fs.existsSync(c)) || candidates[candidates.length - 1];

  let exePath = '';
  let targetUrl = 'chrome://extensions';
  let browserName = 'Google Chrome';

  if (isEdge) {
    browserName = 'Microsoft Edge';
    targetUrl = 'edge://extensions';
    exePath = findExe([
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'msedge'
    ]);
  } else if (isOpera) {
    browserName = 'Opera';
    targetUrl = 'opera://extensions';
    exePath = findExe([
      `${process.env.LOCALAPPDATA || ''}\\Programs\\Opera\\launcher.exe`,
      'C:\\Program Files\\Opera\\launcher.exe',
      'opera'
    ]);
  } else if (isBrave) {
    browserName = 'Brave';
    targetUrl = 'brave://extensions';
    exePath = findExe([
      'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
      `${process.env.LOCALAPPDATA || ''}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
      'brave'
    ]);
  } else if (isFirefox) {
    browserName = 'Mozilla Firefox';
    targetUrl = 'about:debugging#/runtime/this-firefox';
    exePath = findExe([
      'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
      'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
      'firefox'
    ]);
  } else {
    browserName = 'Google Chrome';
    targetUrl = 'chrome://extensions';
    exePath = findExe([
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      `${process.env.LOCALAPPDATA || ''}\\Google\\Chrome\\Application\\chrome.exe`,
      'chrome'
    ]);
  }

  // 1. Abrir la página de extensiones del navegador actual vía PowerShell con ruta absoluta
  try {
    const launchCmd = exePath.endsWith('.exe')
      ? `powershell -Command "Start-Process -FilePath '${exePath}' -ArgumentList '${targetUrl}'"`
      : `powershell -Command "Start-Process '${exePath}' '${targetUrl}'"`;

    exec(launchCmd, (err) => {
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

