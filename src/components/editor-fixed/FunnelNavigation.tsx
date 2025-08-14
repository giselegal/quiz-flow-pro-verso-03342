// @ts-nocheck
/**
 * FUNNEL NAVIGATION SYSTEM
 * Sistema de navegação funcional para as 21 etapas do funil
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react';

interface FunnelNavigationProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onSave: () => void;
  onPreview: () => void;
  isSaving: boolean;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
}

export const FunnelNavigation: React.FC<FunnelNavigationProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  onSave,
  onPreview,
  isSaving,
  canNavigateNext,
  canNavigatePrevious
}) => {
  const handlePrevious = () => {
    if (canNavigatePrevious && currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canNavigateNext && currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  const getStepName = (step: number) => {
    const stepNames = [
      'Introdução', 'Nome', 'Roupa Favorita', 'Estilo Pessoal', 'Ocasiões',
      'Cores', 'Texturas', 'Silhuetas', 'Acessórios', 'Inspiração',
      'Conforto', 'Tendências', 'Investimento', 'Personalidade', 'Transição',
      'Processamento', 'Resultado Parcial', 'Resultado Completo', 'Resultado Final',
      'Lead Capture', 'Oferta'
    ];
    return stepNames[step - 1] || `Etapa ${step}`;
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Card className="sticky top-0 z-10 border-b shadow-sm">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          {/* Navegação Anterior */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!canNavigatePrevious || currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
          </div>

          {/* Informações da Etapa */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Etapa {currentStep} de {totalSteps}
              </Badge>
              <span className="text-sm font-medium text-gray-700">
                {getStepName(currentStep)}
              </span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              disabled={!canNavigateNext || currentStep === totalSteps}
              className="gap-2"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelNavigation;