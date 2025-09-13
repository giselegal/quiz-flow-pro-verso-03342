import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EditorLoadingWrapperProps {
    children: React.ReactNode;
    templateId?: string;
    funnelId?: string;
    timeout?: number;
}

/**
 * 🛡️ WRAPPER DE LOADING COM TIMEOUT
 * 
 * Previne loading infinito do editor com:
 * - Timeout configurável (padrão 10s)
 * - Fallback para erro após timeout
 * - Botões de recuperação
 * - Logs detalhados
 */
export const EditorLoadingWrapper: React.FC<EditorLoadingWrapperProps> = ({
    children,
    templateId,
    funnelId,
    timeout = 10000
}) => {
    const [isTimeout, setIsTimeout] = React.useState(false);
    const [startTime] = React.useState(Date.now());

    React.useEffect(() => {
        console.log('🔄 [LOADING] Iniciando timeout de', timeout, 'ms');

        const timeoutId = setTimeout(() => {
            console.warn('⏰ [LOADING] Timeout atingido após', timeout, 'ms');
            setIsTimeout(true);
        }, timeout);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [timeout]);

    const handleRetry = () => {
        console.log('🔄 [LOADING] Tentando novamente...');
        window.location.reload();
    };

    const handleGoBack = () => {
        console.log('← [LOADING] Voltando para seleção de templates');
        window.location.href = '/admin/funis';
    };

    const handleResetStorage = () => {
        console.log('🗑️ [LOADING] Limpando storage...');
        try {
            // Limpar dados do editor
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('editor') || key.includes('funnel'))) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log('✅ [LOADING] Storage limpo');

            handleRetry();
        } catch (error) {
            console.error('❌ [LOADING] Erro ao limpar storage:', error);
            handleRetry();
        }
    };

    if (isTimeout) {
        const timeElapsed = Math.round((Date.now() - startTime) / 1000);

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Editor Demorou Para Carregar
                        </h3>
                        <p className="text-gray-600 mb-4">
                            O editor não respondeu em {timeElapsed} segundos.
                            Isso pode indicar um problema temporário.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            🔄 Tentar Novamente
                        </button>

                        <button
                            onClick={handleResetStorage}
                            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                        >
                            🗑️ Limpar Cache e Tentar Novamente
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                            ← Voltar aos Modelos
                        </button>
                    </div>

                    <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                        <p className="font-medium mb-2">Informações de Debug:</p>
                        <div className="font-mono text-xs text-left space-y-1">
                            <p>Template: {templateId || 'não especificado'}</p>
                            <p>Funil: {funnelId || 'não especificado'}</p>
                            <p>Tempo: {timeElapsed}s</p>
                            <p>URL: {window.location.pathname}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
