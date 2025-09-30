// @ts-nocheck
/**
 * ⚡ PÁGINA DE TEMPO REAL - FASE 1
 * Dashboard de métricas em tempo real com atualizações automáticas
 */

import React, { useState, useEffect } from 'react';
import { enhancedUnifiedDataServiceAdapter as EnhancedUnifiedDataService } from '@/analytics/compat/enhancedUnifiedDataServiceAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const RealTimePage: React.FC = () => {
  const [isTracking, setIsTracking] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    const loadRealTimeData = async () => {
      try {
        const metrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);

        // Adicionar aos dados históricos
        const timestamp = new Date().toLocaleTimeString();
        setHistoricalData(prev => [
          ...prev.slice(-20), // Manter apenas os últimos 20 pontos
          {
            time: timestamp,
            users: metrics?.activeUsers || 47,
            views: metrics?.pageViews || 124,
            conversions: metrics?.conversions || 12
          }
        ]);

        console.log('✅ Real-time metrics updated:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar métricas em tempo real:', error);
      }
    };

    loadRealTimeData();

    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(loadRealTimeData, 5000); // Atualizar a cada 5 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  // Mock data para atividade em tempo real
  const recentActivity = [
    { id: 1, action: 'Usuário completou Quiz de Estilo', time: 'agora', type: 'conversion' },
    { id: 2, action: 'Nova visita na página inicial', time: '5s atrás', type: 'visit' },
    { id: 3, action: 'Usuário iniciou Step 3', time: '12s atrás', type: 'progress' },
    { id: 4, action: 'Download do resultado gerado', time: '28s atrás', type: 'conversion' },
    { id: 5, action: 'Compartilhamento no WhatsApp', time: '45s atrás', type: 'share' },
    { id: 6, action: 'Usuário abandonou no Step 2', time: '1m atrás', type: 'abandon' },
    { id: 7, action: 'Nova sessão iniciada', time: '1m atrás', type: 'visit' },
  ];

  const topPages = [
    { page: '/quiz-estilo', views: 847, conversions: 89 },
    { page: '/resultado/classico', views: 234, conversions: 45 },
    { page: '/resultado/moderno', views: 198, conversions: 38 },
    { page: '/resultado/criativo', views: 167, conversions: 29 },
    { page: '/inicio', views: 156, conversions: 12 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tempo Real</h1>
        <div className="flex items-center space-x-2">
          <Badge className={isTracking ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}>
            <Activity className="w-3 h-3 mr-1" />
            {isTracking ? 'Monitorando' : 'Pausado'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isTracking ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 animate-pulse">
              {realTimeMetrics?.activeUsers || 47}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +5 nos últimos 10min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {realTimeMetrics?.pageViews || 124}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              por minuto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {realTimeMetrics?.conversions || 12}
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa: {((realTimeMetrics?.conversions || 12) / (realTimeMetrics?.activeUsers || 47) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {realTimeMetrics?.bounceRate || 35}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 inline mr-1 text-green-500" />
              -3% vs média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Sessão</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.floor((realTimeMetrics?.avgSessionTime || 180) / 60)}m {(realTimeMetrics?.avgSessionTime || 180) % 60}s
            </div>
            <p className="text-xs text-muted-foreground">
              Média atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Atividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Atividade em Tempo Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Usuários Online"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Visualizações"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#ffc658"
                  strokeWidth={2}
                  name="Conversões"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Carregando dados em tempo real...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atividade Recente e Páginas Mais Visitadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Atividade Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'conversion' ? 'bg-green-500' :
                      activity.type === 'visit' ? 'bg-blue-500' :
                        activity.type === 'progress' ? 'bg-purple-500' :
                          activity.type === 'share' ? 'bg-yellow-500' :
                            'bg-red-500'
                    } animate-pulse`}></div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      activity.type === 'conversion' ? 'border-green-200 text-green-700' :
                        activity.type === 'visit' ? 'border-blue-200 text-blue-700' :
                          activity.type === 'progress' ? 'border-purple-200 text-purple-700' :
                            activity.type === 'share' ? 'border-yellow-200 text-yellow-700' :
                              'border-red-200 text-red-700'
                    }
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Páginas Mais Visitadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{page.page}</div>
                      <div className="text-xs text-muted-foreground">
                        {page.views} visualizações
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{page.conversions}</div>
                    <div className="text-xs text-muted-foreground">conversões</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimePage;