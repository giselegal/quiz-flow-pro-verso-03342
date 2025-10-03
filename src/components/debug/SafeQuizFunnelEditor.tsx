import React, { Suspense, useEffect, useState } from 'react';

const QuizFunnelEditorOriginal = React.lazy(() => import('../../editor/quiz/QuizFunnelEditor'));

interface Props {
    funnelId?: string;
    templateId?: string;
}

const SafeQuizFunnelEditor: React.FC<Props> = (props) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset error when props change
        setError(null);
    }, [props.funnelId, props.templateId]);

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-lg font-semibold text-red-800 mb-2">❌ Erro no QuizFunnelEditor</h2>
                <pre className="text-sm text-red-700 bg-red-100 p-3 rounded overflow-auto">
                    {error}
                </pre>
                <button
                    onClick={() => setError(null)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="p-8 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-800">Carregando QuizFunnelEditor...</span>
                </div>
            </div>
        }>
            <div onError={(e: any) => {
                console.error('QuizFunnelEditor error:', e);
                setError(e.toString());
            }}>
                <QuizFunnelEditorOriginal {...props} />
            </div>
        </Suspense>
    );
};

export default SafeQuizFunnelEditor;