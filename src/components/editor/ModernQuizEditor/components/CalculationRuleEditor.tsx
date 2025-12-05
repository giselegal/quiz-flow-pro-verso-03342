/**
 * Editor de regras de cálculo para blocos
 * Permite configurar peso, pontos por opção, e escala numérica
 */

import React, { useState } from 'react';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';

interface CalculationRuleEditorProps {
    block: QuizBlock;
    onChange: (rule: any) => void;
}

export default function CalculationRuleEditor({ block, onChange }: CalculationRuleEditorProps) {
    const [expanded, setExpanded] = useState(false);
    const rule = block.calculationRule || { weight: 1 };
    const hasOptions = Array.isArray(block.properties?.options);

    if (!hasOptions && typeof block.properties?.value !== 'number') {
        // Bloco não é quantificável
        return null;
    }

    return (
        <div className="border-t border-gray-200 pt-3 mt-3">
            <button
                className="w-full flex items-center justify-between text-xs font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setExpanded(!expanded)}
            >
                <span>⚙️ Regras de Cálculo</span>
                <span>{expanded ? '▼' : '▶'}</span>
            </button>

            {expanded && (
                <div className="mt-3 space-y-3">
                    {/* Peso do bloco */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Peso</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                            value={rule.weight ?? 1}
                            onChange={(e) => onChange({ ...rule, weight: Number(e.target.value) })}
                        />
                        <p className="text-xs text-gray-500">Multiplicador do score deste bloco (padrão: 1)</p>
                    </div>

                    {/* Pontos por opção (se tiver options) */}
                    {hasOptions && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">Pontos por Opção</label>
                            {((block.properties ?? block.content ?? {}).options as any[] ?? []).map((opt: any, idx: number) => {
                                const val = opt.value ?? `opt_${idx + 1}`;
                                const pts = rule.pointsMap?.[val] ?? 0;
                                return (
                                    <div key={val} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600 flex-1 truncate">{opt.label ?? val}</span>
                                        <input
                                            type="number"
                                            step="1"
                                            className="w-16 px-2 py-1 border border-gray-200 rounded text-sm"
                                            value={pts}
                                            onChange={(e) => {
                                                const nextMap = { ...(rule.pointsMap || {}), [val]: Number(e.target.value) };
                                                onChange({ ...rule, pointsMap: nextMap });
                                            }}
                                        />
                                        <span className="text-xs text-gray-500">pts</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Escala numérica (se for número) */}
                    {typeof block.properties?.value === 'number' && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">Escala Numérica</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Multiplicador:</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                    value={rule.numericScale?.mul ?? 1}
                                    onChange={(e) => {
                                        const next = { ...(rule.numericScale || { mul: 1 }), mul: Number(e.target.value) };
                                        onChange({ ...rule, numericScale: next });
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Min:</span>
                                <input
                                    type="number"
                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                    value={rule.numericScale?.min ?? ''}
                                    placeholder="sem limite"
                                    onChange={(e) => {
                                        const next = { ...(rule.numericScale || { mul: 1 }), min: e.target.value ? Number(e.target.value) : undefined };
                                        onChange({ ...rule, numericScale: next });
                                    }}
                                />
                                <span className="text-xs text-gray-600">Max:</span>
                                <input
                                    type="number"
                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                                    value={rule.numericScale?.max ?? ''}
                                    placeholder="sem limite"
                                    onChange={(e) => {
                                        const next = { ...(rule.numericScale || { mul: 1 }), max: e.target.value ? Number(e.target.value) : undefined };
                                        onChange({ ...rule, numericScale: next });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
