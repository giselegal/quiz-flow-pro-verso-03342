import React, { Suspense, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Smartphone, Tablet, Monitor, Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

import { BlockComponent, EditableQuizStep } from '../types';
import { useEditorMode, usePreviewDevice } from '@/contexts/editor/EditorModeContext';
import { UnifiedStepRenderer } from './UnifiedStepRenderer';
import { smartMigration } from '@/utils/stepDataMigration';

// Virtualização agora tratada internamente via hook
import { useVirtualBlocks } from '../hooks/useVirtualBlocks';

export interface CanvasAreaProps {
    /**
     * @deprecated Use viewMode from EditorModeContext instead
     */
    activeTab?: string;
    /**
     * @deprecated Use EditorModeContext actions instead
     */
    onTabChange?: (tab: string) => void;
    steps: EditableQuizStep[];
    selectedStep?: EditableQuizStep;
    headerConfig: any;
    liveScores: Record<string, number>;
    topStyle?: string;
    BlockRow: React.ComponentType<any>;
    byBlock: Record<string, any[]>;
    selectedBlockId: string;
    isMultiSelected: (id: string) => boolean;
    /** Handler padronizado: (e, block) */
    handleBlockClick: (e: React.MouseEvent, block: BlockComponent) => void;
    renderBlockPreview: (block: BlockComponent, allBlocks: BlockComponent[]) => React.ReactNode;
    removeBlock: (stepId: string, blockId: string) => void;
    setBlockPendingDuplicate: (block: BlockComponent) => void;
    setTargetStepId: (id: string) => void;
    setDuplicateModalOpen: (open: boolean) => void;
    activeId: string | null; // usado para desativar virtualização durante drag
    previewNode?: React.ReactNode;
    FixedProgressHeader: React.ComponentType<{ config: any; steps: EditableQuizStep[]; currentStepId: string }>;
    StyleResultCard?: React.ComponentType<any>;
    OfferMap?: React.ComponentType<any>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    activeTab, // deprecated
    onTabChange, // deprecated
    steps,
    selectedStep,
    headerConfig,
    liveScores,
    topStyle,
    BlockRow,
    byBlock,
    selectedBlockId,
    isMultiSelected,
    handleBlockClick,
    renderBlockPreview,
    removeBlock,
    setBlockPendingDuplicate,
    setTargetStepId,
    setDuplicateModalOpen,
    activeId,
    previewNode,
    FixedProgressHeader,
    StyleResultCard,
    OfferMap,
}) => {
    // 🎯 USAR EDITOR MODE CONTEXT ao invés de activeTab
    const {
        viewMode,
        setViewMode,
        isEditMode,
        isPreviewMode,
        previewSessionData,
        updatePreviewSessionData,
        resetPreviewSession
    } = useEditorMode();
    const { previewDevice, setPreviewDevice } = useEditorMode();

    console.log('🔍 CanvasArea render - selectedStep:', selectedStep?.id, 'viewMode:', viewMode);

    // 🚨 DEPRECATION WARNING para activeTab/onTabChange
    if (activeTab !== undefined && process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️ DEPRECATION: activeTab/onTabChange estão deprecated.\n' +
            'Use EditorModeContext (viewMode) ao invés.'
        );
    }

    // 🎯 MIGRAÇÃO INTELIGENTE: Converter blocos para metadata se necessário
    const migratedStep = useMemo(() => {
        if (!selectedStep) return null;
        return smartMigration(selectedStep);
    }, [selectedStep]);

    console.log('🔍 CanvasArea - migratedStep:', migratedStep?.id, 'type:', migratedStep?.type);

    // ✅ NOVO: Zona droppable ao final do canvas para aceitar novos componentes
    const { setNodeRef: setDropZoneRef, isOver } = useDroppable({
        id: 'canvas-end'
    }); return (
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
            {/* 🎯 CANVAS HEADER - Controles de modo e device */}
            <div className="px-4 py-2 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setViewMode('edit')}
                        variant={isEditMode() ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Editor
                    </Button>
                    <Button
                        onClick={() => setViewMode('preview')}
                        variant={isPreviewMode() ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </Button>
                </div>

                {/* 🎯 DEVICE CONTROLS - Apenas em modo preview */}
                {isPreviewMode() && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-2">Device:</span>
                        <Button
                            onClick={() => setPreviewDevice('mobile')}
                            variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-1"
                        >
                            <Smartphone className="w-3 h-3" />
                        </Button>
                        <Button
                            onClick={() => setPreviewDevice('tablet')}
                            variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-1"
                        >
                            <Tablet className="w-3 h-3" />
                        </Button>
                        <Button
                            onClick={() => setPreviewDevice('desktop')}
                            variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-1"
                        >
                            <Monitor className="w-3 h-3" />
                        </Button>
                    </div>
                )}
            </div>

            {/* 🎯 EDIT MODE - Renderização modular com componentes reais */}
            <div
                className="flex-1 overflow-auto p-4"
                style={{ display: isEditMode() ? 'block' : 'none' }}
                data-testid="canvas-edit-mode"
            >
                {migratedStep ? (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent>
                            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b mb-4">
                                <div className="px-3 py-2">
                                    <FixedProgressHeader config={headerConfig} steps={steps} currentStepId={migratedStep.id} />
                                </div>
                            </div>

                            {/* 🎯 WYSIWYG Real: Renderizar componente de step real */}
                            <UnifiedStepRenderer
                                step={migratedStep}
                                mode="edit"
                                isSelected={selectedBlockId === migratedStep.id}
                                onStepClick={(e, step) => handleBlockClick(e, step as any)}
                                onDelete={() => removeBlock(migratedStep.id, migratedStep.id)}
                                onDuplicate={() => {
                                    setBlockPendingDuplicate(migratedStep as any);
                                    setTargetStepId(migratedStep.id);
                                    setDuplicateModalOpen(true);
                                }}
                            />

                            {/* ✅ ZONA DROPPABLE - Aceita componentes arrastados da biblioteca */}
                            <div
                                ref={setDropZoneRef}
                                className={`
                                    mt-4 p-8 border-2 border-dashed rounded-lg transition-all
                                    ${isOver
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center justify-center text-center gap-2">
                                    <Plus className="w-8 h-8 text-gray-400" />
                                    <p className="text-sm text-gray-600 font-medium">
                                        {isOver ? 'Solte aqui' : 'Arraste componentes aqui'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Componentes serão adicionados ao final
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Selecione uma etapa para editar
                    </div>
                )}
            </div>

            {/* 🎯 PREVIEW MODE - WYSIWYG Real: Mesmo componente do Edit, totalmente interativo */}
            <div
                className="flex-1 overflow-auto p-4"
                style={{ display: isPreviewMode() ? 'block' : 'none' }}
                data-testid="canvas-preview-mode"
            >
                {migratedStep ? (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent>
                            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b mb-4">
                                <div className="px-3 py-2">
                                    <FixedProgressHeader config={headerConfig} steps={steps} currentStepId={migratedStep.id} />
                                </div>
                            </div>

                            {/* 🎯 WYSIWYG Real: Mesmo componente, totalmente interativo */}
                            <Suspense fallback={
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-muted-foreground">Carregando preview...</div>
                                </div>
                            }>
                                <UnifiedStepRenderer
                                    step={migratedStep}
                                    mode="preview"
                                    sessionData={previewSessionData}
                                    onUpdateSessionData={updatePreviewSessionData}
                                />
                            </Suspense>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <p className="text-sm">Preview vazio</p>
                            <p className="text-xs mt-1">Selecione uma etapa</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasArea;
