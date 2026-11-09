import QRCode from 'qrcode';
import { QRDesignConfig } from '../types';

/**
 * Motor de renderizado de alta precisión para Códigos QR personalizados con marcos, formas, degradados y logotipos.
 */
export async function renderCustomQRCode(
  canvas: HTMLCanvasElement,
  text: string,
  config: QRDesignConfig,
  targetWidth = 360
): Promise<void> {
  const content = text.trim() || 'https://qr.io';
  
  // 1. Generar la matriz QR cruda
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

  // 2. Determinar proporciones de lienzo según el Marco (Frame) seleccionado
  let canvasWidth = targetWidth;
  let canvasHeight = targetWidth;
  let qrX = 0;
  let qrY = 0;
  let qrWidth = targetWidth;
  let qrHeight = targetWidth;

  const hasFrame = config.frameStyle && config.frameStyle !== 'none';
  const frameText = config.frameText?.trim() || 'ESCÁNAME';
  const frameColor = config.frameColor || '#0284c7';
  const frameTextColor = config.frameTextColor || '#ffffff';

  if (config.frameStyle === 'bottom-banner') {
    const bannerHeight = Math.round(targetWidth * 0.22);
    canvasHeight = targetWidth + bannerHeight;
    qrWidth = targetWidth;
    qrHeight = targetWidth;
    qrX = 0;
    qrY = 0;
  } else if (config.frameStyle === 'top-banner') {
    const bannerHeight = Math.round(targetWidth * 0.22);
    canvasHeight = targetWidth + bannerHeight;
    qrWidth = targetWidth;
    qrHeight = targetWidth;
    qrX = 0;
    qrY = bannerHeight;
  } else if (config.frameStyle === 'rounded-card') {
    const bannerHeight = Math.round(targetWidth * 0.25);
    canvasHeight = targetWidth + bannerHeight + 20;
    canvasWidth = targetWidth + 24;
    qrWidth = targetWidth;
    qrHeight = targetWidth;
    qrX = 12;
    qrY = 12;
  } else if (config.frameStyle === 'badge') {
    const bannerHeight = Math.round(targetWidth * 0.2);
    canvasHeight = targetWidth + bannerHeight + 16;
    canvasWidth = targetWidth + 16;
    qrWidth = targetWidth;
    qrHeight = targetWidth;
    qrX = 8;
    qrY = bannerHeight + 8;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 3. Pintar fondo general
  ctx.fillStyle = config.bgColor || '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Si tiene marco rounded-card, dibujar borde redondeado
  if (config.frameStyle === 'rounded-card') {
    ctx.save();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = Math.max(3, Math.round(targetWidth * 0.015));
    roundRect(ctx, 4, 4, canvasWidth - 8, canvasHeight - 8, Math.round(targetWidth * 0.06));
    ctx.stroke();
    ctx.restore();
  }

  // 4. Preparar estilo de relleno del cuerpo (Sólido o Gradiente)
  let bodyFillStyle: string | CanvasGradient = config.fgColor || '#000000';
  if (config.colorType === 'gradient') {
    let grad: CanvasGradient;
    if (config.gradientDirection === 'horizontal') {
      grad = ctx.createLinearGradient(qrX, qrY, qrX + qrWidth, qrY);
    } else if (config.gradientDirection === 'vertical') {
      grad = ctx.createLinearGradient(qrX, qrY, qrX, qrY + qrHeight);
    } else {
      // diagonal
      grad = ctx.createLinearGradient(qrX, qrY, qrX + qrWidth, qrY + qrHeight);
    }
    grad.addColorStop(0, config.fgColor || '#2563eb');
    grad.addColorStop(1, config.gradientColor2 || '#06b6d4');
    bodyFillStyle = grad;
  }

  const cellSize = qrWidth / totalModules;
  const offsetStartX = qrX + margin * cellSize;
  const offsetStartY = qrY + margin * cellSize;

  // Helper para saber si un módulo pertenece a uno de los 3 ojos
  const isEyeModule = (row: number, col: number): boolean => {
    // Top-Left
    if (row < 7 && col < 7) return true;
    // Top-Right
    if (row < 7 && col >= matrixSize - 7) return true;
    // Bottom-Left
    if (row >= matrixSize - 7 && col < 7) return true;
    return false;
  };

  // 5. Dibujar los módulos del cuerpo (Body)
  ctx.save();
  ctx.fillStyle = bodyFillStyle;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isEyeModule(r, c)) continue; // Los ojos se dibujan por separado

      const isDark = qr.modules.get(r, c) === 1;
      if (!isDark) continue;

      const x = offsetStartX + c * cellSize;
      const y = offsetStartY + r * cellSize;

      if (config.dotShape === 'dots') {
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.46, 0, Math.PI * 2);
        ctx.fill();
      } else if (config.dotShape === 'rounded') {
        roundRect(ctx, x + cellSize * 0.08, y + cellSize * 0.08, cellSize * 0.84, cellSize * 0.84, cellSize * 0.35);
        ctx.fill();
      } else if (config.dotShape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x + cellSize / 2, y);
        ctx.lineTo(x + cellSize, y + cellSize / 2);
        ctx.lineTo(x + cellSize / 2, y + cellSize);
        ctx.lineTo(x, y + cellSize / 2);
        ctx.closePath();
        ctx.fill();
      } else {
        // squares (clásico)
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
  ctx.restore();

  // 6. Dibujar los 3 Ojos de detección (Eyes: Outer Frame & Inner Ball)
  const eyeColor = (config.customEyeColor && config.eyeColor) ? config.eyeColor : bodyFillStyle;

  const eyeLocations = [
    { r: 0, c: 0 },                       // Top-Left
    { r: 0, c: matrixSize - 7 },          // Top-Right
    { r: matrixSize - 7, c: 0 },          // Bottom-Left
  ];

  eyeLocations.forEach((loc) => {
    const eyeX = offsetStartX + loc.c * cellSize;
    const eyeY = offsetStartY + loc.r * cellSize;
    const eyeSize = 7 * cellSize;

    // A) Marco exterior del ojo (7x7 módulos)
    ctx.save();
    ctx.fillStyle = eyeColor;
    ctx.strokeStyle = eyeColor;

    if (config.eyeFrame === 'circle') {
      ctx.lineWidth = cellSize;
      ctx.beginPath();
      ctx.arc(eyeX + eyeSize / 2, eyeY + eyeSize / 2, eyeSize / 2 - cellSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (config.eyeFrame === 'rounded') {
      ctx.lineWidth = cellSize;
      roundRect(ctx, eyeX + cellSize / 2, eyeY + cellSize / 2, eyeSize - cellSize, eyeSize - cellSize, cellSize * 1.5);
      ctx.stroke();
    } else {
      // square
      ctx.lineWidth = cellSize;
      ctx.strokeRect(eyeX + cellSize / 2, eyeY + cellSize / 2, eyeSize - cellSize, eyeSize - cellSize);
    }
    ctx.restore();

    // B) Pupila / Centro del ojo (3x3 módulos)
    const ballX = eyeX + 2 * cellSize;
    const ballY = eyeY + 2 * cellSize;
    const ballSize = 3 * cellSize;

    ctx.save();
    ctx.fillStyle = eyeColor;

    if (config.eyeBall === 'circle') {
      ctx.beginPath();
      ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (config.eyeBall === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(ballX + ballSize / 2, ballY);
      ctx.lineTo(ballX + ballSize, ballY + ballSize / 2);
      ctx.lineTo(ballX + ballSize / 2, ballY + ballSize);
      ctx.lineTo(ballX, ballY + ballSize / 2);
      ctx.closePath();
      ctx.fill();
    } else {
      // square
      roundRect(ctx, ballX, ballY, ballSize, ballSize, cellSize * 0.4);
      ctx.fill();
    }
    ctx.restore();
  });

  // 7. Dibujar Logotipo Central si está configurado
  if (config.logo && config.logo !== 'none') {
    const logoRatio = (config.logoSize || 22) / 100;
    const logoAreaSize = Math.round(qrWidth * logoRatio);
    const centerX = qrX + qrWidth / 2;
    const centerY = qrY + qrHeight / 2;
    const logoX = centerX - logoAreaSize / 2;
    const logoY = centerY - logoAreaSize / 2;

    // Fondo protector circular detrás del logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, (logoAreaSize / 2) + cellSize * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = config.bgColor || '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = config.fgColor || '#0284c7';
    ctx.stroke();
    ctx.restore();

    if (config.logo === 'upload' && config.customLogoUrl) {
      try {
        await drawImageOnCanvas(ctx, config.customLogoUrl, logoX, logoY, logoAreaSize, logoAreaSize);
      } catch (e) {
        console.warn('Could not draw uploaded logo', e);
      }
    } else {
      // Preset vectorial dibujado directamente
      drawPresetLogo(ctx, config.logo, centerX, centerY, logoAreaSize);
    }
  }

  // 8. Dibujar Decoración del Marco (Frame) y Banner de Texto
  if (hasFrame) {
    ctx.save();

    if (config.frameStyle === 'bottom-banner') {
      const bannerY = qrHeight;
      const bannerH = canvasHeight - qrHeight;
      
      // Rectángulo del banner inferior
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, bannerY, canvasWidth, bannerH);

      // Texto de llamada a la acción
      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(14, Math.round(canvasWidth * 0.052));
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerY + bannerH / 2);

    } else if (config.frameStyle === 'top-banner') {
      const bannerH = qrY;
      
      // Rectángulo del banner superior
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, canvasWidth, bannerH);

      // Texto
      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(14, Math.round(canvasWidth * 0.052));
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, bannerH / 2);

    } else if (config.frameStyle === 'rounded-card') {
      // Pastilla inferior moderna
      const pillW = Math.round(canvasWidth * 0.75);
      const pillH = Math.round(canvasHeight * 0.11);
      const pillX = (canvasWidth - pillW) / 2;
      const pillY = canvasHeight - pillH - 12;

      ctx.fillStyle = frameColor;
      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(13, Math.round(canvasWidth * 0.046));
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, pillY + pillH / 2);

    } else if (config.frameStyle === 'badge') {
      // Cinta superior tipo badge
      const ribbonH = Math.round(canvasHeight * 0.12);
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, canvasWidth, ribbonH);

      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(13, Math.round(canvasWidth * 0.048));
      ctx.font = `900 ${fontSize}px sans-serif`;
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, ribbonH / 2);
    }

    ctx.restore();
  }
}

/**
 * Helper para dibujar rectángulos con esquinas redondeadas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

/**
 * Helper para cargar y dibujar una imagen en canvas
 */
function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  src: string,
  x: number,
  y: number,
  w: number,
  h: number
): Promise<void> {
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

/**
 * Dibuja logotipos vectoriales de marcas populares en el centro
 */
function drawPresetLogo(
  ctx: CanvasRenderingContext2D,
  logoType: string,
  cx: number,
  cy: number,
  size: number
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const radius = size * 0.44;

  if (logoType === 'whatsapp') {
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
    grad.addColorStop(0.25, '#e6683c');
    grad.addColorStop(0.5, '#dc2743');
    grad.addColorStop(0.75, '#cc2366');
    grad.addColorStop(1, '#bc1888');
    ctx.fillStyle = grad;
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.4);
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
    ctx.font = `bold ${Math.round(size * 0.6)}px sans-serif`;
    ctx.fillText('f', cx, cy + 2);
  } else if (logoType === 'tiktok') {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#25F4EE';
    ctx.font = `bold ${Math.round(size * 0.5)}px sans-serif`;
    ctx.fillText('TT', cx, cy);
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
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.52)}px sans-serif`;
    ctx.fillText('X', cx, cy);
  } else if (logoType === 'wifi') {
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.38)}px sans-serif`;
    ctx.fillText('WiFi', cx, cy);
  } else if (logoType === 'pdf') {
    ctx.fillStyle = '#DC2626';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.3);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.42)}px sans-serif`;
    ctx.fillText('PDF', cx, cy);
  } else if (logoType === 'appstore') {
    ctx.fillStyle = '#007AFF';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.35);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.5)}px sans-serif`;
    ctx.fillText('iOS', cx, cy);
  } else if (logoType === 'googleplay') {
    ctx.fillStyle = '#01875F';
    roundRect(ctx, cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.35);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.46)}px sans-serif`;
    ctx.fillText('Play', cx, cy);
  } else {
    // Default Star / Icon
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(size * 0.55)}px sans-serif`;
    ctx.fillText('★', cx, cy + 1);
  }

  ctx.restore();
}

