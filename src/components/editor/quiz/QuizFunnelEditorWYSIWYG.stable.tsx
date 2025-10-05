/**
 * 🎯 EDITOR WYSIWYG ESTÁVEL - VERSÃO EXPERIMENTAL
 * 
 * Esta é uma versão experimental que está sendo desenvolvida.
 * Use o editor principal em /editor
 */

import React, { memo } from 'react';

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

const QuizFunnelEditorWYSIWYGStable: React.FC<QuizFunnelEditorProps> = memo(({
    funnelId,
    templateId
}) => {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                🧪 Editor Experimental
            </h2>
            <p className="text-gray-600 mb-4">
                Esta versão está em desenvolvimento ativo.
            </p>
            <p className="text-sm text-gray-500 mb-6">
                Por favor, use o editor principal que já possui todos os recursos modulares integrados.
            </p>
            <a
                href="/editor"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                🎯 Ir para Editor Principal
            </a>
        </div>
    );
});

QuizFunnelEditorWYSIWYGStable.displayName = 'QuizFunnelEditorWYSIWYGStable';

export default QuizFunnelEditorWYSIWYGStable;