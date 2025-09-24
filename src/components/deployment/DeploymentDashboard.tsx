/**
 * Dashboard de Deploy - Fase 9
 * Interface para monitorar status de deployment e otimizações
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Rocket,
  BarChart3,
  Shield,
  Database
} from 'lucide-react';
import { runDeploymentChecklist, type DeploymentReport } from '@/utils/deploymentChecklist';
import { useProductionOptimization } from '@/hooks/useProductionOptimization';

export const DeploymentDashboard: React.FC = () => {
  const [report, setReport] = useState<DeploymentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { metrics, isOptimizing, applyOptimizations } = useProductionOptimization();

  const runChecklist = async () => {
    setIsLoading(true);
    try {
      const newReport = await runDeploymentChecklist();
      setReport(newReport);
    } catch (error) {
      console.error('Erro ao executar checklist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runChecklist();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Deploy</h2>
          <p className="text-muted-foreground">
            Monitore o status de deployment e otimizações do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runChecklist} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Verificar Sistema
          </Button>
          <Button 
            onClick={applyOptimizations}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Otimizar
          </Button>
        </div>
      </div>

      {report && (
        <>
          {/* Status Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(report.overallStatus)}`} />
                Status Geral do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{report.score}%</div>
                  <div className="text-sm text-muted-foreground">Score Geral</div>
                  <Progress value={report.score} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{report.checks.length}</div>
                  <div className="text-sm text-muted-foreground">Verificações</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{report.criticalIssues}</div>
                  <div className="text-sm text-muted-foreground">Críticos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{report.warnings}</div>
                  <div className="text-sm text-muted-foreground">Avisos</div>
                </div>
              </div>

              {report.overallStatus === 'failed' && (
                <Alert className="mt-4">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sistema não está pronto para deploy. Corrija os problemas críticos antes de continuar.
                  </AlertDescription>
                </Alert>
              )}

              {report.overallStatus === 'warning' && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Sistema pronto para deploy, mas há avisos que devem ser revisados.
                  </AlertDescription>
                </Alert>
              )}

              {report.overallStatus === 'ready' && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Sistema pronto para deploy em produção! 🚀
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Lista de Verificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Verificações Detalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.checks.map(check => (
                  <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-muted-foreground">{check.description}</div>
                        {check.message && (
                          <div className="text-xs text-muted-foreground mt-1">{check.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {check.critical && (
                        <Badge variant="destructive" className="text-xs">Crítico</Badge>
                      )}
                      <Badge variant={
                        check.status === 'passed' ? 'default' :
                        check.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {check.status === 'passed' ? 'OK' :
                         check.status === 'warning' ? 'Aviso' : 'Falha'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Métricas de Performance */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Métricas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{Math.round(metrics.loadTime)}ms</div>
                <div className="text-sm text-muted-foreground">Tempo de Carregamento</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{Math.round(metrics.renderTime)}ms</div>
                <div className="text-sm text-muted-foreground">Primeiro Render</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {(metrics.bundleSize / 1024 / 1024).toFixed(1)}MB
                </div>
                <div className="text-sm text-muted-foreground">Tamanho do Bundle</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                </div>
                <div className="text-sm text-muted-foreground">Uso de Memória</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeploymentDashboard;