/**
 * 🚨 ERROR PAGE
 * 
 * Página de erro genérica para exibir erros da aplicação.
 * Suporta diferentes tipos de erros (404, 500, network, etc).
 * 
 * Rota: /error
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AlertCircle, RefreshCw, Home, ArrowLeft, WifiOff, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { appLogger } from '@/lib/utils/appLogger';

interface ErrorPageProps {
  // Props podem ser passados via location state ou query params
}

type ErrorType = 'not-found' | 'server' | 'network' | 'generic';

interface ErrorInfo {
  type: ErrorType;
  title: string;
  description: string;
  code?: string;
  icon: React.ReactNode;
  suggestion: string;
}

const ERROR_CONFIGS: Record<ErrorType, ErrorInfo> = {
  'not-found': {
    type: 'not-found',
    title: 'Página Não Encontrada',
    description: 'A página que você está procurando não existe ou foi movida.',
    code: '404',
    icon: <AlertCircle className="w-12 h-12 text-yellow-500" />,
    suggestion: 'Verifique o endereço digitado ou volte para a página inicial.',
  },
  'server': {
    type: 'server',
    title: 'Erro no Servidor',
    description: 'Ocorreu um erro ao processar sua solicitação.',
    code: '500',
    icon: <ServerCrash className="w-12 h-12 text-red-500" />,
    suggestion: 'Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.',
  },
  'network': {
    type: 'network',
    title: 'Erro de Conexão',
    description: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    icon: <WifiOff className="w-12 h-12 text-orange-500" />,
    suggestion: 'Verifique sua conexão com a internet e tente novamente.',
  },
  'generic': {
    type: 'generic',
    title: 'Algo Deu Errado',
    description: 'Ocorreu um erro inesperado.',
    icon: <AlertCircle className="w-12 h-12 text-red-500" />,
    suggestion: 'Tente recarregar a página ou voltar para a página inicial.',
  },
};

export function ErrorPage(_props: ErrorPageProps) {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>(ERROR_CONFIGS['generic']);
  const [isOnline, setIsOnline] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Extrair tipo de erro de query params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const errorType = (params.get('type') || 'generic') as ErrorType;
      const message = params.get('message');

      if (ERROR_CONFIGS[errorType]) {
        setErrorInfo(ERROR_CONFIGS[errorType]);
      }

      if (message) {
        setErrorMessage(decodeURIComponent(message));
      }

      appLogger.info('[ErrorPage] Mounted with error type:', { type: errorType, message });
    } catch (error) {
      appLogger.error('[ErrorPage] Error parsing params:', error);
    }
  }, []);

  // Atualizar para erro de rede se offline
  useEffect(() => {
    if (!isOnline) {
      setErrorInfo(ERROR_CONFIGS['network']);
    }
  }, [isOnline]);

  const handleRetry = () => {
    try {
      const referrer = document.referrer;
      if (referrer && referrer !== window.location.href) {
        window.location.href = referrer;
      } else {
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center pb-2">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            {errorInfo.icon}
          </div>
          
          {/* Error Code */}
          {errorInfo.code && (
            <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-2">
              {errorInfo.code}
            </div>
          )}
          
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {errorInfo.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Custom Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          )}

          {/* Suggestion */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Sugestão:</strong> {errorInfo.suggestion}
            </p>
          </div>

          {/* Online Status Indicator */}
          {!isOnline && (
            <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <WifiOff className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700 dark:text-orange-300">
                Você está offline
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              onClick={handleRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button
              variant="outline"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Página Inicial
              </Link>
            </Button>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorPage;
