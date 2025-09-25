/**
 * 🧭 STEP NAVIGATOR - NAVEGAÇÃO ENTRE ETAPAS DO TEMPLATE
 * 
 * Componente crítico que estava FALTANDO - permite:
 * - Navegar entre as 21 etapas do quiz21StepsComplete
 * - Preview sequencial das etapas
 * - Indicação visual da etapa atual
 * - Validação de etapas obrigatórias
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Hash,
  Target,
  Gift,
  User
} from 'lucide-react';

export interface StepInfo {
  id: string;
  order: number;
  name: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  isComplete?: boolean;
  hasError?: boolean;
  blocksCount: number;
}

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  steps: StepInfo[];
  onStepChange: (step: number) => void;
  onPreviewMode?: (enabled: boolean) => void;
  isPreviewMode?: boolean;
  className?: string;
}

// 🎯 MAPEAMENTO DE TIPOS DE ETAPA PARA ÍCONES E CORES
const STEP_TYPE_CONFIG = {
  intro: { icon: User, color: 'bg-blue-500', label: 'Intro' },
  question: { icon: Hash, color: 'bg-green-500', label: 'Questão' },
  strategic: { icon: Target, color: 'bg-purple-500', label: 'Estratégica' },
  transition: { icon: Play, color: 'bg-yellow-500', label: 'Transição' },
  result: { icon: CheckCircle, color: 'bg-emerald-500', label: 'Resultado' },
  offer: { icon: Gift, color: 'bg-red-500', label: 'Oferta' }
};

const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepChange,
  onPreviewMode,
  isPreviewMode = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🎯 ESTATÍSTICAS DAS ETAPAS
  const stepStats = useMemo(() => {
    const completed = steps.filter(s => s.isComplete).length;
    const withErrors = steps.filter(s => s.hasError).length;
    const totalBlocks = steps.reduce((acc, s) => acc + s.blocksCount, 0);

    return { completed, withErrors, totalBlocks };
  }, [steps]);

  // 🎯 NAVEGAÇÃO
  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < totalSteps;

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, canGoPrevious, onStepChange]);

  const handleNext = useCallback(() => {
    if (canGoNext) {
      onStepChange(currentStep + 1);
    }
  }, [currentStep, canGoNext, onStepChange]);

  const handleStepClick = useCallback((stepNumber: number) => {
    onStepChange(stepNumber);
  }, [onStepChange]);

  const handlePreviewToggle = useCallback(() => {
    const newPreviewMode = !isPreviewMode;
    onPreviewMode?.(newPreviewMode);
  }, [isPreviewMode, onPreviewMode]);

  if (isCollapsed) {
    return (
      <div className={`w-12 bg-background border-r border-border flex flex-col ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="h-10 px-2"
          title="Expandir navegador"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-background border-r border-border flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Navegador de Etapas</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="h-6 w-6 p-0"
            title="Recolher navegador"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{currentStep}</div>
            <div className="text-xs text-muted-foreground">Atual</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stepStats.completed}</div>
            <div className="text-xs text-muted-foreground">Completas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{stepStats.withErrors}</div>
            <div className="text-xs text-muted-foreground">Erros</div>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex-1"
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Separator className="my-3" />

        {/* Botão Preview */}
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={handlePreviewToggle}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          {isPreviewMode ? 'Parar Preview' : 'Preview Sequencial'}
        </Button>
      </div>

      {/* Lista de Etapas */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {steps.map((step) => {
            const typeConfig = STEP_TYPE_CONFIG[step.type];
            const isCurrent = step.order === currentStep;
            const IconComponent = typeConfig.icon;
            
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.order)}
                className={`w-full p-3 mb-2 rounded-lg border transition-all duration-200 text-left ${
                  isCurrent
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Ícone do Tipo */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeConfig.color}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>

                  {/* Informações da Etapa */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        Etapa {step.order}
                      </span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {typeConfig.label}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground truncate">
                      {step.name}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {step.blocksCount} blocos
                      </span>
                      
                      {step.isComplete && (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      )}
                      
                      {step.hasError && (
                        <AlertCircle className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Indicador de Etapa Atual */}
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer com Informações */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Total: {totalSteps} etapas</div>
          <div>Blocos: {stepStats.totalBlocks}</div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Etapa atual</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepNavigator;