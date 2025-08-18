import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePreview } from '@/contexts/PreviewContext';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import React from 'react';

interface PreviewNavigationProps {
  position?: 'floating' | 'sticky';
  className?: string;
}

export const PreviewNavigation: React.FC<PreviewNavigationProps> = ({
  position = 'sticky',
  className = '',
}) => {
  const {
    isPreviewing,
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    sessionData,
    goToNextStep,
    goToPreviousStep,
    resetSession,
  } = usePreview();

  // Só mostra se estiver em preview
  if (!isPreviewing) {
    return null;
  }

  const positionClasses =
    position === 'floating'
      ? 'fixed top-4 left-1/2 transform -translate-x-1/2 z-40'
      : 'sticky top-0 z-30';

  return (
    <div className={`${positionClasses} ${className}`}>
      <Card className="shadow-lg bg-white/95 backdrop-blur-sm border-2 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center justify-between">
            <span>Preview Mode</span>
            <div className="text-xs bg-green-100 px-2 py-1 rounded">
              Etapa {currentStep}/{totalSteps}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between space-x-2">
            {/* Navegação */}
            <div className="flex items-center space-x-1">
              <Button
                onClick={goToPreviousStep}
                disabled={!canGoPrevious}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-xs px-2 py-1 bg-stone-100 rounded min-w-[60px] text-center">
                {currentStep}/{totalSteps}
              </div>

              <Button
                onClick={goToNextStep}
                disabled={!canGoNext}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Controles de sessão */}
            <div className="flex items-center space-x-1">
              <Button
                onClick={resetSession}
                variant="outline"
                size="sm"
                className="h-8 px-2"
                title="Resetar Sessão"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>

              {Object.keys(sessionData).length > 0 && (
                <div className="text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded">
                  {Object.keys(sessionData).length} dados
                </div>
              )}
            </div>
          </div>

          {/* Informações extras */}
          <div className="mt-2 text-xs text-stone-500 text-center">
            Use as setas para navegar entre as etapas do funil
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
