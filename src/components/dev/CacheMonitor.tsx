/**
 * 🎯 CACHE MONITOR - Dev Tool para Monitorar Cache
 * 
 * Componente de desenvolvimento para visualizar métricas do UnifiedCacheService
 * em tempo real. Apenas visível em modo de desenvolvimento.
 * 
 * @version 1.0.0
 * @date 2025-01-17
 */

import React, { useState } from 'react';
import { useCacheMetrics } from '@/hooks/useUnifiedCache';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, Database, Zap, HardDrive } from 'lucide-react';

interface CacheMonitorProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export const CacheMonitor: React.FC<CacheMonitorProps> = ({ position = 'bottom-right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { stats, performance } = useCacheMetrics(true, 2000); // Auto-refresh a cada 2s

  // Não mostrar em produção
  if (import.meta.env.PROD) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4',
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'bg-green-500';
    if (efficiency >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed ${positionClasses[position]} z-[9999] 
          bg-primary text-primary-foreground p-3 rounded-full shadow-lg
          hover:scale-110 transition-transform`}
        title="Open Cache Monitor"
      >
        <Database className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Card className={`fixed ${positionClasses[position]} z-[9999] w-80 shadow-2xl`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Cache Monitor
            <Badge variant="outline" className="text-xs">DEV</Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 text-xs">
        {/* Efficiency */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Hit Rate
            </span>
            <span className="font-mono font-semibold">
              {performance.efficiency.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getEfficiencyColor(performance.efficiency)}`}
              style={{ width: `${performance.efficiency}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Entries */}
          <div className="bg-muted/50 p-2 rounded">
            <div className="text-muted-foreground flex items-center gap-1 mb-1">
              <Zap className="h-3 w-3" />
              Entries
            </div>
            <div className="font-mono font-semibold text-sm">
              {performance.totalEntries}
            </div>
          </div>

          {/* Size */}
          <div className="bg-muted/50 p-2 rounded">
            <div className="text-muted-foreground flex items-center gap-1 mb-1">
              <HardDrive className="h-3 w-3" />
              Size
            </div>
            <div className="font-mono font-semibold text-sm">
              {formatSize(performance.totalSize)}
            </div>
          </div>

          {/* Hits */}
          <div className="bg-muted/50 p-2 rounded">
            <div className="text-muted-foreground mb-1">Hits</div>
            <div className="font-mono font-semibold text-sm text-green-600">
              {stats.hitCount}
            </div>
          </div>

          {/* Misses */}
          <div className="bg-muted/50 p-2 rounded">
            <div className="text-muted-foreground mb-1">Misses</div>
            <div className="font-mono font-semibold text-sm text-red-600">
              {stats.missCount}
            </div>
          </div>
        </div>

        {/* By Type */}
        <div className="space-y-1">
          <div className="text-muted-foreground font-semibold">By Type:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Object.entries(stats.byType)
              .filter(([, data]) => data.count > 0)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([type, data]) => (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{data.count}</span>
                    <span className="text-muted-foreground">
                      {formatSize(data.size)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Evictions */}
        {stats.evictionCount > 0 && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            Evictions: <span className="font-mono">{stats.evictionCount}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CacheMonitor;
