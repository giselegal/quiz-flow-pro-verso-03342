/**
 * 📋 STEP NAVIGATOR COLUMN - Fase 2 Modularização
 * 
 * Coluna 1: Lista de etapas do quiz para navegação
 * Extraído de QuizModularProductionEditor para melhor organização
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export interface StepNavigatorItem {
  id: string;
  label: string;
  isValid?: boolean;
  blockCount?: number;
}

interface StepNavigatorColumnProps {
  steps: StepNavigatorItem[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
  className?: string;
}

export const StepNavigatorColumn: React.FC<StepNavigatorColumnProps> = ({
  steps,
  currentStep,
  onStepChange,
  className,
}) => {
  return (
    <div className={cn('flex flex-col h-full border-r bg-muted/30', className)}>
      <div className="p-4 border-b bg-background">
        <h2 className="text-lg font-semibold">Etapas</h2>
        <p className="text-sm text-muted-foreground">
          {steps.length} etapas configuradas
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {steps.map((step) => (
            <Button
              key={step.id}
              variant={currentStep === step.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-left gap-2',
                currentStep === step.id && 'bg-primary text-primary-foreground',
              )}
              onClick={() => onStepChange(step.id)}
            >
              <div className="flex items-center justify-between flex-1">
                <span className="flex items-center gap-2">
                  {step.label}
                  {step.blockCount !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {step.blockCount}
                    </Badge>
                  )}
                </span>
                {step.isValid !== undefined && (
                  step.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
