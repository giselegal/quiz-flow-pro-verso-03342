import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

interface ModularIntroStepProps {
    data: any;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
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
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect,
    onOpenProperties,
    onBlocksReorder
}: ModularIntroStepProps) {

    const safeData = {
        title: data.title || '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        formQuestion: data.formQuestion || 'Como posso te chamar?',
        placeholder: data.placeholder || 'Digite seu primeiro nome aqui...',
        buttonText: data.buttonText || 'Quero Descobrir meu Estilo Agora!',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
        description: data.description || 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.'
    };

    // Ordem dos blocos reordenáveis
    const STEP_ID = data?.id || 'step-intro';
    const DEFAULT_ORDER = [
        'intro-title',
        'intro-image',
        'intro-description',
        'intro-form'
    ];
    const initialOrder: string[] = (data?.metadata?.blockOrder && Array.isArray(data.metadata.blockOrder))
        ? data.metadata.blockOrder
        : DEFAULT_ORDER;
    const [order, setOrder] = React.useState<string[]>(initialOrder);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = order.indexOf(String(active.id));
        const newIndex = order.indexOf(String(over.id));
        const newOrder = arrayMove(order, oldIndex, newIndex);
        setOrder(newOrder);
        // Persistir no estado do editor/template
        onBlocksReorder?.(STEP_ID, newOrder);
        onEdit?.('blockOrder', newOrder);
    };

    const SortableBlock: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.7 : 1,
        } as React.CSSProperties;
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* BLOCO 1: Header com Logo (fixo) */}
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
                                style={{
                                    objectFit: 'contain',
                                    maxWidth: '120px',
                                    aspectRatio: '120 / 50',
                                }}
                            />
                            <div
                                className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5 mx-auto"
                                style={{
                                    width: '300px',
                                    maxWidth: '90%',
                                }}
                            />
                        </div>
                    </div>
                </header>
            </SelectableBlock>

            {/* BLOCOs reordenáveis */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={order} strategy={verticalListSortingStrategy}>
                    {order.map((blockId, index) => {
                        if (blockId === 'intro-title') {
                            return (
                                <SortableBlock key={blockId} id={blockId}>
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
                                            <h1
                                                className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl text-[#432818]"
                                                style={{
                                                    fontFamily: '"Playfair Display", serif',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: safeData.title }} />
                                            </h1>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlock>
                            );
                        }
                        if (blockId === 'intro-image') {
                            return (
                                <SortableBlock key={blockId} id={blockId}>
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
                                                <div
                                                    className="overflow-hidden rounded-lg shadow-sm"
                                                    style={{
                                                        aspectRatio: '1.47',
                                                        maxHeight: '204px',
                                                        width: '100%',
                                                        maxWidth: '300px'
                                                    }}
                                                >
                                                    <img
                                                        src={safeData.image}
                                                        alt="Descubra seu estilo predominante"
                                                        className="w-full h-full object-contain"
                                                        width={300}
                                                        height={204}
                                                        style={{
                                                            maxWidth: '300px',
                                                            maxHeight: '204px',
                                                            width: '100%',
                                                            height: 'auto',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlock>
                            );
                        }
                        if (blockId === 'intro-description') {
                            return (
                                <SortableBlock key={blockId} id={blockId}>
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
                                            <p className="text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600">
                                                {safeData.description}
                                            </p>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlock>
                            );
                        }
                        if (blockId === 'intro-form') {
                            return (
                                <SortableBlock key={blockId} id={blockId}>
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
                                            <form className="w-full space-y-6" autoComplete="off">
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-xs font-semibold text-[#432818] mb-1.5"
                                                    >
                                                        {safeData.formQuestion} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        placeholder={safeData.placeholder}
                                                        className="w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 border-[#B89B7A] focus:outline-none focus:ring-2 focus:ring-[#A1835D]"
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    className="w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg"
                                                >
                                                    {safeData.buttonText}
                                                </button>

                                                <p className="text-xs text-center text-gray-500 pt-1">
                                                    Seu nome é necessário para personalizar sua experiência.
                                                    {isEditable && (
                                                        <span className="block text-blue-500 mt-1">
                                                            ✏️ Editável via Painel de Propriedades
                                                        </span>
                                                    )}
                                                </p>
                                            </form>
                                        </div>
                                    </SelectableBlock>
                                </SortableBlock>
                            );
                        }
                        return null;
                    })}
                </SortableContext>
            </DndContext>

            {/* BLOCO 6: Footer (fixo) */}
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
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados
                    </p>
                </footer>
            </SelectableBlock>
        </div>
    );
}