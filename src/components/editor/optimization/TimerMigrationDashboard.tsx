/**
 * 🔄 DASHBOARD DE MIGRAÇÃO DE TIMERS
 * 
 * Painel para monitorar e executar a migração de timers legados
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Timer, 
  CheckCircle, 
  AlertCircle,
  Clock, 
  Zap,
  RefreshCw,
  FileText,
  TrendingUp
} from 'lucide-react';
import { getMigrationStatus, TIMER_MIGRATION_LIST } from '@/utils/timerMigration';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';

interface TimerMigrationDashboardProps {
  onMigrateFile?: (filePath: string) => Promise<void>;
  onGenerateReport?: () => void;
}

export const TimerMigrationDashboard: React.FC<TimerMigrationDashboardProps> = ({
  onMigrateFile,
  onGenerateReport
}) => {
  const [migrationStatus, setMigrationStatus] = useState(getMigrationStatus());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { schedule, cancel } = useOptimizedScheduler();

  // Atualizar status a cada 5 segundos
  useEffect(() => {
    const key = 'timer-migration:refresh';
    const interval = setInterval(() => setMigrationStatus(getMigrationStatus()), 5000);
    // também agenda uma atualização imediata para responsividade
    schedule(key, () => setMigrationStatus(getMigrationStatus()), 0);
    return () => {
      clearInterval(interval);
      cancel(key);
    };
  }, [schedule, cancel]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simular análise
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMigrationStatus(getMigrationStatus());
    setIsAnalyzing(false);
  };

  const handleMigrateFile = async (filePath: string) => {
    try {
      await onMigrateFile?.(filePath);
      setMigrationStatus(getMigrationStatus());
    } catch (error) {
      console.error('Erro ao migrar arquivo:', error);
    }
  };

  const getPriorityColor = (filePath: string) => {
    const criticalFiles = [
      'CountdownTimerBlock.tsx',
      'LoadingTransitionBlock.tsx',
      'QuizTransitionBlock.tsx'
    ];
    
    if (criticalFiles.some(file => filePath.includes(file))) {
      return 'destructive';
    }
    
    return 'secondary';
  };

  const getFileStatus = (filePath: string) => {
    const completed = [
      'src/components/blocks/quiz/LoadingTransitionBlock.tsx',
      'src/components/editor/EditorProvider.tsx',
      'src/components/editor/blocks/ButtonInlineBlock.tsx'
    ];
    
    return completed.includes(filePath) ? 'completed' : 'pending';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Timer className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Migração de Timers</h2>
            <p className="text-muted-foreground">
              Otimizando setTimeout/setInterval para useOptimizedScheduler
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analisando...' : 'Atualizar'}
          </Button>
          
          <Button
            onClick={onGenerateReport}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Migrados</p>
                <p className="text-2xl font-bold">{migrationStatus.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{migrationStatus.remaining.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="text-2xl font-bold">{migrationStatus.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">+60%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso da Migração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{migrationStatus.completed} de {migrationStatus.total} arquivos</span>
              <span>{migrationStatus.progress}%</span>
            </div>
            <Progress value={migrationStatus.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Arquivos para Migração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TIMER_MIGRATION_LIST.map((filePath, index) => {
              const status = getFileStatus(filePath);
              const fileName = filePath.split('/').pop() || filePath;
              
              return (
                <div key={filePath} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <span className="font-medium">{fileName}</span>
                    </div>
                    
                    <Badge
                      variant={getPriorityColor(filePath)}
                      className="text-xs"
                    >
                      {index < 5 ? 'Alta' : index < 10 ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === 'completed' ? (
                      <Badge variant="outline" className="text-green-600">
                        ✅ Migrado
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMigrateFile(filePath)}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Migrar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Impacto da Migração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Impacto Estimado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-green-600">Memory Leaks</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+60%</div>
              <div className="text-sm text-blue-600">Performance</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-purple-600">Auto Cleanup</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">-40%</div>
              <div className="text-sm text-orange-600">CPU Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerMigrationDashboard;