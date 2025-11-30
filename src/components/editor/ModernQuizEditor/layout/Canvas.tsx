/**
 * 🎨 Canvas - Coluna 3: Área de Edição (Principal)
 * 
 * Funcionalidades:
 * - Renderizar blocos do step selecionado
 * - Selecionar blocos (onclick)
 * - Drop zone para DnD (Fase 3)
 * - Visual de bloco selecionado
 */

import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';

export function Canvas() {
    const quiz = useQuizStore((state) => state.quiz);
    const { selectedStepId, selectedBlockId, selectBlock } = useEditorStore();

    // Encontrar o step selecionado
    const selectedStep = quiz?.steps?.find((step: any) => step.id === selectedStepId);

    return (
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
            {/* Toolbar do Canvas */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div>
                    {selectedStep ? (
                        <>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {selectedStep.title || 'Sem título'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Etapa {selectedStep.order} • {selectedStep.blocks?.length || 0} blocos
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Selecione uma etapa para começar</p>
                    )}
                </div>

                {/* Ações rápidas (Fase 3) */}
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        👁️ Preview
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                        ↩️ Desfazer
                    </button>
                </div>
            </div>

            {/* Área de renderização de blocos */}
            <div className="flex-1 overflow-y-auto p-6">
                {!selectedStep ? (
                    <EmptyState message="Selecione uma etapa no painel esquerdo" />
                ) : selectedStep.blocks?.length === 0 ? (
                    <EmptyState message="Esta etapa não possui blocos. Arraste um bloco da biblioteca." />
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {selectedStep.blocks?.map((block: any) => (
                            <BlockPreview
                                key={block.id}
                                block={block}
                                isSelected={selectedBlockId === block.id}
                                onClick={() => selectBlock(block.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Estado vazio
function EmptyState({ message }: { message: string }) {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    );
}

// Preview individual de cada bloco
interface BlockPreviewProps {
    block: QuizBlock;
    isSelected: boolean;
    onClick: () => void;
}

function BlockPreview({ block, isSelected, onClick }: BlockPreviewProps) {
    return (
        <div
            onClick={onClick}
            className={`
        p-4 bg-white rounded-lg border-2 cursor-pointer
        transition-all duration-150
        ${isSelected
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
      `}
        >
            {/* Header do bloco */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{block.type}</span>
                    {block.id && (
                        <span className="text-xs text-gray-400">#{block.id}</span>
                    )}
                </div>
                {isSelected && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        Selecionado
                    </span>
                )}
            </div>

            {/* Toolbar de ações quando selecionado */}
            {isSelected && (
                <div className="mb-3 flex items-center gap-2">
                    <BlockActions block={block} />
                </div>
            )}

            {/* Conteúdo do bloco (preview com suporte básico por tipo) */}
            <div className="space-y-2">
                {/* Título */}
                {block.properties?.title && (
                    <h3 className="text-base font-semibold text-gray-900">
                        {block.properties.title}
                    </h3>
                )}

                {/* Subtítulo */}
                {block.properties?.subtitle && (
                    <p className="text-sm text-gray-600">
                        {block.properties.subtitle}
                    </p>
                )}

                {/* Descrição */}
                {block.properties?.description && (
                    <p className="text-sm text-gray-500">
                        {block.properties.description}
                    </p>
                )}

                {/* Opções (para perguntas) */}
                {block.properties?.options && Array.isArray(block.properties.options) && (
                    <div className="mt-3 space-y-1">
                        {block.properties.options.slice(0, 3).map((option: any, idx: number) => (
                            <div key={idx} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                                {option.label || option.text || 'Opção'}
                            </div>
                        ))}
                        {block.properties.options.length > 3 && (
                            <p className="text-xs text-gray-400">
                                +{block.properties.options.length - 3} opções
                            </p>
                        )}
                    </div>
                )}

                {/* Imagem */}
                {block.properties?.src && (
                    <div className="mt-2">
                        <img
                            src={block.properties.src}
                            alt={block.properties.alt || ''}
                            className="max-w-full rounded"
                        />
                    </div>
                )}

                {/* Badge do tipo */}
                <div className="pt-2 mt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                        Ordem: {block.order}
                    </span>
                </div>
            </div>
        </div>
    );
}

function BlockActions({ block }: { block: QuizBlock }) {
    const { selectedStepId } = useEditorStore();
    const deleteBlock = useQuizStore((s) => s.deleteBlock);
    const addBlock = useQuizStore((s) => s.addBlock);
    const reorderBlocks = useQuizStore((s) => s.reorderBlocks);

    if (!selectedStepId) return null;

    const duplicate = () => {
        // Duplicar bloco com novo id
        const newId = `${block.id}-copy-${Date.now()}`;
        addBlock(selectedStepId, block.type as any, (block.order || 0) + 1);
        // Nota: Fase 2 completa deve clonar properties e content
    };

    const remove = () => deleteBlock(selectedStepId, block.id);
    const moveUp = () => reorderBlocks(selectedStepId, (block.order || 1) - 1, (block.order || 1) - 2);
    const moveDown = () => reorderBlocks(selectedStepId, (block.order || 1) - 1, (block.order || 1));

    return (
        <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" onClick={duplicate}>Duplicar</button>
            <button className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" onClick={moveUp}>↑ Mover</button>
            <button className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" onClick={moveDown}>↓ Mover</button>
            <button className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded" onClick={remove}>Excluir</button>
        </div>
    );
}
