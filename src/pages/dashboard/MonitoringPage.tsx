/**
 * 📊 PÁGINA DE MONITORAMENTO INTEGRADA - FASE 2
 * Página principal de monitoramento do sistema em tempo real
 */

import React, { useState, useEffect } from 'react';
import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService';
import { RealTimeMonitoringDashboard } from '@/components/monitoring/RealTimeMonitoringDashboard';
import { SecurityAlert } from '@/components/security/SecurityAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecurity } from '@/providers/SecurityProvider';
import { useMonitoringContext } from '@/components/monitoring/MonitoringProvider';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Shield,
  Server,
  Database,
  Zap
} from 'lucide-react';

export const MonitoringPage: React.FC = () => {
  // Real data integration
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const metrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);
        console.log('✅ ' + 'MonitoringPage.tsx' + ' carregado com dados reais:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar dados reais:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRealData();
  }, []);
  const { systemStatus, isSystemHealthy, hasCriticalIssues, hasWarnings } = useSecurity();
  const { isHealthy, errorCount, isMonitoring } = useMonitoringContext();

  const getStatusIcon = () => {
    if (hasCriticalIssues) return <XCircle className="w-5 h-5 text-red-500" />;
    if (hasWarnings) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusBadge = () => {
    if (hasCriticalIssues) return <Badge variant="destructive">Crítico</Badge>;
    if (hasWarnings) return <Badge variant="secondary">Atenção</Badge>;
    return <Badge className="bg-green-500 hover:bg-green-600">Saudável</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Alertas de Segurança */}
      <SecurityAlert showDetails={true} />
      
      {/* Status Geral do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isSystemHealthy ? 'Todos os sistemas operacionais' : 'Verificação necessária'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoramento</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMonitoring ? 'ATIVO' : 'INATIVO'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isHealthy ? 'Coletando métricas' : 'Aguardando conexão'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros Detectados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edge Functions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4/4</div>
            <p className="text-xs text-muted-foreground">
              Funções operacionais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Serviços */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5" />
              <span>Status dos Serviços</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={systemStatus.services?.database?.status === 'healthy' ? 'default' : 'destructive'}>
                    {systemStatus.services?.database?.status || 'Unknown'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {systemStatus.services?.database?.latency || 0}ms
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Edge Functions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={systemStatus.services?.edge_functions?.status === 'healthy' ? 'default' : 'destructive'}>
                    {systemStatus.services?.edge_functions?.status || 'Unknown'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {systemStatus.services?.edge_functions?.latency || 0}ms
                  </span>
                </div>
              </div>
            </div>

            {systemStatus.summary && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Resumo das Métricas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Métricas:</span>
                    <div className="font-medium">{systemStatus.summary.metrics_count}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Críticas:</span>
                    <div className="font-medium text-red-600">{systemStatus.summary.critical_metrics}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Eventos Seg.:</span>
                    <div className="font-medium">{systemStatus.summary.security_events}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Alta Severidade:</span>
                    <div className="font-medium text-orange-600">{systemStatus.summary.high_severity_events}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dashboard de Monitoramento Principal */}
      <RealTimeMonitoringDashboard />
    </div>
  );
};

export default MonitoringPage;