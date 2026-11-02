import path from 'path'
import fs from 'fs'
import os from 'os'
import { execSync } from 'child_process'
import { createRequire } from 'module'

const req = createRequire(import.meta.url)

let cachedFfmpegPath: string | null = null
let cachedYtDlpPath: string | null = null

/**
 * Localiza de manera robusta el ejecutable de FFmpeg en cualquier entorno:
 * - Local Windows (ffmpeg.exe en bin o ffmpeg-static)
 * - Contenedor Docker / Render Linux (/usr/bin/ffmpeg, /usr/local/bin/ffmpeg)
 * - Monorepo npm workspaces (node_modules/ffmpeg-static/ffmpeg)
 * - Variable de entorno FFMPEG_PATH
 * - PATH global del sistema (which / where)
 */
export function findFfmpegBinary(): string | null {
  if (cachedFfmpegPath && fs.existsSync(cachedFfmpegPath)) {
    return cachedFfmpegPath
  }

  // 1. Variable de entorno personalizada
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    cachedFfmpegPath = process.env.FFMPEG_PATH
    return cachedFfmpegPath
  }

  const isWin = process.platform === 'win32'
  const binName = isWin ? 'ffmpeg.exe' : 'ffmpeg'

  // 2. En Linux / Docker / Render: SIEMPRE priorizar el paquete de sistema (/usr/bin/ffmpeg)
  if (!isWin) {
    const linuxSysBins = [
      '/usr/bin/ffmpeg',
      '/usr/local/bin/ffmpeg',
      '/bin/ffmpeg',
      '/opt/homebrew/bin/ffmpeg'
    ]
    for (const lb of linuxSysBins) {
      if (fs.existsSync(lb)) {
        cachedFfmpegPath = lb
        return cachedFfmpegPath
      }
    }

    try {
      const output = execSync('which ffmpeg', { encoding: 'utf-8', timeout: 1500, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
      const firstLine = output.split(/[\r\n]+/)[0]
      if (firstLine && fs.existsSync(firstLine)) {
        cachedFfmpegPath = firstLine
        return cachedFfmpegPath
      }
    } catch {}
  }

  // 3. Resolución física del paquete npm ffmpeg-static (para Windows o fallback)
  try {
    const pkgJson = req.resolve('ffmpeg-static/package.json')
    const staticBin = path.join(path.dirname(pkgJson), binName)
    if (fs.existsSync(staticBin)) {
      try {
        if (!isWin) fs.chmodSync(staticBin, 0o755)
      } catch {}
      cachedFfmpegPath = staticBin
      return cachedFfmpegPath
    }
  } catch {}

  // 4. Fallback directo require('ffmpeg-static')
  try {
    const staticPath = req('ffmpeg-static')
    if (staticPath && typeof staticPath === 'string' && fs.existsSync(staticPath)) {
      try {
        if (!isWin) fs.chmodSync(staticPath, 0o755)
      } catch {}
      cachedFfmpegPath = staticPath
      return cachedFfmpegPath
    }
  } catch {}

  // 4. Directorios conocidos del monorepo y sistema (priorizando sistema en Linux)
  const cwd = process.cwd()
  const candidates = [
    // Rutas estándar en Linux / Docker / Render
    '/usr/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
    '/bin/ffmpeg',
    '/opt/homebrew/bin/ffmpeg',
    '/tmp/ffmpeg',
    // binario en carpetas bin del proyecto
    path.join(cwd, 'apps', 'subdomains', 'web-apps', 'descargador', 'bin', binName),
    path.join(cwd, 'bin', binName),
    // node_modules en monorepo o local
    path.join(cwd, 'node_modules', 'ffmpeg-static', binName),
    path.join(cwd, 'apps', 'subdomains', 'web-apps', 'descargador', 'node_modules', 'ffmpeg-static', binName),
    path.join(cwd, '..', '..', '..', 'node_modules', 'ffmpeg-static', binName),
    path.join(cwd, '..', '..', '..', '..', 'node_modules', 'ffmpeg-static', binName)
  ]

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        try {
          if (!isWin) fs.chmodSync(c, 0o755)
        } catch {}
        cachedFfmpegPath = c
        return cachedFfmpegPath
      }
    } catch {}
  }

  // 5. Búsqueda en PATH del sistema mediante which / where
  try {
    const cmd = isWin ? 'where ffmpeg' : 'which ffmpeg'
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 1500, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    const firstLine = output.split(/[\r\n]+/)[0]
    if (firstLine && fs.existsSync(firstLine)) {
      cachedFfmpegPath = firstLine
      return cachedFfmpegPath
    }
  } catch {}

  return null
}

/**
 * Localiza de manera robusta el ejecutable de yt-dlp en cualquier entorno:
 * - Local Windows (yt-dlp.exe en bin)
 * - Linux / Docker (/usr/local/bin/yt-dlp o /usr/bin/yt-dlp)
 * - Variable de entorno YTDLP_PATH
 * - PATH global del sistema
 */
export function findYtDlpBinary(): string {
  if (cachedYtDlpPath && (cachedYtDlpPath === 'yt-dlp' || fs.existsSync(cachedYtDlpPath))) {
    return cachedYtDlpPath
  }

  // 1. Variable de entorno personalizada
  if (process.env.YTDLP_PATH && fs.existsSync(process.env.YTDLP_PATH)) {
    cachedYtDlpPath = process.env.YTDLP_PATH
    return cachedYtDlpPath
  }

  const isWin = process.platform === 'win32'
  const binName = isWin ? 'yt-dlp.exe' : 'yt-dlp'
  const cwd = process.cwd()

  // 2. Directorios conocidos
  const candidates = [
    path.join(cwd, 'apps', 'subdomains', 'web-apps', 'descargador', 'bin', binName),
    path.join(cwd, 'bin', binName),
    path.join(cwd, 'node_modules', 'yt-dlp-exec', 'bin', binName),
    path.join(cwd, '..', '..', '..', 'node_modules', 'yt-dlp-exec', 'bin', binName),
    // Linux estándar
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp',
    '/bin/yt-dlp'
  ]

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        try {
          if (!isWin) fs.chmodSync(c, 0o755)
        } catch {}
        cachedYtDlpPath = c
        return cachedYtDlpPath
      }
    } catch {}
  }

  // 3. Búsqueda en PATH del sistema
  try {
    const cmd = isWin ? 'where yt-dlp' : 'which yt-dlp'
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 1500, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    const firstLine = output.split(/[\r\n]+/)[0]
    if (firstLine && fs.existsSync(firstLine)) {
      cachedYtDlpPath = firstLine
      return cachedYtDlpPath
    }
  } catch {}

  // 4. Si estamos en Linux y no se encontró en el sistema, auto-descargar a /tmp/yt-dlp
  if (!isWin) {
    const tmpYtDlp = '/tmp/yt-dlp'
    if (fs.existsSync(tmpYtDlp)) {
      try { fs.chmodSync(tmpYtDlp, 0o755) } catch {}
      cachedYtDlpPath = tmpYtDlp
      return cachedYtDlpPath
    }
    try {
      console.log('📥 [binaries] Descargando yt-dlp binario a /tmp/yt-dlp...')
      execSync('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /tmp/yt-dlp && chmod a+rx /tmp/yt-dlp', { timeout: 30000 })
      if (fs.existsSync(tmpYtDlp)) {
        console.log('✅ [binaries] yt-dlp descargado y listo en /tmp/yt-dlp')
        cachedYtDlpPath = tmpYtDlp
        return cachedYtDlpPath
      }
    } catch (e) {
      console.warn('⚠️ [binaries] No se pudo auto-descargar yt-dlp:', e)
    }
  }

  // 5. Default a comando en PATH
  cachedYtDlpPath = 'yt-dlp'
  return cachedYtDlpPath
}

/**
 * Retorna la configuración necesaria para ejecutar yt-dlp con soporte de FFmpeg
 * asegurándose de NUNCA pasar '--ffmpeg-location .' si no existe un directorio válido.
 */
export function getYtDlpWithFfmpeg(): {
  ytDlp: string
  ffmpeg: string | null
  ffmpegArgs: string[]
  binDir?: string
} {
  const ytDlp = findYtDlpBinary()
  const ffmpeg = findFfmpegBinary()

  let ffmpegArgs: string[] = []
  let binDir: string | undefined = undefined

  if (ffmpeg && path.isAbsolute(ffmpeg) && fs.existsSync(ffmpeg)) {
    binDir = path.dirname(ffmpeg)
    ffmpegArgs = ['--ffmpeg-location', binDir]
  }

  return { ytDlp, ffmpeg, ffmpegArgs, binDir }
}
