/**
 * 🎯 Step Navigation for NOCODE Properties Panel
 * 
 * Allows users to navigate between all 21 steps and configure components
 * across the entire quiz flow from the properties panel.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, MapPin, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  className?: string;
}

// Step metadata for better UX
const STEP_METADATA = {
  1: { title: 'Introdução', type: 'intro', color: 'bg-blue-500' },
  2: { title: 'Questão 1', type: 'question', color: 'bg-green-500' },
  3: { title: 'Questão 2', type: 'question', color: 'bg-green-500' },
  4: { title: 'Questão 3', type: 'question', color: 'bg-green-500' },
  5: { title: 'Questão 4', type: 'question', color: 'bg-green-500' },
  6: { title: 'Questão 5', type: 'question', color: 'bg-green-500' },
  7: { title: 'Questão 6', type: 'question', color: 'bg-green-500' },
  8: { title: 'Questão 7', type: 'question', color: 'bg-green-500' },
  9: { title: 'Questão 8', type: 'question', color: 'bg-green-500' },
  10: { title: 'Questão 9', type: 'question', color: 'bg-green-500' },
  11: { title: 'Questão 10', type: 'question', color: 'bg-green-500' },
  12: { title: 'Questão 11', type: 'question', color: 'bg-green-500' },
  13: { title: 'Questão 12', type: 'question', color: 'bg-green-500' },
  14: { title: 'Questão 13', type: 'question', color: 'bg-green-500' },
  15: { title: 'Transição 1', type: 'transition', color: 'bg-purple-500' },
  16: { title: 'Transição 2', type: 'transition', color: 'bg-purple-500' },
  17: { title: 'Transição 3', type: 'transition', color: 'bg-purple-500' },
  18: { title: 'Transição 4', type: 'transition', color: 'bg-purple-500' },
  19: { title: 'Resultado Final', type: 'result', color: 'bg-orange-500' },
  20: { title: 'Oferta', type: 'offer', color: 'bg-red-500' },
  21: { title: 'Finalização', type: 'final', color: 'bg-gray-500' },
} as const;

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  className
}) => {
  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < totalSteps;

  const getStepMeta = (step: number) => {
    return STEP_METADATA[step as keyof typeof STEP_METADATA] || {
      title: `Etapa ${step}`,
      type: 'unknown',
      color: 'bg-gray-500'
    };
  };

  const renderStepButton = (step: number) => {
    const meta = getStepMeta(step);
    const isActive = step === currentStep;
    const isQuestion = meta.type === 'question';
    
    return (
      <TooltipProvider key={step}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              onClick={() => onStepChange(step)}
              className={cn(
                'h-8 min-w-[2rem] px-2 text-xs',
                isActive && 'ring-2 ring-blue-200',
                !isActive && 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-1">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isActive ? 'bg-white' : meta.color
                )} />
                <span className="font-medium">{step}</span>
                {isQuestion && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-1">
                    Q{step - 1}
                  </Badge>
                )}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-center">
              <p className="font-medium">{meta.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{meta.type}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn('border-b bg-gray-50 p-3', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Navegação das Etapas</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={!canGoPrevious}
            className="h-7 px-2"
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
          
          <div className="px-3 py-1 bg-white rounded border text-xs font-medium">
            {currentStep} / {totalSteps}
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStepChange(currentStep + 1)}
            disabled={!canGoNext}
            className="h-7 px-2"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Step Overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Etapa Atual:</span>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', getStepMeta(currentStep).color)} />
            <span className="text-sm font-medium">{getStepMeta(currentStep).title}</span>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Quick Step Navigation */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Navegação Rápida:</span>
          
          <ScrollArea className="w-full">
            <div className="flex gap-1 pb-2">
              {Array.from({ length: totalSteps }, (_, i) => renderStepButton(i + 1))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Step Categories */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStepChange(1)}
            className="h-8 text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Introdução
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStepChange(2)}
            className="h-8 text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Questões
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStepChange(15)}
            className="h-8 text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Transições
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStepChange(19)}
            className="h-8 text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Resultado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;