
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepsPanelProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onPopulateStep: (step: number) => void;
  isLoading?: boolean;
}

// Informações das 21 etapas do quiz
const QUIZ_STEPS = [
  // Etapas 1-12: Quiz Principal
  { number: 1, title: 'Introdução', type: 'intro', category: 'Início' },
  { number: 2, title: 'Coleta de Nome', type: 'name', category: 'Início' },
  { number: 3, title: 'Intro do Quiz', type: 'quiz-intro', category: 'Quiz Principal' },
  { number: 4, title: 'Q1: Tipo de Roupa', type: 'question', category: 'Quiz Principal' },
  { number: 5, title: 'Q2: Personalidade', type: 'question', category: 'Quiz Principal' },
  { number: 6, title: 'Q3: Biotipo Corporal', type: 'question', category: 'Quiz Principal' },
  { number: 7, title: 'Q4: Estilo de Vida', type: 'question', category: 'Quiz Principal' },
  { number: 8, title: 'Q5: Cores Favoritas', type: 'question', category: 'Quiz Principal' },
  { number: 9, title: 'Q6: Inspirações', type: 'question', category: 'Quiz Principal' },
  { number: 10, title: 'Q7: Acessórios', type: 'question', category: 'Quiz Principal' },
  { number: 11, title: 'Q8: Tecidos', type: 'question', category: 'Quiz Principal' },
  { number: 12, title: 'Q9: Ocasiões', type: 'question', category: 'Quiz Principal' },
  { number: 13, title: 'Q10: Prioridade', type: 'question', category: 'Quiz Principal' },
  
  // Etapa 14: Transição
  { number: 14, title: 'Transição Principal', type: 'transition', category: 'Transição' },
  
  // Etapas 15-20: Questões Estratégicas
  { number: 15, title: 'S1: Questão Estratégica 1', type: 'strategic', category: 'Segmentação' },
  { number: 16, title: 'S2: Questão Estratégica 2', type: 'strategic', category: 'Segmentação' },
  { number: 17, title: 'S3: Questão Estratégica 3', type: 'strategic', category: 'Segmentação' },
  { number: 18, title: 'S4: Questão Estratégica 4', type: 'strategic', category: 'Segmentação' },
  { number: 19, title: 'S5: Questão Estratégica 5', type: 'strategic', category: 'Segmentação' },
  { number: 20, title: 'S6: Questão Estratégica 6', type: 'strategic', category: 'Segmentação' },
  
  // Etapa 21: Resultado e Oferta
  { number: 21, title: 'Resultado e Oferta', type: 'result', category: 'Conversão' }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Início': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Quiz Principal': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Transição': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Segmentação': return 'bg-green-100 text-green-700 border-green-200';
    case 'Conversão': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStepIcon = (type: string) => {
  switch (type) {
    case 'intro': return '🚀';
    case 'name': return '👤';
    case 'quiz-intro': return '📝';
    case 'question': return '❓';
    case 'transition': return '🔄';
    case 'strategic': return '🎯';
    case 'result': return '🏆';
    default: return '📄';
  }
};

// Agrupar etapas por categoria
const groupedSteps = QUIZ_STEPS.reduce((acc, step) => {
  if (!acc[step.category]) {
    acc[step.category] = [];
  }
  acc[step.category].push(step);
  return acc;
}, {} as Record<string, typeof QUIZ_STEPS>);

export const StepsPanel: React.FC<StepsPanelProps> = ({
  currentStep,
  onStepChange,
  onPopulateStep,
  isLoading = false
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-[#FAF9F7]">
        <h3 className="font-semibold text-[#432818] mb-2">21 Etapas do Quiz</h3>
        <p className="text-xs text-gray-600">
          Clique em uma etapa para visualizar ou use "Popular" para carregar o template
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {Object.entries(groupedSteps).map(([category, steps]) => (
            <div key={category} className="space-y-2">
              <div className="px-2">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs font-medium", getCategoryColor(category))}
                >
                  {category}
                </Badge>
              </div>
              
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={cn(
                    "group border rounded-lg p-3 transition-all cursor-pointer",
                    currentStep === step.number
                      ? "border-[#B89B7A] bg-[#B89B7A]/5"
                      : "border-gray-200 hover:border-[#B89B7A]/50 hover:bg-gray-50"
                  )}
                  onClick={() => onStepChange(step.number)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStepIcon(step.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-[#432818]">
                          Etapa {step.number}
                        </div>
                        <div className="text-xs text-gray-600">
                          {step.title}
                        </div>
                      </div>
                    </div>
                    
                    {currentStep === step.number && (
                      <CheckCircle className="w-4 h-4 text-[#B89B7A] flex-shrink-0" />
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "w-full text-xs h-7",
                      currentStep === step.number
                        ? "border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                        : "border-gray-300 text-gray-600 hover:border-[#B89B7A] hover:text-[#B89B7A]"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPopulateStep(step.number);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3 mr-1" />
                    )}
                    Popular Etapa
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-[#FAF9F7]">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Etapa Atual:</span>
            <span className="font-medium text-[#432818]">{currentStep} de 21</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-[#B89B7A] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 21) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
