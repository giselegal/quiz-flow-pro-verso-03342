/**
 * 🔄 DRAFT SYNC INDICATOR - Fase 4 Gargalos
 * 
 * Indicador visual do status de sincronização de drafts
 * Mostra drafts pendentes e permite sincronização manual
 * 
 * @version 1.0.0
 */

import React from 'react';
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDraftSync } from '@/hooks/useDraftSync';
import { cn } from '@/lib/utils';

interface DraftSyncIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

export const DraftSyncIndicator: React.FC<DraftSyncIndicatorProps> = ({
  className,
  showLabel = false,
}) => {
  const { state, isAuthenticated, hasPendingDrafts, syncNow } = useDraftSync();
  const { isSyncing, pendingCount, syncError } = state;

  // Determinar estado e ícone
  const getStatusInfo = () => {
    if (isSyncing) {
      return {
        icon: RefreshCw,
        label: 'Sincronizando...',
        color: 'text-blue-500',
        animate: true,
      };
    }
    
    if (syncError) {
      return {
        icon: AlertCircle,
        label: 'Erro na sincronização',
        color: 'text-destructive',
        animate: false,
      };
    }
    
    if (!isAuthenticated && hasPendingDrafts) {
      return {
        icon: CloudOff,
        label: `${pendingCount} draft(s) não sincronizado(s)`,
        color: 'text-yellow-500',
        animate: false,
      };
    }
    
    if (hasPendingDrafts) {
      return {
        icon: Cloud,
        label: `${pendingCount} pendente(s)`,
        color: 'text-yellow-500',
        animate: false,
      };
    }
    
    return {
      icon: Check,
      label: 'Sincronizado',
      color: 'text-green-500',
      animate: false,
    };
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  const handleClick = () => {
    if (!isSyncing && hasPendingDrafts && isAuthenticated) {
      syncNow();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2 h-8 px-2',
              hasPendingDrafts && isAuthenticated && 'cursor-pointer',
              className
            )}
            onClick={handleClick}
            disabled={isSyncing || !hasPendingDrafts || !isAuthenticated}
          >
            <Icon 
              className={cn(
                'h-4 w-4',
                status.color,
                status.animate && 'animate-spin'
              )} 
            />
            {showLabel && (
              <span className={cn('text-xs', status.color)}>
                {status.label}
              </span>
            )}
            {hasPendingDrafts && !showLabel && (
              <span className="text-xs font-medium bg-yellow-500/20 text-yellow-600 px-1.5 py-0.5 rounded">
                {pendingCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-sm">
            <p className="font-medium">{status.label}</p>
            {!isAuthenticated && hasPendingDrafts && (
              <p className="text-xs text-muted-foreground mt-1">
                Faça login para sincronizar
              </p>
            )}
            {isAuthenticated && hasPendingDrafts && !isSyncing && (
              <p className="text-xs text-muted-foreground mt-1">
                Clique para sincronizar agora
              </p>
            )}
            {syncError && (
              <p className="text-xs text-destructive mt-1">
                {syncError}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DraftSyncIndicator;
