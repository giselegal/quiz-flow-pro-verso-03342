/**
 * 🎯 FASE 3.2: UNIFIED STEP RENDERER PROTEGIDO
 * 
 * Renderer otimizado para steps do quiz com:
 * - React.memo com comparação customizada
 * - Virtualização para steps com >20 blocos
 * - Prefetch inteligente do próximo step
 * - Memoização agressiva
 * 
 * META: -60% re-renders
 */

import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Block } from '@/types/editor';
import { OptimizedBlockRenderer } from '@/components/editor/OptimizedBlockRenderer';
import { blockRegistry } from '@/registry/UnifiedBlockRegistry';
import { getPreloadBlocks } from '@/registry/blockCategories';
import { appLogger } from '@/lib/utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface StepData {
    id: string;
    type?: string;
    title?: string;
    blocks: Block[];
    order?: number;
    metadata?: Record<string, any>;
}

interface UnifiedStepRendererProps {
    step: StepData;
    isPreview?: boolean;
    selectedBlockId?: string | null;
    onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
    onBlockDelete?: (blockId: string) => void;
    onBlockSelect?: (blockId: string) => void;
    enableVirtualization?: boolean;
    virtualizationThreshold?: number;
    className?: string;
    style?: React.CSSProperties;
    // Prefetch
    nextStepId?: string;
    currentStepNumber?: number;
}

// ============================================================================
// VIRTUALIZED STEP RENDERER (>20 blocos)
// ============================================================================

const VirtualizedStepRenderer: React.FC<{
    blocks: Block[];
    isPreview?: boolean;
    selectedBlockId?: string | null;
    onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
    onBlockDelete?: (blockId: string) => void;
    onBlockSelect?: (blockId: string) => void;
    className?: string;
}> = ({
    blocks,
    isPreview,
    selectedBlockId,
    onBlockUpdate,
    onBlockDelete,
    onBlockSelect,
    className = '',
}) => {
        const containerRef = useRef<HTMLDivElement>(null);

        const virtualizer = useVirtualizer({
            count: blocks.length,
            getScrollElement: () => containerRef.current,
            estimateSize: useCallback(() => 100, []), // altura média de um bloco
            overscan: 5, // renderizar 5 blocos extras fora da viewport
        });

        useEffect(() => {
            appLogger.info('[VirtualizedStepRenderer] Enabled', {
                blockCount: blocks.length,
                virtualItemsCount: virtualizer.getVirtualItems().length,
            });
        }, [blocks.length, virtualizer]);

        return (
            <div
                ref={containerRef}
                className={`virtualized-step-renderer ${className}`}
                style={{
                    height: '100%',
                    overflow: 'auto',
                }}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const block = blocks[virtualItem.index];

                        return (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <OptimizedBlockRenderer
                                    block={block}
                                    isSelected={selectedBlockId === block.id}
                                    isPreview={isPreview}
                                    onUpdate={(updates) => onBlockUpdate?.(block.id, updates)}
                                    onDelete={() => onBlockDelete?.(block.id)}
                                    onSelect={() => onBlockSelect?.(block.id)}
                                    priority={virtualItem.index < 3 ? 'high' : 'normal'}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

// ============================================================================
// STANDARD STEP RENDERER (≤20 blocos)
// ============================================================================

const StandardStepRenderer: React.FC<{
    blocks: Block[];
    isPreview?: boolean;
    selectedBlockId?: string | null;
    onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
    onBlockDelete?: (blockId: string) => void;
    onBlockSelect?: (blockId: string) => void;
    className?: string;
}> = ({
    blocks,
    isPreview,
    selectedBlockId,
    onBlockUpdate,
    onBlockDelete,
    onBlockSelect,
    className = '',
}) => {
        return (
            <div className={`standard-step-renderer ${className}`}>
                {blocks.map((block, index) => (
                    <OptimizedBlockRenderer
                        key={block.id || `block-${index}`}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        isPreview={isPreview}
                        onUpdate={(updates) => onBlockUpdate?.(block.id, updates)}
                        onDelete={() => onBlockDelete?.(block.id)}
                        onSelect={() => onBlockSelect?.(block.id)}
                        priority={index < 3 ? 'high' : 'normal'}
                    />
                ))}
            </div>
        );
    };

// ============================================================================
// UNIFIED STEP RENDERER (Main Component)
// ============================================================================

/**
 * ✅ FASE 3.2: Unified Step Renderer
 * 
 * Features:
 * - React.memo com comparação customizada
 * - Virtualização automática para steps >20 blocos
 * - Prefetch inteligente do próximo step
 * - Memoização de blocks array
 */
export const UnifiedStepRenderer: React.FC<UnifiedStepRendererProps> = React.memo(
    ({
        step,
        isPreview = false,
        selectedBlockId = null,
        onBlockUpdate,
        onBlockDelete,
        onBlockSelect,
        enableVirtualization = true,
        virtualizationThreshold = 20,
        className = '',
        style,
        nextStepId,
        currentStepNumber,
    }) => {
        // Memoizar array de blocos para evitar re-renders
        const blocks = useMemo(() => {
            return step.blocks || [];
        }, [step.blocks]);

        // Determinar se deve usar virtualização
        const shouldVirtualize = useMemo(() => {
            return enableVirtualization && blocks.length > virtualizationThreshold;
        }, [enableVirtualization, blocks.length, virtualizationThreshold]);

        // ✅ FASE 3.2: Prefetch inteligente do próximo step
        useEffect(() => {
            if (!nextStepId || !currentStepNumber) return;

            // Pré-carregar blocos do próximo step de forma não-bloqueante
            const timer = setTimeout(() => {
                appLogger.debug('[UnifiedStepRenderer] Prefetching next step blocks', {
                    currentStep: currentStepNumber,
                    nextStepId,
                });

                // Prefetch baseado em estratégias (Step 15+ = result blocks, etc)
                const preloadBlocks = getPreloadBlocks(currentStepNumber);
                if (preloadBlocks.length > 0) {
                    blockRegistry.prefetchBatch(preloadBlocks);
                }
            }, 500); // Delay para não bloquear interação atual

            return () => clearTimeout(timer);
        }, [nextStepId, currentStepNumber]);

        // Log de performance
        useEffect(() => {
            appLogger.info('[UnifiedStepRenderer] Rendering step', {
                stepId: step.id,
                blockCount: blocks.length,
                virtualized: shouldVirtualize,
                isPreview,
            });
        }, [step.id, blocks.length, shouldVirtualize, isPreview]);

        // Renderizar versão apropriada
        const RendererComponent = shouldVirtualize ? VirtualizedStepRenderer : StandardStepRenderer;

        return (
            <div
                className={`unified-step-renderer step-${step.id} ${className}`}
                style={style}
                data-step-id={step.id}
                data-block-count={blocks.length}
                data-virtualized={shouldVirtualize}
            >
                <RendererComponent
                    blocks={blocks}
                    isPreview={isPreview}
                    selectedBlockId={selectedBlockId}
                    onBlockUpdate={onBlockUpdate}
                    onBlockDelete={onBlockDelete}
                    onBlockSelect={onBlockSelect}
                    className="step-content"
                />
            </div>
        );
    },
    (prevProps, nextProps) => {
        // ✅ FASE 3.2: Custom comparison para evitar re-renders desnecessários

        // 1. Step ID mudou? Re-render
        if (prevProps.step.id !== nextProps.step.id) {
            return false;
        }

        // 2. Número de blocos mudou? Re-render
        if (prevProps.step.blocks.length !== nextProps.step.blocks.length) {
            return false;
        }

        // 3. IDs dos blocos mudaram? Re-render
        const prevBlockIds = prevProps.step.blocks.map(b => b.id).join(',');
        const nextBlockIds = nextProps.step.blocks.map(b => b.id).join(',');
        if (prevBlockIds !== nextBlockIds) {
            return false;
        }

        // 4. Selected block mudou? Re-render
        if (prevProps.selectedBlockId !== nextProps.selectedBlockId) {
            return false;
        }

        // 5. Preview mode mudou? Re-render
        if (prevProps.isPreview !== nextProps.isPreview) {
            return false;
        }

        // 6. Callbacks mudaram? Verificar referência (idealmente devem ser memoizadas)
        if (
            prevProps.onBlockUpdate !== nextProps.onBlockUpdate ||
            prevProps.onBlockDelete !== nextProps.onBlockDelete ||
            prevProps.onBlockSelect !== nextProps.onBlockSelect
        ) {
            return false;
        }

        // 7. Nenhuma mudança relevante -> Skip re-render ✅
        return true;
    },
);

UnifiedStepRenderer.displayName = 'UnifiedStepRenderer';

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Hook para memoizar callbacks de bloco
 * Previne re-renders desnecessários por mudança de referência
 */
export function useStepBlockCallbacks(
    onUpdate?: (stepId: string, blockId: string, updates: Partial<Block>) => void,
    onDelete?: (stepId: string, blockId: string) => void,
    onSelect?: (stepId: string, blockId: string) => void,
    stepId?: string,
) {
    const handleBlockUpdate = useCallback(
        (blockId: string, updates: Partial<Block>) => {
            if (stepId) {
                onUpdate?.(stepId, blockId, updates);
            }
        },
        [onUpdate, stepId],
    );

    const handleBlockDelete = useCallback(
        (blockId: string) => {
            if (stepId) {
                onDelete?.(stepId, blockId);
            }
        },
        [onDelete, stepId],
    );

    const handleBlockSelect = useCallback(
        (blockId: string) => {
            if (stepId) {
                onSelect?.(stepId, blockId);
            }
        },
        [onSelect, stepId],
    );

    return useMemo(
        () => ({
            onBlockUpdate: handleBlockUpdate,
            onBlockDelete: handleBlockDelete,
            onBlockSelect: handleBlockSelect,
        }),
        [handleBlockUpdate, handleBlockDelete, handleBlockSelect],
    );
}

export default UnifiedStepRenderer;
