import React, { Suspense, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Smartphone, Tablet, Monitor } from 'lucide-react';

import { BlockComponent, EditableQuizStep } from '../types';
import { useEditorMode, usePreviewDevice } from '@/contexts/editor/EditorModeContext';
import { IsolatedPreview } from '../canvas/IsolatedPreview';

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
    const { viewMode, setViewMode, isEditMode, isPreviewMode } = useEditorMode();
    const { previewDevice, setPreviewDevice } = useEditorMode();
    
    console.log('🔍 CanvasArea render - selectedStep:', selectedStep?.id, 'viewMode:', viewMode);
    
    // 🚨 DEPRECATION WARNING para activeTab/onTabChange
    if (activeTab !== undefined && process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️ DEPRECATION: activeTab/onTabChange estão deprecated.\n' +
            'Use EditorModeContext (viewMode) ao invés.'
        );
    }

    // Usar useMemo para calcular rootBlocks uma vez
    const rootBlocks = useMemo(() => {
        if (!selectedStep || !selectedStep.blocks) return [];
        return selectedStep.blocks
            .filter(b => !b.parentId)
            .sort((a, b) => a.order - b.order);
    }, [selectedStep]);
    console.log('✅ Hook 2: useMemo(rootBlocks) -', rootBlocks.length, 'blocks');

    // ✅ CORREÇÃO: Chamar hook useVirtualBlocks no nível superior
    const virtualizationThreshold = 60;
    const virtualizationEnabled = rootBlocks.length >= virtualizationThreshold && !activeId;
    console.log('✅ Hook 3: useVirtualBlocks - enabled:', virtualizationEnabled);

    const { visible, topSpacer, bottomSpacer, containerRef } = useVirtualBlocks({
        blocks: rootBlocks,
        rowHeight: 140,
        overscan: 6,
        enabled: virtualizationEnabled,
    });
    console.log('✅ Hooks completos - visible:', visible.length, 'total:', rootBlocks.length);

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

            {/* 🎯 EDIT MODE - Sempre montado, visível apenas quando isEditMode */}
            <div 
                className="flex-1 overflow-auto p-4"
                style={{ display: isEditMode() ? 'block' : 'none' }}
                data-testid="canvas-edit-mode"
            >
                    {selectedStep ? (
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardContent>
                                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b mb-4">
                                    <div className="px-3 py-2">
                                        <FixedProgressHeader config={headerConfig} steps={steps} currentStepId={selectedStep.id} />
                                    </div>
                                </div>
                                {(!selectedStep.blocks || selectedStep.blocks.length === 0) ? (
                                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed rounded-md bg-white/40">(vazio)</div>
                                ) : (
                                    <div ref={containerRef} className="space-y-2 pr-1 bg-white/40 overflow-visible">
                                        <SortableContext items={[...rootBlocks.map(b => b.id), 'canvas-end']} strategy={verticalListSortingStrategy}>
                                            <TooltipProvider>
                                                <div style={{ position: 'relative' }}>
                                                    {virtualizationEnabled && topSpacer > 0 && <div style={{ height: topSpacer }} />}
                                                    {visible.map(block => (
                                                        <BlockRow
                                                            key={block.id}
                                                            block={block}
                                                            byBlock={byBlock}
                                                            selectedBlockId={selectedBlockId}
                                                            isMultiSelected={isMultiSelected}
                                                            handleBlockClick={handleBlockClick}
                                                            renderBlockPreview={renderBlockPreview}
                                                            allBlocks={selectedStep.blocks}
                                                            removeBlock={removeBlock}
                                                            stepId={selectedStep.id}
                                                            setBlockPendingDuplicate={setBlockPendingDuplicate}
                                                            setTargetStepId={setTargetStepId}
                                                            setDuplicateModalOpen={setDuplicateModalOpen}
                                                        />
                                                    ))}
                                                    {virtualizationEnabled && bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
                                                    <div id="canvas-end" className="h-8 flex items-center justify-center text-[10px] text-slate-400 border border-dashed mx-2 my-2 rounded">Soltar aqui para final</div>
                                                    {!virtualizationEnabled && visible.length === 0 && (
                                                        <div className="text-[11px] text-muted-foreground italic">(sem blocos raiz)</div>
                                                    )}
                                                </div>
                                            </TooltipProvider>
                                        </SortableContext>
                                        {virtualizationEnabled && (
                                            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent text-[10px] text-center py-1 text-slate-500 border-t">
                                                Virtualização ativa · {rootBlocks.length} blocos · exibindo {visible.length}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Selecione uma etapa para editar
                    </div>
                )}
            </div>

            {/* 🎯 PREVIEW MODE - Sempre montado, visível apenas quando isPreviewMode */}
            <div 
                className="flex-1 overflow-hidden"
                style={{ display: isPreviewMode() ? 'flex' : 'none' }}
                data-testid="canvas-preview-mode"
            >
                <Suspense fallback={
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="text-sm text-muted-foreground">Carregando preview...</div>
                    </div>
                }>
                    {selectedStep && selectedStep.blocks && selectedStep.blocks.length > 0 ? (
                        <IsolatedPreview 
                            blocks={selectedStep.blocks as any}
                            funnelId="editor-preview"
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="text-center text-muted-foreground">
                                <p className="text-sm">Preview vazio</p>
                                <p className="text-xs mt-1">Adicione blocos no editor</p>
                            </div>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default CanvasArea;
