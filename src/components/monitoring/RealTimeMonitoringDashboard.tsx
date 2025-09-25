/**
 * 📊 REAL-TIME MONITORING DASHBOARD - FASE 1: INTEGRAÇÃO
 * Dashboard conectado aos dados reais do backend
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { Activity, AlertTriangle, CheckCircle, XCircle, Database, Zap } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  description?: string;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, status, description }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getStatusIcon(status)}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const RealTimeMonitoringDashboard: React.FC = () => {
  const {
    systemStatus,
    isLoading,
    error,
    getSystemStatus,
    checkHealth,
    getMetrics
  } = useSecurityMonitor();

  useEffect(() => {
    const refreshData = async () => {
      try {
        await Promise.all([
          getSystemStatus(),
          checkHealth(),
          getMetrics()
        ]);
      } catch (err) {
        console.error('Failed to refresh monitoring data:', err);
      }
    };

    refreshData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [getSystemStatus, checkHealth, getMetrics]);

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Erro no Monitoramento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoramento em Tempo Real</h2>
          <p className="text-muted-foreground">
            Status do sistema atualizado a cada 30 segundos
          </p>
        </div>
        <Badge 
          variant={systemStatus?.overall_status === 'healthy' ? 'default' : 
                  systemStatus?.overall_status === 'warning' ? 'destructive' : 'secondary'}
          className="text-sm"
        >
          {systemStatus?.overall_status?.toUpperCase() || 'CARREGANDO'}
        </Badge>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Status Geral"
          value={systemStatus?.overall_status?.toUpperCase() || 'N/A'}
          status={systemStatus?.overall_status || 'healthy'}
          description="Status geral do sistema"
        />
        <MetricCard
          title="Database Latency"
          value={systemStatus?.services?.database?.latency ? `${systemStatus.services.database.latency}ms` : 'N/A'}
          status={systemStatus?.services?.database?.status === 'healthy' ? 'healthy' : 'warning'}
          description="Latência do banco de dados"
        />
        <MetricCard
          title="Edge Functions"
          value={systemStatus?.services?.edge_functions?.status?.toUpperCase() || 'N/A'}
          status={systemStatus?.services?.edge_functions?.status === 'healthy' ? 'healthy' : 'warning'}
          description="Status das Edge Functions"
        />
        <MetricCard
          title="Eventos de Segurança"
          value={systemStatus?.summary?.security_events || 0}
          status={systemStatus?.summary?.critical_events ? 'critical' : 'healthy'}
          description="Últimas 24 horas"
        />
      </div>

      {/* Detailed Services Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Health
            </CardTitle>
            <CardDescription>
              Status e métricas do banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={systemStatus?.services?.database?.status === 'healthy' ? 'default' : 'destructive'}>
                {systemStatus?.services?.database?.status || 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Latência:</span>
              <span className="text-sm font-medium">
                {systemStatus?.services?.database?.latency}ms
              </span>
            </div>
            {systemStatus?.services?.database?.latency && (
              <Progress 
                value={Math.min(100, (systemStatus.services.database.latency / 200) * 100)} 
                className="w-full"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Edge Functions
            </CardTitle>
            <CardDescription>
              Status das funções serverless
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={systemStatus?.services?.edge_functions?.status === 'healthy' ? 'default' : 'destructive'}>
                {systemStatus?.services?.edge_functions?.status || 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Latência:</span>
              <span className="text-sm font-medium">
                {systemStatus?.services?.edge_functions?.latency}ms
              </span>
            </div>
            {systemStatus?.services?.edge_functions?.latency && (
              <Progress 
                value={Math.min(100, (systemStatus.services.edge_functions.latency / 500) * 100)} 
                className="w-full"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metrics Summary */}
      {systemStatus?.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Métricas</CardTitle>
            <CardDescription>
              Última atualização: {new Date(systemStatus.timestamp).toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Métricas Coletadas</p>
                <p className="text-2xl font-bold">{systemStatus.summary.metrics_count}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Métricas Críticas</p>
                <p className="text-2xl font-bold text-red-600">{systemStatus.summary.critical_metrics}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Avisos</p>
                <p className="text-2xl font-bold text-yellow-600">{systemStatus.summary.warning_metrics}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};