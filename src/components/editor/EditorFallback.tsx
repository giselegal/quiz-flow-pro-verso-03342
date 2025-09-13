import React from 'react';
import { EditorLoadingWrapper } from './EditorLoadingWrapper';

/**
 * 🛡️ EDITOR COM FALLBACK ROBUSTO
 * 
 * Wrapper que previne loading infinito:
 * - Timeout de 10 segundos
 * - Fallback para editor básico
 * - Recuperação automática de erros
 * - Logs detalhados
 */
const EditorFallback: React.FC<{
    templateId?: string;
    funnelId?: string;
}> = ({ templateId, funnelId }) => {
    const [editorComponent, setEditorComponent] = React.useState<React.ComponentType | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [attempts, setAttempts] = React.useState(0);

    const loadEditor = React.useCallback(async (attempt = 0) => {
        console.log(`🔄 [FALLBACK] Tentativa ${attempt + 1} de carregar editor`);

        try {
            setIsLoading(true);
            setError(null);

            // Lista de editores para tentar em ordem de prioridade
            const editorPaths = [
                '../editor/UnifiedEditor',
                '../editor/EditorPro',
                '../editor/MainEditor'
            ];

            for (const editorPath of editorPaths) {
                try {
                    console.log(`🔄 [FALLBACK] Tentando carregar: ${editorPath}`);
                    const mod = await import(editorPath);
                    const Component = mod.default || mod.UnifiedEditor || mod.EditorPro || mod.MainEditor;

                    if (Component) {
                        console.log(`✅ [FALLBACK] Editor carregado: ${editorPath}`);
                        setEditorComponent(() => Component);
                        setIsLoading(false);
                        return;
                    }
                } catch (editorError) {
                    console.warn(`⚠️ [FALLBACK] Falha ao carregar ${editorPath}:`, editorError);
                    continue;
                }
            }

            // Se chegou aqui, nenhum editor foi carregado
            throw new Error('Nenhum editor disponível');

        } catch (error) {
            console.error(`❌ [FALLBACK] Erro na tentativa ${attempt + 1}:`, error);

            if (attempt < 2) {
                // Tentar novamente até 3 vezes
                setTimeout(() => {
                    setAttempts(attempt + 1);
                    loadEditor(attempt + 1);
                }, 2000);
            } else {
                setError(`Falha ao carregar editor após ${attempt + 1} tentativas`);
                setIsLoading(false);
            }
        }
    }, []);

    React.useEffect(() => {
        loadEditor(attempts);
    }, [loadEditor, attempts]);

    const handleRetry = () => {
        console.log('🔄 [FALLBACK] Reiniciando carregamento...');
        setAttempts(0);
        setError(null);
        loadEditor(0);
    };

    const handleGoBack = () => {
        window.location.href = '/admin/funis';
    };

    // Loading state
    if (isLoading) {
        return (
            <EditorLoadingWrapper templateId={templateId} funnelId={funnelId} timeout={10000}>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg font-medium">
                            Carregando editor...
                        </p>
                        {attempts > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Tentativa {attempts + 1} de 3
                            </p>
                        )}
                    </div>
                </div>
            </EditorLoadingWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M9 21h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Não Foi Possível Carregar o Editor
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            🔄 Tentar Novamente
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                            ← Voltar aos Modelos
                        </button>
                    </div>

                    <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                        <p className="font-medium mb-2">Debug:</p>
                        <div className="font-mono text-xs text-left space-y-1">
                            <p>Template: {templateId || 'none'}</p>
                            <p>Funnel: {funnelId || 'none'}</p>
                            <p>Tentativas: {attempts + 1}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success - render editor
    if (editorComponent) {
        const EditorComponent = editorComponent;
        console.log('🎯 [FALLBACK] Renderizando editor com sucesso');

        return (
            <div>
                <EditorComponent />
            </div>
        );
    }

    // Fallback final
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <p className="text-gray-600">Estado inesperado do editor</p>
                <button
                    onClick={handleRetry}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    );
};

export default EditorFallback;
