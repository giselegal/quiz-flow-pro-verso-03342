/**
 * Exibe erros de validação do quiz
 */

import React from 'react';
import { useQuizStore } from '../store/quizStore';

export default function ValidationPanel() {
    const { error, validateQuiz } = useQuizStore((s) => ({
        error: s.error,
        validateQuiz: s.validateQuiz,
    }));

    const [showDetails, setShowDetails] = React.useState(false);
    const validation = validateQuiz();

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
