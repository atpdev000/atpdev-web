import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Camera as CameraIcon, RefreshCw, X, Check, ArrowRight,
    Image as ImageIcon, Upload, RotateCw, Sparkles, Sliders, Maximize2, FileText, Wand2, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

import {
    processDNIImage,
    detectDNICorners,
    getCenteredDNICorners,
    rotateImage90,
    orderCorners,
    DNI_ASPECT_RATIO
} from '../../utils/imageProcessing';
import { removeBackgroundRunOnWeb } from '../../utils/runOnWebHelper';

const FILTERS = [
    { id: 'magic', label: 'Realce Mágico', icon: Sparkles },
    { id: 'original', label: 'Original HD', icon: ImageIcon },
    { id: 'grayscale', label: 'Documento B/N', icon: FileText },
    { id: 'bw', label: 'Alto Contraste', icon: Sliders }
];

const Scanner = ({
    onCapture,
    onCancel,
    initialStep = 'front',
    initialImages = { front: null, back: null },
    initialRawImages = { front: null, back: null }
}) => {
    const isNative = Capacitor.isNativePlatform();
    const [step, setStep] = useState(initialStep); // 'front' | 'review_front' | 'back' | 'review_back'
    const [capturedImages, setCapturedImages] = useState(initialImages); // Final processed images
    const [rawImages, setRawImages] = useState(initialRawImages); // Raw uncropped captures
    const [cornersData, setCornersData] = useState({ front: null, back: null }); // Natural coordinates
    const [filter, setFilter] = useState('magic');
    const [permissionStatus, setPermissionStatus] = useState(isNative ? 'prompt' : 'granted');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Review & Crop state
    const [corners, setCorners] = useState([]); // UI display coordinates
    const [naturalCorners, setNaturalCorners] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [livePreviewUrl, setLivePreviewUrl] = useState(null);

    // runonweb AI state
    const [aiLoading, setAiLoading] = useState(false);
    const [aiStatus, setAiStatus] = useState('');
    const [aiProgress, setAiProgress] = useState(0);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const reviewContainerRef = useRef(null);
    const reviewImgRef = useRef(null);
    const loupeCanvasRef = useRef(null);
    const streamRef = useRef(null);

    const currentSide = (step === 'front' || step === 'review_front') ? 'front' : 'back';
    const isReview = step === 'review_front' || step === 'review_back';

    const startWebCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                streamRef.current = s;
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                    videoRef.current.play();
                }
                setIsCameraActive(true);
            }
        } catch (err) {
            console.warn("Webcam not available, falling back to file picker:", err);
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    useEffect(() => {
        if (!isReview) {
            if (!isNative) {
                startWebCamera();
            }
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [step, isReview, isNative]);

    const captureNativePhoto = async () => {
        try {
            const photo = await Camera.getPhoto({
                quality: 95,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera
            });

            if (photo && photo.dataUrl) {
                handleImageCaptured(photo.dataUrl);
            }
        } catch (err) {
            console.warn("Native camera cancelled or failed:", err);
        }
    };

    const pickFromGallery = async () => {
        if (isNative) {
            try {
                const photo = await Camera.getPhoto({
                    quality: 95,
                    allowEditing: false,
                    resultType: CameraResultType.DataUrl,
                    source: CameraSource.Photos
                });
                if (photo && photo.dataUrl) {
                    handleImageCaptured(photo.dataUrl);
                }
            } catch (err) {
                console.warn("Gallery picker cancelled:", err);
            }
        } else {
            fileInputRef.current?.click();
        }
    };

    const captureWebVideo = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        handleImageCaptured(dataUrl);
    };

    const handleWebUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleImageCaptured(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleImageCaptured = async (dataUrl) => {
        setIsProcessing(true);
        stopCamera();
        setImgLoaded(false);

        const targetSide = step === 'front' ? 'front' : 'back';
        const nextStep = step === 'front' ? 'review_front' : 'review_back';

        setRawImages(prev => ({ ...prev, [targetSide]: dataUrl }));
        setStep(nextStep);

        try {
            const result = await detectDNICorners(dataUrl);
            if (result && result.points) {
                setNaturalCorners(result.points);
            } else {
                setNaturalCorners(null);
            }
        } catch (e) {
            console.error("Corner detection error:", e);
            setNaturalCorners(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const getMappingMetrics = useCallback(() => {
        const container = reviewContainerRef.current;
        const img = reviewImgRef.current;
        if (!container || !img || !img.naturalWidth || !img.naturalHeight) return null;

        const rect = container.getBoundingClientRect();
        const natW = img.naturalWidth;
        const natH = img.naturalHeight;

        const contAspect = rect.width / rect.height;
        const imgAspect = natW / natH;

        let displayW, displayH, offsetX, offsetY;
        if (imgAspect > contAspect) {
            displayW = rect.width;
            displayH = rect.width / imgAspect;
            offsetX = 0;
            offsetY = (rect.height - displayH) / 2;
        } else {
            displayH = rect.height;
            displayW = rect.height * imgAspect;
            offsetY = 0;
            offsetX = (rect.width - displayW) / 2;
        }

        return { rect, natW, natH, displayW, displayH, offsetX, offsetY };
    }, []);

    const syncCornersToUI = useCallback(() => {
        const metrics = getMappingMetrics();
        if (!metrics) return;
        const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;

        let natPts = naturalCorners;
        if (!natPts || natPts.length !== 4) {
            natPts = getCenteredDNICorners(natW, natH);
            setNaturalCorners(natPts);
        }

        const uiPts = natPts.map(p => ({
            x: (p.x / natW) * displayW + offsetX,
            y: (p.y / natH) * displayH + offsetY
        }));

        setCorners(uiPts);
        setImgLoaded(true);
    }, [getMappingMetrics, naturalCorners]);

    useEffect(() => {
        if (isReview) {
            syncCornersToUI();
        }
    }, [isReview, syncCornersToUI, step]);

    const updatePreview = useCallback(async () => {
        const rawImg = rawImages[currentSide];
        if (!rawImg || !naturalCorners || naturalCorners.length !== 4) return;
        try {
            const preview = await processDNIImage(rawImg, naturalCorners, {
                filter,
                rounded: true,
                width: 600,
                height: Math.round(600 / DNI_ASPECT_RATIO),
                contractPx: 3
            });
            setLivePreviewUrl(preview);
        } catch (e) {
            console.warn("Live preview failed:", e);
        }
    }, [rawImages, currentSide, naturalCorners, filter]);

    useEffect(() => {
        if (isReview && imgLoaded && naturalCorners) {
            const t = setTimeout(updatePreview, 80);
            return () => clearTimeout(t);
        }
    }, [isReview, imgLoaded, naturalCorners, filter, updatePreview]);

    useEffect(() => {
        if (dragging === null || !loupeCanvasRef.current || !reviewImgRef.current) return;
        const canvas = loupeCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = reviewImgRef.current;
        const metrics = getMappingMetrics();
        if (!metrics) return;

        const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;
        const activeCorner = corners[dragging];
        if (!activeCorner) return;

        const natX = ((activeCorner.x - offsetX) / displayW) * natW;
        const natY = ((activeCorner.y - offsetY) / displayH) * natH;

        const zoom = 2.4;
        const size = canvas.width;
        const srcSize = size / zoom;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(
            img,
            natX - srcSize / 2, natY - srcSize / 2, srcSize, srcSize,
            0, 0, size, size
        );

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, size / 2);
        ctx.lineTo(size / 2 - 8, size / 2);
        ctx.moveTo(size / 2 + 8, size / 2);
        ctx.lineTo(size, size / 2);
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2, size / 2 - 8);
        ctx.moveTo(size / 2 + 8, size / 2);
        ctx.lineTo(size / 2, size);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }, [dragging, corners, getMappingMetrics]);

    const handlePointerDown = (index) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(index);
    };

    const handlePointerMove = (e) => {
        if (dragging === null || !reviewContainerRef.current) return;
        const rect = reviewContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        const updated = [...corners];
        updated[dragging] = { x, y };
        setCorners(updated);

        const metrics = getMappingMetrics();
        if (metrics) {
            const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;
            const updatedNat = updated.map(c => ({
                x: Math.round(((c.x - offsetX) / displayW) * natW),
                y: Math.round(((c.y - offsetY) / displayH) * natH)
            }));
            setNaturalCorners(updatedNat);
        }
    };

    const handlePointerUp = () => setDragging(null);

    const handleRotate = async () => {
        const raw = rawImages[currentSide];
        if (!raw) return;
        setIsProcessing(true);
        try {
            const rotated = await rotateImage90(raw);
            setRawImages(prev => ({ ...prev, [currentSide]: rotated }));
            setNaturalCorners(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAutoDetect = async () => {
        const raw = rawImages[currentSide];
        if (!raw) return;
        setIsProcessing(true);
        try {
            const res = await detectDNICorners(raw);
            if (res && res.points) {
                setNaturalCorners(res.points);
                const metrics = getMappingMetrics();
                if (metrics) {
                    const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;
                    setCorners(res.points.map(p => ({
                        x: (p.x / natW) * displayW + offsetX,
                        y: (p.y / natH) * displayH + offsetY
                    })));
                }
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleResetGuide = () => {
        const metrics = getMappingMetrics();
        if (!metrics) return;
        const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;
        const centered = getCenteredDNICorners(natW, natH);
        setNaturalCorners(centered);
        setCorners(centered.map(p => ({
            x: (p.x / natW) * displayW + offsetX,
            y: (p.y / natH) * displayH + offsetY
        })));
    };

    // runonweb AI background removal
    const handleRunOnWebRemoveBg = async () => {
        const raw = rawImages[currentSide];
        if (!raw) return;
        setAiLoading(true);
        setAiStatus('Inicializando red neuronal BEN2 (runonweb)...');
        setAiProgress(0);

        try {
            const resultPng = await removeBackgroundRunOnWeb(raw, (info) => {
                if (info.progress) {
                    setAiProgress(Math.round(info.progress));
                    setAiStatus(`Descargando BEN2 local en WebGPU (${Math.round(info.progress)}%)...`);
                } else if (info.status) {
                    setAiStatus(`Procesando con IA (${info.status})...`);
                }
            });

            setRawImages(prev => ({ ...prev, [currentSide]: resultPng }));
        } catch (err) {
            console.error("runonweb error:", err);
            alert("Error al ejecutar runonweb BEN2: " + (err.message || 'Verifica compatibilidad WebGPU'));
        } finally {
            setAiLoading(false);
        }
    };

    const confirmStep = async () => {
        const raw = rawImages[currentSide];
        if (!raw || !naturalCorners) return;

        setIsProcessing(true);
        try {
            const processed = await processDNIImage(raw, naturalCorners, {
                filter,
                rounded: true,
                width: 1028,
                height: 648,
                contractPx: 3
            });

            const nextCaptured = { ...capturedImages, [currentSide]: processed };
            const nextCorners = { ...cornersData, [currentSide]: naturalCorners };

            setCapturedImages(nextCaptured);
            setCornersData(nextCorners);

            if (step === 'review_front') {
                setStep('back');
                setNaturalCorners(null);
                setImgLoaded(false);
                setLivePreviewUrl(null);
                if (!isNative) {
                    startWebCamera();
                }
            } else {
                onCapture({
                    front: nextCaptured.front,
                    back: processed,
                    rawFront: rawImages.front,
                    rawBack: raw,
                    cornersFront: nextCorners.front,
                    cornersBack: naturalCorners,
                    filterFront: filter,
                    filterBack: filter
                });
            }
        } catch (err) {
            console.error("Confirmation error:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRedo = () => {
        setImgLoaded(false);
        setNaturalCorners(null);
        setLivePreviewUrl(null);
        if (step === 'review_front') {
            setStep('front');
            if (!isNative) startWebCamera();
        } else {
            setStep('back');
            if (!isNative) startWebCamera();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col text-white select-none">
            {/* Camera View Mode */}
            {!isReview && (
                <div className="relative w-full h-full flex flex-col bg-black">
                    <div className="absolute top-6 left-0 right-0 z-30 flex justify-center px-4">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full text-center shadow-xl">
                            <span className="text-sm font-bold tracking-wide text-white block">
                                {step === 'front' ? '1. DNI ANVERSO (FRENTE)' : '2. DNI REVERSO (PARTE TRASERA)'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Centra el DNI dentro del recuadro
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        {isNative ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
                                <div className="w-24 h-24 rounded-3xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-2xl">
                                    <CameraIcon size={48} />
                                </div>
                                <h3 className="text-2xl font-bold">Tomar foto con la cámara</h3>
                                <p className="text-slate-400 max-w-xs text-sm">
                                    Presiona el botón para abrir la cámara nativa de tu dispositivo.
                                </p>
                            </div>
                        ) : isCameraActive ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                                <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                                    <Upload size={36} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">
                                        Subir {step === 'front' ? 'Anverso' : 'Reverso'}
                                    </h3>
                                    <p className="text-slate-400 text-xs max-w-xs">
                                        Selecciona una foto clara del DNI para recortarlo y eliminar el fondo automáticamente.
                                    </p>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
                                >
                                    <ImageIcon size={20} /> Seleccionar de Galería
                                </button>
                            </div>
                        )}

                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                            <div className="w-full max-w-md aspect-[1.586/1] border-2 border-white/40 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pb-10 flex items-center justify-around bg-gradient-to-t from-black via-black/80 to-transparent z-30">
                        <button
                            onClick={onCancel}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                            title="Cancelar"
                        >
                            <X size={24} />
                        </button>

                        <button
                            onClick={isNative ? captureNativePhoto : isCameraActive ? captureWebVideo : () => fileInputRef.current?.click()}
                            className="p-5 bg-white rounded-full shadow-2xl scale-125 transition-all active:scale-95 border-8 border-slate-900 ring-4 ring-blue-500/50"
                            title="Capturar foto"
                        >
                            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                                <CameraIcon size={20} className="text-white" />
                            </div>
                        </button>

                        <button
                            onClick={pickFromGallery}
                            className="p-4 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 border border-blue-500/40 transition-colors"
                            title="Subir de galería"
                        >
                            <ImageIcon size={24} />
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleWebUpload}
                        />
                    </div>
                </div>
            )}

            {/* Interactive Review & Precision Crop Mode */}
            {isReview && (
                <div
                    className="flex-1 flex flex-col bg-slate-950 overflow-hidden touch-none"
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div>
                            <h2 className="font-bold text-lg text-white">
                                {step === 'review_front' ? 'Revisar Anverso' : 'Revisar Reverso'}
                            </h2>
                            <p className="text-xs text-slate-400">
                                Ajusta las esquinas o pulsa Quitar Fondo IA con runonweb
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRedo}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 border border-white/10"
                            >
                                <RefreshCw size={14} /> Repetir
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 overflow-hidden min-h-0">
                        {/* LEFT: Interactive Crop Workspace */}
                        <div
                            className="flex-[1.5] relative flex items-center justify-center bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                            ref={reviewContainerRef}
                        >
                            <img
                                ref={reviewImgRef}
                                src={rawImages[currentSide]}
                                className={`max-w-full max-h-full object-contain pointer-events-none transition-opacity duration-300 ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
                                alt="Raw capture"
                                onLoad={syncCornersToUI}
                            />

                            {/* Floating Toolbar on Image */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-2xl z-30">
                                <button
                                    onClick={handleRunOnWebRemoveBg}
                                    disabled={aiLoading || isProcessing}
                                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border border-pink-400/40 flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-pink-500/20"
                                    title="Quitar fondo con IA local (runonweb BEN2)"
                                >
                                    <Sparkles size={13} className="text-pink-200" /> Quitar Fondo IA
                                </button>
                                <button
                                    onClick={handleAutoDetect}
                                    disabled={isProcessing || aiLoading}
                                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-white bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 flex items-center gap-1 transition-all"
                                >
                                    <Wand2 size={13} className="text-blue-400" /> Auto-Detectar
                                </button>
                                <button
                                    onClick={handleResetGuide}
                                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1"
                                >
                                    <Maximize2 size={13} /> Centrar
                                </button>
                                <button
                                    onClick={handleRotate}
                                    disabled={isProcessing || aiLoading}
                                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1"
                                >
                                    <RotateCw size={13} /> Girar 90°
                                </button>
                            </div>

                            {/* SVG Dimming Mask */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                                <defs>
                                    <mask id="scanner-dni-mask">
                                        <rect width="100%" height="100%" fill="white" />
                                        {corners.length === 4 && (
                                            <polygon
                                                points={`${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[3].x},${corners[3].y}`}
                                                fill="black"
                                            />
                                        )}
                                    </mask>
                                </defs>

                                <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#scanner-dni-mask)" />

                                {corners.length === 4 && (
                                    <>
                                        <polygon
                                            points={`${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[3].x},${corners[3].y}`}
                                            stroke="#38bdf8"
                                            strokeWidth="2.5"
                                            strokeDasharray="6,6"
                                            fill="rgba(56, 189, 248, 0.12)"
                                        />
                                    </>
                                )}
                            </svg>

                            {/* Corner Handles */}
                            {corners.map((corner, i) => (
                                <div
                                    key={i}
                                    onPointerDown={handlePointerDown(i)}
                                    style={{ left: corner.x, top: corner.y }}
                                    className={`absolute w-11 h-11 -ml-5 -mt-5 rounded-full border-4 border-white shadow-[0_0_20px_rgba(56,189,248,0.9)] cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center transition-transform z-20 ${dragging === i ? 'scale-125 bg-amber-400' : 'bg-blue-600 hover:scale-110'}`}
                                >
                                    <div className="w-2.5 h-2.5 bg-white rounded-full pointer-events-none"></div>
                                </div>
                            ))}

                            {/* Precision Magnifier (Lupa) */}
                            {dragging !== null && corners[dragging] && (
                                <div
                                    style={{
                                        left: Math.max(70, Math.min(corners[dragging].x, (reviewContainerRef.current?.clientWidth || 300) - 70)),
                                        top: corners[dragging].y > 140 ? corners[dragging].y - 120 : corners[dragging].y + 40
                                    }}
                                    className="absolute -translate-x-1/2 pointer-events-none z-40 flex flex-col items-center"
                                >
                                    <div className="w-28 h-28 rounded-full border-4 border-sky-400 bg-black shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden ring-4 ring-sky-500/20">
                                        <canvas
                                            ref={loupeCanvasRef}
                                            width={112}
                                            height={112}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="mt-1 px-2 py-0.5 bg-sky-500 text-black text-[9px] font-black rounded-full uppercase tracking-wider shadow">
                                        Esquina {dragging === 0 ? 'Sup-Izq' : dragging === 1 ? 'Sup-Der' : dragging === 2 ? 'Inf-Der' : 'Inf-Izq'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Live Clean Result */}
                        <div className="flex-1 flex flex-col bg-slate-900/80 rounded-3xl border border-white/10 p-5 justify-between gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-blue-400" /> Resultado sin fondo
                                    </span>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                                        HD 1028 x 648
                                    </span>
                                </div>

                                <div className="aspect-[1.586/1] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-2 shadow-inner relative">
                                    {livePreviewUrl ? (
                                        <img
                                            src={livePreviewUrl}
                                            className="w-full h-full object-contain"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <RefreshCw size={24} className="text-slate-600 animate-spin" />
                                    )}
                                </div>
                            </div>

                            {/* Filter Chips */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                    Filtro de Escaneo
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FILTERS.map((f) => {
                                        const Icon = f.icon;
                                        const isSel = filter === f.id;
                                        return (
                                            <button
                                                key={f.id}
                                                onClick={() => setFilter(f.id)}
                                                className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all ${isSel ? 'border-blue-500 bg-blue-600/20 text-white shadow' : 'border-white/5 bg-slate-800/40 text-slate-400 hover:text-white'}`}
                                            >
                                                <Icon size={14} className={isSel ? 'text-blue-400' : ''} />
                                                <span className="truncate">{f.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Confirm Action */}
                            <button
                                onClick={confirmStep}
                                disabled={isProcessing || aiLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? <RefreshCw size={20} className="animate-spin" /> : <Check size={20} />}
                                {step === 'review_front' ? 'Continuar al Reverso' : 'Finalizar Escaneo'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* runonweb AI Loading Modal */}
                    {aiLoading && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[90] flex items-center justify-center p-6">
                            <div className="bg-slate-900 border border-purple-500/40 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30 animate-pulse">
                                    <Sparkles size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">IA Local (runonweb)</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{aiStatus}</p>
                                </div>
                                {aiProgress > 0 && (
                                    <div className="space-y-1.5">
                                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
                                                style={{ width: `${aiProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-purple-400 font-bold block">{aiProgress}%</span>
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-500">
                                    BEN2 ejecutándose en tu GPU con WebGPU • Privacidad 100%
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Scanner;
