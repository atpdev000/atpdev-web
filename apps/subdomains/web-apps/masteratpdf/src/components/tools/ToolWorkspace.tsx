'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { PDFProcessor } from '@/lib/pdf/pdfProcessor';
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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, GripVertical, Trash2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface ToolWorkspaceProps {
    title: string;
    description: string;
    acceptedFileTypes?: string;
    multiple?: boolean;
    actionLabel: string;
    onAction: (files: File[]) => Promise<void>;
    renderOptions?: (files: File[]) => React.ReactNode;
}

interface FileWithPreview extends File {
    id: string;
    preview?: string;
}

// Sortable Item Component
const SortableItem = ({ file, onRemove }: { file: FileWithPreview; onRemove: () => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: file.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all mb-2.5 shadow-xs"
        >
            <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                {/* Drag Handle */}
                <button 
                    {...attributes} 
                    {...listeners} 
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Arrastrar para reordenar"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                {/* Thumbnail */}
                <div className="w-12 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {file.preview ? (
                        <img src={file.preview} alt="Vista previa" className="w-full h-full object-cover" />
                    ) : (
                        <FileText className="w-6 h-6 text-slate-400" />
                    )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>

            <button
                onClick={onRemove}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-3 cursor-pointer"
                title="Quitar archivo"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
    title,
    description,
    acceptedFileTypes = '.pdf',
    multiple = false,
    actionLabel,
    onAction,
    renderOptions,
}) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFilesSelected = async (newFiles: File[]) => {
        setError(null);
        setSuccess(false);

        const filesWithPreviews = await Promise.all(
            newFiles.map(async (file) => {
                const id = Math.random().toString(36).substr(2, 9);
                let preview = '';
                if (file.type === 'application/pdf') {
                    preview = await PDFProcessor.generateThumbnail(file);
                } else if (file.type.startsWith('image/')) {
                    preview = URL.createObjectURL(file);
                }
                const fileWithPreview = file as FileWithPreview;
                fileWithPreview.id = id;
                fileWithPreview.preview = preview;
                return fileWithPreview;
            })
        );

        if (multiple) {
            setFiles((prev) => [...prev, ...filesWithPreviews]);
        } else {
            setFiles([filesWithPreviews[0]]);
        }
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAction = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setError(null);
        setSuccess(false);

        try {
            await onAction(files);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocurrió un error al procesar el archivo. Por favor inténtalo de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Top Back Link */}
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a todas las herramientas</span>
                </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
                    {title}
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="space-y-6">
                {/* File Upload Area */}
                {(files.length === 0 || multiple) && (
                    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs">
                        <FileUpload
                            accept={acceptedFileTypes}
                            multiple={multiple}
                            onFilesSelected={handleFilesSelected}
                        />
                    </div>
                )}

                {/* File List & Options */}
                {files.length > 0 && (
                    <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {multiple ? `Archivos seleccionados (${files.length})` : 'Archivo seleccionado'}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {multiple ? 'Arrastra para ordenar antes de procesar' : 'Documento listo para procesar'}
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setFiles([])}
                                className="text-slate-500 hover:text-red-500"
                            >
                                Limpiar lista
                            </Button>
                        </div>

                        {/* Sortable List */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={files.map(f => f.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="mb-6">
                                    {files.map((file) => (
                                        <SortableItem
                                            key={file.id}
                                            file={file}
                                            onRemove={() => removeFile(file.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {/* Custom Tool Options */}
                        {renderOptions && (
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
                                {renderOptions(files)}
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="flex justify-center pt-2">
                            <Button
                                size="lg"
                                onClick={handleAction}
                                isLoading={isProcessing}
                                loadingText="Procesando documento..."
                                className="w-full sm:w-auto sm:min-w-[220px]"
                            >
                                {actionLabel}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Status Messages */}
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-sm text-red-700 dark:text-red-300">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                        <span>¡Operación completada con éxito! Tu archivo procesado se ha descargado automáticamente.</span>
                    </div>
                )}
            </div>
        </div>
    );
};
