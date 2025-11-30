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
import { getFieldsForType } from '../utils/propertyEditors';

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
    const updateBlock = useQuizStore((state) => state.updateBlock);
    const selectedStepId = useEditorStore((state) => state.selectedStepId);

    const handleChange = (key: string, value: any) => {
        if (!selectedStepId) return;
        updateBlock(selectedStepId, block.id, { [key]: value });
    };

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

            {/* Editor de propriedades (com mapa mínimo por tipo) */}
            <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Propriedades
                </h3>
                {(!block.properties || Object.keys(block.properties).length === 0) ? (
                    <p className="text-xs text-gray-500">Sem propriedades configuradas para este bloco.</p>
                ) : (
                    <div className="space-y-3">
                        {/* Priorizar campos mapeados pelo tipo */}
                        {getFieldsForType(block.type).map((field) => (
                            <PropertyEditor
                                key={field.key}
                                label={field.label}
                                value={(block.properties as any)[field.key]}
                                onChange={(v) => handleChange(field.key, v)}
                            />
                        ))}

                        {/* Exibir demais campos não mapeados */}
                        {Object.entries(block.properties)
                          .filter(([key]) => !getFieldsForType(block.type).some(f => f.key === key))
                          .map(([key, value]) => (
                            <PropertyEditor
                              key={key}
                              label={key}
                              value={value}
                              onChange={(v) => handleChange(key, v)}
                            />
                          ))}
                    </div>
                )}
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

// Editor genérico de propriedade (text/number/boolean/json)
interface PropertyEditorProps {
    label: string;
    value: any;
    onChange: (value: any) => void;
}

function PropertyEditor({ label, value, onChange }: PropertyEditorProps) {
    const type = typeof value;

    if (type === 'string') {
        return (
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">{label}</label>
                <input
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        );
    }

    if (type === 'number') {
        return (
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">{label}</label>
                <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
            </div>
        );
    }

    if (type === 'boolean') {
        return (
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="text-gray-700">{label}</span>
            </label>
        );
    }

    // Arrays e objetos: edição via JSON
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{label}</label>
            <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono"
                rows={4}
                value={safeStringify(value)}
                onChange={(e) => {
                    try {
                        const parsed = JSON.parse(e.target.value);
                        onChange(parsed);
                    } catch {
                        // manter texto inválido até conserto
                    }
                }}
            />
            <p className="text-xs text-gray-400">Formato JSON</p>
        </div>
    );
}

function safeStringify(value: any): string {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}
