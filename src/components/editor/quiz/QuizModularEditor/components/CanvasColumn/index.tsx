// Coluna de Canvas — implementação inicial conectada ao TemplateService e renderizador canônico
import React, { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/services/UnifiedTemplateRegistry';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';

export type CanvasColumnProps = {
    currentStepKey: string | null;
    blocks?: Block[] | null;
    selectedBlockId?: string | null;
    onRemoveBlock?: (blockId: string) => void;
    onMoveBlock?: (fromIndex: number, toIndex: number) => void;
    onUpdateBlock?: (blockId: string, patch: Partial<Block>) => void;
    onBlockSelect?: (blockId: string) => void;
};

export default function CanvasColumn({ currentStepKey, blocks: blocksFromProps, selectedBlockId, onRemoveBlock, onMoveBlock, onUpdateBlock, onBlockSelect }: CanvasColumnProps) {
    const [blocks, setBlocks] = useState<Block[] | null>(blocksFromProps ?? null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Configurar como drop zone para DnD
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas',
    });

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            // Se blocos forem fornecidos via props, priorizar essa fonte e não carregar do serviço
            if (blocksFromProps) {
                setBlocks(blocksFromProps);
                setLoading(false);
                setError(null);
                return;
            }
            if (!currentStepKey) {
                setBlocks(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await templateService.getStep(currentStepKey);
                if (!cancelled) {
                    if (res.success) setBlocks(res.data);
                    else {
                        setBlocks([]);
                        setError(res.error.message);
                    }
                }
            } catch (err: any) {
                if (!cancelled) {
                    setBlocks([]);
                    setError(err?.message || 'Erro ao carregar blocos');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [currentStepKey, blocksFromProps]);

    if (!currentStepKey) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-sm">Selecione uma etapa</div>
            </div>
        );
    }

    if (!blocksFromProps && loading) {
        return <div className="p-3 text-sm">Carregando blocos de {currentStepKey}…</div>;
    }

    if (error) {
        return <div className="p-3 text-sm text-red-500">Erro: {error}</div>;
    }

    if (!blocks || blocks.length === 0) {
        return <div className="p-3 text-sm">Nenhum bloco nesta etapa.</div>;
    }

    return (
        <div
            ref={setNodeRef}
            className={`p-3 space-y-2 min-h-[400px] ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}
        >
            <div className="text-sm font-medium mb-2">
                {currentStepKey}
                {isOver && <span className="text-blue-600 text-xs ml-2">Solte aqui</span>}
            </div>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1">
                    {blocks.map((b, idx) => {
                        const isSelected = selectedBlockId === b.id;
                        const sortable = useSortable({ id: b.id });
                        const { attributes, listeners, setNodeRef: setItemRef, transform, transition, isOver: isItemOver, isDragging } = sortable;
                        const style: React.CSSProperties = {
                            transform: CSS.Transform.toString(transform),
                            transition,
                            opacity: isDragging ? 0.6 : 1,
                        };
                        return (
                            <li
                                key={b.id}
                                ref={setItemRef}
                                style={style}
                                {...attributes}
                                {...listeners}
                                className={`border rounded p-2 relative cursor-grab active:cursor-grabbing transition-all ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-border hover:border-gray-400'
                                    } ${isItemOver ? 'ring-2 ring-blue-300' : ''}`}
                                onClick={e => {
                                    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
                                    onBlockSelect?.(b.id);
                                }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className={`text-xs uppercase ${isSelected
                                        ? 'text-blue-700 font-medium'
                                        : 'text-muted-foreground'
                                        }`}>{b.type}</div>
                                    <div className="flex items-center gap-1">
                                        {typeof onMoveBlock === 'function' && (
                                            <>
                                                <button
                                                    className="text-[10px] px-1 py-0.5 border rounded disabled:opacity-50"
                                                    onClick={e => { e.stopPropagation(); onMoveBlock(idx, Math.max(0, idx - 1)); }}
                                                    disabled={idx === 0}
                                                    title="Mover para cima"
                                                >↑</button>
                                                <button
                                                    className="text-[10px] px-1 py-0.5 border rounded disabled:opacity-50"
                                                    onClick={e => { e.stopPropagation(); onMoveBlock(idx, Math.min((blocks?.length || 1) - 1, idx + 1)); }}
                                                    disabled={idx === (blocks?.length || 1) - 1}
                                                    title="Mover para baixo"
                                                >↓</button>
                                            </>
                                        )}
                                        {typeof onRemoveBlock === 'function' && (
                                            <button
                                                className="text-[10px] px-1 py-0.5 border rounded text-red-600"
                                                onClick={e => { e.stopPropagation(); onRemoveBlock(b.id); }}
                                                title="Remover bloco"
                                            >×</button>
                                        )}
                                    </div>
                                </div>
                                {/* Renderização canônica via BlockTypeRenderer */}
                                <BlockTypeRenderer block={b as any} />

                                {/* Quick Insert (somente quando há onUpdateBlock e conteúdo mínimo ausente) */}
                                {onUpdateBlock && (
                                    <div className="mt-1">
                                        {(() => {
                                            const type = String((b as any).type);
                                            const content: any = (b as any).content || {};
                                            const props: any = (b as any).properties || {};
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
                                                            onUpdateBlock(b.id, { content: { text: '<span style=\"color: #B89B7A; font-weight: 700;\">Chega</span> de um guarda-roupa lotado e da sensação de que <span style=\"color: #B89B7A; font-weight: 700;\">nada combina com você</span>.' } as any });
                                                        } else if (type === 'intro-description' || type === 'text') {
                                                            onUpdateBlock(b.id, { content: { description: 'Em poucos minutos, descubra seu <span class=\"font-semibold text-[#B89B7A]\">Estilo Predominante</span> — e aprenda a montar looks que realmente refletem sua <span class=\"font-semibold text-[#432818]\">essência</span>, com praticidade e <span class=\"font-semibold text-[#432818]\">confiança</span>.' } as any });
                                                        } else if (type === 'intro-logo' || type === 'intro-image' || type === 'image' || type === 'image-display-inline') {
                                                            onUpdateBlock(b.id, { content: { imageUrl: '/favicon.ico', alt: 'logo' } as any });
                                                        } else if (type === 'intro-form' || type === 'form-container') {
                                                            onUpdateBlock(b.id, { content: { fields: [] } as any });
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
                    })}
                </ul>
            </SortableContext>
        </div>
    );
}
