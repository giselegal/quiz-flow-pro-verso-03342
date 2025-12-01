/**
 * 📚 Block Library - Coluna 2: Biblioteca de Tipos de Blocos
 * 
 * Funcionalidades:
 * - Exibir tipos de blocos disponíveis
 * - Categorizar blocos (Pergunta, Resultado, UI)
 * - Drag source para DnD (Fase 3)
 */

import { useEditorStore } from '../store/editorStore';

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
};

export function BlockLibrary() {
    const isBlockLibraryOpen = useEditorStore((state) => state.isBlockLibraryOpen);

    if (!isBlockLibraryOpen) {
        return null;
    }

    return (
        <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">Biblioteca de Blocos</h2>
                <p className="text-xs text-gray-500 mt-1">Arraste para adicionar</p>
            </div>

            {/* Categorias de blocos */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Categoria: Perguntas */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Perguntas
                    </h3>
                    <div className="space-y-2">
                        {BLOCK_TYPES.question.map((block: any) => (
                            <BlockCard key={block.type} {...block} />
                        ))}
                    </div>
                </div>

                {/* Categoria: Resultados */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Resultados
                    </h3>
                    <div className="space-y-2">
                        {BLOCK_TYPES.result.map((block: any) => (
                            <BlockCard key={block.type} {...block} />
                        ))}
                    </div>
                </div>

                {/* Categoria: UI */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Interface
                    </h3>
                    <div className="space-y-2">
                        {BLOCK_TYPES.ui.map((block: any) => (
                            <BlockCard key={block.type} {...block} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Card individual de cada tipo de bloco
interface BlockCardProps {
    type: string;
    label: string;
    icon: string;
    description: string;
}

import { useDraggable } from '@dnd-kit/core';

function BlockCard({ type, label, icon, description }: BlockCardProps) {
    // Tornar o card draggable
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `new-block-${type}`,
        data: {
            blockType: type,
            isNew: true,
        },
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            opacity: isDragging ? 0.5 : 1,
            cursor: isDragging ? 'grabbing' : 'grab',
        }
        : { cursor: 'grab' };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
        p-3 bg-white border border-gray-200 rounded-lg
        hover:border-blue-400 hover:bg-blue-50
        transition-all duration-150
        ${isDragging ? 'opacity-50 shadow-lg ring-2 ring-blue-400' : ''}
      `}
            data-block-type={type}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label={label}>
                    {icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
        </div>
    );
}
