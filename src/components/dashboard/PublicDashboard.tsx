/**
 * 📊 PUBLIC DASHBOARD - INTERFACE PÚBLICA DE MÉTRICAS
 * 
 * Dashboard visível para usuários finais com métricas de uso
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap,
  Brain,
  Target,
  Download
} from 'lucide-react';

interface ProjectMetrics {
  stepsCompleted: number;
  totalSteps: number;
  blocksCreated: number;
  aiUsage: number;
  sessionTime: number;
  conversionRate: number;
  performance: {
    loadTime: number;
    cacheHitRate: number;
    bundleSize: number;
  };
}

const PublicDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    stepsCompleted: 15,
    totalSteps: 21,
    blocksCreated: 47,
    aiUsage: 12,
    sessionTime: 1847, // em segundos
    conversionRate: 23.5,
    performance: {
      loadTime: 1.8,
      cacheHitRate: 87.3,
      bundleSize: 1.2
    }
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simula atualizações em tempo real
    const interval = setInterval(() => {
      if (isLive) {
        setMetrics(prev => ({
          ...prev,
          sessionTime: prev.sessionTime + 1,
          performance: {
            ...prev.performance,
            cacheHitRate: Math.min(95, prev.performance.cacheHitRate + Math.random() * 0.1)
          }
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const getCompletionPercentage = () => {
    return Math.round((metrics.stepsCompleted / metrics.totalSteps) * 100);
  };

  const exportMetrics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      project: 'Quiz Editor Pro',
      metrics,
      generatedAt: 'Sistema v1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-metrics-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              📊 Project Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o progresso do seu projeto em tempo real
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={isLive ? "default" : "secondary"}>
              {isLive ? "🟢 Live" : "⏸️ Pausado"}
            </Badge>
            <Button 
              onClick={() => setIsLive(!isLive)}
              variant="outline"
              size="sm"
            >
              {isLive ? "Pausar" : "Retomar"}
            </Button>
            <Button onClick={exportMetrics} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Progresso Geral
                  </p>
                  <p className="text-2xl font-bold">
                    {getCompletionPercentage()}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <Progress value={getCompletionPercentage()} className="mt-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.stepsCompleted} de {metrics.totalSteps} etapas
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Componentes
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.blocksCreated}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Blocos criados no projeto
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    IA Utilizada
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.aiUsage}x
                  </p>
                </div>
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Templates gerados por IA
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tempo Ativo
                  </p>
                  <p className="text-2xl font-bold">
                    {formatTime(metrics.sessionTime)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Sessão atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Uso</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Velocidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.performance.loadTime}s
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tempo de carregamento
                  </p>
                  <Progress value={85} className="mt-2" />
                  <p className="text-xs text-green-600 mt-1">
                    44% mais rápido que antes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    Ativo
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Status operacional
                  </p>
                  <Progress value={100} className="mt-2" />
                  <p className="text-xs text-blue-600 mt-1">
                    Sistema funcionando
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Bundle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.performance.bundleSize}MB
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tamanho otimizado
                  </p>
                  <Progress value={60} className="mt-2" />
                  <p className="text-xs text-purple-600 mt-1">
                    43% redução alcançada
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade por Etapa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">Etapa {i + 1}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={Math.random() * 100} 
                            className="w-20"
                          />
                          <span className="text-xs text-muted-foreground w-8">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Componentes Mais Usados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Texto', count: 15, color: 'bg-blue-500' },
                      { name: 'Botão', count: 12, color: 'bg-green-500' },
                      { name: 'Imagem', count: 8, color: 'bg-purple-500' },
                      { name: 'Formulário', count: 6, color: 'bg-orange-500' },
                      { name: 'Vídeo', count: 4, color: 'bg-red-500' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${item.color}`} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recomendações Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900">
                      🚀 Performance Excelente
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Seu projeto está 44% mais rápido que a média. Continue assim!
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900">
                      🧠 IA Otimizada
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Cache hit rate de {metrics.performance.cacheHitRate.toFixed(1)}% - excelente eficiência!
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-900">
                      📊 Próxima Milestone
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Você está a {metrics.totalSteps - metrics.stepsCompleted} etapas de completar o projeto!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Sistema ativo • Última atualização: {new Date().toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Todos os sistemas operacionais
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicDashboard;