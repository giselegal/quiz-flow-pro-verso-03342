// 🎨 CANVAS COLUMN - Integração com Universal Block Renderer
// ✅ FASE 4.2: Skeleton loading states adicionado
// ✅ SPRINT 1: Event listener leak fix + auto metrics
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    useSafeDroppable,
    SafeSortableContext,
    useSafeSortable,
    SafeCSS
} from '../SafeDndContext';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/types/editor';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { SkeletonBlock } from '../SkeletonBlock';
import { EmptyCanvasState } from '../EmptyCanvasState';
import { useSafeEventListener } from '@/hooks/useSafeEventListener';
import { useAutoMetrics } from '@/hooks/useAutoMetrics';
import { useStepBlocksQuery } from '@/services/api/steps/hooks';
import { normalizeBlocksData, normalizerLogger } from '@/core/adapters/BlockDataNormalizer';
import { appLogger } from '@/lib/utils/appLogger';

export type CanvasColumnProps = {
    currentStepKey: string | null;
    blocks?: Block[] | null;
    selectedBlockId?: string | null;
    onRemoveBlock?: (blockId: string) => void;
    onMoveBlock?: (fromIndex: number, toIndex: number) => void;
    onUpdateBlock?: (blockId: string, patch: Partial<Block>) => void;
    onBlockSelect?: (blockId: string) => void;
    hasTemplate?: boolean;
    onLoadTemplate?: () => void;
    isEditable?: boolean; // 🆕 Controla se permite edição (drag-drop, remove, etc)
};

const SortableBlockItem = React.memo(function SortableBlockItem({
    block,
    index,
    isSelected,
    onSelect,
    onMoveBlock,
    onRemoveBlock,
    onUpdateBlock,
    isEditable = true,
}: {
    block: Block;
    index: number;
    isSelected: boolean;
    onSelect?: (id: string) => void;
    onMoveBlock?: (fromIndex: number, toIndex: number) => void;
    onRemoveBlock?: (blockId: string) => void;
    onUpdateBlock?: (blockId: string, patch: Partial<Block>) => void;
    isEditable?: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSafeSortable({
        id: block.id,
        disabled: !isEditable // 🆕 Desabilitar drag quando não editável
    });

    // 🆕 G30 FIX: Melhor feedback visual durante drag
    const style: React.CSSProperties = {
        transform: SafeCSS?.Transform?.toString(transform) || 'none',
        transition: transition || 'transform 200ms ease, box-shadow 200ms ease',
        opacity: isDragging ? 0.4 : 1,
        scale: isDragging ? '1.05' : '1',
        boxShadow: isDragging
            ? '0 12px 24px rgba(0,0,0,0.2)'
            : isOver
                ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                : undefined,
        zIndex: isDragging ? 50 : isOver ? 10 : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                border rounded-lg p-2 relative 
                transition-all duration-200
                ${isDragging
                    ? 'border-blue-500 bg-blue-100 ring-4 ring-blue-200 shadow-xl'
                    : isOver
                        ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300 shadow-lg'
                        : isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                }
                ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            onClick={e => {
                const target = e.target as HTMLElement;
                appLogger.info('🖱️ [CanvasColumn] Click no bloco:', {
                    data: [{
                        blockId: block.id,
                        blockType: block.type,
                        targetTag: target.tagName,
                        isButton: target.tagName.toLowerCase() === 'button',
                        onSelectExists: !!onSelect
                    }]
                });

                if (target.tagName.toLowerCase() === 'button') {
                    appLogger.info('⏭️ Click em button, ignorando seleção');
                    return;
                }

                appLogger.info('✅ Chamando onSelect para:', { data: [block.id] });
                onSelect?.(block.id);
            }}
            data-block-id={block.id}
        >
            {/* 🆕 G30 FIX: Linha de drop visual quando outro bloco está sobre este */}
            {isOver && !isDragging && (
                <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-lg animate-pulse" />
            )}
            <div className="flex items-center justify-between mb-1">
                <div className={`text-xs uppercase ${isSelected
                    ? 'text-blue-700 font-medium'
                    : 'text-muted-foreground'
                    }`}>{block.type}</div>
                <div className="flex items-center gap-1">
                    {typeof onMoveBlock === 'function' && (
                        <>
                            <button
                                className="text-[10px] px-1 py-0.5 border rounded disabled:opacity-50"
                                onClick={e => { e.stopPropagation(); onMoveBlock(index, Math.max(0, index - 1)); }}
                                disabled={index === 0}
                                title="Mover para cima"
                            >↑</button>
                            <button
                                className="text-[10px] px-1 py-0.5 border rounded disabled:opacity-50"
                                onClick={e => { e.stopPropagation(); onMoveBlock(index, index + 1); }}
                                disabled={false}
                                title="Mover para baixo"
                            >↓</button>
                        </>
                    )}
                    {typeof onRemoveBlock === 'function' && (
                        <button
                            className="text-[10px] px-1 py-0.5 border rounded text-red-600"
                            onClick={e => { e.stopPropagation(); onRemoveBlock(block.id); }}
                            title="Remover bloco"
                        >×</button>
                    )}
                </div>
            </div>
            {/* Renderização via BlockTypeRenderer - Specialized for Quiz blocks */}
            <BlockTypeRenderer
                block={block}
                isSelected={isSelected}
                isEditable={true}
                onSelect={(blockId: string) => onSelect?.(blockId)}
                onOpenProperties={(blockId: string) => {
                    if (onUpdateBlock) {
                        onUpdateBlock(blockId, block);
                    }
                }}
                contextData={{
                    canvasMode: 'editor',
                    stepNumber: block.properties?.stepNumber,
                }}
            />

            {/* Quick Insert (somente quando há onUpdateBlock e conteúdo mínimo ausente) */}
            {onUpdateBlock && (
                <div className="mt-1">
                    {(() => {
                        const type = String((block as any).type);
                        const content: any = (block as any).content || {};
                        const props: any = (block as any).properties || {};
                        const showQuick = (
                            (type === 'intro-title' || type === 'heading' || type === 'text-inline') && !(content.title || content.text || props.titleHtml)
                        ) || (
                                (type === 'intro-description' || type === 'text') && !(content.description || content.text)
                            ) || (
                                (type === 'intro-logo' || type === 'intro-image' || type === 'image' || type === 'image-display-inline') && !(content.imageUrl || props.imageUrl || props.logoUrl)
                            ) || (
                                (type === 'intro-form' || type === 'form-container') && !(Array.isArray(content.fields) && content.fields.length > 0)
                            );
                        if (!showQuick) return null;
                        return (
                            <button
                                className="px-2 py-1 border rounded text-[10px] hover:bg-accent"
                                onClick={() => {
                                    if (type === 'intro-title' || type === 'heading' || type === 'text-inline') {
                                        onUpdateBlock(block.id, { content: { text: '<span style=\"color: #B89B7A; font-weight: 700;\">Chega</span> de um guarda-roupa lotado e da sensação de que <span style=\"color: #B89B7A; font-weight: 700;\">nada combina com você</span>.' } as any });
                                    } else if (type === 'intro-description' || type === 'text') {
                                        onUpdateBlock(block.id, { content: { description: 'Em poucos minutos, descubra seu <span class=\"font-semibold text-[#B89B7A]\">Estilo Predominante</span> — e aprenda a montar looks que realmente refletem sua <span class=\"font-semibold text-[#432818]\">essência</span>, com praticidade e <span class=\"font-semibold text-[#432818]\">confiança</span>.' } as any });
                                    } else if (type === 'intro-logo' || type === 'intro-image' || type === 'image' || type === 'image-display-inline') {
                                        onUpdateBlock(block.id, { content: { imageUrl: '/favicon.ico', alt: 'logo' } as any });
                                    } else if (type === 'intro-form' || type === 'form-container') {
                                        onUpdateBlock(block.id, { content: { fields: [] } as any });
                                    }
                                }}
                            >
                                + Inserir aqui
                            </button>
                        );
                    })()}
                </div>
            )}
        </li>
    );
}, (prev, next) => (
    prev.block === next.block &&
    prev.index === next.index &&
    prev.isSelected === next.isSelected &&
    prev.onSelect === next.onSelect &&
    prev.onMoveBlock === next.onMoveBlock &&
    prev.onRemoveBlock === next.onRemoveBlock &&
    prev.onUpdateBlock === next.onUpdateBlock
));

function CanvasColumnInner({ currentStepKey, blocks: blocksFromProps, selectedBlockId, onRemoveBlock, onMoveBlock, onUpdateBlock, onBlockSelect, hasTemplate, onLoadTemplate, isEditable = true }: CanvasColumnProps) {
    // ✅ CRITICAL FIX: Todos os hooks devem vir ANTES de qualquer return condicional
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0); // força re-render quando necessário

    // 🔄 React Query: centralizar carregamento sempre via hook (props como initialData)
    const { data: fetchedBlocks, isLoading: isLoadingQuery, error: queryError } = useStepBlocksQuery({
        stepId: currentStepKey,
        enabled: !!currentStepKey,
    });

    // Selecionar blocos com memoização: se arrays são estritamente iguais ou conteúdo id/length igual, reusa referência
    const blocks: Block[] | null = useMemo(() => {
        const source = (fetchedBlocks ?? blocksFromProps ?? null) as Block[] | null;
        return source ? [...source] : source; // shallow copy para evitar mutações externas
    }, [fetchedBlocks, blocksFromProps, tick]);

    // ✅ SPRINT 1: Auto metrics tracking
    useAutoMetrics('CanvasColumn', {
        currentStepKey,
        blocksCount: blocks?.length || 0,
        selectedBlockId,
    });

    // Configurar como drop zone para DnD
    const { setNodeRef, isOver } = useSafeDroppable({
        id: 'canvas',
    });

    // Log de diagnóstico quando props.blocks mudar
    useEffect(() => {
        if (!blocksFromProps) return;
        appLogger.info('🔄 [CanvasColumn] Props blocks changed:', {
            data: [{
                currentStepKey,
                blocksCount: blocksFromProps?.length || 0,
                blockIds: blocksFromProps?.map(b => b.id) || [],
            }]
        });
    }, [blocksFromProps, currentStepKey]);

    // ✅ SPRINT 1: Usar hook seguro para event listeners
    useSafeEventListener('block-updated', (event: Event) => {
        const customEvent = event as CustomEvent;
        const { stepKey, blockId } = customEvent.detail || {};

        appLogger.info('🔔 [CanvasColumn] Recebeu evento block-updated:', {
            data: [{
                stepKey,
                blockId,
                currentStepKey,
                shouldUpdate: stepKey === currentStepKey,
            }]
        });

        // Se a atualização for do step atual, forçar re-render leve
        if (stepKey === currentStepKey) setTick(t => t + 1);
    }, {
        target: typeof window !== 'undefined' ? window : null,
        enabled: true,
    });

    useEffect(() => {
        if (queryError) setError(queryError.message);
        else setError(null);
    }, [queryError]);

    // ✅ CRITICAL FIX: Normalizar blocos ANTES de qualquer return (evita hook condicional no JSX)
    const normalizedBlocks = useMemo(() => {
        if (!blocks || blocks.length === 0) return [];
        return normalizeBlocksData(blocks);
    }, [blocks]);

    // ✅ CRITICAL FIX: Returns condicionais agora vêm DEPOIS de todos os hooks

    if (!currentStepKey) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-sm">Selecione uma etapa</div>
            </div>
        );
    }

    if (isLoadingQuery && !blocks) {
        return (
            <div className="p-3 space-y-2">
                <div className="text-sm text-muted-foreground mb-4">
                    Carregando blocos de {currentStepKey}…
                </div>
                <SkeletonBlock />
                <SkeletonBlock />
                <SkeletonBlock />
            </div>
        );
    }

    if (error) {
        return <div className="p-3 text-sm text-red-500">Erro: {error}</div>;
    }

    if (!blocks || blocks.length === 0) {
        // ✅ NOVO: Mostrar EmptyCanvasState se não tem template carregado
        if (!hasTemplate && onLoadTemplate) {
            return <EmptyCanvasState onLoadTemplate={onLoadTemplate} />;
        }

        // 🔧 CORREÇÃO FASE 5: Melhorar mensagem de fallback com debugging hints
        return (
            <div className="p-6 text-center space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                    ⚠️ Nenhum bloco nesta etapa
                </div>
                <div className="text-xs text-muted-foreground/70 space-y-1">
                    <p>Step: <code className="bg-muted px-1 py-0.5 rounded">{currentStepKey}</code></p>
                    <p>Possíveis causas:</p>
                    <ul className="list-disc list-inside text-left max-w-xs mx-auto">
                        <li>Template JSON não encontrado em <code>/templates/funnels/</code></li>
                        <li>Arquivo vazio ou mal formatado</li>
                        <li>templateService.getStep() retornou array vazio</li>
                    </ul>
                </div>
                <div className="text-xs text-blue-600">
                    💡 Dica: Execute <code className="bg-blue-50 px-1 py-0.5 rounded">npm run generate-templates</code>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            className={`p-3 space-y-2 min-h-[400px] transition-all ${isOver
                ? 'bg-blue-50 border-2 border-blue-400 border-dashed shadow-inner'
                : 'border border-transparent hover:border-gray-200'
                }`}
        >
            <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>{currentStepKey}</span>
                {isOver && (
                    <span className="text-blue-600 text-xs font-semibold animate-pulse bg-blue-100 px-2 py-1 rounded">
                        ⬇️ Solte aqui para adicionar
                    </span>
                )}
            </div>
            {/* 🆕 G30 FIX: Always-visible drop zone indicator quando vazio */}
            {blocks.length === 0 && !isOver && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                    <div className="text-gray-400 text-sm mb-2">⬇️</div>
                    <div className="text-gray-500 text-sm">
                        Arraste um bloco da biblioteca para começar
                    </div>
                </div>
            )}
            <SafeSortableContext items={blocks.map(b => b.id)}>
                <ul className="space-y-1">
                    {normalizedBlocks.map((b, idx) => {
                        normalizerLogger.debug(`Rendering normalized block ${b.type}`, {
                            original: blocks[idx],
                            normalized: b
                        });
                        return (
                            <SortableBlockItem
                                key={b.id}
                                block={b}
                                index={idx}
                                isSelected={selectedBlockId === b.id}
                                onSelect={onBlockSelect}
                                onMoveBlock={(from, to) => {
                                    // Clamp 'to' para dentro da lista
                                    const clampedTo = Math.max(0, Math.min((blocks?.length || 1) - 1, to));
                                    onMoveBlock?.(from, clampedTo);
                                }}
                                onRemoveBlock={onRemoveBlock}
                                onUpdateBlock={onUpdateBlock}
                            />
                        );
                    })}
                </ul>
            </SafeSortableContext>
            {/* 🆕 G30 FIX: Drop zone no final da lista quando tem blocos */}
            {blocks.length > 0 && (
                <div className={`border-2 border-dashed rounded p-4 text-center text-xs transition-all ${isOver
                    ? 'border-blue-400 bg-blue-100 text-blue-600'
                    : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}>
                    {isOver ? '⬇️ Soltar no final' : '+ Adicionar novo bloco'}
                </div>
            )}
        </div>
    );
}

// Export memoizado para reduzir re-renders do canvas em updates externos que não afetam props relevantes
export default React.memo(CanvasColumnInner, (prev, next) => (
    prev.currentStepKey === next.currentStepKey &&
    prev.selectedBlockId === next.selectedBlockId &&
    prev.blocks === next.blocks &&
    prev.onRemoveBlock === next.onRemoveBlock &&
    prev.onMoveBlock === next.onMoveBlock &&
    prev.onUpdateBlock === next.onUpdateBlock &&
    prev.onBlockSelect === next.onBlockSelect &&
    prev.hasTemplate === next.hasTemplate
));
