/**
 * 🔧 TOOLBAR MODULAR DO QUIZ
 *
 * Controles para modo, navegação e configurações
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  PanelRight,
  Play,
  Settings,
  Sidebar,
} from 'lucide-react';
import React from 'react';

interface QuizToolbarModularProps {
  mode: 'editor' | 'preview' | 'production';
  onModeToggle: () => void;
  onSidebarToggle: () => void;
  onPropertiesToggle: () => void;
}

export const QuizToolbarModular: React.FC<QuizToolbarModularProps> = ({
  mode = 'editor',
  onModeToggle = () => {},
  onSidebarToggle = () => {},
  onPropertiesToggle = () => {},
}) => {
  const { quizState, actions } = useQuizFlow();
  const { currentStep: currentStepNumber, totalSteps } = quizState;

  // Buscar dados da etapa atual
  const stepData = actions.getStepData();
  const currentStep = stepData?.[0] || { type: 'content', title: `Etapa ${currentStepNumber}` };

  const nextStep = actions.nextStep;
  const previousStep = actions.prevStep;
  const canGoNext = currentStepNumber < totalSteps;
  const canGoPrevious = currentStepNumber > 1;

  const getModeIcon = () => {
    switch (mode) {
      case 'editor':
        return <Edit3 className="h-4 w-4" />;
      case 'preview':
        return <Eye className="h-4 w-4" />;
      case 'production':
        return <Play className="h-4 w-4" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'preview':
        return 'bg-green-100 text-green-800';
      case 'production':
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4">
      {/* Left Section - Mode and Step Info */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onModeToggle} className="gap-2">
          {getModeIcon()}
          <span className="capitalize">{mode}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Etapa {currentStepNumber}/{totalSteps}
          </Badge>
          <Badge variant="outline" className={getModeColor()}>
            {currentStep.type}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">{currentStep.title}</div>
      </div>

      {/* Center Section - Navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={previousStep} disabled={!canGoPrevious}>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <Button variant="ghost" size="sm" onClick={nextStep} disabled={!canGoNext}>
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section - Panel Controls */}
      {mode === 'editor' && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="gap-2">
            <Sidebar className="h-4 w-4" />
            Componentes
          </Button>

          <Button variant="ghost" size="sm" onClick={onPropertiesToggle} className="gap-2">
            <PanelRight className="h-4 w-4" />
            Propriedades
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
