import React, { useEffect, useState, memo } from 'react';
import { optimizedStorage, StorageOptimizer } from '@/utils/storageOptimization';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { devLog } from '@/utils/editorUtils';

interface LocalStorageManagerProps {
  // Configurações opcionais
  enableAutoCleanup?: boolean;
  cleanupInterval?: number; // ms
  maxQuotaThreshold?: number; // 0-1
  showStats?: boolean;
}

interface StorageStats {
  quota: {
    quota: number;
    usage: number;
    available: number;
    usagePercentage: number;
  };
  itemCount: number;
  compressedItems: number;
  totalSavings: number;
}

/**
 * LocalStorageManager - Gerenciador inteligente de LocalStorage
 * 
 * Funcionalidades:
 * - Compressão automática de dados grandes
 * - Limpeza automática de itens antigos
 * - Monitoramento de quota
 * - Fallback para IndexedDB quando necessário
 */
const LocalStorageManager: React.FC<LocalStorageManagerProps> = memo(({
  enableAutoCleanup = true,
  cleanupInterval = 30 * 60 * 1000, // 30 minutos
  maxQuotaThreshold = 0.8, // 80%
  showStats = process.env.NODE_ENV === 'development'
}) => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { schedule, debounce } = useOptimizedScheduler();

  // Atualizar estatísticas do storage
  const updateStats = debounce('storage-stats', async () => {
    try {
      const storageStats = await optimizedStorage.getStats();
      setStats(storageStats);
      
      if (process.env.NODE_ENV === 'development') {
        devLog('LocalStorage Stats:', {
          usage: `${Math.round(storageStats.quota.usagePercentage)}%`,
          items: storageStats.itemCount,
          compressed: storageStats.compressedItems,
          saved: `${Math.round(storageStats.totalSavings / 1024)}KB`
        });
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error);
    }
  }, 5000);

  // Executar limpeza automática
  const performCleanup = debounce('storage-cleanup', async () => {
    if (isCleaningUp) return;
    
    setIsCleaningUp(true);
    try {
      const cleaned = await optimizedStorage.cleanup();
      
      if (cleaned > 0) {
        devLog(`LocalStorage cleanup: removed ${cleaned} old items`);
        // Atualizar stats após limpeza
        setTimeout(updateStats, 1000);
      }
    } catch (error) {
      console.error('Storage cleanup failed:', error);
    } finally {
      setIsCleaningUp(false);
    }
  }, 1000);

  // Monitorar quota e executar limpeza se necessário
  useEffect(() => {
    if (!enableAutoCleanup || !stats) return;

    if (stats.quota.usagePercentage > maxQuotaThreshold * 100) {
      devLog('Storage quota threshold exceeded, triggering cleanup');
      performCleanup();
    }
  }, [stats, enableAutoCleanup, maxQuotaThreshold, performCleanup]);

  // Setup de limpeza automática periódica
  useEffect(() => {
    if (!enableAutoCleanup) return;

    const cleanup = schedule('periodic-cleanup', () => {
      performCleanup();
    }, cleanupInterval, 'timeout');

    return cleanup;
  }, [enableAutoCleanup, cleanupInterval, schedule, performCleanup]);

  // Atualizar stats periodicamente
  useEffect(() => {
    // Atualização inicial
    updateStats();

    // Atualização periódica
    const interval = schedule('stats-update', updateStats, 60000, 'timeout'); // 1 minuto
    
    return interval;
  }, [schedule, updateStats]);

  // Hook para expor métodos globalmente
  useEffect(() => {
    // Expor StorageOptimizer globalmente para debug
    if (process.env.NODE_ENV === 'development') {
      (window as any).__storageOptimizer = StorageOptimizer.getInstance();
      (window as any).__optimizedStorage = optimizedStorage;
    }

    // Listener para limpeza manual
    const handleCleanupRequest = () => {
      performCleanup();
    };

    window.addEventListener('storage-cleanup-request', handleCleanupRequest);
    
    return () => {
      window.removeEventListener('storage-cleanup-request', handleCleanupRequest);
    };
  }, [performCleanup]);

  // Stats display para desenvolvimento
  if (showStats && stats) {
    return (
      <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-xs font-mono shadow-lg z-50">
        <div className="font-semibold text-gray-800 mb-2">Storage Stats</div>
        <div className="space-y-1 text-gray-600">
          <div>Usage: {Math.round(stats.quota.usagePercentage)}%</div>
          <div>Items: {stats.itemCount}</div>
          <div>Compressed: {stats.compressedItems}</div>
          <div>Saved: {Math.round(stats.totalSavings / 1024)}KB</div>
          {isCleaningUp && (
            <div className="text-blue-600 animate-pulse">Cleaning...</div>
          )}
        </div>
      </div>
    );
  }

  return null; // Componente invisível em produção
});

LocalStorageManager.displayName = 'LocalStorageManager';

export default LocalStorageManager;

// Hook para usar o storage otimizado em componentes
export const useOptimizedLocalStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setItem = async (key: string, value: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await optimizedStorage.setItem(key, value);
      if (!success) {
        throw new Error('Failed to save to storage');
      }
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Storage error';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getItem = (key: string) => {
    setError(null);
    
    try {
      return optimizedStorage.getItem(key);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Retrieval error';
      setError(errorMsg);
      return null;
    }
  };

  const removeItem = (key: string) => {
    setError(null);
    
    try {
      optimizedStorage.removeItem(key);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Removal error';
      setError(errorMsg);
      return false;
    }
  };

  const cleanup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const cleaned = await optimizedStorage.cleanup();
      return cleaned;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Cleanup error';
      setError(errorMsg);
      return 0;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    cleanup,
    isLoading,
    error,
  };
};