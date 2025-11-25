/**
 * 🎯 Live Preview Page
 * 
 * Página de preview somente leitura para visualização de funis publicados.
 * 
 * Características:
 * - ✅ Modo somente leitura (read-only)
 * - ✅ Responsivo (375px, 768px, 1024px, 1280px)
 * - ✅ Feedback visual para 404 e status offline
 * - ✅ Live update via postMessage
 * 
 * Rota: /preview/:id
 * 
 * @see Fase 5 - Rotas, páginas e fluxo publish/preview
 * @see Fase 6 - UX/Design e feedback de estado
 */

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import QuizApp from '@/components/quiz/QuizApp';
import { useFunnelLivePreview } from '@/hooks/useFunnelLivePreview';
import { useSafeEventListener } from '@/hooks/useSafeEventListener';
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator';
import { ResponsiveLayout } from '@/components/ui/responsive-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Eye, WifiOff, RefreshCw, Home } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

export default function LivePreviewPage() {
    const [match, params] = useRoute('/preview/:funnelId');
    
    // Estado local para loading e erros
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(true);
    
    // Extrair funnelId
    const funnelId = useMemo(() => {
        if (match) return params?.funnelId as string | undefined;
        // Fallback: tentar query string ?funnel=...
        try {
            const sp = new URLSearchParams(window.location.search);
            return sp.get('funnel') || sp.get('id') || undefined;
        } catch {
            return undefined;
        }
    }, [match, params]);

    // Hook de live preview
    const { liveSteps } = useFunnelLivePreview(funnelId);
    const [localSteps, setLocalSteps] = React.useState<any | null>(null);
    
    // Handler para mensagens do editor
    const handler = useCallback((ev: MessageEvent) => {
        const data: any = ev.data;
        if (data && data.type === 'steps' && data.steps) {
            setLocalSteps(data.steps);
            setIsLoading(false);
            setError(null);
            appLogger.debug('[LivePreviewPage] Received steps via postMessage');
        }
    }, []);
    useSafeEventListener('message', handler);

    // Detectar status de conexão
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Simular fim de loading após timeout
    useEffect(() => {
        if (!funnelId) {
            setIsLoading(false);
            setError('Nenhum funil especificado');
            return;
        }

        const timer = setTimeout(() => {
            if (isLoading && !liveSteps && !localSteps) {
                setIsLoading(false);
                // Não setamos erro aqui pois o funnel pode ainda não ter sido publicado
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [funnelId, isLoading, liveSteps, localSteps]);

    // Atualizar loading quando steps chegam
    useEffect(() => {
        if (liveSteps || localSteps) {
            setIsLoading(false);
            setError(null);
        }
    }, [liveSteps, localSteps]);

    const steps = liveSteps || localSteps || undefined;
    const isConnected = !!steps;

    // Retry handler
    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        window.location.reload();
    };

    // Renderizar página 404 se não encontrar funil
    if (!funnelId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <ResponsiveLayout variant="narrow" center>
                    <Card className="w-full max-w-md shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <CardTitle className="text-xl">Funil Não Encontrado</CardTitle>
                            <CardDescription>
                                Nenhum ID de funil foi especificado na URL.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Verifique se o link está correto ou volte para a página inicial.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button variant="outline" className="flex-1" asChild>
                                    <Link href="/">
                                        <Home className="w-4 h-4 mr-2" />
                                        Página Inicial
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="flex-1" onClick={() => window.history.back()}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </ResponsiveLayout>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Status de Conexão */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white text-center py-2 text-sm flex items-center justify-center gap-2">
                    <WifiOff className="w-4 h-4" />
                    <span>Você está offline. O preview pode não estar atualizado.</span>
                </div>
            )}

            {/* Badge de Status (read-only) */}
            <div className={`fixed ${!isOnline ? 'top-12' : 'top-3'} right-3 z-50 flex items-center gap-2`}>
                {/* Indicador Read-Only */}
                <div className="text-xs px-2 py-1 rounded shadow-sm border bg-gray-100 text-gray-600 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Somente Leitura</span>
                </div>
                
                {/* Status de Conexão Live */}
                <div className="text-xs px-2 py-1 rounded shadow-sm border bg-white">
                    {isLoading ? (
                        <span className="text-blue-500 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span className="hidden sm:inline">Carregando...</span>
                        </span>
                    ) : isConnected ? (
                        <span className="text-green-600">● Live</span>
                    ) : (
                        <span className="text-gray-400">● Aguardando</span>
                    )}
                </div>
                
                {/* ID do Funil (apenas em telas maiores) */}
                {funnelId && (
                    <div className="hidden md:block text-xs px-2 py-1 rounded shadow-sm border bg-white text-gray-500">
                        {funnelId.length > 20 ? `${funnelId.slice(0, 20)}...` : funnelId}
                    </div>
                )}
            </div>

            {/* Conteúdo do Quiz */}
            <div className={`${!isOnline ? 'pt-10' : ''}`}>
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center space-y-4">
                            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                            <p className="text-gray-600">Carregando preview...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader className="text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <CardTitle>Erro ao Carregar</CardTitle>
                                <CardDescription>{error}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleRetry} className="w-full">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Tentar Novamente
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <QuizApp 
                        funnelId={funnelId} 
                        externalSteps={steps}
                        // Modo somente leitura implícito - não há handlers de edição
                    />
                )}
            </div>
        </div>
    );
}
