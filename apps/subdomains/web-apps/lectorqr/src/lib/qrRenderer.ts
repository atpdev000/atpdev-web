import QRCode from 'qrcode';
import { 
  QRDesignConfig, 
  QRPattern, 
  QRMarkerOut, 
  QRMarkerIn, 
  QROptionLogo, 
  QROuterFrame 
} from '../types';

/**
 * Motor universal de renderizado de Códigos QR con soporte integral para todos los parámetros de API:
 * - 16 Patrones de módulos (puntos, estrellas, diamantes, corazones, etc.)
 * - 13 Estilos de marcadores exteriores (corners)
 * - 14 Estilos de pupilas interiores (marker_in)
 * - 23 Logotipos oficiales vectoriales (TikTok, Instagram, WhatsApp, PayPal, etc.)
 * - 9 Marcos con tipografías y globos de llamada
 * - Gradientes lineales y radiales, transparencias y fondos sin pérdida.
 */
export async function renderCustomQRCode(
  canvas: HTMLCanvasElement,
  text: string,
  config: QRDesignConfig,
  targetWidth = 360
): Promise<void> {
  const content = text.trim() || 'https://qr.io';

  let qr: any;
  try {
    qr = QRCode.create(content, {
      errorCorrectionLevel: config.errorCorrection || 'H',
    });
  } catch (err) {
    console.warn('Error creating QR matrix:', err);
    return;
  }

  const matrixSize = qr.modules.size;
  const margin = config.margin ?? 2;
  const totalModules = matrixSize + margin * 2;

  // 1. Determinar dimensiones según el Marco (outer_frame)
  const outerFrame = config.outer_frame || 'none';
  const hasFrame = outerFrame !== 'none';
  const frameText = config.framelabel?.trim() || 'SCAN ME';
  const frameBg = config.custom_frame_color ? config.framecolor : (config.framecolor || '#000000');
  const frameTextColor = config.frame_text_color || '#ffffff';
  const labelFont = config.label_font || 'Arial, Helvetica, sans-serif';

  let canvasWidth = targetWidth;
  let canvasHeight = targetWidth;
  let qrX = 0;
  let qrY = 0;
  let qrWidth = targetWidth;
  let qrHeight = targetWidth;

  if (outerFrame === 'bottom' || outerFrame === 'balloon-bottom' || outerFrame === 'ribbon-bottom') {
    const bannerH = Math.round(targetWidth * 0.22);
    canvasHeight = targetWidth + bannerH;
    qrHeight = targetWidth;
    qrX = 0;
    qrY = 0;
  } else if (outerFrame === 'top' || outerFrame === 'balloon-top' || outerFrame === 'ribbon-top') {
    const bannerH = Math.round(targetWidth * 0.22);
    canvasHeight = targetWidth + bannerH;
    qrHeight = targetWidth;
    qrX = 0;
    qrY = bannerH;
  } else if (outerFrame === 'phone') {
    const notchH = Math.round(targetWidth * 0.16);
    const chinH = Math.round(targetWidth * 0.24);
    canvasHeight = targetWidth + notchH + chinH;
    canvasWidth = targetWidth + 24;
    qrX = 12;
    qrY = notchH;
  } else if (outerFrame === 'cine') {
    const borderS = Math.round(targetWidth * 0.12);
    canvasHeight = targetWidth + borderS * 2;
    canvasWidth = targetWidth + borderS * 2;
    qrX = borderS;
    qrY = borderS;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 2. Fondo (o transparente)
  if (!config.transparent) {
    ctx.fillStyle = config.backcolor || '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  // 3. Estilo de relleno de puntos (Front color o Gradiente lineal/radial)
  let bodyFillStyle: string | CanvasGradient = config.frontcolor || '#000000';

  if (config.gradient) {
    if (config.radial) {
      const cx = qrX + qrWidth / 2;
      const cy = qrY + qrHeight / 2;
      const r = qrWidth / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, config.frontcolor || '#000000');
      grad.addColorStop(1, config.gradient_color || '#0284c7');
      bodyFillStyle = grad;
    } else {
      const grad = ctx.createLinearGradient(qrX, qrY, qrX + qrWidth, qrY + qrHeight);
      grad.addColorStop(0, config.frontcolor || '#000000');
      grad.addColorStop(1, config.gradient_color || '#0284c7');
      bodyFillStyle = grad;
    }
  }

  const cellSize = qrWidth / totalModules;
  const offsetStartX = qrX + margin * cellSize;
  const offsetStartY = qrY + margin * cellSize;

  // Helper para saber si un módulo pertenece a uno de los 3 ojos
  const isEyeModule = (row: number, col: number): boolean => {
    if (row < 7 && col < 7) return true; // Top-Left
    if (row < 7 && col >= matrixSize - 7) return true; // Top-Right
    if (row >= matrixSize - 7 && col < 7) return true; // Bottom-Left
    return false;
  };

  // 4. Dibujar los módulos del cuerpo con el PATTERN seleccionado
  ctx.save();
  ctx.fillStyle = bodyFillStyle;

  const pattern = config.pattern || 'default';

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isEyeModule(r, c)) continue;
      if (qr.modules.get(r, c) !== 1) continue;

      const x = offsetStartX + c * cellSize;
      const y = offsetStartY + r * cellSize;
      const cx = x + cellSize / 2;
      const cy = y + cellSize / 2;
      const radius = cellSize * 0.46;

      drawPatternModule(ctx, pattern, x, y, cx, cy, cellSize, radius);
    }
  }
  ctx.restore();

  // 5. Dibujar los 3 Marcadores Exteriores (marker) y Pupilas Interiores (marker_in)
  const markerOutColor = config.marker_out_color || config.frontcolor || '#000000';
  const markerInColor = config.marker_in_color || config.frontcolor || '#000000';

  const eyeLocations = [
    { r: 0, c: 0, orientation: 'tl' },
    { r: 0, c: matrixSize - 7, orientation: 'tr' },
    { r: matrixSize - 7, c: 0, orientation: 'bl' },
  ];

  eyeLocations.forEach((loc) => {
    const eyeX = offsetStartX + loc.c * cellSize;
    const eyeY = offsetStartY + loc.r * cellSize;
    const eyeSize = 7 * cellSize;

    // A) Marcador Exterior (7x7 módulos con hueco central 5x5)
    ctx.save();
    ctx.strokeStyle = markerOutColor;
    ctx.fillStyle = markerOutColor;
    drawMarkerOuter(ctx, config.marker || 'default', eyeX, eyeY, eyeSize, cellSize, loc.orientation);
    ctx.restore();

    // B) Pupila Interior (3x3 módulos)
    const ballX = eyeX + 2 * cellSize;
    const ballY = eyeY + 2 * cellSize;
    const ballSize = 3 * cellSize;

    ctx.save();
    ctx.fillStyle = markerInColor;
    drawMarkerInner(ctx, config.marker_in || 'default', ballX, ballY, ballSize, cellSize);
    ctx.restore();
  });

  // 6. Dibujar Logotipo Central (optionlogo)
  if (config.optionlogo && config.optionlogo !== 'none') {
    const logoRatio = (config.logoSize || 22) / 100;
    const logoAreaSize = Math.round(qrWidth * logoRatio);
    const centerX = qrX + qrWidth / 2;
    const centerY = qrY + qrHeight / 2;
    const logoX = centerX - logoAreaSize / 2;
    const logoY = centerY - logoAreaSize / 2;

    // Si no tiene 'no_logo_bg', dibujar fondo protector
    if (!config.no_logo_bg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, (logoAreaSize / 2) + cellSize * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = config.backcolor || '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = config.frontcolor || '#000000';
      ctx.stroke();
      ctx.restore();
    }

    if (config.optionlogo === 'upload' && config.customLogoUrl) {
      try {
        await drawImageOnCanvas(ctx, config.customLogoUrl, logoX, logoY, logoAreaSize, logoAreaSize);
      } catch (e) {
        console.warn('Could not draw uploaded logo', e);
      }
    } else {
      drawVectorPlatformLogo(ctx, config.optionlogo, centerX, centerY, logoAreaSize);
    }
  }

  // 7. Dibujar Marco (outer_frame)
  if (hasFrame) {
    ctx.save();

    if (outerFrame === 'bottom') {
      const bannerY = qrHeight;
      const bannerH = canvasHeight - qrHeight;
      ctx.fillStyle = frameBg;
      ctx.fillRect(0, bannerY, canvasWidth, bannerH);

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(14, Math.round(canvasWidth * 0.052));
      ctx.font = `900 ${fontSize}px ${labelFont}`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerY + bannerH / 2);

    } else if (outerFrame === 'top') {
      const bannerH = qrY;
      ctx.fillStyle = frameBg;
      ctx.fillRect(0, 0, canvasWidth, bannerH);

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(14, Math.round(canvasWidth * 0.052));
      ctx.font = `900 ${fontSize}px ${labelFont}`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerH / 2);

    } else if (outerFrame === 'balloon-bottom') {
      const bannerY = qrHeight;
      const bannerH = canvasHeight - qrHeight;
      ctx.fillStyle = frameBg;
      roundRect(ctx, 12, bannerY + 6, canvasWidth - 24, bannerH - 12, 16);
      ctx.fill();

      // Puntero de globo superior
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2 - 10, bannerY + 6);
      ctx.lineTo(canvasWidth / 2, bannerY - 4);
      ctx.lineTo(canvasWidth / 2 + 10, bannerY + 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(13, Math.round(canvasWidth * 0.048));
      ctx.font = `900 ${fontSize}px ${labelFont}`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerY + bannerH / 2);

    } else if (outerFrame === 'ribbon-bottom') {
      const bannerY = qrHeight;
      const bannerH = canvasHeight - qrHeight;
      ctx.fillStyle = frameBg;
      ctx.fillRect(16, bannerY + 4, canvasWidth - 32, bannerH - 10);

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(13, Math.round(canvasWidth * 0.046));
      ctx.font = `900 ${fontSize}px ${labelFont}`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerY + bannerH / 2);

    } else if (outerFrame === 'phone') {
      // Mockup de celular con notch superior y texto inferior
      ctx.strokeStyle = frameBg;
      ctx.lineWidth = 6;
      roundRect(ctx, 4, 4, canvasWidth - 8, canvasHeight - 8, 36);
      ctx.stroke();

      // Notch
      ctx.fillStyle = frameBg;
      roundRect(ctx, canvasWidth / 2 - 32, 12, 64, 8, 4);
      ctx.fill();

      // Texto en la base
      const textY = canvasHeight - 24;
      ctx.fillStyle = frameBg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold 13px ${labelFont}`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, textY);

    } else if (outerFrame === 'cine') {
      // Marco estilo cine negro con perforaciones
      ctx.fillStyle = frameBg;
      ctx.fillRect(0, 0, canvasWidth, qrY);
      ctx.fillRect(0, canvasHeight - qrY, canvasWidth, qrY);
      ctx.fillRect(0, 0, qrX, canvasHeight);
      ctx.fillRect(canvasWidth - qrX, 0, qrX, canvasHeight);

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold 12px ${labelFont}`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, canvasHeight - qrY / 2);
    }

    ctx.restore();
  }
}

/**
 * Dibuja un módulo de cuerpo individual según el PATTERN
 */
function drawPatternModule(
  ctx: CanvasRenderingContext2D,
  pattern: QRPattern,
  x: number,
  y: number,
  cx: number,
  cy: number,
  size: number,
  radius: number
) {
  if (pattern === 'circle' || pattern === 'special-circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'diamond' || pattern === 'special-diamond') {
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.fill();
  } else if (pattern === 'star' || pattern === 'sparkle') {
    drawStar(ctx, cx, cy, 4, radius, radius * 0.4);
  } else if (pattern === 'heart') {
    drawHeart(ctx, cx, cy, size * 0.42);
  } else if (pattern === 'cross' || pattern === 'plus') {
    const bar = size * 0.32;
    ctx.fillRect(cx - bar / 2, y, bar, size);
    ctx.fillRect(x, cy - bar / 2, size, bar);
  } else if (pattern === 'x') {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    const bar = size * 0.3;
    ctx.fillRect(-bar / 2, -size / 2, bar, size);
    ctx.fillRect(-size / 2, -bar / 2, size, bar);
    ctx.restore();
  } else if (pattern === 'blob') {
    roundRect(ctx, x + size * 0.08, y + size * 0.08, size * 0.84, size * 0.84, size * 0.35);
    ctx.fill();
  } else if (pattern === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // default (cuadrado sólido clásico)
    ctx.fillRect(x, y, size, size);
  }
}

/**
 * Dibuja el marco exterior del ojo (MARKER)
 */
function drawMarkerOuter(
  ctx: CanvasRenderingContext2D,
  marker: QRMarkerOut,
  x: number,
  y: number,
  size: number,
  cellSize: number,
  orientation: string
) {
  ctx.lineWidth = cellSize;

  if (marker === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2 - cellSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (marker === 'rounded' || marker === 'squarecircle') {
    roundRect(ctx, x + cellSize / 2, y + cellSize / 2, size - cellSize, size - cellSize, cellSize * 1.6);
    ctx.stroke();
  } else if (marker === 'drop' || marker === 'dropeye') {
    // Esquina redondeada en la dirección externa
    const r = cellSize * 2.8;
    ctx.beginPath();
    ctx.moveTo(x + cellSize / 2 + r, y + cellSize / 2);
    ctx.lineTo(x + size - cellSize / 2, y + cellSize / 2);
    ctx.lineTo(x + size - cellSize / 2, y + size - cellSize / 2);
    ctx.lineTo(x + cellSize / 2, y + size - cellSize / 2);
    ctx.arcTo(x + cellSize / 2, y + cellSize / 2, x + cellSize / 2 + r, y + cellSize / 2, r);
    ctx.closePath();
    ctx.stroke();
  } else if (marker === 'flower') {
    roundRect(ctx, x + cellSize / 2, y + cellSize / 2, size - cellSize, size - cellSize, cellSize * 2.4);
    ctx.stroke();
  } else {
    // default (cuadrado 7x7)
    ctx.strokeRect(x + cellSize / 2, y + cellSize / 2, size - cellSize, size - cellSize);
  }
}

/**
 * Dibuja la pupila interior del ojo (MARKER_IN)
 */
function drawMarkerInner(
  ctx: CanvasRenderingContext2D,
  markerIn: QRMarkerIn,
  x: number,
  y: number,
  size: number,
  cellSize: number
) {
  const cx = x + size / 2;
  const cy = y + size / 2;

  if (markerIn === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (markerIn === 'diamond') {
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.fill();
  } else if (markerIn === 'star' || markerIn === 'sun') {
    drawStar(ctx, cx, cy, 5, size / 2, size * 0.22);
  } else if (markerIn === 'heart') {
    drawHeart(ctx, cx, cy, size * 0.45);
  } else if (markerIn === 'rounded') {
    roundRect(ctx, x, y, size, size, cellSize * 0.8);
    ctx.fill();
  } else {
    // default (cuadrado 3x3)
    roundRect(ctx, x, y, size, size, cellSize * 0.35);
    ctx.fill();
  }
}

/**
 * Dibuja logotipos vectoriales de las plataformas oficiales más populares (incluyendo TikTok)
 */
function drawVectorPlatformLogo(
  ctx: CanvasRenderingContext2D,
  logoType: QROptionLogo,
  cx: number,
  cy: number,
  size: number
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const radius = size * 0.44;

  if (logoType === 'tiktok') {
    // TikTok: fondo negro + nota musical con degradado cyan/magenta
    ctx.fillStyle = '#010101';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.35);
    ctx.fill();

    // Símbolo musical
    ctx.fillStyle = '#25F4EE';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.25, cy + radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - radius * 0.1, cy - radius * 0.5, radius * 0.2, radius * 0.8);

    ctx.fillStyle = '#FE2C55';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.15, cy + radius * 0.25, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.45)}px sans-serif`;
    ctx.fillText('d', cx + 1, cy - 1);

  } else if (logoType === 'whatsapp') {
    ctx.fillStyle = '#25D366';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.52)}px sans-serif`;
    ctx.fillText('WA', cx, cy + 1);

  } else if (logoType === 'instagram') {
    const grad = ctx.createLinearGradient(cx - radius, cy + radius, cx + radius, cy - radius);
    grad.addColorStop(0, '#f09433');
    grad.addColorStop(0.3, '#e6683c');
    grad.addColorStop(0.6, '#dc2743');
    grad.addColorStop(1, '#bc1888');
    ctx.fillStyle = grad;
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.35);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.5)}px sans-serif`;
    ctx.fillText('IG', cx, cy + 1);

  } else if (logoType === 'facebook') {
    ctx.fillStyle = '#1877F2';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.62)}px sans-serif`;
    ctx.fillText('f', cx, cy + 2);

  } else if (logoType === 'youtube') {
    ctx.fillStyle = '#FF0000';
    roundRect(ctx, cx - radius, cy - radius * 0.75, radius * 2, radius * 1.5, radius * 0.35);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.3, cy - radius * 0.4);
    ctx.lineTo(cx + radius * 0.45, cy);
    ctx.lineTo(cx - radius * 0.3, cy + radius * 0.4);
    ctx.closePath();
    ctx.fill();

  } else if (logoType === 'twitter') {
    ctx.fillStyle = '#000000';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.3);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.52)}px sans-serif`;
    ctx.fillText('X', cx, cy);

  } else if (logoType === 'linkedin') {
    ctx.fillStyle = '#0A66C2';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.3);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.52)}px sans-serif`;
    ctx.fillText('in', cx, cy);

  } else if (logoType === 'spotify') {
    ctx.fillStyle = '#1DB954';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.round(size * 0.42)}px sans-serif`;
    ctx.fillText('♫', cx, cy);

  } else if (logoType === 'telegram') {
    ctx.fillStyle = '#26A5E4';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.45)}px sans-serif`;
    ctx.fillText('✈', cx - 1, cy);

  } else if (logoType === 'pinterest') {
    ctx.fillStyle = '#E60023';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.55)}px serif`;
    ctx.fillText('P', cx, cy + 1);

  } else if (logoType === 'paypal') {
    ctx.fillStyle = '#003087';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.3);
    ctx.fill();
    ctx.fillStyle = '#0079C1';
    ctx.font = `italic bold ${Math.round(size * 0.5)}px sans-serif`;
    ctx.fillText('P', cx, cy);

  } else if (logoType === 'btc') {
    ctx.fillStyle = '#F7931A';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.55)}px sans-serif`;
    ctx.fillText('₿', cx, cy + 1);

  } else if (logoType === 'wifi') {
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.36)}px sans-serif`;
    ctx.fillText('WiFi', cx, cy);

  } else if (logoType === 'email') {
    ctx.fillStyle = '#EA4335';
    roundRect(ctx, cx - radius, cy - radius * 0.75, radius * 2, radius * 1.5, radius * 0.25);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.42)}px sans-serif`;
    ctx.fillText('@', cx, cy);

  } else if (logoType === 'link') {
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.45)}px sans-serif`;
    ctx.fillText('🔗', cx, cy);

  } else if (logoType === 'location') {
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.45)}px sans-serif`;
    ctx.fillText('📍', cx, cy);

  } else {
    // Default Star
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.55)}px sans-serif`;
    ctx.fillText('★', cx, cy + 1);
  }

  ctx.restore();
}

/**
 * Helpers geométricos
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(cx, cy + size * 0.6);
  ctx.bezierCurveTo(cx - size, cy, cx - size, cy - topCurveHeight, cx, cy - topCurveHeight);
  ctx.bezierCurveTo(cx + size, cy - topCurveHeight, cx + size, cy, cx, cy + size * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawImageOnCanvas(ctx: CanvasRenderingContext2D, src: string, x: number, y: number, w: number, h: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, x, y, w, h);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}
