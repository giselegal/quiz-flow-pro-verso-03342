import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import EditorNoCodePanel from '../EditorNoCodePanel';

export interface EditorHeaderProps {
    mode: 'edit' | 'preview';
    setMode: (m: 'edit' | 'preview') => void;
    safeCurrentStep: number;
    currentStepKey: string;
    currentStepData: any[];
    actions: any;
    state: any;
    notification: any;
    renderIcon: (name: string, className?: string) => React.ReactNode;
    getStepAnalysis: (step: number) => { icon: string; label: string; desc: string };
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
    mode,
    setMode,
    safeCurrentStep,
    currentStepKey,
    currentStepData,
    actions,
    state,
    notification,
    renderIcon,
    getStepAnalysis,
}) => {
    const { theme, setTheme } = useTheme();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [customTitle, setCustomTitle] = useState('Quiz Quest - Editor Principal');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePublishAll = () => {
        try {
            const entries = Object.entries(state.stepBlocks || {});
            let published = 0;
            const publishOne = (key: string, blocks: any[]) => {
                if (state.isSupabaseEnabled && actions?.publishStepToSupabase) {
                    return actions.publishStepToSupabase(key, blocks).then(() => { });
                } else {
                    return Promise.resolve();
                }
            };
            const tasks: Promise<any>[] = [];
            for (const [key, blocks] of entries) {
                if (Array.isArray(blocks) && blocks.length > 0) {
                    tasks.push(publishOne(key, blocks));
                    published += 1;
                }
            }
            Promise.allSettled(tasks).then(() => {
                notification?.success?.(`Publicadas ${published} etapas com conteúdo.`);
            });
        } catch (err) {
            console.error('Falha ao publicar todas as etapas:', err);
            notification?.error?.('Erro ao publicar todas as etapas');
        }
    };

    return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Seção do Título */}
                    <div className="flex-1 min-w-0">
                        {isEditingTitle ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink rounded-xl flex items-center justify-center">
                                    {renderIcon('target', 'w-5 h-5 text-white')}
                                </div>
                                <input
                                    type="text"
                                    value={customTitle}
                                    onChange={e => setCustomTitle(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') setIsEditingTitle(false);
                                    }}
                                    className="font-medium text-xl text-gray-200 bg-transparent border-b-2 border-brand-brightBlue outline-none flex-1 min-w-0"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink rounded-xl flex items-center justify-center">
                                    {renderIcon('target', 'w-5 h-5 text-white')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1
                                        className="font-medium text-xl text-gray-200 cursor-pointer hover:text-brand-brightBlue truncate"
                                        onClick={() => setIsEditingTitle(true)}
                                        title="Click to edit title"
                                    >
                                        {customTitle}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-brightBlue/20 text-brand-brightBlue border border-brand-brightBlue/30">
                                            Step {safeCurrentStep}
                                        </span>
                                        <span className="text-sm text-gray-500 truncate">
                                            {getStepAnalysis(safeCurrentStep).label}: {getStepAnalysis(safeCurrentStep).desc}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Seção de Controles */}
                    <div className="flex items-center gap-4">
                        {/* Indicador de Status */}
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm',
                                    state.isSupabaseEnabled
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                )}
                                title={state.isSupabaseEnabled ? 'Connected to Supabase' : 'Offline mode'}
                            >
                                <div className={cn('w-2 h-2 rounded-full', state.isSupabaseEnabled ? 'bg-emerald-400' : 'bg-amber-400')} />
                                {state.isSupabaseEnabled ? 'Online' : 'Offline'}
                            </div>
                        </div>

                        {/* Controles de Histórico */}
                        <div className="flex items-center bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <button
                                type="button"
                                onClick={actions.undo}
                                disabled={!actions.canUndo}
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-l-lg',
                                    actions.canUndo ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 cursor-not-allowed bg-gray-800/30'
                                )}
                                title="Undo (Ctrl+Z)"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Desfazer
                            </button>
                            <div className="w-px h-6 bg-gray-200" />
                            <button
                                type="button"
                                onClick={actions.redo}
                                disabled={!actions.canRedo}
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-r-lg transition-colors',
                                    actions.canRedo
                                        ? 'text-white bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700/50'
                                        : 'text-gray-500 cursor-not-allowed bg-gray-900/30 border border-gray-800/30'
                                )}
                                title="Refazer (Ctrl+Y)"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                                </svg>
                                Refazer
                            </button>
                        </div>

                        {/* Controles de Import/Export */}
                        <div className="flex items-center bg-gray-800/80 rounded-lg border border-gray-700/50 shadow-sm backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        const json = actions.exportJSON();
                                        const success = await navigator.clipboard?.writeText?.(json).then(() => true).catch(() => false);
                                        if (success) notification?.success?.('JSON exportado para a área de transferência!');
                                        else notification?.error?.('Erro ao copiar para área de transferência');
                                    } catch {
                                        notification?.error?.('Erro ao exportar JSON');
                                    }
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-l-lg transition-colors"
                                title="Exportar como JSON"
                                aria-label="Exportar estado atual como JSON"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                Export
                            </button>
                            <div className="w-px h-6 bg-gray-700" />

                            <input
                                type="file"
                                accept=".json"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = event => {
                                            try {
                                                const json = event.target?.result as string;
                                                actions.importJSON(json);
                                                notification?.success?.('JSON importado com sucesso!');
                                            } catch (error) {
                                                notification?.error?.('Erro ao importar JSON: ' + (error as Error).message);
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                    e.currentTarget.value = '';
                                }}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                id="import-json"
                                aria-label="Importar arquivo JSON para o editor"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-r-lg transition-colors"
                                title="Importar JSON"
                                aria-label="Importar estado do editor via JSON"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Import
                            </button>
                        </div>

                        {/* Toggle de Tema */}
                        <div className="flex bg-gray-800/80 rounded-lg p-1 border border-gray-700/50 shadow-sm backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                                title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
                                aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                                {theme === 'dark' ? 'Light' : 'Dark'}
                            </button>
                        </div>

                        {/* Toggle Edit/Preview */}
                        <div className="flex bg-gray-800/80 rounded-lg p-1 border border-gray-700/50 shadow-sm backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={() => setMode('edit')}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors',
                                    mode === 'edit'
                                        ? 'bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white shadow-sm'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                )}
                                aria-label="Modo de edição"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('preview')}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium transition-colors',
                                    mode === 'preview'
                                        ? 'bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white shadow-sm'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                )}
                                aria-label="Modo de visualização"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Preview
                            </button>
                        </div>

                        {/* Botão de Salvar */}
                        <button
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white text-sm font-medium rounded-lg hover:opacity-90 shadow-lg backdrop-blur-sm transition-opacity"
                            title="Salvar etapa atual"
                            aria-label="Salvar etapa atual"
                            onClick={() => {
                                try {
                                    const stepId = currentStepKey;
                                    const blocks = currentStepData;
                                    if (state.isSupabaseEnabled && actions?.publishStepToSupabase) {
                                        actions
                                            .publishStepToSupabase(stepId, blocks)
                                            .then((ok: boolean) => {
                                                if (ok) notification?.success?.('Etapa publicada (Supabase + local)!');
                                                else notification?.success?.('Etapa publicada localmente!');
                                            })
                                            .catch(() => {
                                                notification?.success?.('Etapa publicada localmente!');
                                            });
                                    } else {
                                        notification?.success?.('Etapa publicada localmente!');
                                    }
                                } catch (err) {
                                    console.error('Falha ao salvar/publicar etapa:', err);
                                    notification?.error?.('Erro ao salvar/publicar etapa');
                                }
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Save
                        </button>

                        {/* Botão NoCode Configurações */}
                        <EditorNoCodePanel className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#B89B7A] to-[#D4A574] text-white text-sm font-medium rounded-lg hover:opacity-90 shadow-lg backdrop-blur-sm transition-opacity" />

                        <button
                            className="px-4 py-2 bg-gray-800/80 border border-gray-700/50 text-gray-300 text-sm rounded-md hover:bg-gray-700/80 hover:text-white transition-colors backdrop-blur-sm"
                            title="Remover publicação da etapa atual"
                            aria-label="Despublicar etapa atual"
                            onClick={() => {
                                try {
                                    if (state.isSupabaseEnabled && actions?.unpublishStepFromSupabase) {
                                        actions
                                            .unpublishStepFromSupabase(currentStepKey)
                                            .then(() => {
                                                notification?.info?.('Publicação da etapa removida do Supabase e localmente.');
                                            })
                                            .catch(() => {
                                                notification?.info?.('Publicação local da etapa removida.');
                                            });
                                    } else {
                                        notification?.info?.('Publicação local da etapa removida.');
                                    }
                                } catch (err) {
                                    console.error('Falha ao despublicar etapa:', err);
                                    notification?.error?.('Erro ao despublicar etapa');
                                }
                            }}
                        >
                            ⏏️ Despublicar
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                            title="Publicar todas as etapas com conteúdo"
                            aria-label="Publicar todas as etapas"
                            onClick={handlePublishAll}
                        >
                            <span className="inline-flex items-center gap-2">
                                {renderIcon('rocket', 'w-4 h-4')}
                                Publicar tudo
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorHeader;