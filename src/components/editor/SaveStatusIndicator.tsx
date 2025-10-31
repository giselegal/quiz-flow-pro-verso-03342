/**
 * 💾 SAVE STATUS INDICATOR
 * 
 * Fase 2.2 - Visual indicator de auto-save
 * Fase 2.3 - Retry info display
 */

import React from 'react';
import { Loader2, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface RetryInfo {
  attempt: number;
  maxAttempts: number;
}

export interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
  retryInfo?: RetryInfo | null;
  onRetry?: () => void;
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  status,
  className,
  retryInfo,
  onRetry,
}) => {
  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        'fixed top-16 right-4 z-[9998] px-3 py-2 rounded-lg shadow-lg transition-all',
        'flex items-center gap-2 text-sm font-medium',
        {
          'bg-blue-50 text-blue-700 border border-blue-200': status === 'pending',
          'bg-blue-500 text-white': status === 'saving',
          'bg-green-500 text-white': status === 'saved',
          'bg-red-500 text-white': status === 'error',
        },
        className
      )}
    >
      {status === 'pending' && (
        <>
          <Clock className="w-4 h-4" />
          <span>Pendente...</span>
        </>
      )}

      {status === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>
            {retryInfo
              ? `Tentativa ${retryInfo.attempt}/${retryInfo.maxAttempts}...`
              : 'Salvando...'
            }
          </span>
          {retryInfo && retryInfo.attempt > 1 && (
            <AlertTriangle className="w-4 h-4 ml-1" />
          )}
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="w-4 h-4" />
          <span>Salvo</span>
        </>
      )}

      {status === 'error' && (
        <>
          <X className="w-4 h-4" />
          <div className="flex items-center gap-2">
            <span>Erro ao salvar</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="ml-2 px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SaveStatusIndicator;
