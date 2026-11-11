'use client';

import React, { useState, useCallback } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { 
    ImagePlus, 
    Trash2, 
    RotateCw, 
    Layers, 
    FileText 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    Segmented, 
    OptionCard, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { SortableThumb } from '@/components/tool/ThumbCard';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

interface ImageItem {
    id: string;
    file: File;
    name: string;
    size: number;
    preview: string;
    rotation: number;
}

export default function JpgToPdfPage() {
    const tool = getTool('jpg-to-pdf');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const [images, setImages] = useState<ImageItem[]>([]);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [margin, setMargin] = useState<'none' | 'small' | 'large'>('none');
    const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const handleAddImages = useCallback(async (files: File[]) => {
        const { valid, errors } = validateFiles(files, {
            accept: ['.jpg', '.jpeg', '.png', 'image/jpeg', 'image/png'],
        });

        if (errors.length > 0) {
            setError(errors.map((e) => e.error).join(' · '));
        }

        if (valid.length === 0) return;

        const newItems: ImageItem[] = await Promise.all(
            valid.map(
                (f) =>
                    new Promise<ImageItem>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            resolve({
                                id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                file: f,
                                name: f.name,
                                size: f.size,
                                preview: e.target?.result as string,
                                rotation: 0,
                            });
                        };
                        reader.readAsDataURL(f);
                    })
            )
        );

        setImages((prev) => [...prev, ...newItems]);
    }, [setError]);

    const handleRemove = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const handleRotate = (id: string) => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
            )
        );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleConvert = () => {
        if (images.length === 0) return;

        run(async (setProgress) => {
            setProgress(5, 'Iniciando creación de documento PDF…');
            const { PDFDocument } = await import('pdf-lib');
            const pdfDoc = await PDFDocument.create();

            const total = images.length;
            for (let i = 0; i < total; i++) {
                const imgItem = images[i];
                setProgress(
                    15 + Math.round((i / total) * 75),
                    `Incrustando imagen ${i + 1} de ${total}…`
                );

                const arrayBuffer = await imgItem.file.arrayBuffer();
                const isPng = imgItem.file.type === 'image/png' || imgItem.name.toLowerCase().endsWith('.png');

                let embeddedImage;
                try {
                    embeddedImage = isPng
                        ? await pdfDoc.embedPng(arrayBuffer)
                        : await pdfDoc.embedJpg(arrayBuffer);
                } catch {
                    // Fallback to jpg embed
                    embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
                }

                // Standard A4 dimensions in points: 595.28 x 841.89
                let pageWidth = orientation === 'portrait' ? 595.28 : 841.89;
                let pageHeight = orientation === 'portrait' ? 841.89 : 595.28;

                if (pageSize === 'fit') {
                    pageWidth = embeddedImage.width;
                    pageHeight = embeddedImage.height;
                }

                const page = pdfDoc.addPage([pageWidth, pageHeight]);

                const marginPoints = margin === 'none' ? 0 : margin === 'small' ? 20 : 40;
                const availableWidth = pageWidth - marginPoints * 2;
                const availableHeight = pageHeight - marginPoints * 2;

                const imgScale = Math.min(
                    availableWidth / embeddedImage.width,
                    availableHeight / embeddedImage.height
                );

                const renderWidth = embeddedImage.width * imgScale;
                const renderHeight = embeddedImage.height * imgScale;

                const x = (pageWidth - renderWidth) / 2;
                const y = (pageHeight - renderHeight) / 2;

                page.drawImage(embeddedImage, {
                    x,
                    y,
                    width: renderWidth,
                    height: renderHeight,
                });
            }

            setProgress(92, 'Generando archivo final…');
            const pdfBytes = await pdfDoc.save();
            setProgress(100, '¡PDF listo!');

            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            return {
                blob,
                fileName: 'imagenes-convertidas.pdf',
            };
        });
    };

    const handleRestart = () => {
        setImages([]);
        reset();
    };

    // Stage 1: Upload
    if (images.length === 0 && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                multiple
                buttonLabel="Seleccionar imágenes JPG"
                dropLabel="o arrastra y suelta tus fotos aquí"
                error={error}
                onFiles={handleAddImages}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Convirtiendo tus imágenes a PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tus imágenes se han convertido a PDF!"
                downloadLabel="Descargar PDF generado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="jpg-to-pdf"
            />
        );
    }

    const totalBytes = images.reduce((acc, img) => acc + img.size, 0);

    return (
        <Workspace
            title="JPG a PDF"
            actionLabel="Convertir a PDF"
            onAction={handleConvert}
            actionDisabled={images.length === 0}
            error={error}
            addFiles={{
                accept: '.jpg,.jpeg,.png,image/jpeg,image/png',
                multiple: true,
                count: images.length,
                label: 'Añadir más imágenes',
                onFiles: handleAddImages,
            }}
            toolbar={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                        {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} · {formatBytes(totalBytes)}
                    </span>
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Limpiar todo</span>
                    </button>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Orientación de la página">
                        <Segmented
                            value={orientation}
                            onChange={(val) => setOrientation(val as 'portrait' | 'landscape')}
                            options={[
                                { value: 'portrait', label: 'Vertical' },
                                { value: 'landscape', label: 'Horizontal' },
                            ]}
                        />
                    </SidebarSection>

                    <SidebarSection title="Tamaño de página">
                        <Segmented
                            value={pageSize}
                            onChange={(val) => setPageSize(val as 'a4' | 'fit')}
                            options={[
                                { value: 'a4', label: 'A4 estándar' },
                                { value: 'fit', label: 'Ajustar a imagen' },
                            ]}
                        />
                    </SidebarSection>

                    <SidebarSection title="Márgenes">
                        <Segmented
                            value={margin}
                            onChange={(val) => setMargin(val as 'none' | 'small' | 'large')}
                            options={[
                                { value: 'none', label: 'Sin margen' },
                                { value: 'small', label: 'Pequeño' },
                                { value: 'large', label: 'Grande' },
                            ]}
                        />
                    </SidebarSection>

                    <SidebarSection title="Resumen">
                        <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                            <StatRow label="Imágenes" value={`${images.length} fotos`} />
                            <StatRow label="Páginas PDF" value={`${images.length} págs`} />
                            <StatRow label="Orientación" value={orientation === 'portrait' ? 'Vertical' : 'Horizontal'} />
                        </div>
                    </SidebarSection>

                    <Notice tone="info">
                        Arrastra las tarjetas para ordenar las imágenes exactamente como desees que aparezcan en tu PDF.
                    </Notice>
                </div>
            }
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                        {images.map((item, idx) => (
                            <SortableThumb
                                key={item.id}
                                id={item.id}
                                index={idx + 1}
                                title={item.name}
                                subtitle={formatBytes(item.size)}
                                thumbnail={item.preview}
                                rotation={item.rotation}
                                size="md"
                                actions={[
                                    {
                                        icon: RotateCw,
                                        label: 'Girar 90°',
                                        onClick: () => handleRotate(item.id),
                                    },
                                    {
                                        icon: Trash2,
                                        label: 'Quitar imagen',
                                        tone: 'danger',
                                        onClick: () => handleRemove(item.id),
                                    },
                                ]}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </Workspace>
    );
}
