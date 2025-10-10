import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TooltipProvider } from '@/components/ui/tooltip';

import { BlockComponent, EditableQuizStep } from '../types';

// Virtualização agora tratada internamente via hook
import { useVirtualBlocks } from '../hooks/useVirtualBlocks';

// ✅ COMPONENTE EXTRAÍDO: Virtualização de blocos (evita Hook dentro de IIFE)
interface VirtualizedBlockListProps {
    selectedStep: EditableQuizStep;
    activeId: string | null;
    BlockRow: React.ComponentType<any>;
    byBlock: Record<string, any[]>;
    selectedBlockId: string;
    isMultiSelected: (id: string) => boolean;
    handleBlockClick: (e: React.MouseEvent, block: BlockComponent) => void;
    renderBlockPreview: (block: BlockComponent, allBlocks: BlockComponent[]) => React.ReactNode;
    removeBlock: (stepId: string, blockId: string) => void;
    setBlockPendingDuplicate: (block: BlockComponent) => void;
    setTargetStepId: (id: string) => void;
    setDuplicateModalOpen: (open: boolean) => void;
}

const VirtualizedBlockList: React.FC<VirtualizedBlockListProps> = ({
    selectedStep,
    activeId,
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
}) => {
    const rootBlocks = selectedStep.blocks
        .filter(b => !b.parentId)
        .sort((a, b) => a.order - b.order);
    const virtualizationThreshold = 60;
    const virtualizationEnabled = rootBlocks.length > virtualizationThreshold && !activeId;

    // ✅ AGORA O HOOK É CHAMADO NO NÍVEL SUPERIOR DO COMPONENTE
    const { visible, topSpacer, bottomSpacer, containerRef } = useVirtualBlocks({
        blocks: rootBlocks,
        rowHeight: 140,
        overscan: 6,
        enabled: virtualizationEnabled,
    });

    return (
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
    );
};

export interface CanvasAreaProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
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
    previewNode: React.ReactNode;
    FixedProgressHeader: React.ComponentType<{ config: any; steps: EditableQuizStep[]; currentStepId: string }>;
    StyleResultCard: React.ComponentType<any>;
    OfferMap: React.ComponentType<any>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    activeTab,
    onTabChange,
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
    return (
        <div className="flex-1 bg-gray-100 flex flex-col overflow-y-auto">
            <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
                <div className="px-4 py-2 bg-white border-b">
                    <TabsList>
                        <TabsTrigger value="canvas" data-testid="tab-trigger-canvas">Canvas</TabsTrigger>
                        <TabsTrigger value="preview" data-testid="tab-trigger-preview">Preview</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="canvas" className="flex-1 overflow-visible p-4 m-0" data-testid="tab-content-canvas">
                    {selectedStep ? (
                        <Card className="border-0 shadow-none bg-transparent">
                            <CardContent>
                                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b mb-4">
                                    <div className="px-3 py-2">
                                        <FixedProgressHeader config={headerConfig} steps={steps} currentStepId={selectedStep.id} />
                                    </div>
                                </div>
                                {selectedStep.blocks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed rounded-md bg-white/40">(vazio)</div>
                                ) : (
                                    <>
                                        {(selectedStep.id === 'step-20' || selectedStep.id === 'step-21') && (
                                            <div className="mb-6">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <Badge variant="secondary" className="text-[9px]">live</Badge>
                                                </div>
                                                <div className="border rounded-lg bg-white p-4">
                                                    <Suspense fallback={<div className="text-xs text-muted-foreground">Carregando componente...</div>}>
                                                        {selectedStep.id === 'step-20' && (
                                                            <StyleResultCard
                                                                resultStyle={topStyle || 'classico'}
                                                                userName="Preview"
                                                                secondaryStyles={Object.keys(liveScores).filter(s => s !== (topStyle || 'classico')).slice(0, 2)}
                                                                scores={Object.keys(liveScores).length ? liveScores : { classico: 12, natural: 8, romantico: 6 }}
                                                                mode="result"
                                                            />
                                                        )}
                                                        {selectedStep.id === 'step-21' && (
                                                            <OfferMap
                                                                content={{ offerMap: (selectedStep as any).offerMap || {} }}
                                                                mode="preview"
                                                                userName="Preview"
                                                                selectedOfferKey="Montar looks com mais facilidade e confiança"
                                                            />
                                                        )}
                                                    </Suspense>
                                                </div>
                                            </div>
                                        )}
                                        {/* ✅ CORREÇÃO: Mover lógica de virtualização para nível superior */}
                                        <VirtualizedBlockList
                                            selectedStep={selectedStep}
                                            activeId={activeId}
                                            BlockRow={BlockRow}
                                            byBlock={byBlock}
                                            selectedBlockId={selectedBlockId}
                                            isMultiSelected={isMultiSelected}
                                            handleBlockClick={handleBlockClick}
                                            renderBlockPreview={renderBlockPreview}
                                            removeBlock={removeBlock}
                                            setBlockPendingDuplicate={setBlockPendingDuplicate}
                                            setTargetStepId={setTargetStepId}
                                            setDuplicateModalOpen={setDuplicateModalOpen}
                                        />
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
                                                </>
                                )}
                                            </CardContent>
                                        </Card>
                                        ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">Selecione uma etapa para editar</div>
                    )}
                                    </TabsContent>
                                <TabsContent value="preview" className="flex-1 m-0 p-0" forceMount data-testid="tab-content-preview">
                                    {previewNode}
                                </TabsContent>
                            </Tabs>
                        </div>
                    );
};

                    export default CanvasArea;
