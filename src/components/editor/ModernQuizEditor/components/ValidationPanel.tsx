/**
 * Exibe erros de validação do quiz
 */

import React from 'react';
import { useQuizStore } from '../store/quizStore';

export default function ValidationPanel() {
    // ✅ CRITICAL: Select only primitive values and use shallow equality
    const error = useQuizStore((s) => s.error);
    const quiz = useQuizStore((s) => s.quiz);

    const [showDetails, setShowDetails] = React.useState(false);

    // ✅ CRITICAL: Cache validation result and prevent infinite loop
    // Validação inline evita chamar métodos do store que retornam novos objetos
    const validation = React.useMemo(() => {
        if (!quiz) return { valid: false, errors: ['Nenhum quiz carregado'] };

        const errors: string[] = [];

        // Validar metadados básicos
        if (!quiz.metadata?.name || quiz.metadata.name.trim().length < 3) {
            errors.push('Nome do quiz deve ter pelo menos 3 caracteres');
        }

        // Validar steps
        if (!quiz.steps || quiz.steps.length === 0) {
            errors.push('Quiz deve ter pelo menos 1 step');
        }

        (quiz.steps || []).forEach((step: any, idx: number) => {
            if (!step.id) errors.push(`Step ${idx + 1}: ID obrigatório`);
            if (!step.blocks || step.blocks.length === 0) {
                errors.push(`Step ${step.id || idx + 1}: deve ter pelo menos 1 bloco`);
            }

            (step.blocks || []).forEach((blk: any, bidx: number) => {
                if (!blk.id) errors.push(`Step ${step.id}, bloco ${bidx + 1}: ID obrigatório`);
                if (!blk.type) errors.push(`Step ${step.id}, bloco ${blk.id || bidx + 1}: tipo obrigatório`);
            });
        });

        return { valid: errors.length === 0, errors };
    }, [quiz]);

    if (validation.valid && !error) return null;

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    <div>
                        <p className="text-sm font-medium text-yellow-800">
                            {validation.valid ? 'Aviso do sistema' : 'Erros de validação encontrados'}
                        </p>
                        {error && <p className="text-xs text-yellow-700 mt-1">{error.split('\n')[0]}</p>}
                    </div>
                </div>
                {!validation.valid && (
                    <button
                        className="text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? 'Ocultar' : 'Ver detalhes'}
                    </button>
                )}
            </div>

            {showDetails && !validation.valid && (
                <ul className="mt-3 space-y-1 text-xs text-yellow-700 list-disc list-inside">
                    {validation.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
