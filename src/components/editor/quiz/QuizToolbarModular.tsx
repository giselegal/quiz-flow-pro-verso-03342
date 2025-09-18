/**
 * �️ TOOLBAR MODULAR DO QUIZ COM NAVEGAÇÃO DE ETAPAS
 *
 * Toolbar com controles de modo, navegação entre etapas e propriedades
 */

import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { getNextStep, getPreviousStep, isValidStep } from '@/utils/quiz21StepsRenderer';
import { ChevronLeft, ChevronRight, Edit, Eye, Menu, Settings } from 'lucide-react';
import React from 'react';

interface QuizToolbarProps {
  mode: 'editor' | 'preview' | 'production';
  onModeToggle: () => void;
  onSidebarToggle: () => void;
  onPropertiesToggle: () => void;
}

export const QuizToolbarModular: React.FC<QuizToolbarProps> = ({
  mode,
  onModeToggle,
  onSidebarToggle,
  onPropertiesToggle,
}) => {
  const { quizState, actions } = useQuizFlow();
  const { currentStep, totalSteps } = quizState;

  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < totalSteps;

  const handlePreviousStep = () => {
    if (canGoPrevious) {
      const prevStep = getPreviousStep(currentStep);
      actions.goToStep(prevStep);
    }
  };

  const handleNextStep = () => {
    if (canGoNext) {
      const nextStep = getNextStep(currentStep);
      actions.goToStep(nextStep);
    }
  };

  const handleStepJump = (step: number) => {
    if (isValidStep(step)) {
      actions.goToStep(step);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'editor':
        return <Edit className="w-4 h-4" />;
      case 'preview':
        return <Eye className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'editor':
        return 'Editor';
      case 'preview':
        return 'Preview';
      default:
        return 'Produção';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left Section - Navigation */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle */}
        <button
          onClick={onSidebarToggle}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Step Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousStep}
            disabled={!canGoPrevious}
            className={`p-2 rounded-md transition-colors ${
              canGoPrevious
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Etapa anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Step Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Etapa</span>
            <select
              value={currentStep}
              onChange={e => handleStepJump(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                <option key={step} value={step}>
                  {step}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">de {totalSteps}</span>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!canGoNext}
            className={`p-2 rounded-md transition-colors ${
              canGoNext
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Próxima etapa"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Section - Step Info */}
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{getStepTitle(currentStep)}</div>
          <div className="text-xs text-gray-500">{getStepType(currentStep)}</div>
        </div>
      </div>

      {/* Right Section - Mode & Properties */}
      <div className="flex items-center space-x-2">
        {/* Mode Toggle */}
        <button
          onClick={onModeToggle}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'editor'
              ? 'bg-blue-100 text-blue-700'
              : mode === 'preview'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
          }`}
          title={`Modo: ${getModeLabel()}`}
        >
          {getModeIcon()}
          <span>{getModeLabel()}</span>
        </button>

        {/* Properties Toggle */}
        {mode === 'editor' && (
          <button
            onClick={onPropertiesToggle}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Toggle Properties Panel"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Função auxiliar para obter título da etapa
function getStepTitle(stepNumber: number): string {
  if (stepNumber === 1) return 'Coleta do Nome';
  if (stepNumber >= 2 && stepNumber <= 11) return `Questão ${stepNumber - 1} de 10`;
  if (stepNumber === 12) return 'Transição para Estratégicas';
  if (stepNumber >= 13 && stepNumber <= 18) return `Estratégica ${stepNumber - 12} de 6`;
  if (stepNumber === 19) return 'Preparação do Resultado';
  if (stepNumber === 20) return 'Página de Resultado';
  if (stepNumber === 21) return 'Página de Oferta';
  return `Etapa ${stepNumber}`;
}

// Função auxiliar para obter tipo da etapa
function getStepType(stepNumber: number): string {
  if (stepNumber === 1) return 'Introdução';
  if (stepNumber >= 2 && stepNumber <= 11) return 'Questão Pontuada';
  if (stepNumber === 12 || stepNumber === 19) return 'Transição';
  if (stepNumber >= 13 && stepNumber <= 18) return 'Questão Estratégica';
  if (stepNumber === 20) return 'Resultado';
  if (stepNumber === 21) return 'Oferta';
  return 'Conteúdo';
}
