/**
 * 📊 MONITORING DASHBOARD - Phase 3 Implementation
 * Dashboard em tempo real para saúde do sistema
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Activity, TrendingUp, Clock, Users } from 'lucide-react';
import { healthCheckService, type HealthStatus } from '@/services/monitoring/HealthCheckService';
import { analyticsServiceAdapter as analyticsService } from '@/analytics/compat/analyticsServiceAdapter';
import { errorTrackingService, type ErrorStats } from '@/services/monitoring/ErrorTrackingService';

interface MonitoringDashboardProps {
  className?: string;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ className }) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  useEffect(() => {
    // Carregar dados iniciais
    loadHealthStatus();
    loadErrorStats();

    // Configurar auto-refresh
    if (isAutoRefresh) {
      healthCheckService.startMonitoring(15000); // 15 segundos

      const errorInterval = setInterval(loadErrorStats, 10000); // 10 segundos

      return () => {
        healthCheckService.stopMonitoring();
        clearInterval(errorInterval);
      };
    }
  }, [isAutoRefresh]);

  useEffect(() => {
    // Escutar mudanças de saúde
    healthCheckService.onHealthChange(setHealthStatus);
  }, []);

  const loadHealthStatus = async () => {
    try {
      const status = await healthCheckService.performHealthCheck();
      setHealthStatus(status);
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  };

  const loadErrorStats = () => {
    const stats = errorTrackingService.getErrorStats();
    setErrorStats(stats);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy':
      case 'up':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return <CheckCircle className="h-4 w-4" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy':
      case 'down':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (!healthStatus && !errorStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Carregando dados de monitoramento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`} data-testid="monitoring-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Monitoramento</h2>
          <p className="text-muted-foreground">
            Status em tempo real da aplicação
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            {isAutoRefresh ? 'Pausar' : 'Iniciar'} Auto-Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadHealthStatus}
          >
            Atualizar
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {healthStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
              <div className={getStatusColor(healthStatus.status)}>
                {getStatusIcon(healthStatus.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {healthStatus.status}
              </div>
              <p className="text-xs text-muted-foreground">
                Última verificação: {new Date(healthStatus.timestamp).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {healthStatus.metrics.responseTime}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Tempo médio de verificação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memória</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {healthStatus.metrics.memoryUsage}MB
              </div>
              <p className="text-xs text-muted-foreground">
                Uso atual de memória
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(healthStatus.metrics.uptime / 60)}m
              </div>
              <p className="text-xs text-muted-foreground">
                Tempo de atividade
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="errors">Erros</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {healthStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(healthStatus.services).map(([service, status]) => (
                <Card key={service}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{service}</CardTitle>
                      <Badge variant={status.status === 'up' ? 'default' : 'destructive'}>
                        {status.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {status.responseTime && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tempo de Resposta:</span>
                          <span className="text-sm font-medium">{status.responseTime}ms</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Última Verificação:</span>
                        <span className="text-sm font-medium">
                          {new Date(status.lastCheck).toLocaleTimeString()}
                        </span>
                      </div>
                      {status.error && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                          {status.error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          {errorStats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total de Erros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{errorStats.total}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Por Nível</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(errorStats.byLevel).map(([level, count]) => (
                        <div key={level} className="flex justify-between">
                          <span className="capitalize">{level}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Por Componente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(errorStats.byComponent)
                        .slice(0, 5)
                        .map(([component, count]) => (
                          <div key={component} className="flex justify-between">
                            <span className="truncate">{component}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Erros Recentes</CardTitle>
                  <CardDescription>Últimos 10 erros registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {errorStats.recentErrors.slice(0, 10).map((error) => (
                      <div key={error.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="font-medium">{error.message}</div>
                          <div className="text-sm text-muted-foreground">
                            {error.context.component} • {new Date(error.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={error.level === 'error' ? 'destructive' : 'secondary'}>
                          {error.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas da Sessão</CardTitle>
              <CardDescription>Dados analíticos da sessão atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Session ID:</span>
                    <code className="text-sm">{analyticsService.getSessionMetrics().sessionId}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Blocos Adicionados:</span>
                    <span>{analyticsService.getSessionMetrics().blocksAdded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Templates Usados:</span>
                    <span>{analyticsService.getSessionMetrics().templatesUsed.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tempo na Sessão:</span>
                    <span>{Math.floor(analyticsService.getSessionMetrics().timeSpent / 1000)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Erros Encontrados:</span>
                    <span>{analyticsService.getSessionMetrics().errorsEncountered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Conclusão:</span>
                    <span>{analyticsService.getSessionMetrics().completionRate}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;