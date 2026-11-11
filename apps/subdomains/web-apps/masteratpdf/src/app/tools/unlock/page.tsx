'use client';

import React, { useState } from 'react';
import { 
    Unlock, 
    Lock, 
    KeyRound, 
    Eye, 
    EyeOff, 
    Trash2, 
    CheckCircle2, 
    ShieldCheck, 
    AlertTriangle 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';
import { checkPdfEncrypted, unlockPdf } from '@/lib/pdf/pdfUnlocker';

export default function UnlockPage() {
    const tool = getTool('unlock');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    
    const [file, setFile] = useState<File | null>(null);
    const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [checkingLock, setCheckingLock] = useState<boolean>(false);

    const handleUpload = async (files: File[]) => {
        const { valid, errors } = validateFiles(files, {
            accept: ['.pdf', 'application/pdf'],
            maxFiles: 1,
        });

        if (errors.length > 0) {
            setError(errors.map((e) => e.error).join(' · '));
            return;
        }

        if (valid.length > 0) {
            const f = valid[0];
            setFile(f);
            setPassword('');
            setCheckingLock(true);

            try {
                const buffer = await f.arrayBuffer();
                const encrypted = await checkPdfEncrypted(buffer);
                setIsEncrypted(encrypted);
            } catch {
                setIsEncrypted(true);
            } finally {
                setCheckingLock(false);
            }
        }
    };

    const handleUnlock = () => {
        if (!file) return;

        run(async (setProgress) => {
            setProgress(20, 'Verificando firma criptográfica…');
            const buffer = await file.arrayBuffer();

            setProgress(50, 'Descifrando contenido y eliminando restricciones…');
            const res = await unlockPdf(buffer, password);

            if (!res.success || !res.bytes) {
                throw new Error(res.error || 'No se pudo desbloquear el PDF.');
            }

            setProgress(90, 'Generando PDF sin restricciones…');
            const blob = new Blob([new Uint8Array(res.bytes)], { type: 'application/pdf' });
            setProgress(100, '¡PDF desbloqueado con éxito!');

            const baseName = file.name.replace(/\.pdf$/i, '');
            return {
                blob,
                fileName: `${baseName}-desbloqueado.pdf`,
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        setPassword('');
        reset();
    };

    // Stage 1: Upload
    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar PDF con contraseña"
                dropLabel="o arrastra el PDF aquí"
                onFiles={handleUpload}
                error={error}
            />
        );
    }

    // Stage 3: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Desbloqueando documento PDF…" progress={progress} message={message} />;
    }

    // Stage 4: Download
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡PDF Desbloqueado con éxito!"
                downloadLabel="Descargar PDF sin restricciones"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="unlock"
            />
        );
    }

    // Stage 2: Edit Workspace
    return (
        <Workspace
            title={tool.name}
            actionLabel={isEncrypted ? 'Desbloquear PDF' : 'Guardar sin restricciones'}
            onAction={handleUnlock}
            actionDisabled={isEncrypted && password.trim().length === 0}
            error={error}
            toolbar={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            1 archivo seleccionado
                        </span>
                        {file && (
                            <span className="text-xs text-muted">
                                ({file.name} · {formatBytes(file.size)})
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cambiar archivo</span>
                    </button>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Estado de seguridad">
                        <div className="p-3.5 rounded-2xl bg-canvas border border-line space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-ink">
                                {isEncrypted ? (
                                    <>
                                        <Lock className="w-4 h-4 text-brand" />
                                        <span>Documento con protección</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-ok" />
                                        <span className="text-ok">Sin contraseña detectada</span>
                                    </>
                                )}
                            </div>
                            <p className="text-[11px] text-muted leading-relaxed">
                                {isEncrypted
                                    ? 'Introduce la contraseña para descifrar el contenido y guardar una copia libre de candados.'
                                    : 'Este PDF no requiere clave de apertura. Puedes descargarlo para limpiar permisos de edición.'}
                            </p>
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Resumen del archivo">
                        <StatRow label="Nombre" value={file?.name || ''} />
                        <StatRow label="Tamaño" value={file ? formatBytes(file.size) : ''} />
                        <StatRow label="Protección" value={isEncrypted ? 'Cifrado AES / RC4' : 'Libre'} />
                    </SidebarSection>

                    <Notice tone="info">
                        La contraseña no se almacena ni se transmite por internet. El descifrado ocurre en la memoria de tu dispositivo.
                    </Notice>
                </div>
            }
        >

            <div className="max-w-md mx-auto py-12 px-4 space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-brand/10 text-brand flex items-center justify-center shadow-lift">
                        {isEncrypted ? <Lock className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
                    </div>
                    <h2 className="text-xl font-bold text-ink">
                        {isEncrypted ? 'Introduce la contraseña del documento' : 'Documento listo para limpiar'}
                    </h2>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                        {isEncrypted
                            ? 'Para quitar permanentemente la protección, introduce la clave una sola vez.'
                            : 'El documento se volverá a compilar limpio y sin restricciones.'}
                    </p>
                </div>

                {isEncrypted && (
                    <div className="space-y-4 bg-surface p-6 rounded-3xl border border-line shadow-card">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-ink">
                                Contraseña de apertura:
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                                    <KeyRound className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && password.trim().length > 0) {
                                            handleUnlock();
                                        }
                                    }}
                                    placeholder="Escribe la clave aquí…"
                                    autoFocus
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-line bg-canvas text-sm font-semibold text-ink placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-ink transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleUnlock}
                            disabled={password.trim().length === 0}
                            className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-cta transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Unlock className="w-4 h-4" />
                            <span>Desbloquear PDF ahora</span>
                        </button>
                    </div>
                )}
            </div>
        </Workspace>
    );
}
