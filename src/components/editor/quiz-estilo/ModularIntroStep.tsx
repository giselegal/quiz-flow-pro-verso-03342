import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { cn } from '@/lib/utils';
import { convertTemplateToBlocks, blockComponentsToBlocks } from '@/utils/templateConverter';
import { getQuiz21StepsTemplate } from '@/templates/imports';

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
    onNameSubmit,
}: ModularIntroStepProps) {

    const safeData = {
        title: data.title || '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        formQuestion: data.formQuestion || 'Como posso te chamar?',
        placeholder: data.placeholder || 'Digite seu primeiro nome aqui...',
        buttonText: data.buttonText || 'Quero Descobrir meu Estilo Agora!',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
        description: data.description || 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
    };

    // Identificador do step
    const STEP_ID = data?.id || 'step-intro';

    // Fallback: autoload de blocos do template v3 quando não vierem via props/provider
    const [fallbackBlocks, setFallbackBlocks] = React.useState<Block[]>([]);
    const effectiveBlocks = React.useMemo(() => (Array.isArray(blocks) && blocks.length > 0) ? blocks : fallbackBlocks, [blocks, fallbackBlocks]);

    // Debug: verificar se blocos estão chegando
    React.useEffect(() => {
        console.log('🔍 [ModularIntroStep] Debug:', {
            propsBlocks: blocks?.length || 0,
            fallbackBlocks: fallbackBlocks.length,
            effectiveBlocks: effectiveBlocks.length,
            stepId: STEP_ID
        });
    }, [blocks, fallbackBlocks, effectiveBlocks, STEP_ID]);

    // Evitar auto-load repetido em modo Strict/edição
    const autoloadRequestedRef = React.useRef(false);
    React.useEffect(() => {
        // Se já temos blocos via props, não precisa carregar
        if (Array.isArray(blocks) && blocks.length > 0) return;
        if (autoloadRequestedRef.current) return;
        autoloadRequestedRef.current = true;
        // Tentar extrair step key canônica (ex.: step-01)
        const m = String(data?.id || '').match(/step-\d{2}/);
        const stepKey = m ? m[0] : 'step-01';
        try {
            const comps = convertTemplateToBlocks(getQuiz21StepsTemplate());
            const asBlocks = blockComponentsToBlocks(comps);
            if (Array.isArray(asBlocks) && asBlocks.length > 0) {
                setFallbackBlocks(asBlocks as any);
            }
        } catch (e) {
            // noop
        }
    }, [data?.id, blocks]);

    // Renderização 100% modular baseada em blocos reais
    const hasRealBlocks = Array.isArray(effectiveBlocks) && effectiveBlocks.length > 0;
    const topLevelBlocks: Block[] = React.useMemo(() => {
        if (!hasRealBlocks) return [];
        const list = (effectiveBlocks as Block[]).filter(b => !('parentId' in (b as any)) || !(b as any).parentId);
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [effectiveBlocks, hasRealBlocks]);

    // Debug: verificar blocos filtrados
    React.useEffect(() => {
        console.log('🔍 [ModularIntroStep] Renderização:', {
            hasRealBlocks,
            topLevelBlocksCount: topLevelBlocks.length,
            topLevelBlocksIds: topLevelBlocks.map(b => b.id),
            topLevelBlocksTypes: topLevelBlocks.map(b => (b as any).type)
        });
    }, [hasRealBlocks, topLevelBlocks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        // DnD entre blocos reais: reordenar via onBlocksReorder usando IDs reais
        const ids = topLevelBlocks.map(b => b.id);
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        if (oldIndex >= 0 && newIndex >= 0) {
            const newIds = arrayMove(ids, oldIndex, newIndex);
            onBlocksReorder?.(STEP_ID, newIds);
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

    // Se temos blocos reais: render iterativo (modular)
    if (hasRealBlocks) {
        const hasHeaderBlock = topLevelBlocks.some(b => String((b as any).type || '').toLowerCase() === 'quiz-intro-header' || /intro-header/i.test(String(b.id)));
        const hasFooterBlock = topLevelBlocks.some(b => /intro-footer/i.test(String(b.id)) || String((b as any).type || '').toLowerCase() === 'footer');
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Header fallback para manter paridade visual quando não existir bloco real */}
                {!hasHeaderBlock && (
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
                )}
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
                {/* Footer fallback */}
                {!hasFooterBlock && (
                    <SelectableBlock
                        blockId="intro-footer"
                        isSelected={selectedBlockId === 'intro-footer'}
                        isEditable={isEditable}
                        onSelect={() => onBlockSelect?.('intro-footer')}
                        blockType="Footer"
                        blockIndex={topLevelBlocks.length + 1}
                        onOpenProperties={() => onOpenProperties?.('intro-footer')}
                        isDraggable={false}
                    >
                        <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto">
                            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados</p>
                        </footer>
                    </SelectableBlock>
                )}
            </div>
        );
    }
    // Placeholder mínimo enquanto blocos não carregam (sem UI hard-coded)
    return (
        <div className="min-h-[200px] flex items-center justify-center border rounded bg-white/50 text-xs text-slate-500">
            Carregando blocos do template do Step 01...
        </div>
    );
}
