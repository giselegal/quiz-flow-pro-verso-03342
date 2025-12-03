/**
 * 🌐 NETWORK ERROR FALLBACK
 * 
 * Componente para exibir erro de rede com opção de retry
 * Usado quando imports dinâmicos falham por problemas de conexão
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export interface NetworkErrorFallbackProps {
    error?: Error;
    resetErrorBoundary?: () => void;
    onRetry?: () => void;
}

export function NetworkErrorFallback({
    error,
    resetErrorBoundary,
    onRetry
}: NetworkErrorFallbackProps) {
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);
    const [retrying, setRetrying] = React.useState(false);

    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRetry = async () => {
        setRetrying(true);

        try {
            if (onRetry) {
                await onRetry();
            } else if (resetErrorBoundary) {
                resetErrorBoundary();
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error('Retry failed:', err);
        } finally {
            setRetrying(false);
        }
    };

    const isNetworkError = error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('ERR_NETWORK') ||
        error?.message?.includes('dynamically imported module') ||
        error?.message?.includes('ERR_NETWORK_CHANGED');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                {/* Icon */}
                <div className="flex justify-center">
                    {isOnline ? (
                        <div className="relative">
                            <AlertCircle className="h-20 w-20 text-yellow-500 animate-pulse" />
                            <Wifi className="h-10 w-10 text-yellow-500 absolute bottom-0 right-0" />
                        </div>
                    ) : (
                        <WifiOff className="h-20 w-20 text-red-500 animate-pulse" />
                    )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        {isOnline ? 'Erro de Carregamento' : 'Sem Conexão'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isOnline
                            ? 'Não foi possível carregar alguns recursos da aplicação.'
                            : 'Você está offline. Conecte-se à internet para continuar.'}
                    </p>
                </div>

                {/* Error details (in dev mode) */}
                {import.meta.env.DEV && error && (
                    <div className="bg-muted/50 rounded-lg p-4 text-left">
                        <p className="text-xs font-mono text-muted-foreground break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Network status */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${isOnline
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}>
                    {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    <span>{isOnline ? 'Conexão ativa' : 'Sem conexão'}</span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        onClick={handleRetry}
                        disabled={retrying || !isOnline}
                        className="w-full"
                        size="lg"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
                        {retrying ? 'Tentando novamente...' : 'Tentar novamente'}
                    </Button>

                    <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                        className="w-full"
                    >
                        Voltar para página inicial
                    </Button>
                </div>

                {/* Help text */}
                <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        💡 <strong>Dica:</strong> Se o problema persistir, tente:
                    </p>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1 text-left">
                        <li>• Verificar sua conexão de internet</li>
                        <li>• Limpar o cache do navegador</li>
                        <li>• Desabilitar extensões do navegador</li>
                        <li>• Tentar em modo anônimo/privado</li>
                    </ul>
                </div>

                {/* Auto-retry indicator */}
                {isOnline && isNetworkError && (
                    <div className="text-xs text-muted-foreground animate-pulse">
                        ⏳ Tentando reconectar automaticamente...
                    </div>
                )}
            </div>
        </div>
    );
}

export default NetworkErrorFallback;
