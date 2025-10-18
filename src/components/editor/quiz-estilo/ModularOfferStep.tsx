import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { cn } from '@/lib/utils';

interface ModularOfferStepProps {
    data: any;
    blocks?: Block[];
    userProfile?: {
        userName: string;
        resultStyle: string;
        secondaryStyles?: string[];
    };
    offerKey?: string;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
}

/**
 * 🎁 OFFER STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Título personalizado
 * - Resultado destacado
 * - Título da oferta
 * - Imagem da oferta
 * - Descrição
 * - Benefícios
 * - Preços
 * - Call to Action
 * - Garantia
 */
export default function ModularOfferStep({
    data,
    blocks = [],
    userProfile,
    offerKey = 'default',
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { },
    onBlocksReorder
}: ModularOfferStepProps) {

    const STEP_ID = data?.id || 'step-offer';

    // Suporte a blocos reais (Block[])
    const hasRealBlocks = Array.isArray(blocks) && blocks.length > 0;
    const topLevelBlocks: Block[] = React.useMemo(() => {
        if (!hasRealBlocks) return [];
        const list = (blocks as Block[]).filter(b => !('parentId' in (b as any)) || !(b as any).parentId);
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [blocks, hasRealBlocks]);

    // DnD (para blocos reais e fallback lógico)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    );

    const safeData = {
        title: data.title || 'Oferta Especial Para Você!',
        subtitle: data.subtitle || 'Consultoria de Imagem Personalizada',
        userName: userProfile?.userName || 'João',
        resultStyle: userProfile?.resultStyle || 'Clássico Elegante',
        description: data.description || 'Aprenda a valorizar seu estilo único com nossa consultoria especializada.',
        price: data.price || 'R$ 497,00',
        originalPrice: data.originalPrice || 'R$ 997,00',
        benefits: data.benefits || [
            'Análise completa do seu estilo',
            'Guia personalizado de cores',
            'Dicas de combinações exclusivas',
            'Suporte por 30 dias'
        ],
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png'
    };

    // Block IDs (fallback legado)
    const personalizedTitleBlockId = `${data.id}-personalized-title`;
    const resultHighlightBlockId = `${data.id}-result-highlight`;
    const offerTitleBlockId = `${data.id}-offer-title`;
    const imageBlockId = `${data.id}-image`;
    const descriptionBlockId = `${data.id}-description`;
    const benefitsBlockId = `${data.id}-benefits`;
    const pricingBlockId = `${data.id}-pricing`;
    const ctaBlockId = `${data.id}-cta`;
    const guaranteeBlockId = `${data.id}-guarantee`;

    // Ordem lógica (fallback)
    const DEFAULT_ORDER = [
        'offer-personalized-title',
        'offer-result-highlight',
        'offer-title',
        'offer-image',
        'offer-description',
        'offer-benefits',
        'offer-pricing',
        'offer-cta',
        'offer-guarantee'
    ];
    const initialOrder: string[] = (data?.metadata?.blockOrder && Array.isArray(data.metadata.blockOrder))
        ? data.metadata.blockOrder
        : DEFAULT_ORDER;
    const [order, setOrder] = React.useState<string[]>(initialOrder);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        if (hasRealBlocks) {
            const ids = topLevelBlocks.map(b => b.id);
            const oldIndex = ids.indexOf(String(active.id));
            const newIndex = ids.indexOf(String(over.id));
            if (oldIndex >= 0 && newIndex >= 0) {
                const newIds = arrayMove(ids, oldIndex, newIndex);
                onBlocksReorder?.(STEP_ID, newIds);
            }
        } else {
            const oldIndex = order.indexOf(String(active.id));
            const newIndex = order.indexOf(String(over.id));
            const newOrder = arrayMove(order, oldIndex, newIndex);
            setOrder(newOrder);
            onBlocksReorder?.(STEP_ID, newOrder);
            onEdit?.('blockOrder', newOrder);
        }
    };

    // Sortable item wrapper
    const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
        const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.7 : 1 } as React.CSSProperties;
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        );
    };

    // Drop zone entre blocos reais
    const DropZoneBefore: React.FC<{ blockId: string; insertIndex: number }> = ({ blockId, insertIndex }) => {
        const dropZoneId = `drop-before-${blockId}`;
        const { setNodeRef, isOver } = useDroppable({ id: dropZoneId, data: { dropZone: 'before', blockId, stepId: STEP_ID, insertIndex } });
        return <div ref={setNodeRef} className={cn('h-4 -my-1 transition-all border-2 border-dashed rounded', isOver ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-300 opacity-60 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400')} />;
    };

    // NOVO: Renderização por blocos reais
    if (hasRealBlocks) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <main className="w-full max-w-6xl mx-auto px-4 py-8">
                    <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={topLevelBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                {topLevelBlocks.map((block, index) => (
                                    <React.Fragment key={block.id}>
                                        <DropZoneBefore blockId={block.id} insertIndex={index} />
                                        <SortableItem id={block.id}>
                                            <BlockTypeRenderer
                                                block={block}
                                                isSelected={selectedBlockId === block.id}
                                                isEditable={isEditable}
                                                onSelect={onBlockSelect}
                                                onOpenProperties={onOpenProperties}
                                                contextData={{
                                                    userProfile,
                                                    offerKey,
                                                    onCTA: (payload?: any) => {
                                                        try {
                                                            window.dispatchEvent(new CustomEvent('quiz-offer-cta', { detail: { stepId: STEP_ID, blockId: block.id, payload } }));
                                                        } catch { /* noop */ }
                                                    }
                                                }}
                                            />
                                        </SortableItem>
                                    </React.Fragment>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                    {/* BLOCO 1: Título Personalizado */}
                    <SelectableBlock
                        blockId={personalizedTitleBlockId}
                        isSelected={selectedBlockId === personalizedTitleBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Título Personalizado"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <h1
                            className="text-2xl md:text-3xl font-bold text-[#432818] mb-2"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            {safeData.userName}, agora que você descobriu que é
                        </h1>
                    </SelectableBlock>

                    {/* BLOCO 2: Resultado Destacado */}
                    <SelectableBlock
                        blockId={resultHighlightBlockId}
                        isSelected={selectedBlockId === resultHighlightBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Resultado Destacado"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="bg-gradient-to-r from-[#B89B7A] to-[#A1835D] text-white p-4 rounded-lg mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">
                                {safeData.resultStyle}
                            </h2>
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 3: Título da Oferta */}
                    <SelectableBlock
                        blockId={offerTitleBlockId}
                        isSelected={selectedBlockId === offerTitleBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Título da Oferta"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <h3 className="text-xl text-[#432818] font-semibold mb-8">
                            {safeData.title}
                        </h3>
                    </SelectableBlock>

                    {/* BLOCO 4: Imagem da Oferta */}
                    <SelectableBlock
                        blockId={imageBlockId}
                        isSelected={selectedBlockId === imageBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Imagem da Oferta"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="w-full max-w-sm mx-auto mb-6">
                            <img
                                src={safeData.image}
                                alt="Consultoria de Imagem"
                                className="w-full h-auto rounded-lg shadow-sm"
                            />
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 5: Descrição */}
                    <SelectableBlock
                        blockId={descriptionBlockId}
                        isSelected={selectedBlockId === descriptionBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Descrição"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                            {safeData.description}
                        </p>
                    </SelectableBlock>

                    {/* BLOCO 6: Benefícios */}
                    <SelectableBlock
                        blockId={benefitsBlockId}
                        isSelected={selectedBlockId === benefitsBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Benefícios"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <h4 className="text-lg font-semibold text-[#432818] mb-4">
                                O que você vai receber:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                {safeData.benefits.map((benefit: string, index: number) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        <p className="text-sm text-[#432818]">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 7: Preços */}
                    <SelectableBlock
                        blockId={pricingBlockId}
                        isSelected={selectedBlockId === pricingBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Preços"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="bg-gradient-to-br from-[#B89B7A] to-[#A1835D] text-white p-6 rounded-lg mb-8">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <span className="text-lg line-through opacity-75">{safeData.originalPrice}</span>
                                <span className="text-3xl font-bold">{safeData.price}</span>
                            </div>
                            <p className="text-sm opacity-90">Oferta especial por tempo limitado</p>
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 8: Call to Action */}
                    <SelectableBlock
                        blockId={ctaBlockId}
                        isSelected={selectedBlockId === ctaBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Call to Action"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <button className="bg-[#432818] hover:bg-[#2d1a10] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 mb-4">
                            Quero Minha Consultoria Agora!
                        </button>
                    </SelectableBlock>

                    {/* BLOCO 9: Garantia */}
                    <SelectableBlock
                        blockId={guaranteeBlockId}
                        isSelected={selectedBlockId === guaranteeBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Garantia"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <p className="text-xs text-gray-500 mb-4">
                            🔒 Compra 100% segura • Garantia de 7 dias
                        </p>

                        {isEditable && (
                            <p className="text-xs text-blue-500">
                                ✏️ Editável via Painel de Propriedades
                            </p>
                        )}
                    </SelectableBlock>
                </div>
            </main>
        </div>
    );
}