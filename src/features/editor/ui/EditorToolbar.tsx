/**
 * 🎯 FASE 2: EditorToolbar - Barra de ferramentas unificada
 * 
 * Responsabilidades:
 * - Botões de ação (salvar, publicar, exportar)
 * - Indicadores de estado (autosave, dirty)
 * - Seletores de modo (preview, viewport)
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Save,
    Upload,
    Download,
    Eye,
    Code,
    Smartphone,
    Tablet,
    Monitor,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorState } from '@/lib/editor/store/UnifiedEditorStore';

export interface EditorToolbarProps {
    state: EditorState;
    onSave: () => Promise<void>;
    onPublish: () => Promise<void>;
    onExportJSON: () => void;
    onExportV3: () => void;
    onImport: () => void;
    viewport: 'mobile' | 'tablet' | 'desktop' | 'full';
    onViewportChange: (viewport: 'mobile' | 'tablet' | 'desktop' | 'full') => void;
    previewMode: 'live' | 'production';
    onPreviewModeChange: (mode: 'live' | 'production') => void;
    isSaving?: boolean;
    lastSaved?: number | null;
}

export function EditorToolbar({
    state,
    onSave,
    onPublish,
    onExportJSON,
    onExportV3,
    onImport,
    viewport,
    onViewportChange,
    previewMode,
    onPreviewModeChange,
    isSaving = false,
    lastSaved = null,
}: EditorToolbarProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
            {/* Lado esquerdo - Ações principais */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={onSave}
                    disabled={!state.isDirty || isSaving}
                    variant={state.isDirty ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Salvar
                </Button>

                <Button
                    onClick={onPublish}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Publicar
                </Button>

                <div className="h-6 w-px bg-gray-300 mx-1" />

                <Button
                    onClick={onImport}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                >
                    <Download className="w-4 h-4" />
                    Importar
                </Button>

                <Button
                    onClick={onExportJSON}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                >
                    <Code className="w-4 h-4" />
                    JSON
                </Button>

                <Button
                    onClick={onExportV3}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                >
                    <Code className="w-4 h-4" />
                    V3
                </Button>
            </div>

            {/* Centro - Indicadores */}
            <div className="flex items-center gap-4">
                {/* Estado de salvamento */}
                <div className="flex items-center gap-2 text-sm">
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            <span className="text-gray-600">Salvando...</span>
                        </>
                    ) : state.isDirty ? (
                        <>
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-600">Alterações não salvas</span>
                        </>
                    ) : lastSaved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">
                                Salvo {formatLastSaved(lastSaved)}
                            </span>
                        </>
                    ) : null}
                </div>

                {/* Preview mode toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                    <Button
                        onClick={() => onPreviewModeChange('live')}
                        variant={previewMode === 'live' ? 'default' : 'ghost'}
                        size="sm"
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </Button>
                    <Button
                        onClick={() => onPreviewModeChange('production')}
                        variant={previewMode === 'production' ? 'default' : 'ghost'}
                        size="sm"
                        className="gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Publicado
                    </Button>
                </div>
            </div>

            {/* Lado direito - Viewport */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                <Button
                    onClick={() => onViewportChange('mobile')}
                    variant={viewport === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    title="Mobile (375px)"
                >
                    <Smartphone className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onViewportChange('tablet')}
                    variant={viewport === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    title="Tablet (768px)"
                >
                    <Tablet className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onViewportChange('desktop')}
                    variant={viewport === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    title="Desktop (1440px)"
                >
                    <Monitor className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onViewportChange('full')}
                    variant={viewport === 'full' ? 'default' : 'ghost'}
                    size="sm"
                    title="Full Width"
                >
                    <Monitor className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

function formatLastSaved(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'agora';
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
    return `há ${Math.floor(seconds / 86400)}d`;
}
