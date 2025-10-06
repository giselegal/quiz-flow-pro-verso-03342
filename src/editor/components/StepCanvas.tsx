/**
 * 🎯 STEP CANVAS - Canvas de Preview com Blocos Modulares
 * 
 * Canvas que renderiza os blocos do step selecionado.
 * - Preview apenas (não edição inline)
 * - Suporta seleção de blocos
 * - Drag and drop para reordenação
 * - Live preview: atualiza automaticamente quando JSON muda
 */

import React, { useState } from 'react';
import { useStepBlocks } from '@/editor/hooks/useStepBlocks';
import { getBlockComponent } from '@/editor/registry/BlockRegistry';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

// Importar componentes para garantir que estão registrados
import '@/editor/components/blocks';

interface StepCanvasProps {
    stepIndex: number;
    selectedBlockId: string | null;
    onSelectBlock: (blockId: string) => void;
    isEditable?: boolean;
    className?: string;
}

const StepCanvas: React.FC<StepCanvasProps> = ({
    stepIndex,
    selectedBlockId,
    onSelectBlock,
    isEditable = true,
    className
}) => {
    const { step, blocks, isLoading, error } = useStepBlocks(stepIndex);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // ========================================================================
    // LOADING & ERROR STATES
    // ========================================================================

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Carregando step...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-red-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Erro ao carregar step</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!step) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    <p className="text-sm">Step não encontrado</p>
                    <p className="text-xs mt-1">Índice: {stepIndex}</p>
                </div>
            </div>
        );
    }

    // ========================================================================
    // EMPTY STATE
    // ========================================================================

    if (blocks.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-sm font-medium">Nenhum bloco nesta etapa</p>
                    <p className="text-xs mt-1">Use a biblioteca para adicionar componentes</p>
                </div>
            </div>
        );
    }

    // ========================================================================
    // RENDER BLOCKS
    // ========================================================================

    return (
        <div className={cn('w-full h-full overflow-auto bg-gray-50', className)}>
            {/* Header do Step */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {step.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {blocks.length} {blocks.length === 1 ? 'bloco' : 'blocos'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                            Step {step.order}/{21}
                        </span>
                    </div>
                </div>
            </div>

            {/* Blocks Container */}
            <div className="p-4 space-y-2">
                {blocks.map((block, index) => {
                    // Obter componente do registry
                    const BlockComponent = getBlockComponent(block.type);

                    if (!BlockComponent) {
                        return (
                            <div
                                key={block.id}
                                className="p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg"
                            >
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Componente não encontrado: {block.type}
                                        </p>
                                        <p className="text-xs mt-1">
                                            ID: {block.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    const isSelected = selectedBlockId === block.id;
                    const isDragOver = dragOverIndex === index;

                    return (
                        <div
                            key={block.id}
                            className={cn(
                                'relative transition-all duration-200',
                                isDragOver && 'border-t-2 border-blue-500'
                            )}
                            draggable={isEditable}
                            onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('blockIndex', String(index));
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                setDragOverIndex(index);
                            }}
                            onDragLeave={() => {
                                setDragOverIndex(null);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                const fromIndex = Number(e.dataTransfer.getData('blockIndex'));
                                const toIndex = index;

                                // TODO: Implementar reordenação via hook
                                console.log(`Reordenar: ${fromIndex} → ${toIndex}`);

                                setDragOverIndex(null);
                            }}
                        >
                            {/* Drag Handle */}
                            {isEditable && (
                                <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="w-4 h-8 bg-gray-300 rounded cursor-move flex items-center justify-center">
                                        <div className="text-white text-xs">⋮⋮</div>
                                    </div>
                                </div>
                            )}

                            {/* Block Component */}
                            <BlockComponent
                                data={block}
                                isSelected={isSelected}
                                isEditable={isEditable}
                                onSelect={() => onSelectBlock(block.id)}
                                onUpdate={() => { }} // Atualização via painel de propriedades
                            />

                            {/* Order Indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                                    {index + 1}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Drop Zone para adicionar no final */}
            {isEditable && (
                <div
                    className="p-8 m-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer text-center"
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    }}
                    onClick={() => {
                        // TODO: Abrir modal para adicionar bloco
                        console.log('Adicionar bloco no final');
                    }}
                >
                    <div className="text-gray-400">
                        <div className="text-2xl mb-1">+</div>
                        <p className="text-sm">Adicionar bloco</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepCanvas;
