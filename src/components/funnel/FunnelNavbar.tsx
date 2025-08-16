import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation.simple';

interface FunnelNavbarProps {
  className?: string;
}

const FunnelNavbar: React.FC<FunnelNavbarProps> = ({ className = '' }) => {
  const {
    currentStepNumber,
    totalSteps,
    progressValue,
    stepName,
    canNavigateNext,
    canNavigatePrevious,
    isSaving,
    handleNext,
    handlePrevious,
    handleSave,
    handlePreview,
  } = useFunnelNavigation();

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left section - Navigation */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canNavigatePrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Button>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              Etapa {currentStepNumber} de {totalSteps}
            </span>
            <div className="w-32">
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canNavigateNext}
            className="flex items-center space-x-2"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Center section - Step name */}
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {stepName}
          </h2>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FunnelNavbar;