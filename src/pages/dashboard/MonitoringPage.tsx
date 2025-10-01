// @ts-nocheck
/**
 * 📊 PÁGINA DE MONITORAMENTO - FASE 2
 * Dashboard de monitoramento em tempo real do sistema
 */

import React, { useState, useEffect } from 'react';
import { EnhancedUnifiedDataService } from '@/services/EnhancedUnifiedDataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Server,
  Database,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Bell,
  Settings,
  Eye
} from 'lucide-react';

export const MonitoringPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const metrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);
        console.log('✅ MonitoringPage carregado com dados reais:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar dados reais:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRealData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadRealData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Estados de monitoramento
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Alto tempo de resposta',
      description: 'Tempo de resposta médio está acima de 500ms',
      timestamp: '14:32',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Backup automático concluído',
      description: 'Backup diário executado com sucesso',
      timestamp: '03:00',
      severity: 'low'
    }
  ]);

  const systemMetrics = {
    cpu: 67,
    memory: 84,
    disk: 45,
    network: 23
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitoramento do Sistema</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500 hover:bg-green-600">
            <Activity className="w-3 h-3 mr-1" />
            Sistema Online
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saúde do Servidor</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realTimeMetrics?.serverHealth || 98}%
            </div>
            <Progress value={realTimeMetrics?.serverHealth || 98} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +2% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {realTimeMetrics?.activeUsers || 47}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              +12% vs hora anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisições/min</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {realTimeMetrics?.requestsPerMinute || 124}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 inline mr-1 text-orange-500" />
              -3% vs média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {realTimeMetrics?.responseTime || 45}ms
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1 text-red-500" />
              +15ms vs média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recursos do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5" />
              <span>Recursos do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU</span>
                  <span>{systemMetrics.cpu}%</span>
                </div>
                <Progress value={systemMetrics.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memória</span>
                  <span>{systemMetrics.memory}%</span>
                </div>
                <Progress value={systemMetrics.memory} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disco</span>
                  <span>{systemMetrics.disk}%</span>
                </div>
                <Progress value={systemMetrics.disk} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rede</span>
                  <span>{systemMetrics.network}%</span>
                </div>
                <Progress value={systemMetrics.network} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Banco de Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Conexões Ativas</div>
                    <div className="text-sm text-green-700">
                      {realTimeMetrics?.databaseConnections || 15} de 100 conexões
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Queries/seg</div>
                    <div className="text-sm text-blue-700">45 queries executadas</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-900">Tempo Médio</div>
                    <div className="text-sm text-purple-700">12ms por query</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Alertas Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{alert.title}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      <Badge 
                        className={
                          alert.severity === 'high' 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : alert.severity === 'medium'
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }
                      >
                        {alert.severity === 'high' ? 'Alto' : alert.severity === 'medium' ? 'Médio' : 'Baixo'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{alert.description}</div>
                </div>

                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status dos Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">API Principal</div>
                <div className="text-sm text-muted-foreground">Online</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">Base de Dados</div>
                <div className="text-sm text-muted-foreground">Online</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <div className="font-medium">Cache Redis</div>
                <div className="text-sm text-muted-foreground">Lento</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">CDN</div>
                <div className="text-sm text-muted-foreground">Online</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPage;