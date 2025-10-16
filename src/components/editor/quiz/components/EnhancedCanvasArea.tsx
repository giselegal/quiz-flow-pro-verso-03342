/**
 * 🎭 Enhanced Canvas Area - Área de Canvas com Preview ao Vivo
 * 
 * Versão melhorada do CanvasArea que integra o sistema de preview ao vivo
 * com sincronização em tempo real e otimizações de performance.
 */

import React, { Suspense, useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
    Eye,
    EyeOff,
    Settings,
    Activity,
    Wifi,
    WifiOff,
    RefreshCw
} from 'lucide-react';

import { BlockComponent, EditableQuizStep } from '../types';
import { useVirtualBlocks } from '../hooks/useVirtualBlocks';
import { LiveCanvasPreview } from '@/components/editor/canvas/LiveCanvasPreview';
import { useLiveCanvasPreview } from '@/hooks/canvas/useLiveCanvasPreview';
import { LivePreviewProvider } from '@/providers/LivePreviewProvider';
import PreviewMonitor from '@/components/debug/PreviewMonitor';
import UnifiedBlockRenderer from './UnifiedBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { blocksToBlockComponents } from '@/utils/templateConverter';

export interface EnhancedCanvasAreaProps {
    activeTab: 'canvas' | 'preview';
    onTabChange: (tab: 'canvas' | 'preview') => void;
    steps: EditableQuizStep[];
    selectedStep: EditableQuizStep;
    headerConfig: any;
    liveScores: any;
    topStyle: any;
    BlockRow: React.ComponentType<any>;
    byBlock: any;
    selectedBlockId: string;
    isMultiSelected: (id: string) => boolean;
    handleBlockClick: (block: BlockComponent, event: React.MouseEvent) => void;
    renderBlockPreview: (block: BlockComponent) => React.ReactNode;
    removeBlock: (id: string) => void;
    setBlockPendingDuplicate: (id: string) => void;
    setTargetStepId: (id: string) => void;
    setDuplicateModalOpen: (open: boolean) => void;
    activeId: string | null;
    previewNode?: React.ReactNode;
    FixedProgressHeader: React.ComponentType<any>;
    StyleResultCard: React.ComponentType<any>;
    OfferMap: React.ComponentType<any>;
    funnelId?: string;
    onStepChange?: (stepId: string) => void;
    onBlockUpdate?: (stepId: string, blockId: string, updates: any) => void;
}

export const EnhancedCanvasArea: React.FC<EnhancedCanvasAreaProps> = ({
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
    funnelId = 'quiz-estilo-21-steps',
    onStepChange,
    onBlockUpdate
}) => {
    // ===== STATE =====
    const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [showPreviewSettings, setShowPreviewSettings] = useState(false);
    const [advancedPreviewMode, setAdvancedPreviewMode] = useState(false);

    // ===== LIVE PREVIEW HOOK =====
    const {
        state: previewState,
        metrics: previewMetrics,
        activate: activatePreview,
        deactivate: deactivatePreview,
        toggle: togglePreview,
        forceUpdate: updatePreview,
        isActive: isPreviewActive,
        isUpdating: isPreviewUpdating,
        hasError: hasPreviewError,
        errorMessage: previewErrorMessage
    } = useLiveCanvasPreview(steps, selectedStep?.id, {
        enableDebounce: true,
        debounceDelay: 300,
        enableCache: true,
        cacheTTL: 30000,
        enableDebug: process.env.NODE_ENV === 'development',
        maxUpdatesPerSecond: 10,
        isolatePreviewState: true
    });

    // ===== VIRTUALIZATION =====
    const {
        visible: virtualizedBlocks,
        topSpacer,
        bottomSpacer,
        containerRef,
        total: totalBlocks
    } = useVirtualBlocks({
        blocks: selectedStep?.blocks || [],
        rowHeight: 100,
        enabled: (selectedStep?.blocks || []).length > 20
    });

    const isVirtualizationActive = (selectedStep?.blocks || []).length > 20;

    // ===== HANDLERS =====
    const handleStepChangeInternal = useCallback((stepId: string) => {
        onStepChange?.(stepId);
    }, [onStepChange]);

    const handlePreviewModeToggle = useCallback(() => {
        setAdvancedPreviewMode(prev => !prev);
        if (!advancedPreviewMode) {
            activatePreview();
        } else {
            deactivatePreview();
        }
    }, [advancedPreviewMode, activatePreview, deactivatePreview]);

    // ===== RENDER HELPERS =====
    const renderPreviewStatusIndicator = () => {
        if (!isPreviewActive) {
            return (
                <Badge variant="secondary" className="text-xs">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Preview Inativo
                </Badge>
            );
        }

        if (hasPreviewError) {
            return (
                <Badge variant="destructive" className="text-xs">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Erro
                </Badge>
            );
        }

        if (isPreviewUpdating) {
            return (
                <Badge variant="secondary" className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Atualizando...
                </Badge>
            );
        }

        return (
            <Badge variant="default" className="text-xs">
                <Wifi className="w-3 h-3 mr-1" />
                Ao Vivo ({previewState.updateCount})
            </Badge>
        );
    };

    const renderPreviewMetrics = () => {
        if (!showPreviewSettings || !isPreviewActive) return null;

        return (
            <Card className="mb-4">
                <CardContent className="p-3">
                    <div className="text-xs space-y-2">
                        <div className="flex justify-between">
                            <span>Updates totais:</span>
                            <span className="font-mono">{previewMetrics.totalUpdates}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tempo médio:</span>
                            <span className="font-mono">{previewMetrics.averageUpdateTime.toFixed(1)}ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cache efficiency:</span>
                            <span className="font-mono">{(previewMetrics.cacheEfficiency * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Error rate:</span>
                            <span className="font-mono">{(previewMetrics.errorRate * 100).toFixed(1)}%</span>
                        </div>
                        {hasPreviewError && previewErrorMessage && (
                            <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded">
                                {previewErrorMessage}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Hook do editor para operações de bloco
    const editor = useEditor();
    const { state: editorState, actions } = editor;

    // Obter blocos do step atual via editor
    const currentStepBlocks = useMemo(() => {
        const stepKey = selectedStep?.id || '';
        const blocks = editorState.stepBlocks[stepKey] || [];
        return blocksToBlockComponents(blocks);
    }, [editorState.stepBlocks, selectedStep?.id]);

    const renderCanvasContent = () => (
        <div className="flex-1 overflow-auto">
            {/* Cabeçalho do Canvas */}
            <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">Canvas de Edição</h3>
                    <Badge variant="outline" className="text-xs">
                        Step {selectedStep?.order || '?'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {currentStepBlocks.length} blocos
                    </Badge>
                </div>
            </div>

            {/* Área de Canvas - Renderização Individual de Blocos */}
            <div className="p-4">
                {currentStepBlocks.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <div className="text-center">
                            <p className="mb-2">Nenhum bloco neste step</p>
                            <p className="text-sm">Adicione blocos pelo painel lateral</p>
                        </div>
                    </div>
                ) : (
                    <SortableContext
                        items={currentStepBlocks.map((b: BlockComponent) => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4 min-h-[400px]">
                            {currentStepBlocks
                                .sort((a: BlockComponent, b: BlockComponent) => a.order - b.order)
                                .map((block: BlockComponent) => (
                                    <UnifiedBlockRenderer
                                        key={block.id}
                                        block={block}
                                        allBlocks={currentStepBlocks}
                                        mode="edit"
                                        isSelected={selectedBlockId === block.id}
                                        isMultiSelected={isMultiSelected(block.id)}
                                        onBlockClick={(e) => {
                                            e.stopPropagation();
                                            handleBlockClick(block, e);
                                        }}
                                        onDelete={() => {
                                            const stepKey = selectedStep?.id || '';
                                            actions.removeBlock(stepKey, block.id);
                                        }}
                                        onDuplicate={() => {
                                            setBlockPendingDuplicate(block.id);
                                            setTargetStepId(selectedStep.id);
                                            setDuplicateModalOpen(true);
                                        }}
                                        renderBlockPreview={(blk) => {
                                            // Renderização visual básica do bloco
                                            return renderBlockPreview(blk as any);
                                        }}
                                    />
                                ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );

    const renderPreviewContent = () => {
        if (advancedPreviewMode) {
            return (
                <LivePreviewProvider
                    enableDebug={process.env.NODE_ENV === 'development'}
                    autoReconnect={true}
                    enableHeartbeat={true}
                >
                    <div className="flex-1 flex flex-col">
                        {/* Cabeçalho do Preview Avançado */}
                        <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium">Preview ao Vivo</h3>
                                {renderPreviewStatusIndicator()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPreviewSettings(!showPreviewSettings)}
                                >
                                    <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={updatePreview}
                                    disabled={isPreviewUpdating}
                                >
                                    <RefreshCw className={`w-4 h-4 ${isPreviewUpdating ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Métricas (se habilitadas) */}
                        {renderPreviewMetrics()}

                        {/* Preview Content */}
                        <div className="flex-1 p-4">
                            <LiveCanvasPreview
                                steps={steps}
                                funnelId={funnelId}
                                selectedStepId={selectedStep?.id}
                                onStepChange={handleStepChangeInternal}
                                config={{
                                    autoRefresh: true,
                                    debounceDelay: 300,
                                    defaultDevice: previewSize,
                                    showDebugInfo: showPreviewSettings,
                                    highlightChanges: true,
                                    isolatePreviewState: true
                                }}
                                className="h-full"
                            />
                        </div>
                    </div>
                </LivePreviewProvider>
            );
        }

        // Preview Simples (modo original)
        return (
            <div className="flex-1 flex flex-col">
                {/* Controles de tamanho do preview */}
                <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
                    <span className="text-xs text-muted-foreground">Visualização:</span>
                    <Button
                        onClick={() => setPreviewSize('mobile')}
                        variant={previewSize === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                    >
                        📱
                    </Button>
                    <Button
                        onClick={() => setPreviewSize('tablet')}
                        variant={previewSize === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                    >
                        💊
                    </Button>
                    <Button
                        onClick={() => setPreviewSize('desktop')}
                        variant={previewSize === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                    >
                        🖥️
                    </Button>
                    <div className="ml-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePreviewModeToggle}
                        >
                            {advancedPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {advancedPreviewMode ? 'Modo Simples' : 'Modo Avançado'}
                        </Button>
                    </div>
                </div>

                {/* Área do preview simples */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="w-full h-full flex items-start justify-center">
                        <div
                            className={[
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
                                <p className="text-xs text-muted-foreground italic p-6 text-center">
                                    Preview indisponível
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ===== MAIN RENDER =====
    return (
        <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Preview Monitor (desenvolvimento) */}
            <PreviewMonitor />

            {/* Tabs Header */}
            <Tabs value={activeTab} onValueChange={onTabChange as any} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                    <TabsTrigger
                        value="canvas"
                        data-testid="tab-trigger-canvas"
                        className="flex items-center gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        Canvas
                        {selectedStep?.blocks?.length > 0 && (
                            <Badge variant="secondary" className="text-xs ml-1">
                                {selectedStep.blocks.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="preview"
                        data-testid="tab-trigger-preview"
                        className="flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                        {isPreviewActive && renderPreviewStatusIndicator()}
                    </TabsTrigger>
                </TabsList>

                {/* Canvas Tab */}
                <TabsContent
                    value="canvas"
                    className="flex-1 m-0 mt-4"
                    data-testid="tab-content-canvas"
                    forceMount
                    style={{ display: activeTab === 'canvas' ? 'flex' : 'none', flexDirection: 'column' }}
                >
                    {renderCanvasContent()}
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent
                    value="preview"
                    className="flex-1 m-0 mt-4"
                    data-testid="tab-content-preview"
                    forceMount
                    style={{ display: activeTab === 'preview' ? 'flex' : 'none', flexDirection: 'column' }}
                >
                    <Suspense fallback={
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center space-y-2">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Carregando preview...</p>
                            </div>
                        </div>
                    }>
                        {renderPreviewContent()}
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EnhancedCanvasArea;