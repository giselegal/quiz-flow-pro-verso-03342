/**
 * ⚙️ Properties Panel - Coluna 4: Painel de Propriedades
 * 
 * Funcionalidades:
 * - Exibir propriedades do bloco selecionado
 * - Formulário de edição (Fase 2)
 * - Validação em tempo real (Fase 2)
 */

import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';

export function PropertiesPanel() {
    const quiz = useQuizStore((state) => state.quiz);
    const { selectedStepId, selectedBlockId, isPropertiesPanelOpen } = useEditorStore();

    if (!isPropertiesPanelOpen) {
        return null;
    }

    // Encontrar o step e o bloco selecionados
    const selectedStep = quiz?.steps?.find((step: any) => step.id === selectedStepId);
    const selectedBlock = selectedStep?.blocks?.find((block: any) => block.id === selectedBlockId);

    return (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">Propriedades</h2>
                {selectedBlock && (
                    <p className="text-xs text-gray-500 mt-1">
                        {selectedBlock.type} • #{selectedBlock.id}
                    </p>
                )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto">
                {!selectedBlock ? (
                    <EmptyState />
                ) : (
                    <BlockProperties block={selectedBlock} />
                )}
            </div>
        </div>
    );
}

// Estado vazio quando nenhum bloco está selecionado
function EmptyState() {
    return (
        <div className="h-full flex items-center justify-center p-6 text-center">
            <div>
                <div className="text-4xl mb-3">⚙️</div>
                <p className="text-sm text-gray-600">
                    Selecione um bloco no canvas para ver suas propriedades
                </p>
            </div>
        </div>
    );
}

// Exibir propriedades do bloco (versão simplificada - Fase 1)
// Na Fase 2, será substituído por formulários completos
interface BlockPropertiesProps {
    block: QuizBlock;
}

function BlockProperties({ block }: BlockPropertiesProps) {
    return (
        <div className="p-4 space-y-4">
            {/* Informações básicas */}
            <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Informações
                </h3>
                <div className="space-y-2 text-sm">
                    <PropertyRow label="ID" value={block.id} />
                    <PropertyRow label="Tipo" value={block.type} />
                    <PropertyRow label="Ordem" value={block.order?.toString() || '-'} />
                </div>
            </div>

            {/* Propriedades do bloco */}
            {block.properties && Object.keys(block.properties).length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Propriedades
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(block.properties).map(([key, value]) => (
                            <PropertyRow
                                key={key}
                                label={key}
                                value={formatPropertyValue(value)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Variáveis (se existirem) */}
            {/* Placeholder para formulário de edição (Fase 2) */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                    📝 Formulário de edição será implementado na Fase 2
                </p>
            </div>
        </div>
    );
}

// Row de propriedade (label + valor)
interface PropertyRowProps {
    label: string;
    value: string;
}

function PropertyRow({ label, value }: PropertyRowProps) {
    return (
        <div className="flex items-start justify-between gap-2 py-1">
            <span className="text-xs font-medium text-gray-600 capitalize">
                {label}:
            </span>
            <span className="text-xs text-gray-900 text-right flex-1 break-words">
                {value || '-'}
            </span>
        </div>
    );
}

// Formatar valores complexos para exibição
function formatPropertyValue(value: any): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '✓ Sim' : '✗ Não';
    if (typeof value === 'object') {
        if (Array.isArray(value)) return `Array (${value.length})`;
        return `Object (${Object.keys(value).length} keys)`;
    }
    return String(value);
}
