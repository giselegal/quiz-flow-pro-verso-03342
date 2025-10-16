/**
 * 💾 SAVING INDICATOR - SPRINT 4
 * 
 * Indicador visual de status de salvamento
 * 
 * Estados:
 * - Saving (spinner)
 * - Saved (checkmark)
 * - Error (alert)
 * - Dirty (pending changes)
 * 
 * @version 1.0.0
 * @date 2025-01-16
 */

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SavingStatus = 'idle' | 'saving' | 'saved' | 'error' | 'dirty';

interface SavingIndicatorProps {
  status: SavingStatus;
  lastSaved?: Date | null;
  error?: string;
  className?: string;
}

export const SavingIndicator: React.FC<SavingIndicatorProps> = ({
  status,
  lastSaved,
  error,
  className
}) => {
  const [showSaved, setShowSaved] = useState(false);

  // Auto-hide "Saved" após 3 segundos
  useEffect(() => {
    if (status === 'saved') {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getTimeAgo = (date: Date | null): string => {
    if (!date) return '';
    
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'agora há pouco';
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `há ${Math.floor(seconds / 3600)} h`;
    return `há ${Math.floor(seconds / 86400)} dias`;
  };

  const renderContent = () => {
    switch (status) {
      case 'saving':
        return (
          <Badge variant="secondary" className={cn('gap-1', className)}>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">Salvando...</span>
          </Badge>
        );

      case 'saved':
        if (!showSaved) return null;
        
        return (
          <Badge variant="default" className={cn('gap-1 bg-green-600', className)}>
            <Check className="h-3 w-3" />
            <span className="text-xs">Salvo</span>
            {lastSaved && (
              <span className="text-xs opacity-80">• {getTimeAgo(lastSaved)}</span>
            )}
          </Badge>
        );

      case 'error':
        return (
          <Badge variant="destructive" className={cn('gap-1', className)}>
            <AlertCircle className="h-3 w-3" />
            <span className="text-xs">Erro ao salvar</span>
          </Badge>
        );

      case 'dirty':
        return (
          <Badge variant="outline" className={cn('gap-1', className)}>
            <Clock className="h-3 w-3" />
            <span className="text-xs">Não salvo</span>
          </Badge>
        );

      default:
        return null;
    }
  };

  return <div className="flex items-center">{renderContent()}</div>;
};

export default SavingIndicator;
