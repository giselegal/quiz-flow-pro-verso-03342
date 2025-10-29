import React, { Suspense, useMemo, useState } from 'react';
import { appLogger } from '@/utils/logger';
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
import UnifiedBlockRenderer from './UnifiedBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Badge } from '@/components/ui/badge';

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
    /**
     * @deprecated BlockRow agora é substituído por UnifiedBlockRenderer internamente
     */
    BlockRow?: React.ComponentType<any>;
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
    /**
     * Controla a exibição do preview embutido no Canvas.
     * Quando false, o Canvas funciona apenas em modo Editor e oculta o preview interno.
     * Padrão: true (compatibilidade)
     */
    enableInlinePreview?: boolean;
    // Realce de container alvo durante DnD
    hoverContainerId?: string | null;
    setHoverContainerId?: React.Dispatch<React.SetStateAction<string | null>>;
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
    enableInlinePreview = true,
    hoverContainerId,
    setHoverContainerId,
}) => {
    // Compat: sempre calcular virtualização dos blocos raiz (sem parentId)
    const rawBlocks = Array.isArray(selectedStep?.blocks) ? (selectedStep!.blocks as any[]) : [];
    const rootBlocks = useMemo(() => {
        if (!Array.isArray(rawBlocks)) return [] as any[];
        const roots = rawBlocks.filter((b: any) => !('parentId' in b) || !b.parentId);
        return roots.sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));
    }, [rawBlocks]);
    // ✅ Virtualização habilitada automaticamente quando houver muitos blocos raiz e não estiver em drag
    // Reduzido de 60 → 20 para ativar mais cedo e evitar custo de renderização antes do limiar
    // Padrão: habilitar virtualização apenas em listas grandes (>= 60) e quando não há drag ativo
    const virtualizationEnabled = (rawBlocks?.length || 0) >= 60 && (activeId == null);
    const {
        visible: vVisible,
        topSpacer: vTopSpacer,
        bottomSpacer: vBottomSpacer,
        total: vTotal,
    } = useVirtualBlocks({ blocks: rootBlocks, rowHeight: 140, overscan: 6, enabled: virtualizationEnabled });

    // 🎯 USAR EDITOR MODE CONTEXT ao invés de activeTab
    const {
        viewMode,
        setViewMode,
        isEditMode,
        isPreviewMode,
        previewSessionData,
        updatePreviewSessionData,
        resetPreviewSession,
    } = useEditorMode();
    const { previewDevice, setPreviewDevice } = useEditorMode();

    appLogger.debug('🔍 CanvasArea render', { selectedStepId: selectedStep?.id, viewMode });

    // 🚨 DEPRECATION WARNING para activeTab/onTabChange
    if (activeTab !== undefined && process.env.NODE_ENV === 'development') {
        appLogger.warn(
            '⚠️ DEPRECATION: activeTab/onTabChange estão deprecated.\n' +
            'Use EditorModeContext (viewMode) ao invés.',
        );
    }

    // 🎯 MIGRAÇÃO INTELIGENTE: Converter blocos para metadata se necessário
    // Fallback: se nenhuma etapa estiver selecionada, usar a primeira etapa disponível
    const migratedStep = useMemo(() => {
        const base = selectedStep || (Array.isArray(steps) && steps.length > 0 ? steps[0] : null);
        if (!base) return null;
        return smartMigration(base);
    }, [selectedStep, steps]);

    appLogger.debug('🔍 CanvasArea - migratedStep', { stepId: migratedStep?.id, type: migratedStep?.type });

    // 🔗 Integrar com EditorProvider: pegar blocos do estado para o step atual
    const editor = useEditor({ optional: true } as any);
    const stepBlocks = useMemo(() => {
        if (!migratedStep) return [] as any[];
        const key = migratedStep.id;
        return (editor?.state?.stepBlocks?.[key] || migratedStep.blocks || []) as any[];
    }, [editor?.state?.stepBlocks, migratedStep]);

    // Fonte de dados do step (diagnóstico)
    const stepSource = useMemo(() => {
        const key = migratedStep?.id || '';
        return (editor?.state?.stepSources?.[key] || '').toString();
    }, [editor?.state?.stepSources, migratedStep?.id]);

    // ✅ NOVO: Zona droppable ao final do canvas para aceitar novos componentes
    const { setNodeRef: setDropZoneRef, isOver } = useDroppable({
        id: 'canvas-end',
    });

    // 🔬 DEV: toggle simples para avaliar react-window vs virtualização custom
    const [useRW, setUseRW] = useState<boolean>(false);
    const [RWModule, setRWModule] = useState<any>(null);
    React.useEffect(() => {
        let active = true;
        if (process.env.NODE_ENV === 'development' && useRW) {
            import('react-window')
                .then((mod) => { if (active) setRWModule(mod); })
                .catch(() => { if (active) setRWModule(null); });
        } else {
            setRWModule(null);
        }
        return () => { active = false; };
    }, [useRW]);

    return (
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
                    {enableInlinePreview && (
                        <Button
                            onClick={() => setViewMode('preview')}
                            variant={isPreviewMode() ? 'default' : 'outline'}
                            size="sm"
                            className="gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </Button>
                    )}
                    {process.env.NODE_ENV === 'development' && (
                        <Button
                            onClick={() => setUseRW(v => !v)}
                            variant={useRW ? 'default' : 'outline'}
                            size="sm"
                            className="gap-2"
                            title="Alternar react-window (DEV)"
                        >
                            RW
                        </Button>
                    )}
                </div>

                {/* 🎯 DEVICE CONTROLS - Apenas em modo preview */}
                {enableInlinePreview && isPreviewMode() && (
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

            {/* 🎯 EDIT MODE - Renderização modular com componentes especializados (ou caminho legacy/virtualizado) */}
            <div
                className="flex-1 overflow-auto p-4"
                style={{ display: (!enableInlinePreview || isEditMode()) ? 'block' : 'none' }}
                data-testid="canvas-edit-mode"
            >
                {migratedStep ? (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent>
                            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b mb-4">
                                <div className="px-3 py-2">
                                    <FixedProgressHeader config={headerConfig} steps={steps} currentStepId={migratedStep.id} />
                                </div>
                                {migratedStep?.id && stepSource && (
                                    <div className="px-3 pb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>Fonte:</span>
                                        <Badge variant="outline">{stepSource}</Badge>
                                    </div>
                                )}
                            </div>

                            {/* 🎯 RENDERIZAÇÃO UNIFICADA - Sistema WYSIWYG Real */}
                            {(virtualizationEnabled || BlockRow) ? (
                                <div data-testid="canvas-unified-rendering">
                                    {virtualizationEnabled && (
                                        <div className="mb-2 text-xs text-muted-foreground flex items-center gap-2">
                                            <span>Virtualização ativa — {vTotal} blocos — exibindo {vVisible.length}</span>
                                            {process.env.NODE_ENV === 'development' && (
                                                <span className="text-[10px] text-slate-400">modo: {useRW ? 'react-window' : 'custom'}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Caminho experimental com react-window (DEV) */}
                                    {virtualizationEnabled && useRW && process.env.NODE_ENV === 'development' && RWModule?.FixedSizeList ? (
                                        <div className="border rounded-md">
                                            <RWModule.FixedSizeList
                                                height={800}
                                                width={'100%'}
                                                itemCount={rootBlocks.length}
                                                itemSize={140}
                                                itemKey={(index: number) => rootBlocks[index].id}
                                            >
                                                {({ index, style }: { index: number; style: React.CSSProperties }) => {
                                                    const block = rootBlocks[index];
                                                    return (
                                                        <div style={style}>
                                                            <UnifiedBlockRenderer
                                                                key={block.id}
                                                                block={block}
                                                                allBlocks={rootBlocks}
                                                                mode="edit"
                                                                isSelected={selectedBlockId === block.id}
                                                                isMultiSelected={isMultiSelected?.(block.id)}
                                                                onBlockClick={(e) => handleBlockClick?.(e, block)}
                                                                onDelete={() => removeBlock?.(migratedStep.id, block.id)}
                                                                onDuplicate={() => {
                                                                    setBlockPendingDuplicate?.(block);
                                                                    setTargetStepId?.(migratedStep.id);
                                                                    setDuplicateModalOpen?.(true);
                                                                }}
                                                                renderBlockPreview={(blk) => renderBlockPreview?.(blk, rootBlocks) || null}
                                                            />
                                                        </div>
                                                    );
                                                }}
                                            </RWModule.FixedSizeList>
                                        </div>
                                    ) : (
                                        <>
                                            {vTopSpacer > 0 && <div style={{ height: vTopSpacer }} />}
                                            {vVisible.map((block: any) => (
                                                <UnifiedBlockRenderer
                                                    key={block.id}
                                                    block={block}
                                                    allBlocks={rootBlocks}
                                                    mode="edit"
                                                    isSelected={selectedBlockId === block.id}
                                                    isMultiSelected={isMultiSelected?.(block.id)}
                                                    onBlockClick={(e) => handleBlockClick?.(e, block)}
                                                    onDelete={() => removeBlock?.(migratedStep.id, block.id)}
                                                    onDuplicate={() => {
                                                        setBlockPendingDuplicate?.(block);
                                                        setTargetStepId?.(migratedStep.id);
                                                        setDuplicateModalOpen?.(true);
                                                    }}
                                                    renderBlockPreview={(blk) => renderBlockPreview?.(blk, rootBlocks) || null}
                                                />
                                            ))}
                                            {vBottomSpacer > 0 && <div style={{ height: vBottomSpacer }} />}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* 🎯 COMPONENTES MODULARES - Mantém arquitetura do template */}
                                    <UnifiedStepRenderer
                                        step={{
                                            ...migratedStep,
                                            blocks: stepBlocks,
                                        } as any}
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
                                </>
                            )}

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
            {enableInlinePreview && (
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

                                {/* Suporte ao modo legado controlado via props activeTab/onTabChange */}
                                {typeof activeTab !== 'undefined' && (
                                    <div className="mb-3 flex items-center gap-2">
                                        <button data-testid="tab-trigger-canvas" onClick={() => onTabChange?.('canvas')}>Canvas</button>
                                        <button data-testid="tab-trigger-preview" onClick={() => onTabChange?.('preview')}>Preview</button>
                                    </div>
                                )}

                                {BlockRow ? (
                                    // Em caminho legacy, previewNode só aparece quando activeTab === 'preview'
                                    <>
                                        {activeTab === 'preview' && previewNode}
                                    </>
                                ) : (
                                    <>
                                        {/* 🎯 WYSIWYG Real: Mesmo componente, totalmente interativo */}
                                        {/* ✅ SUSPENSE REMOVIDO - lazy() components já têm Suspense interno */}
                                        <UnifiedStepRenderer
                                            step={{
                                                ...migratedStep,
                                                blocks: stepBlocks,
                                            } as any}
                                            mode="preview"
                                            sessionData={previewSessionData}
                                            onUpdateSessionData={updatePreviewSessionData}
                                        />
                                    </>
                                )}
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
            )}
        </div>
    );
};

export default CanvasArea;
