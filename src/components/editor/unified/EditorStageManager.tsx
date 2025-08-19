/**
 * 🎪 EDITOR STAGE MANAGER - GERENCIADOR DE ETAPAS
 *
 * Componente responsável por gerenciar as etapas do quiz no editor
 * Integra com useQuizFlow e UnifiedPreviewEngine
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { cn } from '@/lib/utils';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Edit,
  Eye,
  Gift,
  Layers,
  Play,
  Trophy,
  Users,
} from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

export interface EditorStageManagerProps {
  /** Modo atual do editor */
  mode: 'edit' | 'preview' | 'test';
  /** Callback quando uma etapa é selecionada */
  onStepSelect?: (step: number) => void;
  /** Callback quando os dados de uma etapa são atualizados */
  onStepDataUpdate?: (step: number, data: any) => void;
  /** Callback quando o modo muda */
  onModeChange?: (mode: 'edit' | 'preview' | 'test') => void;
  /** Etapa inicialmente selecionada */
  initialStep?: number;
  /** Classe CSS adicional */
  className?: string;
}

interface StepMetadata {
  id: string;
  title: string;
  description: string;
  type: 'form' | 'question' | 'transition' | 'result' | 'offer';
  icon: React.ComponentType<any>;
  category: 'intro' | 'questions' | 'strategic' | 'transitions' | 'result' | 'offer';
  isCompleted: boolean;
  hasData: boolean;
  blockCount: number;
}

/**
 * 🎪 Gerenciador de Etapas do Editor
 *
 * Permite navegar, editar e testar todas as 21 etapas do quiz
 */
export const EditorStageManager: React.FC<EditorStageManagerProps> = ({
  mode,
  onStepSelect,
  onStepDataUpdate,
  onModeChange,
  initialStep = 1,
  className,
}) => {
  // Hook principal do quiz flow
  const { quizState, actions } = useQuizFlow({
    mode: mode === 'test' ? 'production' : 'editor',
    onStepChange: onStepSelect,
    initialStep,
  });

  // Metadados das etapas
  const stepsMetadata = useMemo((): StepMetadata[] => {
    const getStepMetadata = (step: number): StepMetadata => {
      const stepKey = `step-${step}`;
      const stepData = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey] || [];

      // Categorizar etapas
      const getCategory = (step: number): StepMetadata['category'] => {
        if (step === 1) return 'intro';
        if (step >= 2 && step <= 11) return 'questions';
        if (step >= 12 && step <= 13) return 'transitions';
        if (step >= 14 && step <= 18) return 'strategic';
        if (step === 19) return 'transitions';
        if (step === 20) return 'result';
        if (step === 21) return 'offer';
        return 'questions';
      };

      // Determinar tipo da etapa
      const getStepType = (step: number): StepMetadata['type'] => {
        if (step === 1) return 'form';
        if (step === 12 || step === 19) return 'transition';
        if (step === 20) return 'result';
        if (step === 21) return 'offer';
        return 'question';
      };

      // Ícone da etapa
      const getStepIcon = (step: number) => {
        const category = getCategory(step);
        switch (category) {
          case 'intro':
            return Users;
          case 'questions':
            return Circle;
          case 'strategic':
            return Calculator;
          case 'transitions':
            return ArrowRight;
          case 'result':
            return Trophy;
          case 'offer':
            return Gift;
          default:
            return Circle;
        }
      };

      // Título da etapa
      const getStepTitle = (step: number): string => {
        if (step === 1) return 'Introdução';
        if (step >= 2 && step <= 11) return `Questão ${step - 1}`;
        if (step === 12) return 'Transição Principal';
        if (step >= 13 && step <= 18) return `Estratégica ${step - 12}`;
        if (step === 19) return 'Calculando Resultado';
        if (step === 20) return 'Resultado Final';
        if (step === 21) return 'Oferta Final';
        return `Etapa ${step}`;
      };

      // Descrição da etapa
      const getStepDescription = (step: number): string => {
        if (step === 1) return 'Coleta nome e apresentação';
        if (step >= 2 && step <= 11) return 'Questões de personalidade';
        if (step === 12) return 'Ponte entre seções';
        if (step >= 13 && step <= 18) return 'Questões estratégicas';
        if (step === 19) return 'Processamento de dados';
        if (step === 20) return 'Exibição do resultado';
        if (step === 21) return 'Call to action final';
        return 'Etapa do quiz';
      };

      const category = getCategory(step);

      return {
        id: stepKey,
        title: getStepTitle(step),
        description: getStepDescription(step),
        type: getStepType(step),
        icon: getStepIcon(step),
        category,
        isCompleted: step < quizState.currentStep,
        hasData: stepData.length > 0,
        blockCount: stepData.length,
      };
    };

    return Array.from({ length: 21 }, (_, i) => getStepMetadata(i + 1));
  }, [quizState.currentStep]);

  // Navegar para uma etapa específica
  const handleStepSelect = useCallback(
    (step: number) => {
      if (mode === 'edit') {
        // No modo de edição, permite navegar para qualquer etapa
        onStepSelect?.(step);
      } else if (mode === 'test') {
        // No modo de teste, usa a navegação natural do quiz
        if (step === quizState.currentStep + 1) {
          actions.nextStep();
        } else if (step === quizState.currentStep - 1) {
          actions.prevStep();
        }
      }
    },
    [mode, quizState.currentStep, actions, onStepSelect]
  );

  // Agrupar etapas por categoria
  const groupedSteps = useMemo(() => {
    const groups = stepsMetadata.reduce(
      (acc, step, index) => {
        const stepNumber = index + 1;
        const category = step.category;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push({ ...step, stepNumber });
        return acc;
      },
      {} as Record<string, Array<StepMetadata & { stepNumber: number }>>
    );

    return groups;
  }, [stepsMetadata]);

  // Estatísticas das etapas
  const stats = useMemo(() => {
    const totalSteps = stepsMetadata.length;
    const completedSteps = stepsMetadata.filter(s => s.isCompleted).length;
    const stepsWithData = stepsMetadata.filter(s => s.hasData).length;

    return {
      total: totalSteps,
      completed: completedSteps,
      withData: stepsWithData,
      progress: Math.round((completedSteps / totalSteps) * 100),
    };
  }, [stepsMetadata]);

  // Renderizar um item de etapa
  const renderStepItem = (step: StepMetadata & { stepNumber: number }) => {
    const isActive = step.stepNumber === quizState.currentStep;
    const isClickable =
      mode === 'edit' ||
      (mode === 'test' && Math.abs(step.stepNumber - quizState.currentStep) <= 1);

    const StepIcon = step.icon;

    return (
      <Card
        key={step.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          isActive && 'ring-2 ring-blue-500 bg-blue-50',
          !isClickable && 'opacity-50 cursor-not-allowed',
          step.isCompleted && 'border-green-200 bg-green-50'
        )}
        onClick={() => isClickable && handleStepSelect(step.stepNumber)}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Ícone e status */}
            <div className="flex-shrink-0">
              {step.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : isActive ? (
                <StepIcon className="h-5 w-5 text-blue-600" />
              ) : (
                <StepIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    'text-sm font-medium truncate',
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  )}
                >
                  {step.stepNumber}. {step.title}
                </h4>
                <span className="text-xs text-gray-500 ml-2">{step.blockCount} blocos</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">{step.description}</p>
            </div>

            {/* Indicador de modo */}
            {isActive && (
              <div className="flex-shrink-0">
                {mode === 'edit' ? (
                  <Edit className="h-4 w-4 text-blue-600" />
                ) : mode === 'preview' ? (
                  <Eye className="h-4 w-4 text-blue-600" />
                ) : (
                  <Play className="h-4 w-4 text-blue-600" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Renderizar grupo de etapas
  const renderStepGroup = (
    categoryKey: string,
    steps: Array<StepMetadata & { stepNumber: number }>
  ) => {
    const categoryLabels = {
      intro: 'Introdução',
      questions: 'Questões Principais',
      transitions: 'Transições',
      strategic: 'Questões Estratégicas',
      result: 'Resultado',
      offer: 'Oferta Final',
    };

    const categoryIcons = {
      intro: Users,
      questions: Circle,
      transitions: ArrowRight,
      strategic: Calculator,
      result: Trophy,
      offer: Gift,
    };

    const CategoryIcon = categoryIcons[categoryKey as keyof typeof categoryIcons] || Layers;

    return (
      <div key={categoryKey} className="space-y-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <CategoryIcon className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">
            {categoryLabels[categoryKey as keyof typeof categoryLabels] || categoryKey}
          </h3>
          <span className="text-xs text-gray-500">({steps.length})</span>
        </div>
        <div className="space-y-1">{steps.map(renderStepItem)}</div>
      </div>
    );
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Gerenciador de Etapas
          </CardTitle>

          {/* Controles de modo */}
          <div className="flex gap-1">
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onModeChange?.('edit')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant={mode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onModeChange?.('preview')}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant={mode === 'test' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onModeChange?.('test')}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">{stats.total}</div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-700">{stats.completed}</div>
            <div className="text-green-600">Completas</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-700">{stats.withData}</div>
            <div className="text-blue-600">Com Dados</div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progresso</span>
            <span>{stats.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Lista de etapas */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {Object.entries(groupedSteps).map(([categoryKey, steps]) =>
            renderStepGroup(categoryKey, steps)
          )}
        </div>
      </ScrollArea>

      {/* Controles de navegação */}
      {mode === 'test' && (
        <>
          <Separator />
          <div className="p-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.prevStep}
                disabled={quizState.currentStep <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Etapa</span>
                <span className="font-semibold">
                  {quizState.currentStep} / {quizState.totalSteps}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={actions.nextStep}
                disabled={quizState.currentStep >= quizState.totalSteps}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default EditorStageManager;
