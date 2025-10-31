/**
 * 💾 SAVE STATUS INDICATOR
 * 
 * Fase 2.2 - Visual indicator de auto-save
 */

import React from 'react';
import { Loader2, Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  status,
  className,
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
          <span>Salvando...</span>
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
          <span>Erro ao salvar</span>
        </>
      )}
    </div>
  );
};

export default SaveStatusIndicator;
