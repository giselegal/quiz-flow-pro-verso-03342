import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { cn } from '@/lib/utils';

interface ModularIntroStepProps {
    data?: any; // legacy fallback
    blocks?: Block[]; // NOVO: blocos reais vindos do JSON/EditorProvider
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
    /** Emite o nome digitado quando o botão do formulário é clicado (paridade com preview). */
    onNameSubmit?: (name: string) => void;
}

/**
 * 🏠 INTRO STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Header com logo
 * - Título principal 
 * - Imagem
 * - Texto descritivo
 * - Formulário
 * - Footer
 */
export default function ModularIntroStep({
    data,
    blocks = [],
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect,
    onOpenProperties,
    onBlocksReorder,
    onNameSubmit
}: ModularIntroStepProps) {

    const safeData = {
        title: data.title || '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        formQuestion: data.formQuestion || 'Como posso te chamar?',
        placeholder: data.placeholder || 'Digite seu primeiro nome aqui...',
        buttonText: data.buttonText || 'Quero Descobrir meu Estilo Agora!',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
        description: data.description || 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.'
    };

    // Identificador do step
    const STEP_ID = data?.id || 'step-intro';

    // NOVO: Se recebemos Block[], renderizamos iterativamente com DnD
    const hasRealBlocks = Array.isArray(blocks) && blocks.length > 0;
    const topLevelBlocks: Block[] = React.useMemo(() => {
        if (!hasRealBlocks) return [];
        const list = (blocks as Block[]).filter(b => !('parentId' in (b as any)) || !(b as any).parentId);
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [blocks, hasRealBlocks]);

    // Ordem legacy (fallback) para layout hard-coded
    const DEFAULT_ORDER = ['intro-title', 'intro-image', 'intro-description', 'intro-form'];
    const initialOrder: string[] = (data?.metadata?.blockOrder && Array.isArray(data.metadata.blockOrder)) ? data.metadata.blockOrder : DEFAULT_ORDER;
    const [order, setOrder] = React.useState<string[]>(initialOrder);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        if (hasRealBlocks) {
            // DnD entre blocos reais: reordenar via onBlocksReorder usando IDs reais
            const ids = topLevelBlocks.map(b => b.id);
            const oldIndex = ids.indexOf(String(active.id));
            const newIndex = ids.indexOf(String(over.id));
            if (oldIndex >= 0 && newIndex >= 0) {
                const newIds = arrayMove(ids, oldIndex, newIndex);
                onBlocksReorder?.(STEP_ID, newIds);
            }
        } else {
            // Legacy: ordem lógica
            const oldIndex = order.indexOf(String(active.id));
            const newIndex = order.indexOf(String(over.id));
            const newOrder = arrayMove(order, oldIndex, newIndex);
            setOrder(newOrder);
            onBlocksReorder?.(STEP_ID, newOrder);
            onEdit?.('blockOrder', newOrder);
        }
    };

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // DropZoneBefore local (para blocos reais)
    const DropZoneBefore: React.FC<{ blockId: string; insertIndex: number }> = ({ blockId, insertIndex }) => {
        const dropZoneId = `drop-before-${blockId}`;
        const { setNodeRef, isOver } = useDroppable({ id: dropZoneId, data: { dropZone: 'before', blockId, stepId: STEP_ID, insertIndex } });
        return (
            <div ref={setNodeRef} className={cn('h-4 -my-1 transition-all border-2 border-dashed rounded', isOver ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-300 opacity-60 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400')} />
        );
    };

    // Sortable wrapper reutilizável
    const SortableBlockItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
        const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.7 : 1 } as React.CSSProperties;
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        );
    };

    // Se temos blocos reais: render iterativo
    if (hasRealBlocks) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={topLevelBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {topLevelBlocks.map((block, index) => (
                            <React.Fragment key={block.id}>
                                <DropZoneBefore blockId={block.id} insertIndex={index} />
                                <SortableBlockItem id={block.id}>
                                    <BlockTypeRenderer
                                        block={block}
                                        isSelected={selectedBlockId === block.id}
                                        isEditable={isEditable}
                                        onSelect={onBlockSelect}
                                        onOpenProperties={onOpenProperties}
                                        contextData={{ onNameSubmit, inputRef }}
                                    />
                                </SortableBlockItem>
                            </React.Fragment>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        );
    }

    // Fallback legacy: UI hard-coded enquanto blocos reais não estiverem disponíveis
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header fixo */}
            <SelectableBlock
                blockId="intro-header"
                isSelected={selectedBlockId === 'intro-header'}
                isEditable={isEditable}
                onSelect={() => onBlockSelect?.('intro-header')}
                blockType="Header com Logo"
                blockIndex={0}
                onOpenProperties={() => onOpenProperties?.('intro-header')}
                isDraggable={false}
            >
                <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 py-8 mx-auto space-y-8">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                            <img
                                src="https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png"
                                alt="Logo Gisele Galvão"
                                className="h-auto mx-auto"
                                width={120}
                                height={50}
                                style={{ objectFit: 'contain', maxWidth: '120px', aspectRatio: '120 / 50' }}
                            />
                            <div className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5 mx-auto" style={{ width: '300px', maxWidth: '90%' }} />
                        </div>
                    </div>
                </header>
            </SelectableBlock>

            {/* BLOCOS legados reordenáveis por IDs lógicos */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={order} strategy={verticalListSortingStrategy}>
                    {order.map((blockId, index) => {
                        if (blockId === 'intro-title') {
                            return (
                                <SortableBlockItem key={blockId} id={blockId}>
                                    <SelectableBlock
                                        blockId="intro-title"
                                        isSelected={selectedBlockId === 'intro-title'}
                                        isEditable={isEditable}
                                        onSelect={() => onBlockSelect?.('intro-title')}
                                        blockType="Título Principal"
                                        blockIndex={index + 1}
                                        onOpenProperties={() => onOpenProperties?.('intro-title')}
                                        isDraggable={true}
                                    >
                                        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto">
                                            <h1 className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl text-[#432818]" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}>
                                                <span dangerouslySetInnerHTML={{ __html: safeData.title }} />
                                            </h1>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlockItem>
                            );
                        }
                        if (blockId === 'intro-image') {
                            return (
                                <SortableBlockItem key={blockId} id={blockId}>
                                    <SelectableBlock
                                        blockId="intro-image"
                                        isSelected={selectedBlockId === 'intro-image'}
                                        isEditable={isEditable}
                                        onSelect={() => onBlockSelect?.('intro-image')}
                                        blockType="Imagem Principal"
                                        blockIndex={index + 1}
                                        onOpenProperties={() => onOpenProperties?.('intro-image')}
                                        isDraggable={true}
                                    >
                                        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto mt-8">
                                            <div className="mt-2 w-full mx-auto flex justify-center">
                                                <div className="overflow-hidden rounded-lg shadow-sm" style={{ aspectRatio: '1.47', maxHeight: '204px', width: '100%', maxWidth: '300px' }}>
                                                    <img src={safeData.image} alt="Descubra seu estilo predominante" className="w-full h-full object-contain" width={300} height={204} style={{ maxWidth: '300px', maxHeight: '204px', width: '100%', height: 'auto', objectFit: 'contain' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlockItem>
                            );
                        }
                        if (blockId === 'intro-description') {
                            return (
                                <SortableBlockItem key={blockId} id={blockId}>
                                    <SelectableBlock
                                        blockId="intro-description"
                                        isSelected={selectedBlockId === 'intro-description'}
                                        isEditable={isEditable}
                                        onSelect={() => onBlockSelect?.('intro-description')}
                                        blockType="Texto Descritivo"
                                        blockIndex={index + 1}
                                        onOpenProperties={() => onOpenProperties?.('intro-description')}
                                        isDraggable={true}
                                    >
                                        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto mt-6">
                                            <p className="text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600">{safeData.description}</p>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlockItem>
                            );
                        }
                        if (blockId === 'intro-form') {
                            return (
                                <SortableBlockItem key={blockId} id={blockId}>
                                    <SelectableBlock
                                        blockId="intro-form"
                                        isSelected={selectedBlockId === 'intro-form'}
                                        isEditable={isEditable}
                                        onSelect={() => onBlockSelect?.('intro-form')}
                                        blockType="Formulário"
                                        blockIndex={index + 1}
                                        onOpenProperties={() => onOpenProperties?.('intro-form')}
                                        isDraggable={true}
                                    >
                                        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto mt-8">
                                            <form className="w-full space-y-6" autoComplete="off" onSubmit={(e) => { e.preventDefault(); }}>
                                                <div>
                                                    <label htmlFor="name" className="block text-xs font-semibold text-[#432818] mb-1.5">
                                                        {safeData.formQuestion} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input id="name" type="text" placeholder={safeData.placeholder} className="w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 border-[#B89B7A] focus:outline-none focus:ring-2 focus:ring-[#A1835D]" required ref={inputRef} />
                                                </div>

                                                <button type="button" className="w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg" onClick={() => {
                                                    const name = String(inputRef.current?.value || '').trim();
                                                    if (name && onNameSubmit) onNameSubmit(name);
                                                }}>
                                                    {safeData.buttonText}
                                                </button>

                                                <p className="text-xs text-center text-gray-500 pt-1">
                                                    Seu nome é necessário para personalizar sua experiência.
                                                    {isEditable && (<span className="block text-blue-500 mt-1">✏️ Editável via Painel de Propriedades</span>)}
                                                </p>
                                            </form>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlockItem>
                            );
                        }
                        return null;
                    })}
                </SortableContext>
            </DndContext>

            {/* Footer fixo */}
            <SelectableBlock
                blockId="intro-footer"
                isSelected={selectedBlockId === 'intro-footer'}
                isEditable={isEditable}
                onSelect={() => onBlockSelect?.('intro-footer')}
                blockType="Footer"
                blockIndex={order.length + 1}
                onOpenProperties={() => onOpenProperties?.('intro-footer')}
                isDraggable={false}
            >
                <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados</p>
                </footer>
            </SelectableBlock>
        </div>
    );
}
