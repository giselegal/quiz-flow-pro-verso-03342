/**
 * ⚙️ Properties Panel - Coluna 4: Painel de Propriedades
 * 
 * Funcionalidades:
 * - Exibir propriedades do bloco selecionado
 * - Formulário de edição (Fase 2)
 * - Validação em tempo real (Fase 2)
 */

import React, { useState } from 'react';
import { z } from 'zod';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import { getFieldsForType } from '../utils/propertyEditors';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOverlay } from '@dnd-kit/core';

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
                                kind={field.kind}
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
    kind?: 'text' | 'number' | 'boolean' | 'json' | 'image' | 'options';
    onChange: (value: any) => void;
}

function PropertyEditor({ label, value, kind, onChange }: PropertyEditorProps) {
    const type = typeof value;
    const schema = (() => {
        switch (kind) {
            case 'text':
                return z.string().min(1, 'Texto obrigatório');
            case 'number':
                // números com limites padrão (opcional): >=0 e <= 1e6
                return z.number({ invalid_type_error: 'Número inválido' })
                    .min(0, 'Valor mínimo é 0')
                    .max(1_000_000, 'Valor máximo é 1.000.000');
            case 'image':
                return z.string().url('URL inválida');
            case 'boolean':
                // aceitar coerção de string e número para boolean
                return z.union([z.boolean(), z.string(), z.number()]).transform((v) => {
                    if (typeof v === 'boolean') return v;
                    if (typeof v === 'number') return v !== 0;
                    const s = String(v).toLowerCase().trim();
                    return s === 'true' || s === '1' || s === 'yes' || s === 'sim';
                });
            case 'options':
                return z.array(z.object({
                    label: z.string().min(1, 'Label obrigatório'),
                    value: z.string().min(1, 'Value obrigatório'),
                })).refine((opts) => {
                    const set = new Set(opts.map(o => o.value.trim()));
                    return set.size === opts.length;
                }, { message: 'Values devem ser únicos' });
            default:
                return null;
        }
    })();
    const fieldError = (() => {
        if (!schema) return null;
        try {
            let v: any = value;
            if (kind === 'number' && typeof value === 'string') v = Number(value);
            if (kind === 'boolean') v = value; // transformação cuidada pelo schema
            schema.parse(v);
            return null;
        } catch (e: any) {
            const issue = e?.issues?.[0];
            return issue?.message || 'Valor inválido';
        }
    })();

    // Editor específico para options com validações e mover ↑/↓
    if (kind === 'options' && Array.isArray(value)) {
        const options = value as Array<any>;
        const errors: string[] = [];
        const seen = new Set<string>();
        options.forEach((opt, i) => {
            const label = (opt.label ?? opt.text ?? '').trim();
            const val = (opt.value ?? `opt_${i + 1}`).toString().trim();
            if (!label) errors.push(`Opção ${i + 1}: label é obrigatório.`);
            if (!val) errors.push(`Opção ${i + 1}: value é obrigatório.`);
            if (seen.has(val)) errors.push(`Value duplicado: "${val}".`);
            seen.add(val);
        });

        const setOption = (idx: number, nextOpt: any) => {
            const next = [...options];
            next[idx] = nextOpt;
            onChange(next);
        };
        const removeOption = (idx: number) => {
            const next = options.filter((_, i) => i !== idx);
            onChange(next);
        };
        const addOption = () => {
            const next = [...options, { label: 'Nova opção', value: `opt_${options.length + 1}` }];
            onChange(next);
        };
        const moveOption = (from: number, to: number) => {
            if (to < 0 || to >= options.length) return;
            const next = [...options];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            onChange(next);
        };

        const sensors = useSensors(useSensor(PointerSensor));
        const [activeId, setActiveId] = useState<number | null>(null);

        return (
            <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">{label}</label>
                {errors.length > 0 && (
                    <div className="text-xs text-red-600 space-y-1">
                        {errors.map((e, i) => (
                            <div key={i}>• {e}</div>
                        ))}
                    </div>
                )}
                {fieldError && (
                    <div className="text-xs text-red-600">• {fieldError}</div>
                )}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={(event) => {
                        const { active } = event;
                        setActiveId(Number(active.id));
                    }}
                    onDragEnd={(event) => {
                        const { active, over } = event;
                        if (!over || active.id === over.id) return;
                        const from = Number(active.id);
                        const to = Number(over.id);
                        moveOption(from, to);
                        setActiveId(null);
                    }}
                    onDragCancel={() => setActiveId(null)}
                >
                    <SortableContext items={options.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {options.map((opt: any, idx: number) => (
                                <SortableRow key={idx} id={idx}>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                            value={(opt.label ?? opt.text ?? '')}
                                            placeholder="Label"
                                            onChange={(e) => setOption(idx, { ...opt, label: e.target.value })}
                                        />
                                        <input
                                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                            value={(opt.value ?? `opt_${idx + 1}`)}
                                            placeholder="Value"
                                            onChange={(e) => setOption(idx, { ...opt, value: e.target.value })}
                                        />
                                        <button
                                            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                                            onClick={() => removeOption(idx)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </SortableRow>
                            ))}
                        </div>
                    </SortableContext>
                    <DragOverlay>
                        {activeId !== null ? (
                            <div className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-200 rounded shadow-lg">
                                <span className="text-xs text-gray-500">Reordenando:</span>
                                <span className="text-xs font-medium">{(options[activeId]?.label ?? options[activeId]?.text ?? 'Opção')}</span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
                <div>
                    <button
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                        onClick={addOption}
                    >
                        Adicionar opção
                    </button>
                </div>
            </div>
        );
    }

    if (type === 'string') {
        return (
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">{label}</label>
                <input
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    value={value}
                    onChange={(e) => {
                        const v = e.target.value;
                        // Validação leve para campos de imagem (URL)
                        if (kind === 'image' && v) {
                            try { new URL(v); } catch { return; }
                        }
                        onChange(v);
                    }}
                />
                {fieldError && <p className="text-xs text-red-600">{fieldError}</p>}
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
                {fieldError && <p className="text-xs text-red-600">{fieldError}</p>}
            </div>
        );
    }

    if (type === 'boolean') {
        return (
            <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    <span className="text-gray-700">{label}</span>
                </label>
                {fieldError && <p className="text-xs text-red-600">{fieldError}</p>}
            </div>
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
                        // Validação leve para options: garantir array
                        if (kind === 'options' && !Array.isArray(parsed)) {
                            return;
                        }
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

// Wrapper para itens sortáveis
function SortableRow({ id, children }: { id: number; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : undefined,
        opacity: isDragging ? 0.95 : 1,
    } as React.CSSProperties;
    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2">
            <button
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded cursor-grab"
                {...attributes}
                {...listeners}
                title="Arrastar para reordenar"
            >⋮⋮</button>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
