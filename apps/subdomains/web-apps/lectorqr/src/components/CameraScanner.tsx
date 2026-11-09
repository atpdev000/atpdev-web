'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, 
  FlipHorizontal, 
  Flashlight, 
  Upload, 
  AlertCircle, 
  RefreshCw,
  Scan,
  Sparkles,
  Zap
} from 'lucide-react';
import { playScanSuccessBeep } from '../lib/sound';
import { parseScannedContent } from '../lib/parser';
import { ScannedCode } from '../types';

interface CameraScannerProps {
  onScanSuccess: (code: ScannedCode) => void;
  isScanningActive: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanSuccess,
  isScanningActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  // Iniciar cámara con permisos
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.setAttribute('playsinline', 'true'); // iOS Safari
        await videoRef.current.play();
      }

      // Comprobar soporte de linterna (Torch)
      const track = newStream.getVideoTracks()[0];
      const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
      setHasTorch(!!capabilities.torch);
    } catch (err: any) {
      console.warn('Error al iniciar cámara:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permiso de cámara denegado. Activa los permisos en tu navegador o sube una imagen directamente.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No se encontró ninguna cámara activa en este dispositivo. Puedes usar la opción de subir imagen.');
      } else {
        setCameraError('No se pudo acceder a la cámara. Puedes subir una foto o captura de pantalla con código QR.');
      }
    }
  }, [facingMode]);

  // Alternar linterna
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const nextTorch = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      console.warn('Linterna no soportada en este dispositivo', e);
    }
  };

  // Alternar cámara frontal / trasera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (isScanningActive) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanningActive, facingMode]);

  // Loop de escaneo continuo
  useEffect(() => {
    let animationFrameId: number;
    let isDetecting = false;

    // Verificar si el navegador soporta BarcodeDetector nativo
    const hasNativeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    let nativeDetector: any = null;
    if (hasNativeDetector) {
      try {
        nativeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'code_128', 'data_matrix', 'aztec', 'pdf417'],
        });
      } catch (e) {
        nativeDetector = null;
      }
    }

    const scanFrame = async () => {
      if (!isScanningActive || isDetecting) {
        animationFrameId = requestAnimationFrame(scanFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);

            // Método 1: BarcodeDetector nativo
            if (nativeDetector) {
              try {
                isDetecting = true;
                const barcodes = await nativeDetector.detect(canvas);
                if (barcodes && barcodes.length > 0) {
                  const first = barcodes[0];
                  playScanSuccessBeep();
                  const parsed = parseScannedContent(first.rawValue, first.format.toUpperCase());
                  onScanSuccess(parsed);
                  return;
                }
              } catch (e) {
                // Fallback a jsQR
              } finally {
                isDetecting = false;
              }
            }

            // Método 2: jsQR Fallback
            try {
              const imageData = ctx.getImageData(0, 0, width, height);
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });

              if (code && code.data) {
                playScanSuccessBeep();
                const parsed = parseScannedContent(code.data, 'QR_CODE');
                onScanSuccess(parsed);
                return;
              }
            } catch (err) {
              // Ignore frame errors
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(scanFrame);
    };

    animationFrameId = requestAnimationFrame(scanFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanningActive, onScanSuccess]);

  // Manejar escaneo desde archivo o imagen seleccionada
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0);

          // Probar BarcodeDetector nativo primero
          if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
            try {
              const detector = new (window as any).BarcodeDetector({
                formats: ['qr_code', 'ean_13', 'code_128', 'data_matrix'],
              });
              const barcodes = await detector.detect(canvas);
              if (barcodes && barcodes.length > 0) {
                playScanSuccessBeep();
                const parsed = parseScannedContent(barcodes[0].rawValue, barcodes[0].format.toUpperCase());
                onScanSuccess(parsed);
                setIsProcessingImage(false);
                return;
              }
            } catch (err) {
              // Continuar a jsQR
            }
          }

          // jsQR
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            playScanSuccessBeep();
            const parsed = parseScannedContent(code.data, 'QR_CODE');
            onScanSuccess(parsed);
          } else {
            alert('No se detectó ningún código QR o de barras en la imagen seleccionada. Prueba con una imagen más nítida o centrada.');
          }
        }
        setIsProcessingImage(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    // Limpiar input para permitir seleccionar la misma imagen
    e.target.value = '';
  };

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden bg-black border-4 border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
      
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover absolute inset-0"
        muted
      />

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Laser Viewfinder Overlay */}
      {isScanningActive && !cameraError && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          
          {/* Dimmed surround */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            
            {/* Esquinas del visor (Target Crosshairs) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl shadow-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl shadow-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl shadow-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl shadow-lg" />

            {/* Glowing Laser line */}
            <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser rounded-full" />
            
            {/* Center target indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Scan className="w-12 h-12 text-blue-400 stroke-[1]" />
            </div>

          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
            Apunta la cámara al código QR
          </p>

        </div>
      )}

      {/* Camera Error Message with Direct Upload Fallback */}
      {cameraError && (
        <div className="p-6 text-center text-white space-y-4 max-w-sm z-10">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h4 className="font-black text-base font-display">Aviso de Cámara</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {cameraError}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Escanear Imagen / Captura</span>
            </button>
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar Permisos</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Controls (Torch, Camera Switch, Upload File) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3">
        
        {/* Flashlight / Torch */}
        {hasTorch && (
          <button
            type="button"
            onClick={toggleTorch}
            aria-label="Alternar Linterna"
            className={`p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg ${
              isTorchOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-black/60 text-white hover:bg-black/80'
            }`}
          >
            <Flashlight className="w-5 h-5" />
          </button>
        )}

        {/* Upload file hidden input and trigger */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          type="button"
          disabled={isProcessingImage}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-3 px-4 rounded-2xl bg-black/65 backdrop-blur-md hover:bg-black/85 text-white font-black text-xs uppercase tracking-wide border border-white/20 flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>{isProcessingImage ? 'Leyendo imagen...' : 'Subir Imagen QR'}</span>
        </button>

        {/* Switch Front/Back Camera */}
        <button
          type="button"
          onClick={switchCamera}
          aria-label="Cambiar Cámara"
          className="p-3 rounded-2xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer shadow-lg"
        >
          <FlipHorizontal className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};

export default CameraScanner;

