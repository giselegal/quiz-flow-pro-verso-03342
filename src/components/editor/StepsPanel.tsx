import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Copy, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  name: string;
}

interface StepsPanelProps {
  steps: Step[];
  activeStepId: string | null;
  onStepSelect: (stepId: string) => void;
  onStepAdd: () => void;
  onStepDelete: (stepId: string) => void;
  onStepDuplicate: (stepId: string) => void;
  onPopulateStep?: (stepId: string) => void;
  onPopulateAllEmptySteps?: () => void;
}

export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  activeStepId,
  onStepSelect,
  onStepAdd,
  onStepDelete,
  onStepDuplicate,
  onPopulateStep,
  onPopulateAllEmptySteps
}) => {
  const [expanded, setExpanded] = useState(true);

  const hasStepContent = (stepId: string): boolean => {
    // Implemente a lógica para verificar se a etapa tem conteúdo
    // Por exemplo, verificar se existem blocos associados a esta etapa
    return true; // Altere para a lógica real
  };

  const getBlockCount = (stepId: string): number => {
    // Implemente a lógica para obter a contagem de blocos na etapa
    return 5; // Altere para a lógica real
  };

  const getStepNumber = (stepId: string): number => {
    const match = stepId.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Etapas do Quiz</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {steps.length}/21
          </Badge>
        </div>
        
        {/* Botões de ação */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={onStepAdd}
            className="w-full text-xs h-8"
            size="sm"
          >
            <Plus className="w-3 h-3 mr-1" />
            Nova Etapa
          </Button>
          
          {/* ✅ NOVO BOTÃO: Popular Todas Vazias */}
          {onPopulateAllEmptySteps && (
            <Button
              onClick={onPopulateAllEmptySteps}
              variant="outline"
              className="w-full text-xs h-8"
              size="sm"
            >
              <Zap className="w-3 h-3 mr-1" />
              Popular Vazias
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {steps.map((step) => {
              const isEmpty = !hasStepContent(step.id);
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "relative group rounded-lg border-2 transition-all cursor-pointer",
                    activeStepId === step.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300",
                    isEmpty && "border-dashed border-orange-300 bg-orange-50"
                  )}
                  onClick={() => onStepSelect(step.id)}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          activeStepId === step.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {getStepNumber(step.id)}
                        </div>
                        <span className="text-sm font-medium truncate">
                          {step.name || `Etapa ${getStepNumber(step.id)}`}
                        </span>
                      </div>
                      
                      {/* Status da etapa */}
                      {isEmpty ? (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                          Vazia
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {getBlockCount(step.id)} blocos
                        </Badge>
                      )}
                    </div>

                    {/* Descrição da etapa */}
                    <p className="text-xs text-gray-500 mb-3">
                      {getStepDescription(getStepNumber(step.id))}
                    </p>

                    {/* Botões de ação */}
                    <div className="flex gap-1">
                      {/* ✅ BOTÃO POPULAR ETAPA INDIVIDUAL */}
                      {isEmpty && onPopulateStep && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPopulateStep(step.id);
                          }}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Popular
                        </Button>
                      )}
                      
                      {/* Botão duplicar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStepDuplicate(step.id);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      {/* Botão deletar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStepDelete(step.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Função helper para obter descrição da etapa baseada no número
const getStepDescription = (stepNumber: number): string => {
  const descriptions = {
    1: 'Introdução e coleta do nome',
    2: 'Questão: Roupa favorita',
    3: 'Questão: Como se descreve',
    4: 'Questão: Silhueta preferida',
    5: 'Questão: Estilo de vida',
    6: 'Questão: Paleta de cores',
    7: 'Questão: Inspiração de estilo',
    8: 'Questão: Acessórios preferidos',
    9: 'Questão: Tecidos favoritos',
    10: 'Questão: Ocasiões principais',
    11: 'Questão: Prioridade de estilo',
    12: 'Transição: Conhecendo você melhor',
    13: 'Estratégica: Seu guarda-roupa',
    14: 'Estratégica: Dificuldades para se arrumar',
    15: 'Estratégica: Frequência da indecisão',
    16: 'Estratégica: Investimento em roupas',
    17: 'Estratégica: Orçamento mensal',
    18: 'Estratégica: Objetivo do novo estilo',
    19: 'Transição: Preparando resultado',
    20: 'Resultado personalizado completo',
    21: 'Oferta exclusiva personalizada'
  };
  
  return descriptions[stepNumber as keyof typeof descriptions] || 'Etapa do quiz';
};

export default StepsPanel;
