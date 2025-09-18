import { useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  useGlobalNavigationConfig,
  useNavigationConfigStats,
  useStepNavigationConfig,
} from '@/stores/useStepNavigationStore';
import {
  BarChart3,
  Download,
  Eye,
  MousePointer,
  Palette,
  RotateCcw,
  Settings,
  Timer,
  Upload,
} from 'lucide-react';
import React from 'react';

interface StepNavigationOverviewProps {
  className?: string;
  showStats?: boolean;
  showExportImport?: boolean;
}

/**
 * 📊 PAINEL DE VISÃO GERAL DAS CONFIGURAÇÕES DE NAVEGAÇÃO
 *
 * Mostra:
 * - Status das configurações de cada etapa
 * - Estatísticas gerais
 * - Import/Export
 * - Preview das configurações ativas
 */
export const StepNavigationOverview: React.FC<StepNavigationOverviewProps> = ({
  className,
  showStats = true,
  showExportImport = true,
}) => {
  const { currentStep } = useQuiz21Steps();
  const { config: currentConfig } = useStepNavigationConfig(`step-${currentStep}`);
  const { getStats } = useNavigationConfigStats();
  const { exportConfigs, importConfigs, resetAllConfigs } = useGlobalNavigationConfig();

  const stats = getStats();

  // Gerar array de todas as etapas para mostrar status
  const allSteps = Array.from({ length: 21 }, (_, i) => i + 1);

  const handleExport = () => {
    const configsJson = exportConfigs();
    const blob = new Blob([configsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-navigation-configs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        importConfigs(content);
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações de navegação?')) {
      resetAllConfigs();
    }
  };

  // Obter informações da etapa atual
  const getCurrentStepInfo = () => {
    if (currentStep === 1) return { type: 'lead', title: 'Coleta de Nome', icon: '👤' };
    if (currentStep >= 2 && currentStep <= 11)
      return { type: 'question', title: `Questão ${currentStep - 1}`, icon: '❓' };
    if (currentStep === 12) return { type: 'transition', title: 'Transição', icon: '⏳' };
    if (currentStep >= 13 && currentStep <= 18)
      return { type: 'strategic', title: `Pergunta Estratégica ${currentStep - 12}`, icon: '🎯' };
    if (currentStep === 19) return { type: 'transition', title: 'Transição', icon: '⏳' };
    if (currentStep === 20) return { type: 'result', title: 'Resultado', icon: '📊' };
    if (currentStep === 21) return { type: 'offer', title: 'Oferta', icon: '💎' };
    return { type: 'unknown', title: `Etapa ${currentStep}`, icon: '⚙️' };
  };

  const stepInfo = getCurrentStepInfo();

  return (
    <div className={cn('space-y-6', className)}>
      {/* 🎯 CONFIGURAÇÃO DA ETAPA ATUAL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="text-lg">{stepInfo.icon}</div>
            <span>Etapa Atual: {stepInfo.title}</span>
            <Badge variant="outline">step-{currentStep}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <MousePointer className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <div className="text-sm font-medium">Seleções</div>
              <div className="text-lg font-bold text-blue-700">
                {currentConfig.requiredSelections}
                {currentConfig.maxSelections !== currentConfig.requiredSelections &&
                  ` / ${currentConfig.maxSelections}`}
              </div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Timer className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-sm font-medium">Auto-Advance</div>
              <div className="text-lg font-bold text-green-700">
                {currentConfig.autoAdvanceOnComplete
                  ? `${currentConfig.autoAdvanceDelay}ms`
                  : 'OFF'}
              </div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Eye className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <div className="text-sm font-medium">Validação</div>
              <div className="text-lg font-bold text-purple-700">
                {currentConfig.showValidationFeedback ? 'ON' : 'OFF'}
              </div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Palette className="h-5 w-5 mx-auto mb-1 text-orange-600" />
              <div className="text-sm font-medium">Estilo</div>
              <div className="text-sm font-bold text-orange-700 capitalize">
                {currentConfig.selectionStyle}
              </div>
            </div>
          </div>

          {/* Preview das mensagens */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Mensagens:</div>
            <div className="grid gap-2">
              <div className="text-xs p-2 bg-gray-50 rounded">
                <span className="font-medium">Validação:</span> {currentConfig.validationMessage}
              </div>
              {currentConfig.showProgressMessage && (
                <div className="text-xs p-2 bg-gray-50 rounded">
                  <span className="font-medium">Progresso:</span> {currentConfig.progressMessage}
                </div>
              )}
              <div className="text-xs p-2 bg-gray-50 rounded">
                <span className="font-medium">Botão:</span> {currentConfig.nextButtonText}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📊 ESTATÍSTICAS GERAIS */}
      {showStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estatísticas de Configuração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.customizedSteps}</div>
                <div className="text-sm text-muted-foreground">Etapas Customizadas</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.autoAdvanceSteps}</div>
                <div className="text-sm text-muted-foreground">Auto-Advance Ativo</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.multipleSelectionSteps}
                </div>
                <div className="text-sm text-muted-foreground">Múltiplas Seleções</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.avgAutoAdvanceDelay}ms
                </div>
                <div className="text-sm text-muted-foreground">Delay Médio</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{stats.defaultSteps}</div>
                <div className="text-sm text-muted-foreground">Etapas Padrão</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">21</div>
                <div className="text-sm text-muted-foreground">Total de Etapas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🛠️ FERRAMENTAS DE IMPORT/EXPORT */}
      {showExportImport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciamento de Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Configurações
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importar Configurações
                </Button>
              </div>

              <Button
                onClick={handleReset}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar Tudo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🗺️ MAPA DE ETAPAS */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {allSteps.map(stepNumber => {
              const { config } = useStepNavigationConfig(`step-${stepNumber}`);
              const hasCustomConfig =
                config.requiredSelections !== 0 || config.autoAdvanceOnComplete;
              const isCurrentStep = stepNumber === currentStep;

              return (
                <div
                  key={stepNumber}
                  className={cn(
                    'aspect-square flex items-center justify-center text-xs font-medium rounded border',
                    isCurrentStep
                      ? 'bg-blue-500 text-white border-blue-600'
                      : hasCustomConfig
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                  )}
                  title={`Etapa ${stepNumber}${hasCustomConfig ? ' (Customizada)' : ' (Padrão)'}`}
                >
                  {stepNumber}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Atual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Customizada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Padrão</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepNavigationOverview;
