/**
 * 📚 Block Library - Coluna 2: Biblioteca de Tipos de Blocos + Blocos Salvos
 * 
 * Funcionalidades:
 * - Tab "Blocos": tipos de blocos disponíveis para arrastar
 * - Tab "Salvos": blocos salvos pelo usuário (persistidos no Supabase)
 * - Drag source para DnD
 */

import React, { memo, useMemo } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useDraggable } from '@dnd-kit/core';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Blocks, Library } from 'lucide-react';
import { BlockLibraryPanel } from '../components/BlockLibraryPanel';
import { useQuizStore } from '../store/quizStore';
import { cn } from '@/lib/utils';

// Tipos de blocos disponíveis no sistema
const BLOCK_TYPES = {
    question: [
        { type: 'singleChoice', label: 'Escolha Única', icon: '🔘', description: 'Pergunta com uma resposta' },
        { type: 'multipleChoice', label: 'Múltipla Escolha', icon: '☑️', description: 'Pergunta com várias respostas' },
        { type: 'slider', label: 'Slider', icon: '🎚️', description: 'Pergunta com escala numérica' },
    ],
    result: [
        { type: 'resultText', label: 'Texto Resultado', icon: '📄', description: 'Exibir texto baseado no score' },
        { type: 'resultCard', label: 'Card Resultado', icon: '🎴', description: 'Card visual com resultado' },
        { type: 'resultChart', label: 'Gráfico', icon: '📊', description: 'Gráfico de resultados' },
    ],
    ui: [
        { type: 'text', label: 'Texto', icon: '📝', description: 'Bloco de texto livre' },
        { type: 'image', label: 'Imagem', icon: '🖼️', description: 'Exibir imagem' },
        { type: 'divider', label: 'Divisor', icon: '➖', description: 'Linha divisória' },
    ],
} as const;

export const BlockLibrary = memo(() => {
    const isBlockLibraryOpen = useEditorStore((state) => state.isBlockLibraryOpen);
    const libraryTab = useEditorStore((state) => state.libraryTab);
    const setLibraryTab = useEditorStore((state) => state.setLibraryTab);
    const selectedStepId = useEditorStore((state) => state.selectedStepId);
    const addBlock = useQuizStore((state) => state.addBlock);

    const handleInsertFromLibrary = (blockType: string, _config: Record<string, any>) => {
        if (!selectedStepId) return;
        
        // Get current step to determine order
        const quiz = useQuizStore.getState().quiz;
        const step = quiz?.steps.find(s => s.id === selectedStepId);
        const order = step?.blocks?.length || 0;
        
        addBlock(selectedStepId, blockType, order);
    };

    if (!isBlockLibraryOpen) {
        return null;
    }

    return (
        <div className="w-64 border-r border-border bg-card flex flex-col">
            <Tabs 
                value={libraryTab} 
                onValueChange={(v) => setLibraryTab(v as 'blocks' | 'saved')}
                className="flex flex-col h-full"
            >
                {/* Tab Headers */}
                <div className="border-b border-border">
                    <TabsList className="w-full h-auto p-1 bg-transparent">
                        <TabsTrigger 
                            value="blocks" 
                            className="flex-1 gap-1.5 data-[state=active]:bg-background"
                        >
                            <Blocks className="h-4 w-4" />
                            Blocos
                        </TabsTrigger>
                        <TabsTrigger 
                            value="saved" 
                            className="flex-1 gap-1.5 data-[state=active]:bg-background"
                        >
                            <Library className="h-4 w-4" />
                            Salvos
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab: Block Types */}
                <TabsContent value="blocks" className="flex-1 m-0 overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="p-3 border-b border-border">
                            <p className="text-xs text-muted-foreground">Arraste para adicionar ao canvas</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-4">
                            <BlockCategory title="Perguntas" blocks={BLOCK_TYPES.question} />
                            <BlockCategory title="Resultados" blocks={BLOCK_TYPES.result} />
                            <BlockCategory title="Interface" blocks={BLOCK_TYPES.ui} />
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Saved Library */}
                <TabsContent value="saved" className="flex-1 m-0 overflow-hidden">
                    <BlockLibraryPanel onInsertBlock={handleInsertFromLibrary} />
                </TabsContent>
            </Tabs>
        </div>
    );
});

interface BlockCategoryProps {
    title: string;
    blocks: readonly { type: string; label: string; icon: string; description: string }[];
}

const BlockCategory = memo(({ title, blocks }: BlockCategoryProps) => {
    return (
        <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {title}
            </h3>
            <div className="space-y-2">
                {blocks.map((block) => (
                    <BlockCard key={block.type} {...block} />
                ))}
            </div>
        </div>
    );
});

interface BlockCardProps {
    type: string;
    label: string;
    icon: string;
    description: string;
}

const BlockCard = memo(({ type, label, icon, description }: BlockCardProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `new-block-${type}`,
        data: {
            blockType: type,
            isNew: true,
        },
    });

    const style = useMemo(() => transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            opacity: isDragging ? 0.5 : 1,
            cursor: isDragging ? 'grabbing' : 'grab',
        }
        : { cursor: 'grab' }, [transform, isDragging]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "p-3 bg-card border border-border rounded-lg",
                "hover:border-primary/50 hover:bg-accent/50",
                "transition-all duration-150",
                isDragging && "opacity-50 shadow-lg ring-2 ring-primary"
            )}
            data-block-type={type}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label={label}>
                    {icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
            </div>
        </div>
    );
});
