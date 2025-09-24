/**
 * Dashboard de Monitoramento de Segurança
 * Fase 5: Security & Production Hardening
 */

import React, { useState } from 'react';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  TrendingUp,
  Clock
} from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const {
    systemStatus,
    healthStatus,
    performanceMetrics,
    isLoading,
    error,
    checkHealth,
    getSystemStatus,
    getMetrics,
    isSystemHealthy,
    hasCriticalIssues,
    hasWarnings
  } = useSecurityMonitor();

  const [metricsData, setMetricsData] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const handleRefresh = async () => {
    try {
      await Promise.all([
        checkHealth(),
        getSystemStatus()
      ]);
    } catch (err) {
      console.error('Erro ao atualizar:', err);
    }
  };

  const loadMetrics = async (serviceName?: string) => {
    try {
      setLoadingMetrics(true);
      const data = await getMetrics(serviceName, 24);
      setMetricsData(data);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      healthy: 'default',
      warning: 'secondary', 
      critical: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro no monitoramento: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Dashboard de Segurança</h1>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isLoading}
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            {systemStatus && getStatusIcon(systemStatus.overall_status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus ? getStatusBadge(systemStatus.overall_status) : 'Carregando...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Última verificação: {systemStatus ? new Date(systemStatus.timestamp).toLocaleTimeString() : '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Críticos</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus?.summary.critical_events || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics.pageLoadTime ? `${Math.round(performanceMetrics.pageLoadTime)}ms` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Tempo de carregamento
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="health">Health Check</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Alertas críticos */}
          {hasCriticalIssues && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema em estado crítico!</strong>
                {(systemStatus?.summary?.critical_metrics || 0) > 0 && 
                  ` ${systemStatus?.summary?.critical_metrics || 0} métricas críticas detectadas.`
                }
                {(systemStatus?.summary?.critical_events || 0) > 0 && 
                  ` ${systemStatus?.summary?.critical_events || 0} eventos críticos nas últimas 24h.`
                }
              </AlertDescription>
            </Alert>
          )}

          {hasWarnings && !hasCriticalIssues && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Sistema com avisos de performance ou segurança. Monitore de perto.
              </AlertDescription>
            </Alert>
          )}

          {isSystemHealthy && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sistema operando normalmente. Todos os indicadores estão saudáveis.
              </AlertDescription>
            </Alert>
          )}

          {/* Resumo de métricas */}
          {systemStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo das Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total de Métricas:</span>
                    <span className="ml-2">{systemStatus.summary.metrics_count}</span>
                  </div>
                  <div>
                    <span className="font-medium">Métricas Críticas:</span>
                    <span className="ml-2 text-destructive">{systemStatus.summary.critical_metrics}</span>
                  </div>
                  <div>
                    <span className="font-medium">Avisos:</span>
                    <span className="ml-2 text-warning">{systemStatus.summary.warning_metrics}</span>
                  </div>
                  <div>
                    <span className="font-medium">Eventos de Segurança:</span>
                    <span className="ml-2">{systemStatus.summary.security_events}</span>
                  </div>
                  <div>
                    <span className="font-medium">Eventos Críticos:</span>
                    <span className="ml-2 text-destructive">{systemStatus.summary.critical_events}</span>
                  </div>
                  <div>
                    <span className="font-medium">Alta Severidade:</span>
                    <span className="ml-2 text-warning">{systemStatus.summary.high_severity_events}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {healthStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(healthStatus.services.database.status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Latência:</span>
                      <span>{healthStatus.services.database.latency}ms</span>
                    </div>
                    {healthStatus.services.database.error && (
                      <div className="text-sm text-destructive">
                        Erro: {healthStatus.services.database.error}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Edge Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(healthStatus.services.edge_functions.status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Latência:</span>
                      <span>{healthStatus.services.edge_functions.latency}ms</span>
                    </div>
                    {healthStatus.services.edge_functions.error && (
                      <div className="text-sm text-destructive">
                        Erro: {healthStatus.services.edge_functions.error}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => loadMetrics()} disabled={loadingMetrics}>
              Todas as Métricas
            </Button>
            <Button onClick={() => loadMetrics('frontend')} disabled={loadingMetrics} variant="outline">
              Frontend
            </Button>
            <Button onClick={() => loadMetrics('database')} disabled={loadingMetrics} variant="outline">
              Database
            </Button>
            <Button onClick={() => loadMetrics('edge-functions')} disabled={loadingMetrics} variant="outline">
              Edge Functions
            </Button>
          </div>

          {loadingMetrics && (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          )}

          {metricsData && (
            <Card>
              <CardHeader>
                <CardTitle>Métricas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(metricsData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {systemStatus?.recent_critical_events?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Eventos Críticos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemStatus.recent_critical_events.map((event: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{event.event_type}</span>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="destructive">{event.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhum evento crítico</h3>
                <p className="text-muted-foreground">O sistema está operando sem eventos críticos recentes.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};