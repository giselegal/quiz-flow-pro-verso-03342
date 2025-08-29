// Sistema de Feedback Visual Avançado
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
  WifiOff,
  Save,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';

// Tipos para o sistema de feedback
export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastMessage {
  id: string;
  type: FeedbackType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface AutoSaveState {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  pendingChanges?: number;
}

export interface ConnectionState {
  isOnline: boolean;
  isConnected: boolean;
  latency?: number;
}

// Hook para gerenciar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { schedule, cancel } = useOptimizedScheduler();

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove se não for persistente
    if (!newToast.persistent && newToast.duration) {
      cancel(`toast-${id}`);
      schedule(`toast-${id}`, () => removeToast(id), newToast.duration, 'timeout');
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    cancel(`toast-${id}`);
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
};

// Hook para estado de loading
export const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const startLoading = useCallback((message?: string) => {
    setLoadingState({ isLoading: true, message });
  }, []);

  const updateProgress = useCallback((progress: number, message?: string) => {
    setLoadingState(prev => ({ ...prev, progress, message }));
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({ isLoading: false });
  }, []);

  return {
    loadingState,
    startLoading,
    updateProgress,
    stopLoading,
  };
};

// Hook para auto-save
export const useAutoSave = (
  saveFunction: () => Promise<void>,
  deps: any[],
  options: { interval?: number; enabled?: boolean } = {}
) => {
  const { interval = 3000, enabled = true } = options;
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    status: 'idle',
  });

  const [pendingChanges, setPendingChanges] = useState(0);
  const { addToast } = useToast();
  const { debounce } = useOptimizedScheduler();

  // Detectar mudanças
  useEffect(() => {
    if (enabled) {
      setPendingChanges(prev => prev + 1);
    }
  }, deps);

  // Auto-save timer
  useEffect(() => {
    if (!enabled || pendingChanges === 0) return;

    const cancelDebounce = debounce('feedback-autosave', async () => {
      setAutoSaveState(prev => ({ ...prev, status: 'saving' }));

      try {
        await saveFunction();
        setAutoSaveState({
          status: 'saved',
          lastSaved: new Date(),
          pendingChanges: 0,
        });
        setPendingChanges(0);

        addToast({
          type: 'success',
          title: 'Salvo automaticamente',
          duration: 2000,
        });
      } catch (error) {
        setAutoSaveState(prev => ({ ...prev, status: 'error' }));
        addToast({
          type: 'error',
          title: 'Erro ao salvar',
          description: 'Suas alterações não foram salvas',
          action: {
            label: 'Tentar novamente',
            onClick: () => saveFunction(),
          },
        });
      }
    }, interval);

    return () => cancelDebounce();
  }, [pendingChanges, enabled, interval, saveFunction, addToast]);

  return {
    autoSaveState,
    pendingChanges: pendingChanges > 0,
  };
};

// Hook para estado de conexão
export const useConnectionState = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isOnline: navigator.onLine,
    isConnected: true,
  });

  useEffect(() => {
    const handleOnline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return connectionState;
};

// Componente de Toast individual
const Toast: React.FC<{
  toast: ToastMessage;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle style={{ color: '#432818' }} />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-[#B89B7A]" />;
      case 'loading':
        return <Loader2 style={{ color: '#8B7355' }} />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-stone-50 border-yellow-200';
      case 'info':
        return 'bg-[#B89B7A]/10 border-[#B89B7A]/30';
      case 'loading':
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`max-w-sm w-full bg-white rounded-lg shadow-lg border ${getBgColor()} p-4`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 w-0 flex-1">
          <p style={{ color: '#432818' }}>{toast.title}</p>
          {toast.description && <p style={{ color: '#8B7355' }}>{toast.description}</p>}
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium text-[#B89B7A] hover:text-[#B89B7A] focus:outline-none"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button style={{ color: '#8B7355' }} onClick={() => onRemove(toast.id)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Container de Toasts
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return createPortal(
    <div className="fixed bottom-0 right-0 z-50 p-6 space-y-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Indicador de Auto-save
export const AutoSaveIndicator: React.FC<{
  autoSaveState: AutoSaveState;
  pendingChanges: boolean;
}> = ({ autoSaveState, pendingChanges }) => {
  const getStatusIcon = () => {
    switch (autoSaveState.status) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-[#B89B7A]" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle style={{ color: '#432818' }} />;
      default:
        return pendingChanges ? (
          <Clock className="h-4 w-4 text-yellow-500" />
        ) : (
          <Save className="h-4 w-4 text-gray-400" />
        );
    }
  };

  const getStatusText = () => {
    switch (autoSaveState.status) {
      case 'saving':
        return 'Salvando...';
      case 'saved':
        return `Salvo ${autoSaveState.lastSaved ? autoSaveState.lastSaved.toLocaleTimeString() : ''}`;
      case 'error':
        return 'Erro ao salvar';
      default:
        return pendingChanges ? 'Alterações pendentes' : 'Tudo salvo';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md border text-sm">
      {getStatusIcon()}
      <span style={{ color: '#6B4F43' }}>{getStatusText()}</span>
    </div>
  );
};

// Indicador de Conexão
export const ConnectionIndicator: React.FC<{
  connectionState: ConnectionState;
}> = ({ connectionState }) => {
  if (connectionState.isOnline && connectionState.isConnected) {
    return null; // Não mostrar quando tudo está ok
  }

  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <WifiOff style={{ color: '#432818' }} />
      <span style={{ color: '#432818' }}>
        {!connectionState.isOnline ? 'Sem conexão' : 'Conectando...'}
      </span>
    </div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader: React.FC<{
  className?: string;
  lines?: number;
}> = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded mb-3 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

// Loading Overlay
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
  progress?: number;
}> = ({ isLoading, message, progress }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#B89B7A]" />
        </div>
        {message && <p style={{ color: '#6B4F43' }}>{message}</p>}
        {progress !== undefined && (
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="bg-[#B89B7A]/100 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Success Animation
export const SuccessAnimation: React.FC<{
  show: boolean;
  onComplete?: () => void;
}> = ({ show, onComplete }) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-green-500 rounded-full p-4"
      >
        <CheckCircle className="h-12 w-12 text-white" />
      </motion.div>
    </motion.div>
  );
};

// Hook principal que combina todos os feedbacks
export const useFeedbackSystem = () => {
  const toast = useToast();
  const loadingState = useLoadingState();
  const connectionState = useConnectionState();

  return {
    ...toast,
    ...loadingState,
    connectionState,
    // Métodos de conveniência
    showSuccess: (title: string, description?: string) =>
      toast.addToast({ type: 'success', title, description }),
    showError: (title: string, description?: string) =>
      toast.addToast({ type: 'error', title, description }),
    showWarning: (title: string, description?: string) =>
      toast.addToast({ type: 'warning', title, description }),
    showInfo: (title: string, description?: string) =>
      toast.addToast({ type: 'info', title, description }),
  };
};

export default useFeedbackSystem;
