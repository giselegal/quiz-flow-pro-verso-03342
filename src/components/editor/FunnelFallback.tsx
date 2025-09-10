/**
 * 🚨 COMPONENTE DE FALLBACK PARA FUNIS INVÁLIDOS
 * 
 * Exibido quando:
 * - Funil não existe
 * - Usuário não tem permissão
 * - Erro de carregamento
 * 
 * Funcionalidades:
 * - Mensagens de erro claras
 * - Sugestões de funis alternativos
 * - Ações de recuperação
 * - Opção de criar novo funil
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home, Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface FunnelFallbackProps {
    errorType: string;
    errorMessage: string;
    funnelId?: string;
    suggestions?: string[];
    onRetry?: () => void;
    onCreateNew?: () => void;
}

export const FunnelFallback: React.FC<FunnelFallbackProps> = ({
    errorType,
    errorMessage,
    funnelId,
    suggestions = [],
    onRetry,
    onCreateNew
}) => {
    const [, setLocation] = useLocation();

    const getErrorIcon = () => {
        switch (errorType) {
            case 'NOT_FOUND':
                return '🔍';
            case 'NO_PERMISSION':
                return '🔒';
            case 'NETWORK_ERROR':
                return '🌐';
            default:
                return '⚠️';
        }
    };

    const getErrorTitle = () => {
        switch (errorType) {
            case 'NOT_FOUND':
                return 'Funil não encontrado';
            case 'NO_PERMISSION':
                return 'Acesso negado';
            case 'NETWORK_ERROR':
                return 'Erro de conexão';
            case 'INVALID_FORMAT':
                return 'ID inválido';
            default:
                return 'Erro desconhecido';
        }
    };

    const getErrorDescription = () => {
        switch (errorType) {
            case 'NOT_FOUND':
                return 'O funil solicitado não existe ou foi removido. Verifique se o link está correto.';
            case 'NO_PERMISSION':
                return 'Você não tem permissão para acessar este funil. Entre em contato com o proprietário.';
            case 'NETWORK_ERROR':
                return 'Não foi possível carregar o funil devido a um problema de conexão. Tente novamente.';
            case 'INVALID_FORMAT':
                return 'O ID do funil fornecido não é válido. Verifique se o link está correto.';
            default:
                return 'Ocorreu um erro inesperado ao carregar o funil.';
        }
    };

    const handleSuggestionClick = (suggestionId: string) => {
        setLocation(`/editor?funnel=${suggestionId}`);
    };

    const handleGoHome = () => {
        setLocation('/admin');
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handleCreateNew = () => {
        if (onCreateNew) {
            onCreateNew();
        } else {
            setLocation('/editor?template=default');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-6">
                {/* Cabeçalho de erro */}
                <div className="text-center">
                    <div className="text-6xl mb-4">{getErrorIcon()}</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {getErrorTitle()}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {getErrorDescription()}
                    </p>
                </div>

                {/* Card principal */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Detalhes do erro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                <strong>Mensagem:</strong> {errorMessage}
                                {funnelId && (
                                    <>
                                        <br />
                                        <strong>Funil solicitado:</strong> {funnelId}
                                    </>
                                )}
                            </AlertDescription>
                        </Alert>

                        {/* Ações principais */}
                        <div className="flex flex-wrap gap-3">
                            {onRetry && errorType === 'NETWORK_ERROR' && (
                                <Button onClick={onRetry} variant="default" className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Tentar novamente
                                </Button>
                            )}

                            <Button onClick={handleCreateNew} variant="default" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Criar novo funil
                            </Button>

                            <Button onClick={handleGoHome} variant="outline" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Ir para dashboard
                            </Button>

                            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Voltar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sugestões de funis alternativos */}
                {suggestions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Funis disponíveis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Experimente um destes funis disponíveis:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {suggestions.map((suggestion) => (
                                    <Button
                                        key={suggestion}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        variant="outline"
                                        className="justify-start h-auto p-4"
                                    >
                                        <div className="text-left">
                                            <div className="font-medium">{suggestion}</div>
                                            <div className="text-sm text-gray-500 capitalize">
                                                {suggestion.replace('-', ' ')}
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informações de ajuda */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                        <h3 className="font-semibold text-blue-900 mb-2">💡 Precisa de ajuda?</h3>
                        <p className="text-blue-800 text-sm">
                            Se você acredita que deveria ter acesso a este funil, entre em contato com o suporte
                            ou verifique se o link foi compartilhado corretamente.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FunnelFallback;
