import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, X, RefreshCw, RotateCw, Wand2, Eye, Sliders,
    Sparkles, Image as ImageIcon, FileText, CheckCircle2, Maximize2, Cpu, ScanText
} from 'lucide-react';
import {
    processDNIImage,
    detectDNICorners,
    getCenteredDNICorners,
    rotateImage90,
    orderCorners,
    DNI_ASPECT_RATIO
} from '../../utils/imageProcessing';
import { removeBackgroundRunOnWeb, extractDniTextRunOnWeb } from '../../utils/runOnWebHelper';

const FILTERS = [
    { id: 'magic', label: 'Realce Mágico', icon: Sparkles, desc: 'Elimina sombras y blanquea fondo' },
    { id: 'original', label: 'Original HD', icon: ImageIcon, desc: 'Colores directos de la cámara' },
    { id: 'grayscale', label: 'Documento B/N', icon: FileText, desc: 'Escala de grises contrastada' },
    { id: 'bw', label: 'Alto Contraste', icon: Sliders, desc: 'Binarizado nítido tipo fotocopia' }
];

const Editor = ({
    image,
    initialCorners = null,
    initialFilter = 'magic',
    initialRounded = true,
    title = 'Ajustar Bordes y Filtros',
    onConfirm,
    onCancel
}) => {
    const [currentImage, setCurrentImage] = useState(image);
    const [filter, setFilter] = useState(initialFilter);
    const [rounded, setRounded] = useState(initialRounded);
    const [corners, setCorners] = useState([]); // UI display coordinates
    const [naturalCorners, setNaturalCorners] = useState(initialCorners);
    const [dragging, setDragging] = useState(null); // Index 0..3 of corner being dragged
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 }); // Current pointer position for magnifier
    const [imgLoaded, setImgLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('crop'); // 'crop' | 'preview'
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // runonweb AI state
    const [aiLoading, setAiLoading] = useState(false);
    const [aiStatus, setAiStatus] = useState('');
    const [aiProgress, setAiProgress] = useState(0);
    const [ocrResult, setOcrResult] = useState(null);
    const [notification, setNotification] = useState(null);

    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const loupeCanvasRef = useRef(null);

    // Coordinate mapping helper: Natural image pixels <-> Display container pixels
    const getMappingMetrics = useCallback(() => {
        const container = containerRef.current;
        const img = imgRef.current;
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

    // Sync UI corners from natural corners
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
        syncCornersToUI();
    }, [syncCornersToUI, currentImage]);

    // Update real-time Magnifier (Lupa) when dragging
    useEffect(() => {
        if (dragging === null || !loupeCanvasRef.current || !imgRef.current) return;
        const canvas = loupeCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;
        const metrics = getMappingMetrics();
        if (!metrics) return;

        const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;
        const activeCorner = corners[dragging];
        if (!activeCorner) return;

        const natX = ((activeCorner.x - offsetX) / displayW) * natW;
        const natY = ((activeCorner.y - offsetY) / displayH) * natH;

        const zoom = 2.4;
        const size = canvas.width; // 120px
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
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2 - 8, size / 2);
        ctx.moveTo(size / 2 + 8, size / 2);
        ctx.lineTo(size / 2, size);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }, [dragging, corners, getMappingMetrics]);

    // Handle Dragging
    const handlePointerDown = (index) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(index);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const handlePointerMove = (e) => {
        if (dragging === null || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        setDragPos({ x, y });

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

    const handlePointerUp = () => {
        if (dragging !== null) {
            setDragging(null);
        }
    };

    // Auto-detect corners
    const handleAutoDetect = async () => {
        setIsProcessing(true);
        try {
            const result = await detectDNICorners(currentImage);
            if (result && result.points && result.points.length === 4) {
                setNaturalCorners(result.points);
                const metrics = getMappingMetrics();
                if (metrics) {
                    const { natW, natH, displayW, displayH, offsetX, offsetY } = metrics;
                    const uiPts = result.points.map(p => ({
                        x: (p.x / natW) * displayW + offsetX,
                        y: (p.y / natH) * displayH + offsetY
                    }));
                    setCorners(uiPts);
                }
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Reset to Centered DNI Guide
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

    // Rotate Image 90° Clockwise
    const handleRotate = async () => {
        setIsProcessing(true);
        try {
            const rotated = await rotateImage90(currentImage);
            setCurrentImage(rotated);
            setNaturalCorners(null);
        } finally {
            setIsProcessing(false);
        }
    };

    // runonweb: BEN2 AI Background Removal
    const handleRunOnWebRemoveBg = async () => {
        setAiLoading(true);
        setAiStatus('Inicializando red neuronal BEN2...');
        setAiProgress(0);

        try {
            const resultPng = await removeBackgroundRunOnWeb(currentImage, (info) => {
                if (info.progress) {
                    setAiProgress(Math.round(info.progress));
                    setAiStatus(`Descargando modelo local en WebGPU (${Math.round(info.progress)}%)...`);
                } else if (info.status) {
                    setAiStatus(`Procesando con IA (${info.status})...`);
                }
            });

            setCurrentImage(resultPng);
            setNotification('¡Fondo eliminado con IA (runonweb BEN2)!');
            setTimeout(() => setNotification(null), 4000);
        } catch (err) {
            console.error("runonweb error:", err);
            setNotification('Error al ejecutar IA local: ' + (err.message || 'Verifica compatibilidad WebGPU'));
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setAiLoading(false);
        }
    };

    // runonweb: Local OCR text extraction
    const handleRunOnWebOCR = async () => {
        setAiLoading(true);
        setAiStatus('Cargando motor OCR PP-OCRv6...');
        setAiProgress(0);

        try {
            const result = await extractDniTextRunOnWeb(currentImage, (info) => {
                if (info.progress) {
                    setAiProgress(Math.round(info.progress));
                    setAiStatus(`Cargando OCR local (${Math.round(info.progress)}%)...`);
                }
            });

            setOcrResult(result);
            if (result.dniNumber) {
                setNotification(`DNI Detectado: ${result.dniNumber}`);
            } else {
                setNotification('Texto extraído con éxito.');
            }
            setTimeout(() => setNotification(null), 4000);
        } catch (err) {
            console.error("OCR error:", err);
            setNotification('Error al leer texto con OCR local');
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setAiLoading(false);
        }
    };

    // Generate Live Preview
    const generatePreview = useCallback(async () => {
        if (!naturalCorners || naturalCorners.length !== 4) return;
        setIsProcessing(true);
        try {
            const res = await processDNIImage(currentImage, naturalCorners, {
                filter,
                rounded,
                width: 800,
                height: Math.round(800 / DNI_ASPECT_RATIO),
                contractPx: 3
            });
            setPreviewUrl(res);
        } finally {
            setIsProcessing(false);
        }
    }, [currentImage, naturalCorners, filter, rounded]);

    useEffect(() => {
        if (activeTab === 'preview') {
            generatePreview();
        }
    }, [activeTab, generatePreview]);

    // Confirm and Save
    const handleApply = async () => {
        setIsProcessing(true);
        try {
            const finalImage = await processDNIImage(currentImage, naturalCorners, {
                filter,
                rounded,
                width: 1028,
                height: 648,
                contractPx: 3
            });
            onConfirm({
                processedImage: finalImage,
                rawImage: currentImage,
                corners: naturalCorners,
                filter,
                rounded,
                ocrResult
            });
        } catch (err) {
            console.error("Error applying DNI crop:", err);
            onCancel();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[70] flex flex-col text-white select-none">
            {/* Top Navigation */}
            <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Wand2 size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-white leading-tight">{title}</h2>
                        <p className="text-xs text-slate-400">Recorte cuadrilátero + IA local runonweb (BEN2)</p>
                    </div>
                </div>

                {/* View Tabs */}
                <div className="flex bg-slate-900 border border-white/10 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('crop')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'crop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Sliders size={14} /> Ajustar Bordes
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Eye size={14} /> Vista Previa
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        title="Cancelar"
                    >
                        <X size={22} />
                    </button>
                </div>
            </header>

            {/* Notification Banner */}
            {notification && (
                <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 text-center text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> {notification}
                </div>
            )}

            {/* Main Interactive Workspace */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Crop & Marker Canvas Area */}
                {activeTab === 'crop' && (
                    <div
                        className="flex-1 relative flex items-center justify-center bg-black/90 overflow-hidden touch-none"
                        ref={containerRef}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <img
                            ref={imgRef}
                            src={currentImage}
                            className={`max-w-full max-h-full object-contain pointer-events-none transition-opacity duration-300 ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
                            alt="DNI to crop"
                            onLoad={syncCornersToUI}
                        />

                        {/* Floating Quick Action Toolbar */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-2xl z-30">
                            {/* runonweb AI Background Removal Button */}
                            <button
                                onClick={handleRunOnWebRemoveBg}
                                disabled={aiLoading || isProcessing}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border border-pink-400/40 flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-pink-500/20"
                                title="Eliminar fondo con IA local (runonweb BEN2)"
                            >
                                <Sparkles size={14} className="text-pink-200" /> Quitar Fondo IA
                            </button>

                            <button
                                onClick={handleAutoDetect}
                                disabled={isProcessing || aiLoading}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 flex items-center gap-1.5 transition-all active:scale-95"
                                title="Buscar bordes automáticamente"
                            >
                                <Wand2 size={14} className="text-blue-400" /> Auto-Detectar
                            </button>

                            <button
                                onClick={handleResetGuide}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                                title="Restablecer marco centrado"
                            >
                                <Maximize2 size={14} /> Centrar
                            </button>

                            <button
                                onClick={handleRotate}
                                disabled={isProcessing || aiLoading}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                                title="Girar 90 grados"
                            >
                                <RotateCw size={14} /> Girar 90°
                            </button>
                        </div>

                        {/* SVG Dimming Mask & Polygon Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                            <defs>
                                <mask id="editor-dni-mask">
                                    <rect width="100%" height="100%" fill="white" />
                                    {corners.length === 4 && (
                                        <polygon
                                            points={`${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[3].x},${corners[3].y}`}
                                            fill="black"
                                        />
                                    )}
                                </mask>
                            </defs>

                            <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#editor-dni-mask)" />

                            {corners.length === 4 && (
                                <>
                                    <polygon
                                        points={`${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[3].x},${corners[3].y}`}
                                        stroke="#38bdf8"
                                        strokeWidth="2.5"
                                        strokeDasharray="6,6"
                                        fill="rgba(56, 189, 248, 0.12)"
                                    />
                                    {corners.map((c, i) => (
                                        <line
                                            key={i}
                                            x1={c.x}
                                            y1={c.y}
                                            x2={corners[(i + 1) % 4].x}
                                            y2={corners[(i + 1) % 4].y}
                                            stroke="#0284c7"
                                            strokeWidth="2"
                                        />
                                    ))}
                                </>
                            )}
                        </svg>

                        {/* Interactive Corner Handles */}
                        {corners.map((corner, i) => {
                            const isCurrentDrag = dragging === i;
                            return (
                                <div
                                    key={i}
                                    onPointerDown={handlePointerDown(i)}
                                    style={{ left: corner.x, top: corner.y }}
                                    className={`absolute w-11 h-11 -ml-5 -mt-5 rounded-full border-4 border-white shadow-[0_0_20px_rgba(56,189,248,0.9)] cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center transition-transform z-20 ${isCurrentDrag ? 'scale-125 bg-amber-400' : 'bg-blue-600 hover:scale-110'}`}
                                >
                                    <div className="w-2.5 h-2.5 bg-white rounded-full pointer-events-none"></div>
                                </div>
                            );
                        })}

                        {/* Precision Magnifier (Lupa) when dragging */}
                        {dragging !== null && corners[dragging] && (
                            <div
                                style={{
                                    left: Math.max(70, Math.min(corners[dragging].x, (containerRef.current?.clientWidth || 300) - 70)),
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
                )}

                {/* Live Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900/60 overflow-hidden relative">
                        {previewUrl ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-md w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-slate-800 flex items-center justify-center relative group"
                            >
                                <img
                                    src={previewUrl}
                                    className="w-full h-full object-contain"
                                    alt="Preview"
                                />
                                <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                                    <CheckCircle2 size={13} /> {FILTERS.find(f => f.id === filter)?.label}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                <RefreshCw size={36} className="animate-spin text-blue-500" />
                                <p className="text-sm font-medium">Generando vista previa de alta resolución...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Right Controls Panel */}
                <aside className="w-full lg:w-80 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col justify-between gap-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* runonweb AI Section */}
                        <div className="p-4 bg-gradient-to-br from-purple-950/40 to-slate-900 rounded-2xl border border-purple-500/20 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                                <Cpu size={14} /> IA Local runonweb (Midudev)
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Modelos que se ejecutan en tu GPU con WebGPU. 100% privado y sin servidores.
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={handleRunOnWebRemoveBg}
                                    disabled={aiLoading}
                                    className="p-2.5 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-xl text-xs font-bold flex flex-col items-center gap-1 text-purple-200 transition-all active:scale-95"
                                >
                                    <Sparkles size={16} className="text-pink-400" />
                                    <span>BEN2 Quita-Fondo</span>
                                </button>
                                <button
                                    onClick={handleRunOnWebOCR}
                                    disabled={aiLoading}
                                    className="p-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-xl text-xs font-bold flex flex-col items-center gap-1 text-blue-200 transition-all active:scale-95"
                                >
                                    <ScanText size={16} className="text-blue-400" />
                                    <span>OCR Leer DNI</span>
                                </button>
                            </div>

                            {ocrResult && ocrResult.dniNumber && (
                                <div className="mt-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono flex items-center justify-between">
                                    <span>DNI Detectado:</span>
                                    <span className="font-bold text-sm">{ocrResult.dniNumber}</span>
                                </div>
                            )}
                        </div>

                        {/* Filter Selection */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                                Filtro de Documento
                            </label>
                            <div className="grid grid-cols-1 gap-2.5">
                                {FILTERS.map((f) => {
                                    const Icon = f.icon;
                                    const isSelected = filter === f.id;
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => {
                                                setFilter(f.id);
                                                if (activeTab === 'preview') setTimeout(generatePreview, 50);
                                            }}
                                            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${isSelected ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10' : 'border-white/5 bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800/80'}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-sm text-white flex items-center justify-between">
                                                    {f.label}
                                                    {isSelected && <Check size={14} className="text-blue-400" />}
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate">{f.desc}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rounded Corners Switch */}
                        <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-sm block">Esquinas Redondeadas</span>
                                <span className="text-[11px] text-slate-400">Radio oficial DNI ISO/IEC 7810</span>
                            </div>
                            <button
                                onClick={() => {
                                    setRounded(!rounded);
                                    if (activeTab === 'preview') setTimeout(generatePreview, 50);
                                }}
                                className={`w-12 h-7 rounded-full p-1 transition-colors ${rounded ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${rounded ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <button
                            onClick={handleApply}
                            disabled={isProcessing || aiLoading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isProcessing ? <RefreshCw size={20} className="animate-spin" /> : <Check size={20} />}
                            {isProcessing ? 'Procesando...' : 'Guardar y Aplicar'}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Descartar cambios
                        </button>
                    </div>
                </aside>
            </main>

            {/* runonweb AI Loading Modal */}
            {aiLoading && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[90] flex items-center justify-center p-6">
                    <div className="bg-slate-900 border border-purple-500/40 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30 animate-pulse">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">IA en Navegador (runonweb)</h3>
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
                            Modelo ejecutándose en local con WebGPU/WASM • Sin servidores externos
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
