/**
 * 🎯 CANVAS MODULAR RENDERER - Renderizador de Steps com Blocos Modulares
 * 
 * Renderiza steps decompostos em blocos modulares independentes.
 * Cada propriedade do step vira um bloco editável e reordenável.
 * 
 * @deprecated Este componente será removido no Sprint 4.
 * Use AdvancedCanvasRenderer de @/components/editor/canvas/AdvancedCanvasRenderer
 * 
 * Motivo: Funcionalidade consolidada no AdvancedCanvasRenderer oficial que:
 * - DnD moderno com @dnd-kit
 * - Performance otimizada
 * - Melhor gestão de estado
 * - Features de editor completas
 * 
 * Migração:
 * ```tsx
 * // ANTES:
 * import { ModularCanvasRenderer } from '@/editor/components/ModularCanvasRenderer';
 * <ModularCanvasRenderer 
 *   step={step}
 *   isSelected={true}
 *   onUpdateBlock={handleUpdate}
 * />
 * 
 * // DEPOIS:
 * import { AdvancedCanvasRenderer } from '@/components/editor/canvas/AdvancedCanvasRenderer';
 * <AdvancedCanvasRenderer 
 *   steps={steps}
 *   selectedStep={step}
 *   onUpdate={handleUpdate}
 * />
 * ```
 * 
 * Data de remoção prevista: Sprint 4 - Dia 2 (22/out/2024)
 */

import React from 'react';
import { stepToBlocks } from '@/editor/utils/stepToBlocks';
import { BlockRenderer } from '@/editor/components/BlockRenderer';
import { BlockData } from '@/types/blockTypes';
import { QuizStep } from '@/data/quizSteps';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Copy, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type EditableQuizStep = QuizStep & { id: string };

interface ModularCanvasRendererProps {
    step: EditableQuizStep;
    index: number;
    totalSteps: number;
    isSelected: boolean;
    selectedBlockId: string;
    isEditMode: boolean;
    steps?: EditableQuizStep[]; // Lista completa de steps para navegação
    renderComponent?: (step: EditableQuizStep, index: number) => React.ReactNode; // Renderizar componente real
    children?: React.ReactNode; // Alternativamente, aceitar children
    onSelectStep: () => void;
    onSelectBlock: (blockId: string) => void;
    onUpdateBlock: (blockId: string, props: any) => void;
    onReorderBlock: (blockId: string, direction: 'up' | 'down') => void;
    onMoveStep: (direction: number) => void;
    onNavigateStep?: (stepId: string) => void; // Nova prop para navegação
    onDuplicateStep: () => void;
    onDeleteStep: () => void;
}

export const ModularCanvasRenderer: React.FC<ModularCanvasRendererProps> = ({
    step,
    index,
    totalSteps,
    isSelected,
    selectedBlockId,
    isEditMode,
    steps = [],
    renderComponent,
    children,
    onSelectStep,
    onSelectBlock,
    onUpdateBlock,
    onReorderBlock,
    onMoveStep,
    onNavigateStep,
    onDuplicateStep,
    onDeleteStep,
}) => {
    // ⚠️ AVISO DE DEPRECIAÇÃO
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️ [DEPRECATED] ModularCanvasRenderer será removido no Sprint 4.\n' +
            'Use AdvancedCanvasRenderer de @/components/editor/canvas/AdvancedCanvasRenderer\n' +
            'Veja documentação no topo do arquivo para guia de migração.'
        );
    }

    // Decompor step em blocos modulares
    const blocks = stepToBlocks(step);

    return (
        <div
            className={cn(
                "border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer relative group",
                isSelected
                    ? "border-blue-500 shadow-lg bg-blue-50/30 ring-2 ring-blue-300 ring-offset-2"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            )}
            onClick={(e) => {
                // Se clicar no container (não em um bloco), selecionar o step
                if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.step-header')) {
                    onSelectStep();
                }
            }}
        >
            {/* Header do Step */}
            <div className="step-header flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                        Step {index + 1} / {totalSteps}
                    </Badge>
                    <span className={cn(
                        "text-sm font-semibold",
                        isSelected ? "text-blue-700" : "text-gray-700"
                    )}>
                        {step.type.toUpperCase().replace('-', ' ')}
                    </span>
                    {isSelected && (
                        <Badge variant="secondary" className="text-[10px]">
                            ✏️ Editando
                        </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {blocks.length} bloco{blocks.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                {/* Navegação entre steps - mesma funcionalidade do modo OFF */}
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Navegar para step anterior (mesma lógica exata do modo OFF)
                            const prevIndex = index - 1;
                            if (prevIndex >= 0 && steps[prevIndex]) {
                                if (onNavigateStep) {
                                    onNavigateStep(steps[prevIndex].id);
                                }
                            }
                        }}
                        title="Step anterior"
                        disabled={index === 0}
                    >
                        <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Navegar para próximo step (mesma lógica exata do modo OFF)
                            const nextIndex = index + 1;
                            if (nextIndex < steps.length && steps[nextIndex]) {
                                if (onNavigateStep) {
                                    onNavigateStep(steps[nextIndex].id);
                                }
                            }
                        }}
                        title="Próximo step"
                        disabled={index === totalSteps - 1}
                    >
                        <ChevronRight className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateStep();
                        }}
                        title="Duplicar"
                    >
                        <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteStep();
                        }}
                        title="Remover"
                        disabled={totalSteps === 1}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {/* Renderizar Componente Real - mesma funcionalidade do modo OFF */}
            <div className="transition-opacity opacity-100">
                {renderComponent ? (
                    renderComponent(step, index)
                ) : children ? (
                    children
                ) : (
                    // Fallback se não houver componente para renderizar
                    <div className="min-h-[200px] bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="font-medium">Componente Real do Step</div>
                            <div className="text-sm">Aguardando implementação de renderComponent</div>
                            <div className="text-xs mt-2 opacity-75">
                                Tipo: {step.type} | ID: {step.id}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Seção de Blocos Modulares (Oculta por padrão para manter paridade) */}
            <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    🔧 Blocos Modulares ({blocks.length})
                </summary>
                <div className="mt-2 space-y-2 pl-4 border-l-2 border-blue-200">
                    {blocks.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            <div className="text-lg mb-2">📦</div>
                            <div>Nenhum bloco disponível</div>
                            <div className="text-xs">Este step não possui propriedades decomponíveis</div>
                        </div>
                    )}

                    {blocks.map((block, blockIndex) => {
                        const isBlockSelected = selectedBlockId === block.id;

                        return (
                            <div
                                key={block.id}
                                className={cn(
                                    "relative group/block",
                                    isBlockSelected && "ring-2 ring-primary rounded-lg"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectBlock(block.id);
                                }}
                            >
                                {/* Botões de reordenação do bloco */}
                                {isEditMode && (
                                    <div className={cn(
                                        "absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-10",
                                        "opacity-0 group-hover/block:opacity-100 transition-opacity"
                                    )}>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-5 w-5 p-0 bg-white border shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReorderBlock(block.id, 'up');
                                            }}
                                            title="Mover bloco para cima"
                                            disabled={blockIndex === 0}
                                        >
                                            <ArrowUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-5 w-5 p-0 bg-white border shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReorderBlock(block.id, 'down');
                                            }}
                                            title="Mover bloco para baixo"
                                            disabled={blockIndex === blocks.length - 1}
                                        >
                                            <ArrowDown className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}

                                {/* Label do Bloco (visível apenas se selecionado) */}
                                {isBlockSelected && (
                                    <div className="absolute -top-2 left-2 z-20">
                                        <Badge variant="default" className="text-[10px] shadow-sm">
                                            {block.metadata?.icon} {block.metadata?.label || block.type}
                                        </Badge>
                                    </div>
                                )}

                                {/* Renderizar o bloco */}
                                <BlockRenderer
                                    block={block}
                                    isSelected={isBlockSelected}
                                    isEditable={isEditMode}
                                    onSelect={() => onSelectBlock(block.id)}
                                    onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                                />
                            </div>
                        );
                    })}
                </div>
            </details>
        </div>
    );
};

export default ModularCanvasRenderer;
