import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const {
    performanceMetrics,
    isLoadingPerformance,
    refreshPerformanceMetrics,
    trackPerformanceMetric
  } = useAnalytics();

  useEffect(() => {
    // Carregar métricas de desempenho ao montar o componente
    refreshPerformanceMetrics();
  }, [refreshPerformanceMetrics]);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  };

  if (isLoadingPerformance) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Performance</h2>
        <button
          onClick={refreshPerformanceMetrics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Atualizar Dados
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tempo de Carregamento da Página */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tempo de Carregamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics?.pageLoadTimes ? formatTime(performanceMetrics.pageLoadTimes.average) : '0ms'}
            </div>
            <p className="text-xs text-gray-600">
              P95: {performanceMetrics?.pageLoadTimes ? formatTime(performanceMetrics.pageLoadTimes.p95) : '0ms'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {performanceMetrics?.pageLoadTimes?.history?.length || 0} amostras
            </p>
          </CardContent>
        </Card>

        {/* Tempo de Resposta da API */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resposta da API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics?.apiResponseTimes ? formatTime(performanceMetrics.apiResponseTimes.average) : '0ms'}
            </div>
            <p className="text-xs text-gray-600">
              P95: {performanceMetrics?.apiResponseTimes ? formatTime(performanceMetrics.apiResponseTimes.p95) : '0ms'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {performanceMetrics?.apiResponseTimes?.history?.length || 0} chamadas
            </p>
          </CardContent>
        </Card>

        {/* Uso de Memória */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Uso de Memória</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics?.memoryUsage ? formatSize(performanceMetrics.memoryUsage.average) : '0B'}
            </div>
            <p className="text-xs text-gray-600">
              Pico: {performanceMetrics?.memoryUsage ? formatSize(performanceMetrics.memoryUsage.peak) : '0B'}
            </p>
          </CardContent>
        </Card>

        {/* Tamanho do Bundle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tamanho do Bundle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics?.bundleSizes ? formatSize(performanceMetrics.bundleSizes.total) : '0B'}
            </div>
            <p className="text-xs text-gray-600">
              {performanceMetrics?.bundleSizes ? Object.keys(performanceMetrics.bundleSizes.perRoute).length : 0} rotas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações de atualização */}
      {performanceMetrics?.updatedAt && (
        <div className="text-xs text-gray-500 text-center mt-4">
          Última atualização: {new Date(performanceMetrics.updatedAt).toLocaleString('pt-BR')}
        </div>
      )}

      {/* Seção de Testes */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Teste de Performance</h3>
        <div className="space-x-2">
          <button
            onClick={() => trackPerformanceMetric({
              metricName: 'pageLoad',
              value: performance.now(),
              unit: 'ms'
            })}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Simular Page Load
          </button>
          <button
            onClick={() => trackPerformanceMetric({
              metricName: 'apiResponse',
              value: Math.random() * 1000 + 100,
              unit: 'ms'
            })}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Simular API Call
          </button>
          <button
            onClick={() => trackPerformanceMetric({
              metricName: 'memoryUsage',
              value: Math.random() * 50 + 10,
              unit: 'mb'
            })}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            Simular Memory Check
          </button>
          <button
            onClick={() => trackPerformanceMetric({
              metricName: 'bundleSize',
              value: Math.random() * 2 + 0.5,
              unit: 'mb'
            })}
            className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
          >
            Simular Bundle Size
          </button>
        </div>
      </div>
    </div>
  );
};

const AdvancedAnalytics: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Analytics Avançado</h2>
      <p style={{ color: '#6B4F43' }}>Sistema de analytics avançado em desenvolvimento...</p>
    </div>
  );
};

export default AdvancedAnalytics;
