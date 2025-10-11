import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFunnelStageActivation } from '@/utils/FunnelStageActivator';
import { Activity, ArrowRight, CheckCircle, Circle, Play, RotateCcw } from 'lucide-react';

interface FunnelDebugPanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

/**
 * Painel de Debug para monitorar ativação das 21 etapas do funil
 *
 * Funcionalidades:
 * - Monitor em tempo real das etapas ativadas
 * - Progresso visual e estatísticas
 * - Controles de teste (reset, ativar etapas)
 * - Log de eventos de ativação
 * - Visualização das regras de ativação
 */

export function FunnelDebugPanel({ isVisible = true, onToggle }: FunnelDebugPanelProps) {
  const {
    activatedStages,
    progressStats,
    registerAnswer,
    registerFieldFilled,
    activateStage,
    isStageActivated,
    reset,
  } = useFunnelStageActivation();

  const [debugLogs, setDebugLogs] = React.useState<
    Array<{
      timestamp: Date;
      type: 'activation' | 'answer' | 'field' | 'reset';
      message: string;
    }>
  >([]);

  // Mock functions para testes
  const handleTestNameFill = () => {
    registerFieldFilled('userName', 'Teste Usuario');
    addDebugLog('field', "Nome preenchido: 'Teste Usuario'");
  };

  const handleTestAnswer = (stepNumber: number) => {
    const mockAnswers = ['opção A', 'opção B', 'opção C'];
    registerAnswer(`q${stepNumber}`, mockAnswers, stepNumber);
    addDebugLog('answer', `Resposta registrada para Q${stepNumber}: ${mockAnswers.join(', ')}`);
  };

  const handleTestActivation = (stepNumber: number) => {
    activateStage(stepNumber);
    addDebugLog('activation', `Etapa ${stepNumber} ativada manualmente`);
  };

  const handleReset = () => {
    reset();
    setDebugLogs([]);
    addDebugLog('reset', 'Sistema resetado');
  };

  const addDebugLog = (type: 'activation' | 'answer' | 'field' | 'reset', message: string) => {
    setDebugLogs(prev => [
      {
        timestamp: new Date(),
        type,
        message,
      },
      ...prev.slice(0, 49), // Manter apenas 50 logs mais recentes
    ]);
  };

  // Gerar dados das etapas para visualização
  const stageData = Array.from({ length: 21 }, (_, index) => {
    const stepNumber = index + 1;
    return {
      number: stepNumber,
      name: getStepName(stepNumber),
      type: getStepType(stepNumber),
      isActive: isStageActivated(stepNumber),
      isNextToActivate: stepNumber === Math.max(...activatedStages, 0) + 1,
    };
  });

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-96 max-h-[90vh] z-50 bg-background border border-border rounded-lg shadow-lg">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
            </CardTitle>
            {onToggle && (
              <Button variant="ghost" size="sm" onClick={onToggle}>
                ×
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progressStats.completionRate}%</span>
            </div>
            <Progress value={progressStats.completionRate} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressStats.activatedStages}/21 etapas</span>
              <span>{progressStats.answers} respostas</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controles de Teste */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Controles de Teste:</h4>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={handleTestNameFill}>
                <Play className="w-3 h-3 mr-1" />
                Nome
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleTestAnswer(2)}>
                Q1
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleTestAnswer(3)}>
                Q2
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleTestActivation(15)}>
                Transição
              </Button>
              <Button size="sm" variant="destructive" onClick={handleReset}>
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Etapas Ativas */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Etapas do Funil:</h4>
            <ScrollArea className="h-48 border rounded p-2">
              <div className="space-y-1">
                {stageData.map(stage => (
                  <div
                    key={stage.number}
                    className={`flex items-center gap-2 p-2 rounded text-xs ${
                      stage.isActive
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : stage.isNextToActivate
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {stage.isActive ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : stage.isNextToActivate ? (
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Circle className="w-3 h-3 text-gray-400" />
                    )}

                    <span className="font-mono">{stage.number.toString().padStart(2, '0')}</span>
                    <span className="flex-1">{stage.name}</span>

                    <Badge variant="secondary" className="text-xs py-0">
                      {stage.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Log de Eventos */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Log de Eventos:</h4>
            <ScrollArea className="h-32 border rounded p-2">
              <div className="space-y-1">
                {debugLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Nenhum evento ainda...</p>
                ) : (
                  debugLogs.map((log, index) => (
                    <div key={index} className="text-xs">
                      <span className="text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="ml-2">
                        <Badge
                          variant={
                            log.type === 'activation'
                              ? 'default'
                              : log.type === 'answer'
                                ? 'secondary'
                                : log.type === 'field'
                                  ? 'outline'
                                  : 'destructive'
                          }
                          className="text-xs py-0 mr-2"
                        >
                          {log.type}
                        </Badge>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Funções auxiliares (duplicadas para independência do componente)
function getStepName(stepNumber: number): string {
  const names = {
    1: 'Introdução',
    2: 'Q1 - Tipo de Roupa',
    3: 'Q2 - Nome Pessoal',
    4: 'Q3 - Estilo Pessoal',
    5: 'Q4 - Ocasiões',
    6: 'Q5 - Cores',
    7: 'Q6 - Textura',
    8: 'Q7 - Silhueta',
    9: 'Q8 - Acessórios',
    10: 'Q9 - Inspiração',
    11: 'Q10 - Conforto',
    12: 'Q11 - Tendências',
    13: 'Q12 - Investimento',
    14: 'Q13 - Personalidade',
    15: 'Transição',
    16: 'Q14 - Estratégica 1',
    17: 'Q15 - Estratégica 2',
    18: 'Q16 - Estratégica 3',
    19: 'Processamento',
    20: 'Resultado',
    21: 'Oferta',
  };

  return names[stepNumber as keyof typeof names] || `Etapa ${stepNumber}`;
}

function getStepType(stepNumber: number): string {
  if (stepNumber === 1) return 'intro';
  if (stepNumber >= 2 && stepNumber <= 14) return 'question';
  if (stepNumber === 15 || stepNumber === 19) return 'transition';
  if (stepNumber >= 16 && stepNumber <= 18) return 'strategic';
  if (stepNumber === 20) return 'result';
  if (stepNumber === 21) return 'offer';

  return 'question';
}

export default FunnelDebugPanel;
