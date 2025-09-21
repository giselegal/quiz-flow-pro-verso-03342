/**
 * 🔍 SYSTEM STATUS - INDICADOR DE SAÚDE DO SISTEMA
 * 
 * Componente para mostrar status dos sistemas em tempo real
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { aiCache } from '@/services/AICache';

interface SystemHealth {
  performance: 'good' | 'warning' | 'critical';
  cache: 'good' | 'warning' | 'critical';
  analytics: 'good' | 'warning' | 'critical';
  overall: 'good' | 'warning' | 'critical';
}

const SystemStatus: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    performance: 'good',
    cache: 'good', 
    analytics: 'good',
    overall: 'good'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostra status apenas se houver problemas ou em desenvolvimento
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      window.location.search.includes('debug=true');
    
    if (shouldShow) {
      setIsVisible(true);
      checkSystemHealth();
      const interval = setInterval(checkSystemHealth, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  const checkSystemHealth = () => {
    const cacheStats = aiCache.getStats();
    
    // Verifica cache
    const cacheHealth = cacheStats.hitRate >= 70 ? 'good' :
                       cacheStats.hitRate >= 50 ? 'warning' : 'critical';

    // Performance e analytics sempre good para esta versão
    const performanceHealth = 'good';
    const analyticsHealth = 'good';

    // Status geral
    const healths = [performanceHealth, cacheHealth, analyticsHealth];
    const overallHealth = healths.includes('critical') ? 'critical' :
                         healths.includes('warning') ? 'warning' : 'good';

    setHealth({
      performance: performanceHealth,
      cache: cacheHealth,
      analytics: analyticsHealth,
      overall: overallHealth
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Saudável';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return 'Desconhecido';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Status do Sistema</span>
            <Badge variant={health.overall === 'good' ? 'default' : 'destructive'}>
              {getStatusText(health.overall)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Performance</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(health.performance)}`}></div>
                <span>{getStatusText(health.performance)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Cache IA</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(health.cache)}`}></div>
                <span>{getStatusText(health.cache)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Analytics</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(health.analytics)}`}></div>
                <span>{getStatusText(health.analytics)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              🚀 Editor Consolidado v3.0
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatus;