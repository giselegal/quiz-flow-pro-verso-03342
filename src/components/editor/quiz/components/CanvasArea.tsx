import React, { Suspense, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

import { BlockComponent, EditableQuizStep } from '../types';

// Virtualização agora tratada internamente via hook
import { useVirtualBlocks } from '../hooks/useVirtualBlocks';

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
    // Controle de preview responsivo
    const [previewSize, setPreviewSize] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

    // ✅ CORREÇÃO: Calcular rootBlocks no nível superior com useMemo
    const rootBlocks = useMemo(() => {
        if (!selectedStep) return [];
        return selectedStep.blocks
            .filter(b => !b.parentId)
            .sort((a, b) => a.order - b.order);
    }, [selectedStep]);

    // ✅ CORREÇÃO: Chamar hook useVirtualBlocks no nível superior
    const virtualizationThreshold = 60;
    const virtualizationEnabled = rootBlocks.length > virtualizationThreshold && !activeId;

    const { visible, topSpacer, bottomSpacer, containerRef } = useVirtualBlocks({
        blocks: rootBlocks,
        rowHeight: 140,
        overscan: 6,
        enabled: virtualizationEnabled,
    });

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
                        <div className="flex items-center justify-center h-full text-muted-foreground">Selecione uma etapa para editar</div>
                    )}
                </TabsContent>
                <TabsContent value="preview" className="flex-1 m-0 p-0" data-testid="tab-content-preview">
                    {/* Barra de controle de tamanho do preview */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
                        <span className="text-xs text-muted-foreground">Modo preview:</span>
                        <Button onClick={() => setPreviewSize('mobile')} variant={previewSize === 'mobile' ? 'default' : 'outline'} size="sm" aria-label="Preview Mobile">
                            📱
                        </Button>
                        <Button onClick={() => setPreviewSize('tablet')} variant={previewSize === 'tablet' ? 'default' : 'outline'} size="sm" aria-label="Preview Tablet">
                            💊
                        </Button>
                        <Button onClick={() => setPreviewSize('desktop')} variant={previewSize === 'desktop' ? 'default' : 'outline'} size="sm" aria-label="Preview Desktop">
                            🖥️
                        </Button>
                    </div>
                    {/* Área do preview com classes condicionais */}
                    <div className="flex-1 overflow-auto p-4">
                        <div className="w-full h-full flex items-start justify-center">
                            <div
                                className={
                                    [
                                        'w-full',
                                        previewSize === 'mobile' && 'max-w-[375px] border rounded-md shadow-sm',
                                        previewSize === 'tablet' && 'max-w-[768px] border rounded-md shadow-sm',
                                        previewSize === 'desktop' && 'max-w-full',
                                        'bg-white'
                                    ]
                                        .filter(Boolean)
                                        .join(' ')
                                }
                                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                            >
                                {previewNode || (
                                    <p className="text-xs text-muted-foreground italic p-6 text-center">Preview indisponível</p>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CanvasArea;
