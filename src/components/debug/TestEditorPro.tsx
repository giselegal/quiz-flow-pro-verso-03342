import React from 'react';

/**
 * Teste simples para verificar se EditorPro carrega sem erros
 */
const TestEditorPro: React.FC = () => {
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<boolean>(false);

    React.useEffect(() => {
        const testEditorImport = async () => {
            try {
                console.log('🧪 Testando import do EditorPro...');
                const editorModule = await import('@/components/editor/EditorProUnified');
                console.log('✅ EditorPro importado com sucesso:', editorModule);
                setSuccess(true);
            } catch (err) {
                console.error('❌ Erro ao importar EditorPro:', err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            }
        };

        testEditorImport();
    }, []);

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🧪 Teste de Import do EditorPro</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>❌ Erro:</strong> {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <strong>✅ Sucesso:</strong> EditorPro importado sem erros
                </div>
            )}

            {!error && !success && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                    <strong>⏳ Carregando...</strong> Testando import do EditorPro...
                </div>
            )}

            <div className="text-sm text-gray-600">
                <p>Este teste verifica se o EditorPro pode ser importado sem erros.</p>
                <p>Se houver erros, o fallback SchemaDrivenEditorResponsive será usado.</p>
            </div>
        </div>
    );
};

export default TestEditorPro;