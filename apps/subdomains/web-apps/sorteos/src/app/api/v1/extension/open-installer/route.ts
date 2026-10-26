import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST() {
  let extensionPath = 'D:\\PROYECTOS\\atpdev-web\\extension-sorteos-pro';
  if (!fs.existsSync(extensionPath)) {
    extensionPath = path.resolve(process.cwd(), '../../../../extension-sorteos-pro');
  }

  // 1. Abrir edge://extensions en Microsoft Edge vía PowerShell
  try {
    exec('powershell -Command "Start-Process msedge \'edge://extensions\'"', (err) => {
      if (err) console.warn('No se pudo abrir edge://extensions automáticamente:', err);
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
    extensionPath,
    message: 'Se ha abierto la pestaña de extensiones de Edge y la carpeta en el explorador.',
  });
}

