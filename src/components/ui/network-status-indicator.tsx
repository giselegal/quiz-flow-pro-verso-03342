/**
 * 🎯 Network Status Indicator
 * 
 * Componente visual para feedback de status de rede e operações.
 * Exibe banners para estados offline, salvando, publicando, erro, etc.
 * 
 * @see Fase 6 - UX/Design e feedback de estado
 */

import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { WifiOff, Loader2, CheckCircle2, AlertCircle, CloudOff, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appLogger } from '@/lib/utils/appLogger';

export type NetworkStatus = 'online' | 'offline' | 'connecting';
export type OperationStatus = 'idle' | 'saving' | 'publishing' | 'loading' | 'success' | 'error';

interface NetworkStatusIndicatorProps {
  /** Status da operação atual */
  operationStatus?: OperationStatus;
  /** Mensagem personalizada */
  message?: string;
  /** Callback para tentar novamente */
  onRetry?: () => void;
  /** Se deve exibir indicador de rede */
  showNetworkStatus?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Se deve exibir como banner fixo */
  fixed?: boolean;
}

export function NetworkStatusIndicator({
  operationStatus = 'idle',
  message,
  onRetry,
  showNetworkStatus = true,
  className,
  fixed = false,
}: NetworkStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  // Detectar status de conexão
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      appLogger.info('[NetworkStatus] Back online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      appLogger.warn('[NetworkStatus] Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setShowOfflineBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Configuração de status
  const statusConfig = {
    idle: null,
    saving: {
      icon: <Save className="w-4 h-4 animate-pulse" />,
      text: message || 'Salvando...',
      bgClass: 'bg-blue-500',
      textClass: 'text-white',
    },
    publishing: {
      icon: <Upload className="w-4 h-4 animate-bounce" />,
      text: message || 'Publicando...',
      bgClass: 'bg-purple-500',
      textClass: 'text-white',
    },
    loading: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: message || 'Carregando...',
      bgClass: 'bg-gray-500',
      textClass: 'text-white',
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      text: message || 'Operação concluída!',
      bgClass: 'bg-green-500',
      textClass: 'text-white',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      text: message || 'Erro na operação',
      bgClass: 'bg-red-500',
      textClass: 'text-white',
    },
  };

  const currentStatus = statusConfig[operationStatus];

  // Não renderizar se não houver nada para mostrar
  if (!showOfflineBanner && !currentStatus) {
    return null;
  }

  const containerClass = cn(
    'flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300',
    fixed && 'fixed top-0 left-0 right-0 z-50',
    className
  );

  return (
    <div className="space-y-0">
      {/* Banner de Offline */}
      {showNetworkStatus && showOfflineBanner && (
        <div className={cn(containerClass, 'bg-orange-500 text-white')}>
          <WifiOff className="w-4 h-4" />
          <span>Você está offline. Algumas funcionalidades podem não estar disponíveis.</span>
        </div>
      )}

      {/* Banner de Status de Operação */}
      {currentStatus && (
        <div className={cn(containerClass, currentStatus.bgClass, currentStatus.textClass)}>
          {currentStatus.icon}
          <span>{currentStatus.text}</span>
          {operationStatus === 'error' && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="ml-2 h-6 px-2 text-white hover:bg-white/20"
            >
              Tentar novamente
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Hook para gerenciar estado de operações de rede
 */
export function useNetworkOperations() {
  const [status, setStatus] = useState<OperationStatus>('idle');
  const [message, setMessage] = useState<string | undefined>();

  const startSaving = useCallback((msg?: string) => {
    setStatus('saving');
    setMessage(msg);
  }, []);

  const startPublishing = useCallback((msg?: string) => {
    setStatus('publishing');
    setMessage(msg);
  }, []);

  const startLoading = useCallback((msg?: string) => {
    setStatus('loading');
    setMessage(msg);
  }, []);

  const setSuccess = useCallback((msg?: string, autoClearMs = 3000) => {
    setStatus('success');
    setMessage(msg);
    if (autoClearMs > 0) {
      setTimeout(() => {
        setStatus('idle');
        setMessage(undefined);
      }, autoClearMs);
    }
  }, []);

  const setError = useCallback((msg?: string) => {
    setStatus('error');
    setMessage(msg);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage(undefined);
  }, []);

  return {
    status,
    message,
    startSaving,
    startPublishing,
    startLoading,
    setSuccess,
    setError,
    reset,
  };
}

export default NetworkStatusIndicator;
